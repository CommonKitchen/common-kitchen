import { API_SERVER_URL } from '$env/static/private';

import { error } from '@sveltejs/kit';

const API_URL = `https://${API_SERVER_URL}`;

/** @typedef {import('$lib/types/types.js').Product} Product */
/* @type {Product[]} */
/** @typedef {import('$lib/types/types.js').Category} Category */
/* @type {Category[]} */
/** @typedef {import('$lib/types/types.js').Customer} Customer */
/* @type {Category[]} */

/**
 * @typedef {object} ApiData
 * @property {Product[]} products - Массив товаров.
 * @property {Category[]} categories - Массив категорий.
 * @property {object} checkoutConfig - Объект конфигурации заказа.
 * @property {string} apiURL - Объект конфигурации заказа.
 * @property {Customer} customer - Объект конфигурации заказа.
 */

/**
 * Проверяет, что полученный JSON-объект содержит необходимые структуры данных.
 * @param {ApiData} data - Объект, полученный после response.json().
 * @returns {ApiData} Возвращает проверенный объект с данными (products, categories и checkoutConfig).
 * @throws {Error} Выбрасывает ошибку, если данные не соответствуют ожидаемой структуре.
 */ function validateApiData(data) {
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		throw new Error("Помилка валідациї даних: відповідь API не являє собою коректний об'єкт.");
	}

	// 1. Проверяем products: должен быть массив
	if (!Array.isArray(data.products)) {
		throw new Error("Помилка валідациї даних: відсутній або некоректний масив 'products'.");
	}

	// 2. Проверяем categories: должен быть массив
	if (!Array.isArray(data.categories)) {
		throw new Error("Помилка валідациї даних: відсутній або некоректний массив 'categories'.");
	}

	// 3. Проверяем checkoutConfig: должен быть объект, но не массив и не null
	if (
		!(
			data.checkoutConfig &&
			typeof data.checkoutConfig === 'object' &&
			!Array.isArray(data.checkoutConfig)
		)
	) {
		throw new Error("Помилка валідациї даних: відсутній або некоректний об'єкт 'checkoutConfig'.");
	}

	const res = { ...data, apiURL: API_URL };

	return res;
}

export async function load({ fetch, cookies }) {
	const sessionId = cookies.get('auth_session_id');

	let response;

	const headers = new Headers({
		Accept: 'application/json'
	});
	if (sessionId) {
		headers.set('X-SessionId', sessionId);
	}

	const requestOptions = {
		method: 'POST',
		headers: headers
	};

	try {
		response = await fetch(`${API_URL}/cakes/hs/shop/data`, requestOptions);
	} catch (e) {
		console.error('Network or critical fetch error:', e);
		throw error(503, {
			message: 'Не вдалося підключитися до серверу даних (мережа недоступна).'
		});
	}

	// 3. Обработка ошибок HTTP-ответа (статусы 4xx или 5xx)
	if (!response.ok) {
		console.error(`API returned error status: ${response.status} ${response.statusText}`);
		throw error(response.status, {
			message: `Помилка API. Статус: ${response.status} ${response.statusText}`
		});
	}

	// 4. Успешный ответ (status 200-299)
	try {
		const allData = await response.json();

		const validatedData = validateApiData(allData);

		const products = validatedData.products.map((item) => ({
			...item,
			imageUrl: item.imageUrl || '/nophoto.png'
		}));
		return { shopData: { ...validatedData, products, sessionId } };
	} catch (e) {
		console.error('Error parsing JSON:', e);
		throw error(500, {
			message: 'Помилка обробки отриманої відповіді (некоректний JSON).'
		});
	}
}

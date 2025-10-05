import { API_SERVER_URL } from '$env/static/private';

import { error } from '@sveltejs/kit';

// const API_URL = `${API_SERVER_URL}/shopData`;
const API_URL = `${API_SERVER_URL}/cakes/hs/initdata`;

export async function load({ fetch }) {
	let response;

	const requestOptions = {
		method: 'POST',
		headers: {
			Accept: 'application/json'
		}
	};

	try {
		response = await fetch(API_URL, requestOptions);
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

		// 5. ✅ ИСПРАВЛЕНИЕ: Проверка структуры данных (allData.categories)
		if (!allData || !Array.isArray(allData.categories) || !Array.isArray(allData.products)) {
			console.error('Invalid data structure received from API:', allData);
			throw error(500, {
				message: 'Зовнішній API повернув некоректну структуру даних.'
			});
		}

		/** @typedef {import('$lib/types.js').Product} Product */
		/** @type {Product[]} */
		const products = allData.products.map(
			/** @param {Product} item */
			(item) => ({
				...item,
				imageUrl: item.imageUrl || '/nophoto.svg'
			})
		);
		// 6. Возвращение успешных данных
		return {
			shopData: {
				categories: allData.categories,
				products: products
			}
		};
	} catch (e) {
		// 7. Обработка ошибок парсинга JSON
		console.error('Error parsing JSON:', e);
		throw error(500, {
			message: 'Помилка обробки отриманої відповіді (некоректний JSON).'
		});
	}
}

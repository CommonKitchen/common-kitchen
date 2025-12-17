import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { API_SERVER_URL } from '$env/static/private';
import type { ApiData, LayoutData, ShopDataClient } from '$lib/types/types';

const API_URL = `https://${API_SERVER_URL}`;

function validateApiData(data: ApiData): ShopDataClient {
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

export const load: LayoutServerLoad = async ({ fetch, cookies, request }): Promise<LayoutData> => {
	const ua = request.headers.get('user-agent') || '';
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);

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
		const allData: ApiData = await response.json();
		let validatedData: ShopDataClient;
		try {
			validatedData = validateApiData(allData);
		} catch (e) {
			console.error('Data validation error:', (e as Error).message);
			throw error(500, {
				message: `Внутрішня помилка: ${(e as Error).message}`
			});
		}

		const products = validatedData.products.map((item) => ({
			...item,
			imageUrl: item.imageUrl || '/nophoto.png'
		}));

		return { shopData: { ...validatedData, products, sessionId }, isMobile };
	} catch (e) {
		console.error('Error parsing JSON:', e);
		throw error(500, {
			message: 'Помилка обробки отриманої відповіді (некоректний JSON).'
		});
	}
};

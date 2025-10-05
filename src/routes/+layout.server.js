import { API_SERVER_URL } from '$env/static/private';

import { error } from '@sveltejs/kit';

const API_URL = `${API_SERVER_URL}/shopData`;

export async function load({ fetch }) {
	let response;

	try {
		response = await fetch(API_URL);
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

		// 6. Возвращение успешных данных
		return {
			shopData: {
				categories: allData.categories,
				products: allData.products
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

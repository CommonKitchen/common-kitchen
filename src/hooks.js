// src/hooks.js
export async function handle({ request, resolve }) {
	const response = await resolve(request);

	console.log('hook');
	// Разрешаем запросы с внешних доменов (например, с WayForPay)
	response.headers.set('Access-Control-Allow-Origin', '*'); // или укажи конкретный домен
	response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // добавь необходимые заголовки

	// Обработка preflight-запросов для CORS
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: response.headers
		});
	}

	return response;
}

// src/routes/payment/+server.js
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
	const contentType = request.headers.get('content-type') || '';
	let paymentData;

	try {
		if (
			contentType.includes('multipart/form-data') ||
			contentType.includes('application/x-www-form-urlencoded')
		) {
			const data = await request.formData();
			// Преобразуем FormData в обычный объект JavaScript
			paymentData = Object.fromEntries(data.entries());
		} else if (contentType.includes('application/json')) {
			paymentData = await request.json();
		} else {
			// Неизвестный или неподдерживаемый тип контента
			return new Response(JSON.stringify({ message: 'Unsupported Content Type' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		console.log('paymentData (From WayForPay)', paymentData);

		throw redirect(303, `/payment?status=success`);
	} catch (error) {
		console.error('Ошибка обработки WayForPay POST:', error);
		throw redirect(303, `/payment?status=error`);
	}
}

export async function GET() {
	return new Response('OK');
}

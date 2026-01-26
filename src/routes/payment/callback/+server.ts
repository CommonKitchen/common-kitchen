// src/routes/payment/callback/+server.ts
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
	const contentType = request.headers.get('content-type') || '';
	let statusToRedirect = 'error';
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

		console.log('+server.ts paymentData:', paymentData);
		const { orderReference, reasonCode, reason } = paymentData;

		// WayForPay использует 1100 для успешной операции
		if (reasonCode === '1100') {
			console.log(`Оплата ${orderReference} успешно завершена. Код: ${reasonCode}`);
			statusToRedirect = 'success';
		} else if (reasonCode) {
			console.warn(
				`Транзакция ${orderReference} отклонена/ошибочна. Код: ${reasonCode}, Причина: ${reason}`
			);
			statusToRedirect = 'declined';
		} else {
			console.log(`Транзакция ${orderReference} - Неопределенный статус. Code: ${reasonCode}`);
			// statusToRedirect = 'pending';
		}

		console.log('+server.ts statusToRedirect:', statusToRedirect);

		return redirect(303, `/payment?status=${statusToRedirect}`);
	} catch (error) {
		console.error('Ошибка обработки WayForPay POST:', error);
		return redirect(303, `/payment?status=error`);
	}
}

export async function GET() {
	return new Response('OK');
}

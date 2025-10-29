// src/routes/payment/+server.js
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
	console.log('POST', request);
	try {
		//const paymentData = await request.json();

		//console.log('paymentData', paymentData);
		throw redirect(303, `/payment`);
	} catch (error) {
		console.error('Ошибка обработки WayForPay POST:', error);
		throw redirect(303, `/payment?status=error`);
	}
}

export async function GET() {
	return new Response('OK');
}

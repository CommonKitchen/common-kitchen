// src/routes/api/successlogin/+server.ts
import { API_SERVER_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { sessionId } = await request.json();

	cookies.set('auth_session_id', sessionId, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	});

	let customerData = null;

	const API_URL = `https://${API_SERVER_URL}/cakes/hs/shop/customers`;

	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ sessionId })
		});
		if (!res.ok) {
			console.error(`Telegram bot API responded with ${res.status}: ${res.statusText}`);
			return new Response(JSON.stringify({ error: `External API error: ${res.status}` }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		customerData = await res.json();
	} catch (err) {
		console.error('Failed to fetch customer data from Telegram bot:', err);
		customerData = null;
	}

	return new Response(JSON.stringify({ customer: customerData }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

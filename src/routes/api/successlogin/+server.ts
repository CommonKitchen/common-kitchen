// src/routes/api/successlogin/+server.ts
import { API_SERVER_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const sessionId = request.headers.get('X-SessionId');

	if (!sessionId || typeof sessionId !== 'string') {
		return new Response(JSON.stringify({ error: 'Missing or invalid X-SessionId header' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const API_URL = `https://${API_SERVER_URL}/cakes/hs/shop/customers`;

	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-SessionId': sessionId,
				origin: `https://common-kitchen.vercel.app`
			}
		});

		if (!res.ok) {
			console.error(`Telegram bot API responded with ${res.status}: ${res.statusText}`);
			return new Response(JSON.stringify({ error: `External API error: ${res.status}` }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const customerData = await res.json();

		if (!sessionId) {
			return new Response(JSON.stringify({ error: 'sessionId is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		cookies.set('auth_session_id', sessionId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			secure: true, // Внимание: может вызвать проблемы на http://localhost
			sameSite: 'lax'
		});

		return new Response(JSON.stringify({ customer: customerData }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Failed to fetch customer data or process request:', err);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

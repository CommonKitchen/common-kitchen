// src/routes/api/auth/telegram/+server.ts
import type { RequestHandler } from './$types';
import { sessions } from '$lib/types/sessions';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { customer, sessionId } = data;

	if (!customer) {
		return new Response(`Missing data customer:'${customer}' sessionId:'${sessionId}'`, {
			status: 400
		});
	}

	sessions[sessionId] = {
		customer,
		authorized: true
	};

	console.log('User authorized:', sessions[sessionId]);

	return new Response('OK');
};

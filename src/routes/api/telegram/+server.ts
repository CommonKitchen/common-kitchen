// src/routes/api/auth/telegram/+server.ts
import type { RequestHandler } from './$types';
import { sessions } from '$lib/types/sessions';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { sessionId } = data;

	if (!sessionId) {
		return new Response(`Missing data customer: sessionId:'${sessionId}'`, {
			status: 400
		});
	}

	sessions[sessionId] = {
		authorized: true
	};

	console.log('User authorized:', sessions[sessionId]);

	return new Response('OK');
};

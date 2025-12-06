// src/routes/api/successlogin/+server.ts
import type { RequestHandler } from './$types';

import { sessions } from '$lib/types/sessions';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { sessionId } = await request.json();

	const session = sessions[sessionId];

	if (session && session.authorized) {
		cookies.set('auth_session_id', sessionId, {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		return new Response('Cookie set', { status: 200 });
	}

	return new Response('Unauthorized', { status: 401 });
};

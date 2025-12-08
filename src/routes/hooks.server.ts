import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// const sessionId = event.cookies.get('auth_session_id');

	return await resolve(event);
};

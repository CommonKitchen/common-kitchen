// src/routes/cart/+page.server.ts
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_SERVER_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const sessionId = cookies.get('auth_session_id');

	if (!sessionId) {
		throw redirect(302, '/login');
	}

	const API_URL = `https://${API_SERVER_URL}/cakes/hs/shop/customers`;

	let res: Response;

	try {
		res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-SessionId': sessionId,
				origin: 'https://common-kitchen.vercel.app'
			}
		});
	} catch (err) {
		console.error('Network error fetching customer:', err);
		throw error(503, 'Service temporarily unavailable');
	}

	if (res.status === 401 || res.status === 403) {
		throw redirect(302, '/login');
	}

	if (!res.ok) {
		throw error(500, 'Failed to fetch user data from server.');
	}

	const userData = await res.json();

	if (!userData?.customer) {
		throw redirect(302, '/login');
	}

	return {
		customer: userData.customer
	};
};

// src/routes/cart/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_SERVER_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const sessionId = cookies.get('auth_session_id');

	if (!sessionId) {
		throw redirect(302, '/login');
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
			throw new Error('Failed to fetch user data from server.');
		}

		const userData = await res.json();

		return {
			customer: userData.customer
		};
	} catch (error) {
		console.error('Error fetching cart data:', error);
		return {
			error: 'Could not load customer data.',
			customer: null
		};
	}
};

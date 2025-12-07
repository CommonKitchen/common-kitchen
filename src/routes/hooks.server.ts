import { sessions } from '$lib/types/sessions';
import type { Handle } from '@sveltejs/kit';

// declare module '@sveltejs/kit' {
//     interface Locals {
//         user: {
//             sessionId: string;
//             id: number;
//             username: string;
//         } | null;
//     }
// }

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('auth_session_id');

	if (sessionId) {
		console.log('sessionId', sessionId);
	}
	// const session = sessions[sessionId];

	// 3. Перевірка, чи сесія дійсна та авторизована
	// if (session && session.authorized) {
	// 4. Додавання даних користувача до locals
	// Це робить дані користувача доступними для всіх серверних обробників
	// event.locals.user = {
	//     sessionId: sessionId,
	//     id: session.id,
	//     username: session.username,
	// ... інші дані, які ви зберігаєте
	// };
	// } else {
	// Якщо кукі є, але сесії вже немає (наприклад, сервер перезавантажився), видаляємо кукі
	// event.cookies.delete('auth_session_id', { path: '/' });
	// event.locals.user = null;
	// }
	// } else {
	// event.locals.user = null;
	// }

	return await resolve(event);
};

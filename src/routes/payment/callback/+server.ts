import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
	const contentType = request.headers.get('content-type') || '';
	let paymentData;

	try {
		if (
			contentType.includes('multipart/form-data') ||
			contentType.includes('application/x-www-form-urlencoded')
		) {
			const data = await request.formData();
			paymentData = Object.fromEntries(data.entries());
		} else if (contentType.includes('application/json')) {
			paymentData = await request.json();
		} else {
			throw redirect(303, '/payment?status=error');
		}

		const { reasonCode, orderReference } = paymentData;

		let statusToRedirect = 'error';

		if (reasonCode === '1100') {
			statusToRedirect = 'success';
		} else if (reasonCode) {
			statusToRedirect = 'declined';
		}

		console.log(`Обработка возврата для ${orderReference}. Итоговый статус: ${statusToRedirect}`);

		// Эта строка выбрасывает специальное исключение SvelteKit Redirect
		throw redirect(303, `/payment?status=${statusToRedirect}`);
	} catch (err: any) {
		/**
		 * КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
		 * Мы проверяем, является ли пойманный объект ошибкой редиректа.
		 * Если да — выбрасываем его снова (rethrow), чтобы SvelteKit обработал переход.
		 * Если этого не сделать, код ниже превратит любой успех в "status=error".
		 */
		if (err && err.status >= 300 && err.status <= 308 && err.location) {
			throw err;
		}

		console.error('Критическая ошибка в обработчике callback:', err);
		throw redirect(303, `/payment?status=error`);
	}
}

export async function GET() {
	// Если пользователь просто зашел по ссылке
	throw redirect(303, '/payment?status=initial');
}

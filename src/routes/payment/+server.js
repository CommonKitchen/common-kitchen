import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, url }) {
	console.log('POST');
	try {
		// 1. Извлекаем данные, отправленные WayForPay
		const paymentData = await request.json();

		console.log('paymentData', paymentData);
		// 2. ***ВАЖНЫЙ ШАГ: ПРОВЕРКА ПОДПИСИ***
		// В реальном коде здесь нужно проверить, что:
		// const expectedSignature = generateSignature(paymentData);
		// if (expectedSignature !== paymentData.merchantSignature) {
		//     // Вернуть ошибку, если подпись не совпадает
		//     return new Response(JSON.stringify({ status: 'error', message: 'Signature mismatch' }), { status: 400 });
		// }
		// ЭТО КРИТИЧЕСКИ ВАЖНО ДЛЯ БЕЗОПАСНОСТИ!

		// const status = paymentData.transactionStatus;
		// const orderId = paymentData.orderReference;

		// 3. Обновляем статус заказа в вашей базе данных (Firestore или другой)
		// updateOrderStatusInDatabase(orderId, status, paymentData);
		// console.log(`Статус платежа для заказа ${orderId}: ${status}`);

		// 4. Перенаправляем клиента на конечную страницу статуса с GET-параметрами
		// (Это и есть решение проблемы "Cross-site POST")

		// if (status === 'Approved') {
		// Перенаправление на страницу успеха
		// throw redirect(303, `${url.pathname}?status=success&orderId=${orderId}`);
		// } else if (status === 'Declined' || status === 'Refunded') {
		// Перенаправление на страницу ошибки/отказа
		// throw redirect(303, `${url.pathname}?status=failed&orderId=${orderId}`);
		// }

		// Если статус неизвестен, перенаправляем на страницу ожидания
		// throw redirect(303, `${url.pathname}?status=pending&orderId=${orderId}`);
	} catch (error) {
		console.error('Ошибка обработки WayForPay POST:', error);
		// В случае любой ошибки перенаправляем на страницу с общей ошибкой
		throw redirect(303, `/payment?status=error`);
	}

	// WayForPay ожидает ответ 200 OK.
	// Хотя редиректы выше выбрасывают ошибку, если код доходит до сюда
	// (что теоретически невозможно из-за throw redirect), или если нам нужно
	// дать ответ серверу WayForPay о приеме нотификации, добавим явный return.
	// Однако, поскольку вся логика завершается 'throw redirect', этот код недостижим
	// для клиентского браузера, но может быть важен для самого сервера WayForPay,
	// если они ожидают HTTP 200 в ответ на нотификацию, а редирект происходит позже.

	// В контексте SvelteKit, POST-запрос, приходящий от клиента (не от сервера WayForPay),
	// должен завершаться либо throw redirect, либо return Response.
	// Если WayForPay отправляет сюда нотификацию (callback URL),
	// то нужно вернуть 200 OK для WayForPay.
	// Если сюда приходит пользователь после оплаты, то нужно редиректить.

	// Поскольку в данном случае этот эндпоинт используется как для возврата клиента,
	// так и потенциально для callback'а, мы оставим логику как есть,
	// используя throw redirect для клиента.
	// Если WayForPay ожидает именно ответ 200 OK на нотификацию,
	// этот эндпоинт должен быть перенесен на отдельный URL (например, /callback).

	// **Чтобы удовлетворить TypeScript (который выделил это),
	// нужно добавить return Response для случаев, которые не обрабатываются throw redirect.**
	// В данном случае, вся функция завершается либо успешным, либо ошибочным редиректом.
	// Единственная точка выхода без throw redirect была бы здесь, но она недостижима.

	// Вернем 200 OK, чтобы удовлетворить WayForPay, если они считают,
	// что это их Callback URL (что часто совпадает с Return URL).
	return new Response('OK', { status: 200 });
}

// WayForPay также может делать GET-запрос для проверки, его можно оставить пустым
export async function GET() {
	return new Response('OK');
}

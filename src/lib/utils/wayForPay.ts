export function wayforpayRedirect(
	paymentData: { url: string; body: Record<string, string> } | undefined
): void {
	// Перевіряємо, чи є необхідні дані для перенаправлення
	if (
		paymentData &&
		paymentData.url &&
		typeof paymentData.body === 'object' &&
		paymentData.body !== null
	) {
		// 1. Створюємо динамічну HTML-форму для POST-запиту на Wayforpay
		const form = document.createElement('form');
		form.method = 'POST'; // Метод завжди POST для Wayforpay
		form.action = paymentData.url;
		form.style.display = 'none'; // Приховуємо форму від користувача

		// 2. Додаємо приховані поля з об'єкта body
		const body = paymentData.body;
		for (const key in body) {
			// Перевірка, щоб не обробляти успадковані властивості
			if (Object.prototype.hasOwnProperty.call(body, key)) {
				const value: string | string[] = body[key];

				if (Array.isArray(value)) {
					value.forEach((item) => {
						const input = document.createElement('input');
						input.type = 'hidden';
						input.name = `${key}[]`;
						input.value = String(item);
						form.appendChild(input);
					});
				} else {
					const input = document.createElement('input');
					input.type = 'hidden';
					input.name = key;
					input.value = String(value);
					form.appendChild(input);
				}
			}
		}

		// 3. Додаємо форму до DOM та відправляємо її.
		document.body.appendChild(form);
		// clearCart();
		form.submit();
		// Ми більше не повертаємося звідси, оскільки браузер перенаправляється
	}
}

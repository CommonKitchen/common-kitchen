<script>
	/** @typedef {import('$lib/types.js').CartItem} CartItem */

	import OrderTitle from '$lib/components/ui/OrderTitle.svelte';
	import { clearCart } from '$lib/stores/cartStore';
	import { getWebApp } from '$lib/utils/telegram';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let { orderData, toggleConfirmationPage, toggleOrderSuccess } = $props();
	let isLoading = $state(false);
	let isExpanded = $state(true);
	let checkoutError = $state('');
	const { customer, delivery, payment, summary, note, products, apiURL } = orderData();

	console.log('customer', customer);

	function toggleProducts() {
		isExpanded = !isExpanded;
	}

	/**
	 * Функція для створення та відправки динамічної форми для перенаправлення
	 * на платіжний шлюз (наприклад, Wayforpay).
	 * Це необхідно, оскільки fetch не може виконати POST-запит з подальшим перенаправленням
	 * вкладки браузера на інший домен.
	 * @param {{ url: string, body: Record<string, string> } | undefined} paymentData
	 * @returns {void}
	 */
	function wayforpayRedirect(paymentData) {
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
					/** @type {string | string[]} */
					const value = body[key];

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

	/**
	 * @param {MouseEvent} event
	 */
	async function handleCheckout(event) {
		event.preventDefault();

		isLoading = true;
		checkoutError = '';

		const debug = !true;

		let webApp;
		if (debug) {
			webApp = {
				initData:
					'query_id=AAFsRjIYAAAAAGxGMhiXftHC&user=%7B%22id%22%3A405948012%2C%22first_name%22%3A%22Olexander%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FYSacqszPFJcQEXl9G11mEpWG1P9Ln3ZNY35WASFaZ8U.svg%22%7D&auth_date=1761562755&signature=Xh-V123nFu0o1mGgZNnFL4LYJg8KH_BrXRm3PxChGmhtUm_Lxi7xAo9QL6Uaigyi1nqpUDfcbRUWOI8NBPejAQ&hash=3e36f75e88a81dba351658f714721f07230a43ccc31b606166b829b9b3855a01'
			};
		} else {
			webApp = getWebApp();
		}

		// @ts-ignore
		const initData = webApp?.initData;
		if (!initData) {
			console.warn('Telegram WebApp.initData не знайдено. Замовлення неможливе.');
			return;
		}

		const payload = {
			customer: customer.id,
			paymentMethod: payment.id,
			delivery: {
				type: delivery.method,
				date: delivery.date,
				amount: delivery.amount,
				location: delivery.location,
				pickupLocation: delivery.pickupLocation
			},
			comment: note,
			subtotal: summary.subtotal,
			totalAmount: summary.finalTotal,
			products: products.map((/** @type {CartItem} */ item) => ({
				id: item.id,
				quantity: item.quantity,
				price: item.price,
				amount: item.price * item.quantity
			}))
		};

		/** @type {any} */
		let data = null;

		try {
			const response = await fetch(`${apiURL}/cakes/hs/shop/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'X-Telegram-Init-Data': initData
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				let errorMessage = `Помилка сервера: ${response.status}`;
				console.log(response);
				try {
					const errorBody = await response.json();
					errorMessage = errorBody.message || errorMessage;
				} catch (e) {
					errorMessage = errorMessage;
					// errorMessage = (await response.text()) || errorMessage;
				}

				console.log(`errorMessage ${errorMessage}`);
				throw new Error(errorMessage);
			}

			data = await response.json();

			if (payment.id === 'wayforpay' && data?.paymentData && typeof data.paymentData === 'object') {
				try {
					wayforpayRedirect(data.paymentData);
					return;
				} catch (redirectError) {
					checkoutError =
						'Помилка перенаправлення до платіжного шлюзу. Спробуйте інший спосіб оплати.';
					console.error('Redirect Error:', redirectError);
				}
			}

			// 4. Логика успеха для НЕ-Wayforpay (или если Wayforpay Redirection не удалось)
			if (!checkoutError) {
				clearCart();
				toggleOrderSuccess();
				toggleConfirmationPage();
			}
		} catch (error) {
			checkoutError = 'Не вдалося оформити замовлення. Спробуйте пізніше.';
			console.error('API Checkout Error:', error);
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="confirmation-block">
	<h2>Підтвердження замовлення</h2>
	<p class="summary-intro">Будь ласка, перевірте всі деталі перед фінальним оформленням.</p>
	<div class="order-card">
		<div class="order-main-info">
			<OrderTitle title="Дата:" value={delivery.date} />
			<OrderTitle title="Оплата:" value={payment.title} />
			<div class="long-row">
				<OrderTitle title={'Замовник:'} value={customer.title} />
			</div>
			<div class="long-row">
				<OrderTitle title={'Заклад:'} value={customer.location} />
			</div>
			<div class="long-row">
				<OrderTitle title="Отримання:" value={delivery.title} />
			</div>
			{#if note}
				<div class="long-row">
					<OrderTitle title="Примітка:" value={note} isBold={false} />
				</div>
			{/if}
		</div>
		<div class="order-details-toggle">
			<div class="total-row">
				<OrderTitle title="Сума замовлення:" value={summary.subtotal} />
			</div>
			<div class="total-row">
				<OrderTitle title="Вартість доставки:" value={delivery.amount} />
			</div>
			<div class="total-row final-total">
				<OrderTitle title="Разом до оплати:" value={summary.finalTotal} />
				<div class="toggle-button-row">
					<button
						onclick={toggleProducts}
						class="toggle-details-button"
						aria-expanded={isExpanded}
						aria-controls={`products`}
						title={isExpanded ? 'Сховати позиції' : 'Показати позиції'}
					>
						<svg
							class="arrow-icon {isExpanded ? 'expanded' : ''}"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<!-- Иконка шеврона (стрелка вниз) -->
							<path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		{#if isExpanded}
			<div class="products-block" transition:slide={{ duration: 400, easing: cubicOut }}>
				<ul class="order-items-list">
					{#each products as item, index (index)}
						<li class="order-item">
							<span class="item-title">{item.title}</span>
							<div class="item-details-row">
								<span class="item-price">{item.price} ₴</span>
								<span class="item-quantity">x{item.quantity} шт.</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<div class="action-row">
			<button onclick={toggleConfirmationPage} class="buttons clear-btn"> Змінити дані </button>
			<button onclick={handleCheckout} class="buttons checkout-btn" disabled={isLoading}>
				{#if isLoading}
					<div class="spinner"></div>
					Оформлення...
				{:else}
					Оформити
				{/if}
			</button>
		</div>
	</div>

	{#if checkoutError}
		<div class="checkout-error-message">
			⚠️ {checkoutError}
		</div>
	{/if}
</div>

<style>
	.confirmation-block h2,
	p {
		margin-bottom: 10px;
	}

	.order-card {
		padding: 1rem;
		border: 1px solid var(--common-border-dark, #ddd);
		border-radius: 16px;
		background-color: var(--common-bg-light, #f8f9fa);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.order-main-info {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.4rem 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #eee);
	}

	.long-row {
		grid-column: 1 / 3;
	}

	.order-details-toggle {
		padding-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.total-row {
		display: flex;
		justify-content: space-between;
		padding: 0.2rem 0;
	}

	.final-total {
		border-top: 1px dashed var(--common-border-dark, #eee);
		margin-top: 0.5rem;
		padding-top: 0.5rem;
	}

	.toggle-button-row {
		display: flex;
		justify-content: flex-end;
		padding-top: 0.5rem;
	}

	.action-row {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 20px;
		margin-top: 10px;
	}

	.toggle-details-button {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--background-color, #eeeeee);
		color: var(--icons-color, #333);
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			transform 0.1s ease;
	}

	.toggle-details-button:hover {
		background-color: #dddddd;
	}

	.arrow-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.3s ease; /* Анимация поворота */
		color: var(--icons-color, #5ac8fa); /* Цвет стрелки */
	}

	.arrow-icon.expanded {
		transform: rotate(180deg); /* Поворот при раскрытии */
	}

	.products-block {
		overflow: hidden;
		margin-top: 0.5rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		border: 1px solid var(--common-border-dark, #ddd);
	}

	.order-items-list {
		list-style: none;
		padding-left: 0;
		margin: 0;
	}

	.order-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0.25rem 0.75rem;
		border-radius: 6px;
		font-size: 0.9rem;
		border-bottom: 1px dashed var(--common-border-dark, #eee);
	}

	.order-item:last-child {
		border-bottom: none;
	}

	.item-title {
		font-weight: 500;
		margin-bottom: 0.2rem;
		line-height: 1.3;
		flex-grow: 1;
	}

	.item-details-row {
		display: flex;
		justify-content: flex-start; /* Выравнивание цены и количества по правому краю */
		gap: 0.75rem;
		font-size: 0.85rem;
		color: #6c757d;
		padding-left: 0.5rem;
	}

	.item-quantity,
	.item-price {
		white-space: nowrap; /* Гарантируем, что цена и шт не переносятся отдельно */
	}

	.buttons {
		font-size: 1.2rem;
		padding: 10px 24px 12px 24px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 600;
		transition: opacity 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkout-btn {
		background: var(--main-color, #e24511);
		color: white;
		border: none;
	}

	.clear-btn {
		border: 1px solid var(--common-border-dark);
		padding: 9px 24px 11px 24px;
	}

	.checkout-btn[disabled] {
		opacity: 0.6;
		cursor: not-allowed;
		box-shadow: none;
		background: #b6b6b6;
		color: #eee;
	}

	.checkout-btn:hover:not([disabled]) {
		background-color: #c43c0f;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.checkout-btn:active:not([disabled]) {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		background-color: var(--main-active-color, #a8330c);
	}

	.checkout-btn:hover {
		background-color: #c43c0f;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.checkout-btn:active {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		background-color: var(--main-active-color, #a8330c);
	}

	.spinner {
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid #ffffff; /* Колір спінера */
		border-radius: 50%;
		width: 18px;
		height: 18px;
		animation: spin 1s linear infinite;
		display: inline-block;
		vertical-align: middle;
		margin-right: 8px; /* Відступ від тексту */
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

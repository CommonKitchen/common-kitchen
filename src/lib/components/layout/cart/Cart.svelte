<script>
	import { goto } from '$app/navigation';
	import {
		cart,
		updateCart,
		clearCart,
		total as cartAmount,
		removeItem
	} from '$lib/stores/cartStore.js';

	import Button from '$lib/components/ui/Button.svelte';
	import ButtonRemove from '$lib/components/ui/ButtonRemove.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import RadioOptions from '$lib/components/ui/RadioOptions.svelte';
	import SelectOptions from '$lib/components/ui/SelectOptions.svelte';
	import QuantitySelector from '$lib/components/ui/QuantitySelector.svelte';
	import { getWebApp } from '$lib/utils/telegram';

	/** @typedef {import('$lib/types.js').Product} Product */
	/** @typedef {import('$lib/types.js').CheckoutConfig} CheckoutConfig */
	/** @typedef {import('$lib/types.js').DeliveryType} DeliveryType */
	/** @typedef {import('$lib/types.js').PickupLocation} PickupLocation */
	/** @typedef {import('$lib/types.js').PaymentMethod} PaymentMethod */
	/** @typedef {import('$lib/types.js').CartItem} CartItem */
	/** @typedef {import('$lib/types.js').Customer} Customer */
	/** @typedef {import('$lib/types.js').legalEntity} legalEntity */

	const {
		/** @type {Product[]} */
		products,
		/** @type {CheckoutConfig} */
		checkoutConfig,
		/** @type {Customer} */
		customer,
		/** @type {string} */
		apiURL
	} = $props();

	const {
		/** @type {DeliveryType[]} */
		deliveryTypes,
		/** @type {PickupLocation[]} */
		pickupLocations,
		/** @type {PaymentMethod[]} */
		paymentMethods
	} = checkoutConfig;

	let isOrderSuccess = $state(false);

	/** @type {Date} */
	let deliveryDate = $state(new Date());

	/** @type {string} */
	let comment = $state('');
	let checkoutError = $state('');

	let selectedPaymentMethodId = $state(paymentMethods[0].id);

	/** @type {PaymentMethod} */
	const selectedPaymentMethod = $derived(
		paymentMethods.find((/** @type {PaymentMethod} */ item) => item.id === selectedPaymentMethodId)
	);

	let currentPickupLocationId = $state(pickupLocations[0].id);
	let selectedDeliveryTypeId = $state(deliveryTypes[0].id);

	/** @type {DeliveryType} */
	const selectedDeliveryType = $derived(
		deliveryTypes.find((/** @type {DeliveryType} */ item) => item.id === selectedDeliveryTypeId)
	);

	let minAmount = $derived(selectedDeliveryType?.minAmount);
	let freeShippingThreshold = $derived(selectedDeliveryType?.freeShippingThreshold);

	/** @type {boolean} */
	let isLoading = $state(false);

	/** @type {PickupLocation} */
	const currentPickupLocation = $derived(
		pickupLocations.find(
			(/** @type {PickupLocation} */ location) => location.id === currentPickupLocationId
		)
	);

	const hasCustomer = !!customer;

	const firstEntity = customer?.legalEntities?.length > 0 ? customer.legalEntities[0] : null;
	const firstLocation =
		firstEntity && firstEntity.customerLocations.length > 0
			? firstEntity.customerLocations[0]
			: null;

	let currentEntityId = $state(firstEntity ? firstEntity.id : null);
	let currentCustomerLocationId = $state(firstLocation ? firstLocation.id : null);

	const currentEntity = $derived(() => {
		/** @type {legalEntity[]} */
		const entityList = customer?.legalEntities ?? [];
		return entityList.find((entity) => entity.id === currentEntityId);
	});

	const currentCustomerLocations = $derived(() => {
		return currentEntity()?.customerLocations ?? [];
	});

	const currentCustomerLocation = $derived(
		currentCustomerLocations().find((loc) => loc.id === currentCustomerLocationId)
	);

	$effect(() => {
		const locations = currentEntity()?.customerLocations;

		if (locations && locations.length > 0) {
			const isCurrentLocationValid = locations.some((loc) => loc.id === currentCustomerLocationId);
			if (!isCurrentLocationValid) {
				currentCustomerLocationId = locations[0].id;
			}
		} else {
			currentCustomerLocationId = null;
		}
	});

	const deliveryAmount = $derived(() => {
		if ($cartAmount >= freeShippingThreshold) {
			return 0;
		}

		const selectedOption = checkoutConfig.deliveryTypes.find(
			(/** @type {DeliveryType} */ item) => item.id === selectedDeliveryTypeId
		);

		return selectedOption ? selectedOption.amount : 0;
	});

	const isMinOrderReached = $derived($cartAmount >= minAmount);
	const amountToReachMin = $derived(isMinOrderReached ? 0 : minAmount - $cartAmount);

	const finalTotal = $derived($cartAmount + deliveryAmount());

	const cartItems = $derived(
		$cart.map((cartItem) => {
			/** @type {Product[]} */
			const productList = products;
			const productDetail = productList.find((p) => p.id === cartItem.id);
			return {
				...cartItem,
				title: productDetail?.title || 'Товар видалено',
				imageUrl: productDetail?.imageUrl,
				minOrder: productDetail?.minOrder || 1
			};
		})
	);

	/** @param {number} id
	 * @param {number} quantity */
	function changeQuantity(id, quantity = 1) {
		const item = cartItems.find((i) => i.id === id);

		if (item) {
			const newQuantity = item.quantity + quantity;
			if (newQuantity < item.minOrder) {
				removeItem(id);
			} else {
				updateCart(item.id, item.price, newQuantity);
			}
		}
	}

	/** @param {number} id - ID товара.  */
	function remove(id) {
		removeItem(id);
	}

	/**
	 * @returns {boolean} True, если все проверки пройдены; False в противном случае.
	 */
	function validateCheckout() {
		checkoutError = '';

		if (!isMinOrderReached) {
			checkoutError = 'Не досягнуто мінімальної суми замовлення.';
			return false;
		}

		if ($cart.length === 0) {
			checkoutError = 'Кошик порожній.';
			return false;
		}

		if (!currentEntityId || !currentCustomerLocationId) {
			checkoutError = 'Будь ласка, оберіть замовника та заклад.';
			return false;
		}

		if (selectedDeliveryType.shippingMethod === 'pickup' && !currentPickupLocationId) {
			checkoutError = 'Будь ласка, оберіть точку видачі.';
			return false;
		}

		return true;
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
	 * @param {SubmitEvent} event
	 */
	async function handleCheckout(event) {
		event.preventDefault();

		if (!validateCheckout()) {
			return;
		}

		const debug = true;

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
			console.warn('Telegram WebApp.initData не знайдено. Замовоення неможливе.');
			return;
		}

		isLoading = true;

		const orderData = {
			customer: currentEntityId,
			paymentMethod: selectedPaymentMethodId,
			subtotal: $cartAmount,
			totalAmount: finalTotal,
			comment: comment.trim(),
			products: $cart.map((item) => ({
				id: item.id,
				quantity: item.quantity,
				price: item.price,
				amount: item.price * item.quantity
			})),
			delivery: {
				type: selectedDeliveryTypeId,
				date: deliveryDate.toLocaleDateString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				}),
				amount: deliveryAmount(),
				location:
					selectedDeliveryType.shippingMethod === 'pickup'
						? currentPickupLocationId
						: currentCustomerLocationId
			}
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
				body: JSON.stringify(orderData)
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
		} catch (error) {
			checkoutError = 'Не вдалося оформити замовлення. Спробуйте пізніше.';
			console.error('API Checkout Error:', error);
			isLoading = false;
			return;
		}

		if (
			selectedPaymentMethodId === 'wayforpay' &&
			data?.paymentData &&
			typeof data.paymentData === 'object'
		) {
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
			isOrderSuccess = true;
		}

		isLoading = false;
	}
</script>

<div class="cart-container">
	{#if isOrderSuccess}
		<div class="empty-cart-message">
			<h2>Вашe замовлення успішно оформлено!</h2>
			<p class="empty-message" style="margin-bottom: 10px;">
				Дякуємо за ваш вибір. Деталі замовлення ви завжди можете переглянути в розділі «Мої
				замовлення»
			</p>
			<div style="weight: 300px">
				<div style="margin-top: 20px;">
					<Button
						title="Перейти до моїх замовлень"
						stretch={true}
						onclick={() => goto('/orders')}
					/>
				</div>
				<div style="margin-top: 20px;">
					<Button title="Перейти до продукції" stretch={true} onclick={() => goto('/categories')} />
				</div>
			</div>
		</div>
	{:else if $cart.length === 0}
		<div class="empty-cart-message">
			<h2>Ваш кошик порожній 😔</h2>
			<p class="empty-message">Додайте що-небудь смачне!</p>
			<div>
				<Button onclick={() => goto('/categories')} />
			</div>
		</div>
	{:else}
		<form onsubmit={handleCheckout}>
			<div class="cart-title">
				<Button title="Назад до продукції" onclick={() => goto('/categories')} type="button" />
				<div class="block-total">
					<span>Ваш кошик:</span>
					<span class="total-amount">{$cartAmount}<span>₴</span></span>
				</div>
			</div>
			<div class="cart-items">
				{#each cartItems as item (item.id)}
					<div class="cart-item">
						<a href={`/products/${item.id}`} class="item-image-link">
							<div class="item-image-wrap">
								<img src={item.imageUrl} alt={item.title} class="item-image" />
							</div>
						</a>

						<div class="item-details">
							<div class="item-title">{item.title}</div>
							<div class="item-price">Мінімальне замовлення {item.minOrder}</div>
							<div class="item-price">{item.price}<span>₴</span></div>
						</div>

						<div class="item-controls">
							<div class="limiter">
								<QuantitySelector
									quantity={item.quantity}
									minOrder={item.minOrder}
									changeQuantity={(/** @type {number} */ change) => changeQuantity(item.id, change)}
									block={true}
								/>
							</div>
							<div class="item-total">{item.price * item.quantity}<span>₴</span></div>
							<ButtonRemove onclick={() => remove(item.id)} />
						</div>
					</div>
				{/each}
			</div>

			<div class="cart-summary">
				{#if !isMinOrderReached}
					<div class="warning-block">
						⚠️ Мінімальна сума замовлення — {minAmount}<span>₴</span>. Додайте ще {amountToReachMin}<span
							>₴</span
						> для оформлення.
					</div>
				{/if}

				{#if hasCustomer}
					<div class="customer-block">
						<div class="customer-info">Ваші дані: {customer.name} {customer.phone}</div>
						<div class="entity-container">
							<SelectOptions
								title="Замовник:"
								bind:value={currentEntityId}
								items={customer.legalEntities}
							/>

							<SelectOptions
								title="Заклад:"
								bind:value={currentCustomerLocationId}
								items={currentCustomerLocations()}
							/>
						</div>
					</div>
				{/if}

				<DatePicker
					title="Дата доставки (приготування):"
					availableDays={currentCustomerLocation?.availableDays || [1, 2, 3, 4, 5]}
					bind:selectedDate={deliveryDate}
				/>

				<RadioOptions
					title="Спосіб отримання:"
					options={deliveryTypes}
					bind:selectedOption={selectedDeliveryTypeId}
					groupName="deliveryType"
					info={selectedDeliveryType.shippingMethod === 'pickup'
						? currentPickupLocation?.info
						: selectedDeliveryType?.info}
				/>

				{#if selectedDeliveryType.shippingMethod === 'pickup'}
					<SelectOptions
						title="Точки видачі:"
						bind:value={currentPickupLocationId}
						items={pickupLocations}
					/>
				{:else}
					<div class="delivery-block"></div>
				{/if}

				<RadioOptions
					title="Спосіб оплати:"
					options={paymentMethods}
					bind:selectedOption={selectedPaymentMethodId}
					groupName="paymentMetod"
					info={selectedPaymentMethod.info}
				/>

				<div class="comment-block">
					<textarea
						name="comment"
						id="comment"
						class="comment"
						bind:value={comment}
						placeholder="Коментар до замовлення"
						rows="4"
					></textarea>
				</div>

				<div class="delivery-block-amount">
					<span class="delivery-description">Вартість доставки:</span>
					<span class="text-amount">
						{deliveryAmount()}<span>₴</span>
					</span>
				</div>

				<div class="block-total">
					<span>Разом до оплати:</span>
					<span class="total-amount">{finalTotal}<span>₴</span></span>
				</div>

				{#if checkoutError}
					<div class="checkout-error-message">
						⚠️ {checkoutError}
					</div>
				{/if}

				{#if !hasCustomer}
					<div class="warning-block">
						⚠️ Замовлення можуть оформити тільки зареєстровані клієнти. <br />
						Для реєстрації перейдіть за посиланням у наш телеграм-бот
						<a href="https://t.me/commonkitchenbot" target="_blank" rel="noopener noreferrer"
							>t.me/CommonKitchenbot</a
						>
					</div>
				{/if}

				<div class="summary-actions">
					<button onclick={clearCart} class="buttons clear-btn" type="button">Очистити кошик</button
					>
					<button
						class="buttons checkout-btn"
						disabled={!isMinOrderReached || isLoading || !hasCustomer}
					>
						{#if isLoading}
							<div class="spinner"></div>
							Оформлення...
						{:else}
							Оформити замовлення
						{/if}
					</button>
				</div>
			</div>
		</form>
	{/if}
</div>

<style>
	.cart-container {
		max-width: 800px;
		margin: 40px auto;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
		padding: 20px;
	}

	.empty-cart-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 50px 20px;
		background-color: var(--common-bg-light);
		border-radius: 12px;
		margin: 40px auto;
		max-width: 500px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	}
	.empty-cart-message h2 {
		color: var(--common-text-dark);
		font-size: 1.8rem;
		margin-bottom: 10px;
	}
	.empty-cart-message p {
		color: #777;
		margin-bottom: 30px;
		font-size: 1.1rem;
	}

	.cart-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 0;
		border-bottom: 1px dashed #eee;
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.item-image-link {
		display: block;
		text-decoration: none;
		color: inherit;
		flex-shrink: 0;
	}

	.item-image-wrap {
		width: 60px;
		height: 60px;
		margin-right: 15px;
	}

	.item-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
	}

	.item-details {
		flex-grow: 1;
		padding-right: 20px;
	}

	.item-title {
		font-size: 1.1rem;
		font-weight: 500;
	}

	.item-price {
		color: #888;
		font-size: 0.9rem;
	}

	.item-price span {
		font-size: 0.7rem;
	}

	.item-controls {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-shrink: 0;
	}

	.limiter {
		width: 144px;
	}

	.item-total {
		font-size: 1.5rem;
		color: #333;
		min-width: 80px;
		text-align: right;
	}

	.item-total span {
		font-size: 1rem;
		font-weight: normal;
	}

	.cart-summary {
		padding-top: 20px;
		border-top: 2px solid var(--main-color, #e24511);
	}

	.warning-block {
		background-color: #fff3cd;
		color: #856404;
		border: 1px solid #ffeeba;
		padding: 10px 15px;
		border-radius: 4px;
		margin-bottom: 20px;
		font-weight: 500;
		text-align: left;
		line-height: 1.6;
	}

	.warning-block span {
		font-size: 0.9rem;
	}

	.entity-container {
		display: flex;
		flex-direction: column;
	}

	.delivery-block {
		padding: 42px 0px 44px 0px;
		font-size: 1.1rem;
	}

	.delivery-description {
		color: #333; /* Загальний колір тексту */
		font-weight: 500; /* Трохи більша вага для помітності */
	}

	.text-amount {
		font-weight: 600;
		font-size: 1.2rem;
		color: var(--main-color);
	}

	.text-amount span {
		font-size: 1rem;
	}

	.delivery-block-amount {
		display: flex;
		justify-content: space-between;
		padding: 16px 0;
		font-size: 1.1rem;
	}

	.block-total {
		display: flex;
		justify-content: space-between;
		font-size: 1.4rem;
		font-weight: 600;
		align-items: center;
	}

	.total-amount {
		color: var(--main-color, #e24511);
		font-size: 2rem;
		font-weight: 800;
	}

	.total-amount span {
		font-size: 1.4rem;
		font-weight: normal;
	}

	.summary-actions {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
		margin-top: 20px;
	}

	.checkout-error-message {
		background-color: #f8d7da; /* Світло-червоний фон */
		color: #721c24; /* Темно-червоний текст */
		border: 1px solid #f5c6cb;
		padding: 15px;
		border-radius: 4px;
		margin-bottom: 20px;
		font-weight: 500;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

	.buttons {
		font-size: 1.2rem;
		padding: 10px 24px 12px 24px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 600;
		transition: opacity 0.2s;
	}

	.clear-btn {
		background: #f7f7f7;
		border: 1px solid #ccc;
		color: #666;
	}

	.checkout-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--main-color, #e24511);
		color: white;
		border: none;
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

	.clear-btn:hover {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		background: #ededed;
	}

	.comment-block {
		margin: 16px 0px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-right: 16px;
	}

	.comment {
		padding: 4px 8px;
		width: 100%;
		font-size: 1rem;
		font-family: 'Roboto', sans-serif;
		border: 1px solid var(--common-border-dark);
		border-radius: 8px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.comment:hover {
		border-color: var(--main-color, #e24511);
		box-shadow: 0 0 0 2px rgba(226, 69, 17, 0.1);
	}

	@media (max-width: 480px) {
		.cart-container {
			padding: 20px 8px;
		}
	}

	@media (max-width: 768px) {
		.cart-item {
			flex-wrap: wrap;
			align-items: flex-start;
		}

		.item-image-link {
			order: 1;
		}

		.item-details {
			order: 2;
			flex-grow: 1;
			min-width: 0; /* Допомагає уникнути перевищення розміру */
		}

		.item-controls {
			order: 3; /* Встановлюємо третім, щоб він перенісся вниз */
			width: 100%; /* Займаємо всю ширину контейнера cart-item */
			margin-top: 15px; /* Додаємо відступ зверху для візуального розділення */
			justify-content: center;
			gap: 10px;
		}
	}
</style>

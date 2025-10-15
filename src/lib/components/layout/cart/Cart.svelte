<script>
	import {
		cart,
		updateCart,
		clearCart,
		total as cartAmount,
		removeItem
	} from '$lib/stores/cartStore.js';

	import QuantitySelector from '$lib/components/ui/QuantitySelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonRemove from '$lib/components/ui/ButtonRemove.svelte';
	import { goto } from '$app/navigation';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import RadioOptions from '$lib/components/ui/RadioOptions.svelte';
	import SelectOptions from '$lib/components/ui/SelectOptions.svelte';

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
		/** @type {number} */
		minAmount,
		/** @type {number} */
		freeShippingAmount,
		/** @type {DeliveryType[]} */
		deliveryTypes,
		/** @type {PickupLocation[]} */
		pickupLocations,
		/** @type {PaymentMethod[]} */
		paymentMethods
	} = checkoutConfig;

	/** @type {Date} */
	let deliveryDate = $state(new Date());

	/** @type {string} */
	let comment = $state('');
	let checkoutError = $state('');
	let selectedDeliveryType = $state(deliveryTypes[0].id);
	let selectedPaymentMethod = $state(paymentMethods[0].id);
	let currentPickupLocationId = $state(pickupLocations[0].id);

	/** @type {boolean} */
	let isLoading = $state(false);

	const currentPickupLocation = $derived(() => {
		/** @type {PickupLocation[]} */
		const locationList = pickupLocations;
		return locationList.find((location) => location.id === currentPickupLocationId);
	});

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

	const currentCustomerLocation = $derived(() => {
		return currentCustomerLocations().find((loc) => loc.id === currentCustomerLocationId);
	});

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
		if ($cartAmount >= freeShippingAmount) {
			return 0;
		}

		const selectedOption = checkoutConfig.deliveryTypes.find(
			(/** @type {DeliveryType} */ item) => item.id === selectedDeliveryType
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

		if (selectedDeliveryType === 'pickup' && !currentPickupLocationId) {
			checkoutError = 'Будь ласка, оберіть точку видачі.';
			return false;
		}

		return true;
	}

	/**
	 * @param {SubmitEvent} event
	 */
	async function handleCheckout(event) {
		event.preventDefault();

		if (!validateCheckout()) {
			return;
		}

		isLoading = true;

		const orderData = {
			customer: {
				entityId: currentEntityId,
				locationId: currentCustomerLocationId
			},
			products: $cart.map((item) => ({
				id: item.id,
				quantity: item.quantity,
				price: item.price,
				amount: item.price * item.quantity
			})),
			delivery: {
				type: selectedDeliveryType,
				date: deliveryDate.toLocaleDateString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				}),
				amount: deliveryAmount(),
				pickupLocationId: selectedDeliveryType === 'pickup' ? currentPickupLocationId : null
			},
			paymentMethod: selectedPaymentMethod,
			subtotal: $cartAmount,
			totalAmount: finalTotal,
			comment: comment.trim()
		};

		// console.log(orderData);

		try {
			const response = await fetch(`${apiURL}/cakes/hs/shop/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
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

			// const data = await response.json();
			// Успішне оформлення
			// clearCart(); // Очищаємо кошик
			// goto('/order-success'); // Перенаправляємо на сторінку успіху
		} catch (error) {
			checkoutError = 'Не вдалося оформити замовлення. Спробуйте пізніше.';
			console.error(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="cart-container">
	{#if $cart.length === 0}
		<div class="empty-cart-message">
			<h2>Ваш кошик порожній 😔</h2>
			<p class="empty-message">Додайте що-небудь смачне!</p>
			<div>
				<Button onclick={() => goto('/categories')} />
			</div>
		</div>
	{:else}
		<form onsubmit={handleCheckout}>
			<div class="t">
				<Button title="Назад до продукції" onclick={() => goto('/categories')} type="button" />
				<h2>Ваш кошик</h2>
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
							<div class="item-price">{item.price} ₴</div>
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
							<div class="item-total">{item.price * item.quantity} <span>₴</span></div>
							<ButtonRemove onclick={() => remove(item.id)} />
						</div>
					</div>
				{/each}
			</div>

			<div class="cart-summary">
				{#if !isMinOrderReached}
					<div class="warning-block">
						⚠️ Мінімальна сума замовлення — {minAmount} ₴. Додайте ще {amountToReachMin} ₴ для оформлення.
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
					availableDays={currentCustomerLocation()?.availableDays || [1, 2, 3, 4, 5]}
					bind:selectedDate={deliveryDate}
				/>

				<RadioOptions
					title="Спосіб отримання:"
					options={deliveryTypes}
					bind:selectedOption={selectedDeliveryType}
					groupName="deliveryType"
				/>

				{#if selectedDeliveryType === 'pickup'}
					<SelectOptions
						title="Точки видачі:"
						bind:value={currentPickupLocationId}
						items={pickupLocations}
					/>
					<div class="pickup-info">
						{currentPickupLocation()?.info}
					</div>
				{:else}
					<div class="delivery-block">
						<span class="delivery-description">Сума замовлення для безкоштовной доставки:</span>
						<span class="text-amount">
							{freeShippingAmount} <span>₴</span>
						</span>
					</div>
				{/if}

				<RadioOptions
					title="Спосіб оплати:"
					options={paymentMethods}
					bind:selectedOption={selectedPaymentMethod}
					groupName="paymentMetod"
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
						{deliveryAmount()} <span>₴</span>
					</span>
				</div>

				<div class="block-total">
					<span>Разом до оплати:</span>
					<span class="total-amount">{finalTotal} <span>₴</span></span>
				</div>

				{#if checkoutError}
					<div class="checkout-error-message">
						⚠️ {checkoutError}
					</div>
				{/if}

				{#if !hasCustomer}
					<div class="warning-block">
						⚠️ Замовлення можуть оформити тільки зареєстровані клієнти.
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
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
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
		text-align: center;
	}

	.customer-info {
		padding-bottom: 15px;
	}

	.entity-container {
		display: flex;
		flex-direction: column;
	}

	.delivery-block {
		display: flex;
		justify-content: space-between;
		padding: 44px 0px 46px 0px;
		font-size: 1.1rem;
	}

	.pickup-info {
		margin: 8px;
		font-style: italic;
		color: #555;
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
		border-top: 1px solid #eee;
		font-size: 1.4rem;
		font-weight: 600;
	}

	.total-amount {
		color: var(--main-color, #e24511);
		font-size: 2rem;
		font-weight: 800;
	}

	.total-amount span {
		font-size: 1.1rem;
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
</style>

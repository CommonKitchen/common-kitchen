<!-- $lib/components/layout/cart -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { cart, updateCart, total as cartAmount, removeItem } from '$lib/stores/cartStore.js';

	import type {
		DeliveryType,
		PickupLocation,
		PaymentMethod,
		OrderProduct,
		Product
	} from '$lib/types/types';
	import type { Customer, LegalEntity } from '$lib/types/types';

	import Button from '$lib/components/ui/Button.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import RadioOptions from '$lib/components/ui/RadioOptions.svelte';
	import SelectOptions from '$lib/components/ui/SelectOptions.svelte';
	import CartMessage from './CartMessage.svelte';
	import CartItem from './CartItem.svelte';
	import CartConfirmation from './CartConfirmation.svelte';

	import { checkoutConfig } from '$lib/stores/checkoutConfig';
	import { products } from '$lib/stores/productsStore';
	const { customer, apiURL } = $props<{
		customer: Customer | undefined | null;
		apiURL: string;
	}>();

	let deliveryTypes = $state<DeliveryType[]>([]);
	let pickupLocations = $state<PickupLocation[]>([]);
	let paymentMethods = $state<PaymentMethod[]>([]);

	if ($checkoutConfig) {
		deliveryTypes = $checkoutConfig.deliveryTypes;
		pickupLocations = $checkoutConfig.pickupLocations;
		paymentMethods = $checkoutConfig.paymentMethods;
	}

	const hasCustomer: boolean = !!customer;
	let isOrderSuccess = $state(false);
	let isConfirmationPage = $state(false);
	let note = $state('');
	let checkoutError = $state('');
	let deliveryDate = $state(new Date());

	let selectedPaymentMethodId = $state<string | undefined>(undefined);
	let currentPickupLocationId = $state<string | undefined>(undefined);
	let selectedDeliveryTypeId = $state<string | undefined>(undefined);

	const selectedPaymentMethod = $derived(
		paymentMethods.find((item) => item.id === selectedPaymentMethodId) ?? ({} as PaymentMethod)
	);
	const selectedDeliveryType = $derived(
		deliveryTypes.find((item) => item.id === selectedDeliveryTypeId) ?? ({} as DeliveryType)
	);
	let minAmount = $derived(selectedDeliveryType?.minAmount ?? 0);
	let freeShippingThreshold = $derived(selectedDeliveryType?.freeShippingThreshold ?? 0);
	const currentPickupLocation = $derived(
		pickupLocations.find((location) => location.id === currentPickupLocationId)
	);

	const firstEntity = customer?.legalEntities?.length > 0 ? customer.legalEntities[0] : null;
	const firstLocation =
		firstEntity && firstEntity.customerLocations.length > 0
			? firstEntity.customerLocations[0]
			: null;

	let currentEntityId = $state(firstEntity ? firstEntity.id : null);
	let currentCustomerLocationId = $state(firstLocation ? firstLocation.id : null);

	const currentEntity = $derived((): LegalEntity | undefined => {
		const entityList: LegalEntity[] = customer?.legalEntities ?? [];
		return entityList.find((entity) => entity.id === currentEntityId);
	});
	const hasEntity = $derived(() => !!currentEntity());

	const currentCustomerLocations = $derived(() => {
		return currentEntity()?.customerLocations ?? [];
	});

	const currentCustomerLocation = $derived(
		currentCustomerLocations().find((loc) => loc.id === currentCustomerLocationId)
	);

	const deliveryAmount = $derived((): number => {
		if ($cartAmount >= freeShippingThreshold) {
			return 0;
		}

		const selectedOption = $checkoutConfig?.deliveryTypes.find(
			(item: DeliveryType) => item.id === selectedDeliveryTypeId
		);

		return selectedOption ? selectedOption.amount : 0;
	});

	const isMinOrderReached = $derived($cartAmount >= minAmount);
	const amountToReachMin = $derived(isMinOrderReached ? 0 : minAmount - $cartAmount);
	const finalTotal = $derived($cartAmount + deliveryAmount());

	interface CartItemDetail extends OrderProduct {
		title: string;
		imageUrl?: string;
		minOrder: number;
	}

	const cartItems = $derived(
		$cart.map((cartItem): CartItemDetail => {
			const productList: Product[] = $products as Product[];
			const productDetail = productList.find((p) => p.id === cartItem.id);
			return {
				...cartItem,
				title: productDetail?.title || 'Товар видалено',
				imageUrl: productDetail?.imageUrl,
				minOrder: productDetail?.minOrder || 1,
				quantity: cartItem.quantity,
				amount: cartItem.price * cartItem.quantity,
				discount: 0,
				discountedAmount: cartItem.price * cartItem.quantity
			};
		})
	);

	interface OrderData {
		apiURL: string;
		customer: { id: string; title: string; phone: string; location: string };
		delivery: {
			title: string;
			method: string;
			deliveryTypeId: string;
			date: string;
			location: string | null;
			pickupLocation: string | null | undefined;
			amount: number;
		};
		payment: { id: string | undefined; title: string };
		summary: { subtotal: number; deliveryAmount: number; finalTotal: number };
		note: string;
		products: CartItemDetail[];
	}

	const orderData = $derived((): OrderData => {
		return {
			apiURL: apiURL,
			customer: {
				id: currentEntityId || '',
				title: currentEntity()?.title || 'Не вказано',
				phone: customer?.phone || 'Не вказано',
				location: currentCustomerLocation?.title || 'Не вказано'
			},
			delivery: {
				title: selectedDeliveryType.title || 'Не вказано',
				method: selectedDeliveryType.shippingMethod || 'Не вказано',
				deliveryTypeId: selectedDeliveryTypeId || '',
				date: deliveryDate.toLocaleDateString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				}),
				location: currentCustomerLocationId,
				pickupLocation: currentPickupLocationId,
				amount: deliveryAmount()
			},
			payment: {
				id: selectedPaymentMethodId,
				title: selectedPaymentMethod.title || 'Не вказано'
			},
			summary: {
				subtotal: $cartAmount,
				deliveryAmount: deliveryAmount(),
				finalTotal: finalTotal
			},
			note: note.trim() || '',
			products: cartItems
		};
	});

	$effect(() => {
		if (paymentMethods.length > 0 && selectedPaymentMethodId === undefined) {
			selectedPaymentMethodId = paymentMethods[0].id;
		}

		if (deliveryTypes.length > 0 && selectedDeliveryTypeId === undefined) {
			selectedDeliveryTypeId = deliveryTypes[0].id;
		}

		if (pickupLocations.length > 0 && currentPickupLocationId === undefined) {
			currentPickupLocationId = pickupLocations[0].id;
		}
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

	function changeQuantity(id: string, quantity = 1) {
		const item = cartItems.find((i) => i.id === id);

		if (item) {
			const newQuantity = item.quantity + quantity;
			if (newQuantity < item.minOrder) {
				removeItem(id);
			} else {
				// Припускаємо, що price береться з cartItem, яке має price з кошика
				updateCart(item.id, item.price, newQuantity);
			}
		}
	}

	/**
	 * @returns {boolean} True, если все проверки пройдены; False в противном случае.
	 */
	function validateCheckout(): boolean {
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

		if (!selectedDeliveryType.shippingMethod || !selectedPaymentMethod.id) {
			checkoutError = 'Помилка конфігурації доставки/оплати.';
			return false;
		}

		if (selectedDeliveryType.shippingMethod === 'pickup' && !currentPickupLocationId) {
			checkoutError = 'Будь ласка, оберіть точку видачі.';
			return false;
		}

		return true;
	}

	function handlePreCheckout() {
		if (validateCheckout()) {
			toggleConfirmationPage();
			checkoutError = '';
		}
	}

	const toggleConfirmationPage = () => (isConfirmationPage = !isConfirmationPage);
	const toggleOrderSuccess = () => (isOrderSuccess = !isOrderSuccess);
</script>

<!-- #region html -->
<div class="cart-container">
	{#if isOrderSuccess}
		<CartMessage option="success" />
	{:else if $cart.length === 0}
		<CartMessage option="empty" />
	{:else if isConfirmationPage}
		<CartConfirmation {orderData} {toggleConfirmationPage} {toggleOrderSuccess} />
	{:else}
		<div>
			<div class="cart-title">
				<Button title="Назад до продукції" onclick={() => goto('/categories')} type="button" />
				<div class="block-total">
					<span>Ваш кошик:</span>
					<span class="total-amount">{$cartAmount}<span>₴</span></span>
				</div>
			</div>
			{#if hasCustomer && !hasEntity()}
				<div class="warning-block">
					⚠️ Попередження: Неможливо створити замовлення.<br /> Ваш обліковий запис ще не повністю
					налаштований для оформлення замовлень.<br /> Щоб отримати можливість замовляти продукцію,
					необхідно додати <b>Замовника</b> (платника) та <b>Заклад</b>, для якого робиться
					замовлення. Або дочекатися затвердження внесеної інформації, якщо ви вже додали
					<b>Замовника</b>
					і <b>Заклад</b>.<br /> Для внесення необхідної інформації перейдіть, будь ласка, за
					посиланням:<br />
					<a href="/customer" class="call-to-action">Додати <b>Замовника</b> та <b>Заклад</b></a>
				</div>
			{/if}

			<div class="cart-items">
				{#each cartItems as item (item.id)}
					<CartItem {item} {changeQuantity} />
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
						<div class="customer-info">Користувач: {customer.name} {customer.phone}</div>
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
					availableDays={currentCustomerLocation?.availableDays || []}
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

				<div class="note-block">
					<textarea
						name="note"
						id="note"
						class="note"
						bind:value={note}
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
						<a href="/login">Перейти до реєстрації</a>
					</div>
				{/if}

				<Button
					title="Перейти до оформлення"
					onclick={handlePreCheckout}
					disabled={!isMinOrderReached || !hasCustomer}
				/>
			</div>
		</div>
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
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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

	.warning-block a.call-to-action {
		/* Робимо посилання кнопкою */
		display: inline-block;
		padding: 8px 15px;
		margin-top: 10px; /* Відділити від попереднього тексту */
		text-decoration: none;
		font-weight: bold;

		/* Кольори, гармонійні з попередженням */
		background-color: #f7e096; /* Трохи темніший жовтий фон, ніж блок */
		color: #856404; /* Темний текст (як основний текст блоку) */
		border: 1px solid #e1c87a; /* Тонка рамка */
		border-radius: 4px;
		transition: background-color 0.2s; /* Плавний ефект при наведенні */
	}

	.warning-block a.call-to-action:hover {
		background-color: #e1c87a; /* Затемнення фону при наведенні */
		color: #584100; /* Ще темніший текст */
		cursor: pointer;
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
		margin-bottom: 20px;
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

	.note-block {
		margin: 16px 0px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-right: 16px;
	}

	.note {
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

	.note:hover {
		border-color: var(--main-color, #e24511);
		box-shadow: 0 0 0 2px rgba(226, 69, 17, 0.1);
	}

	@media (max-width: 480px) {
		.cart-container {
			padding: 20px 8px;
		}
	}
</style>

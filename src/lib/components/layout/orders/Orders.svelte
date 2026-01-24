<script lang="ts">
	import { customer } from '$lib/stores/customerStore.js';
	import Order from '$lib/components/layout/orders/Order.svelte';
	import { cart } from '$lib/stores/cartStore.svelte';
	import { goto } from '$app/navigation';
	import type { Order as OrderType } from '$lib/types/types';
	import { wayforpayRedirect } from '$lib/utils/wayForPay';

	import { sessionStore } from '$lib/stores/sessionStore';

	import { products } from '$lib/stores/productsStore';

	const { apiURL } = $props();

	let checkoutError = $state('');

	function handleRepeat(order: OrderType) {
		cart.clear();

		order.products.forEach((product) => {
			const currentProduct = $products.find((item) => item.id === product.id);

			if (!currentProduct) {
				return;
			}

			cart.updateQuantity(currentProduct.id, currentProduct.price, product.quantity);
		});

		goto('/cart');
	}

	async function handlePay(order: OrderType) {
		const payload = { id: order.id };
		let data: any = null;
		checkoutError = '';

		try {
			const response = await fetch(`${apiURL}/cakes/hs/shop/paymentdata`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'X-SessionId': $sessionStore ?? ''
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				let errorMessage = `Помилка сервера: ${response.status}`;
				try {
					const errorBody = await response.json();
					errorMessage = errorBody.message || errorMessage;
				} catch (e) {
					errorMessage = errorMessage;
				}

				throw new Error(errorMessage);
			}

			data = await response.json();

			if (data?.paymentData && typeof data.paymentData === 'object') {
				try {
					wayforpayRedirect(data.paymentData);
					return;
				} catch (redirectError) {
					checkoutError =
						'Помилка перенаправлення до платіжного шлюзу. Спробуйте інший спосіб оплати.';
					console.error('Redirect Error:', redirectError);
				}
			}
		} catch (error) {
			checkoutError = 'Не вдалося оплатити замовлення. Спробуйте пізніше.';
			console.error('API Checkout Error:', error);
			return;
		} finally {
			// isLoading = false;
		}
	}
</script>

<div class="orders-block">
	<div class="orders-container">
		<h3 class="orders-title">Мої замовлення</h3>

		{#if $customer?.orders.length === 0}
			<div class="no-orders-block info-block">
				<p class="text-xl">У вас поки що немає оформлених замовлень.</p>
			</div>
		{:else}
			<div class="orders-list">
				{#each $customer?.orders as order (order.id)}
					<Order {order} {handleRepeat} {handlePay} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.orders-block {
		padding: 1rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.orders-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.info-block {
		padding: 1.5rem;
		border-radius: 12px;
		background-color: var(--tg-theme-secondary-bg-color, #f0f4f8);
		text-align: center;
		color: var(--tg-theme-hint-color, #555);
		margin-top: 1rem;
	}

	.orders-list {
		display: grid;
		gap: 0.5rem;
	}
</style>

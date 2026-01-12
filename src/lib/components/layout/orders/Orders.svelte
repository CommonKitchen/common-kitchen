<script lang="ts">
	import { customer } from '$lib/stores/customerStore.js';
	import Order from '$lib/components/layout/orders/Order.svelte';
	import { cart } from '$lib/stores/cartStore.svelte';
	import { goto } from '$app/navigation';
	import type { Order as OrderType } from '$lib/types/types';

	import { products } from '$lib/stores/productsStore';

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
					<Order {order} {handleRepeat} />
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

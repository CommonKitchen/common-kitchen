<script>
	import { customer } from '$lib/stores/customerStore.js';
	import Order from '$lib/components/layout/order/Order.svelte';
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
					<Order {order} />
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

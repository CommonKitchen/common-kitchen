<script lang="ts">
	import { slide } from 'svelte/transition';
	import Button from '$lib/components/ui/Button.svelte';
	import OrderTitle from '$lib/components/ui/OrderTitle.svelte';
	import { cubicOut } from 'svelte/easing';

	const { order, handleRepeat, handlePay } = $props();

	let isExpanded = $state(false);

	function toggleProducts() {
		isExpanded = !isExpanded;
	}
</script>

<div class="order-card">
	<div class="order-main-info">
		<OrderTitle title="Дата:" value={order.date} />
		<OrderTitle title="№" value={order.id} />
		<div class="long-row">
			<OrderTitle title={'Замовник:'} value={order.customer} />
		</div>
		<div class="long-row">
			<OrderTitle title={'Заклад:'} value={order.location} />
		</div>
		<OrderTitle title="Отримання:" value={order.deliveryType} />
		<OrderTitle title="Оплата:" value={order.paymentMethod} />
		<OrderTitle title="Сума (зі знижкою та доставкою):" value={`${order.total} ₴`} />
		<OrderTitle
			title="Доставка:"
			value={order.deliveryAmount === '0' ? 'безкоштовно' : `${order.deliveryAmount} ₴`}
		/>
		{#if order.note}
			<div class="long-row">
				<OrderTitle title="Примітка:" value={order.note} isBold={false} />
			</div>
		{/if}
	</div>
	<div class="action-row">
		<Button title={'Повторити'} onclick={() => handleRepeat(order)} />
		{#if !order.paid}
			<Button title={'Оплатити'} onclick={() => handlePay(order)} />
		{:else}
			<div class="paid">
				<img src="./check.webp" alt="Оплачено" />
				<span>Оплачено</span>
			</div>
		{/if}
		<button
			onclick={toggleProducts}
			class="toggle-details-button"
			aria-expanded={isExpanded}
			aria-controls={`products-${order.id}`}
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
	{#if isExpanded}
		<div class="products-block" transition:slide={{ duration: 400, easing: cubicOut }}>
			<ul class="order-items-list">
				{#each order.products as item, index (index)}
					<li class="order-item">
						<span class="item-title">{item.title}</span>
						<div class="item-details-row">
							<span class="item-quantity">{item.quantity} шт.</span>
							<span class="item-price">{item.price} ₴</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
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
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #eee);
	}

	.long-row {
		grid-column: 1 / 3;
	}

	.action-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	.paid {
		display: flex;
		align-items: center;
	}

	.paid span {
		margin-left: 8px;
	}
</style>

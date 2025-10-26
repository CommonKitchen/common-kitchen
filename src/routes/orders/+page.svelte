<script>
	import { onMount } from 'svelte';
	import { getWebApp } from '$lib/utils/telegram';

	const { data } = $props();
	const apiURL = data?.shopData?.apiURL ?? '';

	const webApp = getWebApp();
	// @ts-ignore
	const initData = webApp?.initData;

	/** @typedef {import('$lib/types.js').Order} Order */
	/** @type {Order[]} */
	let orders = $state([]);
	let loading = $state(true);
	let error = $state('');

	onMount(() => {
		fetchOrders();
	});

	async function fetchOrders() {
		loading = true;
		error = '';
		orders = [];

		if (!initData) {
			error = 'Ошибка инициализации: Не удалось получить данные Telegram.';
			loading = false;
			return;
		}

		try {
			const url = `${apiURL}/cakes/hs/shop/orders`;
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-Telegram-Init-Data': initData
				}
			});

			if (!response.ok) {
				error = 'not ok';
				const errorText = await response.json();
				throw new Error(`Ошибка сервера ${response.status}: ${errorText || response.statusText}`);
			}

			const data = await response.json();
			orders = data.orders || [];
			console.log('orders', orders);
		} catch (e) {
			console.error('Ошибка при загрузке заказов:', e);
			error = `Ошибка при загрузке: {e.message}`;
		} finally {
			loading = false;
		}
	}
</script>

<div class="orders-block">
	<div class="orders-container">
		<h3 class="orders-title">Мои заказы</h3>

		{#if loading}
			<div class="loading-indicator info-block">
				<svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<p>Загрузка заказов...</p>
			</div>
		{:else if error}
			<div class="error-block">
				<p class="font-bold">Произошла ошибка при загрузке данных</p>
				<p class="text-sm mt-1">{error}</p>
				<button onclick={fetchOrders} class="retry-button"> Повторить попытку </button>
			</div>
		{:else if orders.length === 0}
			<div class="no-orders-block info-block">
				<p class="text-xl">У вас пока нет оформленных заказов.</p>
				<p class="text-sm">Начните свой первый заказ прямо сейчас!</p>
			</div>
		{:else}
			<div class="orders-list">
				{#each orders as order (order.id)}
					<div class="order-card">
						<div class="order-header">
							<p>Заказ №{order.id}</p>
							<!-- <p>Дата: {new Date(order.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</p> -->
						</div>

						<!-- Сумма -->
						<p class="order-total">
							Сумма: {order.total} UAH
						</p>

						<!-- Состав заказа -->
						<div class="order-items-block">
							<p>Состав:</p>
							<ul class="order-items-list">
								{#each order.products as item}
									<li class="order-item">
										<span>{item.title}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<script>
	import { customer } from '$lib/stores/customerStore.js';

	/** @type {Record<string, boolean>} */
	let expandedDetails = $state({}); // Для "Реквизиты"
	/** @type {Record<string, boolean>} */
	let expandedProducts = $state({}); // Для "Содержимое заказа"

	/** @param {string | number} id */
	function toggleDetails(id) {
		expandedDetails = { ...expandedDetails, [id]: !expandedDetails[id] };
	}

	/** @param {string | number} id */
	function toggleProducts(id) {
		expandedProducts = { ...expandedProducts, [id]: !expandedProducts[id] };
	}

	/** @param {number} id */
	function repeatOrder(id) {}
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
					<div class="order-card">
						<div class="order-main-info">
							<div class="info-group">
								<span class="label">Дата: {order.date}</span>
							</div>
							<div class="info-group">
								<span class="label">№:</span>
								<span class="value font-bold">{order.id}</span>
							</div>
							<div class="info-group">
								<span class="label">Сума:</span>
								<span class="value order-total">{order.total} UAH</span>
							</div>
							<div class="info-group">
								<span class="label">Заклад:</span>
								<span class="value">{order.location ?? 'Не вказано'}</span>
							</div>
						</div>
						<div class="action-row">
							<button class="repeat-button" onclick={() => repeatOrder(order.id)}>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="w-4 h-4 mr-1"
								>
									<path d="M21.5 2v6h-6" /><path d="M2.5 22v-6h6" /><path
										d="M22 11.5a10 10 0 0 0-20-1.5m1.5 0a10 10 0 0 1 20 1.5"
									/>
								</svg>
								Повторити
							</button>
						</div>
						<div class="toggle-buttons">
							<button class="toggle-button" onclick={() => toggleDetails(order.id)}>
								Реквизиты
								{#if expandedDetails[order.id]}
									(Сховати)
								{:else}
									(Показати)
								{/if}
							</button>
							<button class="toggle-button" onclick={() => toggleProducts(order.id)}>
								Вміст замовлення
								{#if expandedProducts[order.id]}
									(Сховати)
								{:else}
									(Показати)
								{/if}
							</button>
						</div>

						{#if expandedDetails[order.id]}
							<div class="details-block">
								<p class="details-title">Додаткові реквізити</p>
								<div class="detail-item">
									<span class="label">Замовник:</span>
									<span class="value">{order.customer ?? 'Не вказан'}</span>
								</div>
								<div class="detail-item">
									<span class="label">Спосіб отримання:</span>
									<span class="value">{order.deliveryType ?? 'Не вказан'}</span>
								</div>
								<div class="detail-item">
									<span class="label">Варіант оплати:</span>
									<span class="value">{order.paymentMethod ?? 'Не вказан'}</span>
								</div>
								<div class="detail-item">
									<span class="label">Вартість доставки:</span>
									<span class="value delivery-sum">{order.deliveryAmount}</span>
								</div>
								{#if order.note}
									<div class="detail-item note-item">
										<span class="label">Примітка:</span> <span class="value">{order.note}</span>
									</div>
								{/if}
							</div>
						{/if}
						{#if expandedProducts[order.id]}
							<div class="products-block">
								<p class="details-title">Вміст замовлення</p>
								<ul class="order-items-list">
									{#each order.products as item}
										<li class="order-item">
											<span>{item.title}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
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
		gap: 1.5rem;
	}

	.order-card {
		padding: 1rem;
		/* border: 1px solid var(--tg-theme-secondary-bg-color, #ddd); */
		border-radius: 16px;
		background-color: white;
		/* background-color: var(--tg-theme-bg-color, #ffffff); */
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.order-main-info {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem 1rem;
		padding-bottom: 1rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #eee);
	}

	.info-group {
		display: flex;
		flex-direction: column;
	}

	.info-group .label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--tg-theme-hint-color, #888);
		text-transform: uppercase;
	}

	.info-group .value {
		font-size: 1rem;
		font-weight: 600;
		color: var(--tg-theme-text-color, #333);
	}

	.order-total {
		color: #28a745; /* Зеленый цвет для суммы */
		font-weight: 700 !important;
	}

	/* --- Кнопка "Повторить" --- */
	.action-row {
		text-align: right;
		margin-bottom: 0.5rem;
	}

	.repeat-button {
		display: inline-flex;
		align-items: center;
		padding: 0.4rem 0.8rem;
		background-color: #ffc107; /* Желтый для повтора */
		color: #333;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.repeat-button:hover {
		opacity: 0.8;
	}

	/* --- Скрываемые блоки --- */
	.toggle-buttons {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--tg-theme-secondary-bg-color, #eee);
		padding-bottom: 1rem;
	}

	.toggle-button {
		flex-grow: 1;
		padding: 0.5rem;
		background-color: var(--tg-theme-button-color, #5a6268);
		color: var(--tg-theme-button-text-color, white);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.details-block,
	.products-block {
		margin-top: 0.5rem;
		padding: 1rem;
		border-top: 1px dashed var(--tg-theme-hint-color, #ccc);
		background-color: var(--tg-theme-secondary-bg-color, #f9f9f9);
		border-radius: 8px;
	}

	.details-title {
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: 0.75rem;
		color: var(--tg-theme-text-color, #333);
	}

	.detail-item {
		display: grid;
		grid-template-columns: 120px 1fr;
		font-size: 0.9rem;
		margin-bottom: 0.4rem;
	}

	.detail-item .label {
		font-weight: 500;
		color: var(--tg-theme-hint-color, #666);
	}

	.detail-item .value {
		font-weight: 600;
		color: var(--tg-theme-text-color, #333);
	}

	.delivery-sum {
		color: #dc3545; /* Красный для доставки */
	}

	.note-item {
		grid-template-columns: 1fr;
		padding-top: 0.5rem;
		margin-top: 0.5rem;
		border-top: 1px dotted var(--tg-theme-hint-color, #ddd);
	}

	.note-item .value {
		font-style: italic;
		font-weight: normal;
		margin-top: 0.25rem;
	}

	.order-items-list {
		list-style: none;
		padding-left: 0;
	}

	.order-item {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
		border-left: 3px solid var(--tg-theme-button-color, #007bff);
		background-color: var(--tg-theme-bg-color, #ffffff);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}
</style>

<script>
	// Импортируем cartTotal
	import { cart, updateCart, removeItem, clearCart, total } from '$lib/stores/cartStore.js';

	/** @typedef {import('$lib/stores/cartStore.js').CartItem} CartItem */

	// Функция для увеличения количества товара на 1
	/** @param {CartItem} item */
	function increment(item) {
		updateCart({
			id: item.id,
			price: item.price,
			newQuantity: item.quantity + 1
		});
	}

	// Функция для уменьшения количества товара на 1
	/** @param {CartItem} item */
	function decrement(item) {
		updateCart({
			id: item.id,
			price: item.price,
			newQuantity: item.quantity - 1
		});
	}

	// Функция для явного удаления товара
	/** @param {number} id */
	function remove(id) {
		removeItem(id);
	}
</script>

<div class="cart-container">
	<h2>Ваш кошик</h2>

	{#if $cart.length === 0}
		<p class="empty-message">Ваш кошик порожній. Додайте що-небудь смачне!</p>
	{:else}
		<div class="cart-items">
			{#each $cart as item (item.id)}
				<div class="cart-item">
					<div class="item-details">
						<!-- <div class="item-title">{item.title}</div> -->
						<div class="item-price-unit">{item.price} ₴ / шт.</div>
					</div>

					<div class="item-controls">
						<div class="quantity-selector">
							<button onclick={() => decrement(item)} class="quantity-btn">-</button>
							<span class="quantity-display">{item.quantity}</span>
							<button onclick={() => increment(item)} class="quantity-btn">+</button>
						</div>

						<div class="item-total">{item.price * item.quantity} ₴</div>

						<button onclick={() => remove(item.id)} class="remove-btn"> &times; Удалить </button>
					</div>
				</div>
			{/each}
		</div>

		<div class="cart-summary">
			<div class="summary-line total-line">
				<span>Разом до оплати:</span>
				<span class="total-amount">{$total} ₴</span>
			</div>

			<div class="summary-actions">
				<button onclick={clearCart} class="clear-btn">Очистити кошик</button>
				<button class="checkout-btn">Оформити замовлення</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* ... (Стили остаются без изменений) */
	.cart-container {
		max-width: 800px;
		margin: 40px auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background-color: #fff;
	}

	.empty-message {
		text-align: center;
		padding: 30px;
		color: #666;
		font-style: italic;
	}

	.cart-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 0;
		border-bottom: 1px dashed #eee;
	}

	.item-details {
		flex-grow: 1;
		padding-right: 20px;
	}

	/* .item-title {
        font-weight: 600;
        font-size: 1.1rem;
    } */

	.item-price-unit {
		color: #888;
		font-size: 0.9rem;
	}

	.item-controls {
		display: flex;
		align-items: center;
		gap: 20px;
		flex-shrink: 0;
	}

	.quantity-selector {
		display: flex;
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow: hidden;
	}

	.quantity-btn {
		background-color: #f7f7f7;
		border: none;
		padding: 6px 12px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.quantity-btn:hover {
		background-color: #e0e0e0;
	}

	.quantity-display {
		padding: 6px 10px;
		font-weight: 500;
		min-width: 25px;
		text-align: center;
		border-left: 1px solid #ccc;
		border-right: 1px solid #ccc;
	}

	.item-total {
		font-weight: bold;
		color: #333;
		min-width: 80px;
		text-align: right;
	}

	.remove-btn {
		background: none;
		border: none;
		color: #ff4444;
		cursor: pointer;
		font-size: 0.9rem;
		transition: opacity 0.2s;
		padding: 0;
	}

	.remove-btn:hover {
		opacity: 0.8;
	}

	.cart-summary {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 2px solid var(--main-color, #e24511);
	}

	.total-line {
		display: flex;
		justify-content: space-between;
		font-size: 1.4rem;
		font-weight: 600;
	}

	.total-amount {
		color: var(--main-color, #e24511);
		font-weight: 800;
	}

	.summary-actions {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
		margin-top: 20px;
	}

	.clear-btn {
		background: #f7f7f7;
		border: 1px solid #ccc;
		color: #666;
	}

	.checkout-btn {
		background: var(--main-color, #e24511);
		color: white;
		border: none;
	}

	.clear-btn,
	.checkout-btn {
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: opacity 0.2s;
	}
</style>

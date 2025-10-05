<script>
	import { cart, updateCart, clearCart, total, removeItem } from '$lib/stores/cartStore.js';
	import QuantitySelector from '$lib/components/ui/QuantitySelector.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonRemove from '$lib/components/ui/ButtonRemove.svelte';
	import { goto } from '$app/navigation';

	/** @typedef {import('$lib/types.js').Product} Product
	 * @typedef {object} CartProps
	 * @property {Product[]} products
	 */
	/** @type {CartProps} */
	const { products } = $props();

	const cartItems = $derived(
		$cart.map((cartItem) => {
			const productDetail = products.find((p) => p.id === cartItem.id);

			return {
				...cartItem,
				title: productDetail?.title || 'Товар видалено',
				imageUrl: productDetail?.imageUrl,
				minOrder: productDetail?.minOrder || 1
			};
		})
	);

	/** @param {number} id
	 * @param {number} quantity
	 */
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

	/**
	 * @param {number} id - ID товара.
	 */
	function remove(id) {
		removeItem(id);
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
		<div>
			<Button title="Назад до продукції" onclick={() => goto('/categories')} />
		</div>
		<h2>Ваш кошик</h2>
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
			<div class="summary-line total-line">
				<span>Разом до оплати:</span>
				<span class="total-amount">{$total} <span>₴</span></span>
			</div>

			<div class="summary-actions">
				<button onclick={clearCart} class="clear-btn">Очистити кошик</button>
				<button class="checkout-btn">Оформити замовлення</button>
			</div>
		</div>
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

	.total-line {
		display: flex;
		justify-content: space-between;
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

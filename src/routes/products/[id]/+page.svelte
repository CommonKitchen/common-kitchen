<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { error } from '@sveltejs/kit';
	import { cart, updateCart } from '$lib/stores/cartStore.js';
	import { get } from 'svelte/store';

	const { data, params } = $props();

	/** @typedef {import('$lib/types.js').Product} Product */
	/** @type {Product[]} */
	const allProducts = $derived(data?.shopData?.products ?? []);
	const productId = $derived(Number(params.id));
	const product = $derived(allProducts.find((p) => p.id === productId));

	let quantity = $state(1);

	$effect(() => {
		if (product) {
			// 1. Получаем текущее значение из корзины
			const currentCart = get(cart);
			const existingItem = currentCart.find((item) => item.id === product.id);
			const cartQuantity = existingItem ? existingItem.quantity : 0;

			// 2. Определяем минимально возможное количество (minOrder)
			const minAllowed = product.minOrder || 1;

			let initialQuantity;

			if (cartQuantity > 0) {
				// Если товар уже в корзине, используем его количество
				initialQuantity = cartQuantity;
			} else {
				// Если товара нет, используем minOrder
				initialQuantity = minAllowed;
			}

			// Гарантируем, что quantity никогда не будет ниже minOrder (даже если в корзине был 1 шт, а minOrder стал 5)
			if (initialQuantity < minAllowed) {
				initialQuantity = minAllowed;
			}

			// 3. Устанавливаем начальное реактивное значение для счетчика
			quantity = initialQuantity;
		}
	});

	$effect(() => {
		if (product && product.minOrder > 1) {
			quantity = product.minOrder;
		}
	});

	$effect(() => {
		if (allProducts.length > 0 && !product) {
			throw error(404, 'Товар не знайдено');
		}
	});

	const total = $derived((product?.price || 0) * quantity);

	function decrement() {
		if (quantity > (product?.minOrder || 1)) {
			quantity -= 1;
		}
	}

	function increment() {
		quantity += 1;
	}

	const addToCart = () => {
		if (product) {
			updateCart({
				id: product.id,
				price: product.price,
				newQuantity: quantity
			});
		}
	};
</script>

<div class="product-card">
	<img src={product?.imageUrl} alt={product?.title} class="product-main-image" />

	<div class="product-details">
		<h1 class="product-title">{product?.title}</h1>
		<div class="product-info">
			<span class="icon-scale">⚖</span>{product?.weight}
			<span class="product-min-order">від {product?.minOrder} шт.</span>
		</div>

		<div class="product-price">{product?.price} <span>₴</span></div>

		<div class="action-panel-container">
			<div class="total-block">
				<span class="total-label">Сума:</span>
				<span class="total">{total} <span>₴</span></span>
			</div>

			<div class="action-panel">
				<div class="quantity-selector">
					<button
						class="quantity-btn"
						onclick={decrement}
						disabled={quantity === (product?.minOrder || 1)}>-</button
					>
					<span class="quantity">{quantity}</span>
					<button class="quantity-btn" onclick={increment}>+</button>
				</div>
				<Button title="Додати до кошика" onclick={addToCart} stretch={false} />
			</div>
		</div>

		<div class="description-block">
			<h2>Опис</h2>
			<p>{product?.description}</p>
		</div>

		<div class="key-details">
			<div class="detail-item">
				<span class="detail-label">Склад:</span>
				<span class="detail-value">{product?.composition}</span>
			</div>
			<div class="detail-item">
				<span class="detail-label">Термін зберігання:</span>
				<span class="detail-value">{product?.storageLife}</span>
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		--common-text-dark: #333;
		--common-text-light: #666;
		--common-bg-light: #fdf7f3;
		--common-border: #e0e0e0;
	}

	.product-card {
		padding: 40px 20px;
		margin: 20px auto;
		max-width: 1200px;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 50px;
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
		align-items: flex-start;
	}

	@media (max-width: 992px) {
		.product-card {
			grid-template-columns: 1fr;
			padding: 20px;
			gap: 20px;
		}
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		padding: 10px 0;
	}

	.detail-label {
		font-weight: 700;
		color: var(--common-text-dark);
		margin-bottom: 5px;
		width: 100%;
		text-align: left;
	}

	.detail-value {
		color: var(--common-text-dark); /* Цвет текста описания */
		font-weight: 400; /* Обычный шрифт для описания */
		text-align: left; /* ВЫРАВНИВАНИЕ: по левому краю */
		width: 100%;
		line-height: 1.5;
	}

	.product-main-image {
		width: 100%;
		max-width: 500px;
		height: auto;
		object-fit: contain;
		border-radius: 8px;
	}

	.product-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--common-text-dark);
		margin-bottom: 10px;
		line-height: 1.2;
	}

	.product-info {
		font-size: 1.1rem;
		color: var(--common-text-light);
		margin-bottom: 5px;
		text-align: left;
	}

	.product-min-order {
		margin-left: 30px;
	}

	.product-price {
		font-size: 3.2rem;
		font-weight: 800;
		color: var(--main-color);
		text-align: right;
		margin-bottom: 24px;
	}

	.product-price span {
		font-size: 2rem;
	}

	.action-panel-container {
		border-bottom: 1px solid var(--common-border);
		padding-bottom: 20px;
		margin-bottom: 30px;
	}

	.total-block {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		margin-bottom: 15px;
		border-top: 2px solid var(--main-color);
		padding-top: 15px;
	}

	.total-label {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--common-text-dark);
	}

	.total {
		font-size: 2.2rem;
		font-weight: 800;
		color: var(--main-color);
	}

	.total span {
		font-size: 1.5rem;
	}

	.action-panel {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	@media (max-width: 600px) {
		.action-panel {
			flex-direction: column;
			align-items: stretch;
		}
		.quantity-selector {
			width: 100%;
			margin-bottom: 15px;
		}
	}

	.quantity-selector {
		display: flex;
		border: 1px solid var(--common-border);
		border-radius: 8px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.quantity-btn {
		background-color: var(--common-bg-light);
		border: none;
		padding: 12px 18px;
		min-width: 50px;
		font-size: 1.3rem;
		font-weight: bold;
		cursor: pointer;
		color: var(--common-text-dark);
		transition: background-color 0.2s ease;
	}
	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quantity {
		padding: 12px 0px;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--common-text-dark);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 40px;
	}

	.description-block h2 {
		font-size: 1.4rem;
		color: var(--common-text-dark);
		margin-bottom: 10px;
		display: inline-block;
		padding-bottom: 5px;
		margin-top: 0;
	}

	.description-block p {
		line-height: 1.6;
		color: var(--common-text-dark);
		margin-bottom: 30px;
	}

	.key-details {
		display: flex;
		flex-direction: column;
	}
</style>

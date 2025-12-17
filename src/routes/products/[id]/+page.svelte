<script lang="ts">
	import { goto } from '$app/navigation';
	import CartButtons from '$lib/components/ui/CartButtons.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { cart } from '$lib/stores/cartStore.js';
	import { error } from '@sveltejs/kit';
	import Image from '$lib/components/ui/Image.svelte';

	import { products } from '$lib/stores/productsStore';

	const { params } = $props();
	const id = Number(params.id);

	const product = $products?.find((p) => p.id === id);

	if (!product) {
		throw error(404, {
			message: `Товар з ID ${id} не знайдений.`
		});
	}

	const cartQuantity = $derived($cart.find((item) => item.id === product?.id)?.quantity || 0);

	let quantity = $state(1);

	$effect(() => {
		let initialQuantity;
		if (product && cartQuantity !== undefined) {
			const minAllowed = product.minOrder || 1;

			if (cartQuantity > 0) {
				initialQuantity = cartQuantity;
				if (initialQuantity < minAllowed) {
					initialQuantity = minAllowed;
				}
			} else {
				initialQuantity = 0;
			}
		} else {
			initialQuantity = 0;
		}
		quantity = initialQuantity;
	});

	const total = $derived((product?.price || 0) * quantity);
</script>

<div class="product-card">
	<div class="image-container">
		<Image src={product?.imageUrl} alt={product?.title} className="product-main-image" />
		<Button onclick={() => goto('/categories')} />
	</div>
	<div class="product-details">
		<h1 class="product-title">{product?.title}</h1>
		<div class="product-info">
			<span class="icon-scale">⚖</span>{product?.weight}
			<span class="product-min-order">від {product?.minOrder} шт.</span>
		</div>

		<div class="price-block">
			<div class="action-panel">
				<CartButtons id={product?.id} price={product?.price} minOrder={product?.minOrder} />
			</div>
			<div class="product-price">
				{product?.price} <span>₴</span>
			</div>
		</div>

		<div class="action-panel-container">
			<div class="total-block">
				<span class="total-label">Сума:</span>
				<span class="total">{total} <span>₴</span></span>
			</div>
		</div>

		<div class="description-block">
			<h2>Опис</h2>
			<p>{@html product?.description}</p>
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

	.image-container {
		width: 100%;
		text-align: center;
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

	.icon-scale {
		margin-right: 8px;
	}

	.product-min-order {
		margin-left: 30px;
	}

	.price-block {
		display: flex;
		align-items: center;
		justify-content: space-between;
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

	.action-panel {
		width: 144px;
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

	@media (max-width: 480px) {
		.product-title {
			font-size: 1.5rem;
		}
	}
</style>

<script>
	import CartButtons from '$lib/components/ui/CartButtons.svelte';

	const { id, title, price, weight, minOrder, imageUrl } = $props();
	const productUrl = `/products/${id}`;
</script>

<div class="product-tile">
	<a href={productUrl} class="product-tile-link">
		<div class="image-container">
			<img src={imageUrl} alt={title} class="product-image" />
		</div>
	</a>
	<div class="product-content">
		<div class="product-title">{title}</div>
		<div class="product-info">
			<div class="product-weight">
				<span class="icon-scale">⚖</span>
				{weight}
			</div>
			<span class="product-min-order">Від {minOrder} шт.</span>
		</div>
		<div class="product-price">{price} <span>₴</span></div>
		<CartButtons {id} {price} {minOrder} />
	</div>
</div>

<style>
	.product-tile-link {
		text-decoration: none;
		color: inherit;
		display: block;
		height: 100%;
	}

	.product-tile {
		width: 168px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 8px;
		background-color: var(--common-bg-light, #f8f9fa);
		border-radius: 8px;
		border: 2px solid transparent;
		overflow: hidden;
		transition: border-color 0.3s ease;
	}

	.product-tile:hover {
		border-color: #ff6347;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}

	.image-container {
		width: 100%;
		height: 168px;
		overflow: hidden;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.product-tile:hover .product-image {
		transform: scale(1.05);
	}

	.product-content {
		width: 100%;
	}

	.product-title {
		font-size: 1.1rem;
		line-height: 1.3;
		/* 1. Устанавливаем высоту, которая точно соответствует двум строкам */
		/* (font-size * line-height * 2 строки) */
		/* В данном случае, это приблизительно 1.1rem * 1.3 * 2 = 2.86rem */
		height: calc(1.1rem * 1.3 * 2);
		/* 2. Логика ограничения текста */
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0px;
	}

	.product-info {
		line-height: 2;
		display: flex;
		justify-content: space-between;
	}

	.product-price {
		color: var(--main-color, #e24511);
		font-weight: bold;
		text-align: right;
		font-size: 2rem;
		letter-spacing: 0.03em;
		margin: 8px 0px;
	}

	.product-price span {
		font-size: 1.5rem;
	}
</style>

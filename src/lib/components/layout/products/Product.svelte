<script>
	import CartButtons from '$lib/components/ui/CartButtons.svelte';
	import heart from '$lib/assets/icon-favorite-24x24.svg';
	import fillHeart from '$lib/assets/icon-favorite2-24x24.svg';
	import Image from '$lib/components/ui/Image.svelte';

	const {
		id,
		title,
		price,
		weight,
		minOrder,
		imageUrl,
		toggleFavorite,
		isFavorite = false
	} = $props();
	const productUrl = `/products/${id}`;
	const imageUrl_168x168 = imageUrl.replace('w_400,h_400', 'w_168,h_168');
</script>

<div class="product-tile">
	<a href={productUrl} class="product-tile-link">
		<Image src={imageUrl_168x168} alt={title} className="image-container" />
		<div class="icon-heart">
			<button
				type="button"
				class="favorite-button"
				onclick={(event) => {
					event.stopPropagation();
					event.preventDefault();
					toggleFavorite(id);
				}}
			>
				{#if !isFavorite}
					<img src={heart} alt="Додати до улюбленого" />
				{:else}
					<img src={fillHeart} alt="Прибрати з улюбленого" />
				{/if}
			</button>
		</div>
	</a>
	<div class="product-content">
		<div class="product-title">{title}</div>
		<div class="product-info">
			<div class="product-weight">
				<span class="icon-scale">⚖</span>
				{weight} г
			</div>
			<span class="product-min-order">Від {minOrder} шт.</span>
		</div>
		<div class="product-price">{price} <span>₴</span></div>
		<CartButtons {id} {price} {minOrder} />
	</div>
</div>

<style>
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
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		/* border: 1px solid var(--common-border-dark); */
	}

	.product-tile-link {
		position: relative;
		text-decoration: none;
		color: inherit;
		display: block;
		height: 100%;
	}

	.product-tile:hover {
		border-color: #ff6347;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}

	.icon-heart {
		position: absolute;
		top: 5px;
		right: 5px;
		z-index: 10;
	}

	.icon-heart img:hover {
		filter: invert(33%) sepia(85%) saturate(7390%) hue-rotate(352deg) brightness(85%) contrast(98%);
	}

	.icon-heart img {
		height: 28px;
		width: 28px;
	}

	.favorite-button {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border: none;
		background-color: transparent;
		border-radius: 50%;
		padding: 4px;
		background-color: rgba(204, 204, 204, 0.3);
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

	@media (min-width: 410px) {
		.product-tile {
			width: 188px;
		}
	}
</style>

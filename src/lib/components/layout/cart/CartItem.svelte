<script>
	import ButtonRemove from '$lib/components/ui/ButtonRemove.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import QuantitySelector from '$lib/components/ui/QuantitySelector.svelte';
	import { removeItem } from '$lib/stores/cartStore';

	const { item, changeQuantity } = $props();
</script>

<div class="cart-item">
	<a href={`/products/${item.id}`} class="item-image-link">
		<div class="item-image-wrap">
			<Image src={item.imageUrl} alt={item.title} className="item-image" />
		</div>
	</a>

	<div class="item-details">
		<div class="item-title">{item.title}</div>
		<div class="item-price">Мінімальне замовлення {item.minOrder}</div>
		<div class="item-price">{item.price}<span>₴</span></div>
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
		<div class="item-total">{item.price * item.quantity}<span>₴</span></div>
		<ButtonRemove onclick={() => removeItem(item.id)} />
	</div>
</div>

<style>
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

	/* .item-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 4px;
	} */

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

	.item-price span {
		font-size: 0.7rem;
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

	@media (max-width: 768px) {
		.cart-item {
			flex-wrap: wrap;
			align-items: flex-start;
		}

		.item-image-link {
			order: 1;
		}

		.item-details {
			order: 2;
			flex-grow: 1;
			min-width: 0; /* Допомагає уникнути перевищення розміру */
		}

		.item-controls {
			order: 3; /* Встановлюємо третім, щоб він перенісся вниз */
			width: 100%; /* Займаємо всю ширину контейнера cart-item */
			margin-top: 15px; /* Додаємо відступ зверху для візуального розділення */
			justify-content: center;
			gap: 10px;
		}
	}
</style>

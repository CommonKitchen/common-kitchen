<script>
	// Принимаемые параметры (пропсы)
	import Button from '$lib/components/ui/Button.svelte';
	// Используем $props() для Svelte 5, как в вашем исходном коде
	const { id, title, price, weight, minOrder, imageUrl } = $props();
	const productUrl = `/products/${id}`;

	// Функция-заглушка для добавления в корзину
	const addToCart = (e) => {
		// Останавливаем всплытие события, чтобы клик по кнопке не перевел на страницу товара
		e.preventDefault();
		console.log(`Додано до кошика: ${title}`);
		// Тут будет логика добавления товара в Svelte store
	};
</script>

<a href={productUrl} class="product-tile-link">
	<div class="product-tile">
		<div class="image-container">
			<img src={imageUrl} alt={title} class="product-image" />
		</div>

		<div class="product-content">
			<div class="product-title">{title}</div>

			<div class="product-info">
				<div class="product-weight">
					<span class="icon-scale">⚖</span>
					{weight}
				</div>
				<span class="product-min-order">Від {minOrder} шт.</span>
			</div>

			<div class="product-price">{price} ₴</div>

			<Button title="До кошика" stretch={true} onclick={addToCart} />
		</div>
	</div>
</a>

<style>
	/* Основные цвета из макета: 
       Красный/Оранжевый CTA: #E24511 (как в вашем price) или #FF6347 (как в вашем hover)
       Фон: белый, но с бежевым оттенком тени для мягкости.
    */

	.product-tile-link {
		text-decoration: none;
		color: #333; /* Более темный, коричневатый текст, как на макете */
		display: block;
		height: 100%;
	}

	.product-tile {
		/* Общие размеры: 168px */
		width: 168px;
		display: flex;
		flex-direction: column;
		/* Уменьшили внутренний отступ для более компактного вида */
		padding: 0px 8px 8px 8px;
		background-color: white;
		border-radius: 8px;
		/* Скрываем рамку по умолчанию, чтобы не занимать место */
		border: 2px solid transparent;
		overflow: hidden;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.product-tile:hover {
		/* Акцентный оранжево-красный цвет с макета */
		border-color: #e24511;
		box-shadow: 0 4px 10px rgba(226, 69, 17, 0.15); /* Мягкая тень в тон акцента */
	}

	.image-container {
		width: 100%;
		height: 168px; /* Сохраняем квадратный формат */
		overflow: hidden;
		margin-bottom: 8px; /* Добавим небольшой отступ */
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
		border-radius: 6px; /* Небольшое скругление для изображения */
	}

	.product-tile:hover .product-image {
		transform: scale(1.03); /* Менее агрессивный зум */
	}

	.product-content {
		width: 100%;
		display: flex; /* Используем flex для лучшего управления вертикальным пространством */
		flex-direction: column;
		flex-grow: 1; /* Позволяем контенту растягиваться */
	}

	.product-title {
		font-size: 1rem;
		line-height: 1.4;
		height: calc(1rem * 1.4 * 2);
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0px 0px 4px 0px; /* Уменьшаем отступ снизу */
		font-weight: 500;
	}

	.product-info {
		line-height: 1.5; /* Уменьшаем line-height */
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: #666; /* Более приглушенный цвет для второстепенной информации */
		margin-bottom: 8px; /* Отступ до цены */
	}

	.product-price {
		/* Сохраняем акцентный цвет и жирность */
		color: #e24511;
		font-weight: bold;
		text-align: right;
		font-size: 1.8rem; /* Немного уменьшили для баланса */
		letter-spacing: 0.01em;
		margin: auto 0px 8px 0px; /* Auto margin top для выравнивания кнопки снизу */
	}

	/* Стиль для кнопки: предполагается, что компонент Button поддерживает цвет по умолчанию */
	/* Если нет, то в стилях компонента Button нужно установить background: #E24511 */
</style>

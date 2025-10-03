<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { error } from '@sveltejs/kit'; // Для выброса 404

	// 💡 Импорт типов для JSDoc
	/** @typedef {import('$lib/types.js').Product} Product */

	// Svelte 5 Runes: Получаем data (глобальные данные) и params (параметры маршрута)
	const { data, params } = $props();

	// Безопасное извлечение товаров из глобальных данных
	/** @type {Product[]} */
	const allProducts = $derived(data?.shopData?.products ?? []);

	// 1. Получаем ID товара из URL-адреса
	// SvelteKit передает id как строку, преобразуем его в число
	const productId = $derived(Number(params.id));

	// 2. Реактивно находим товар по ID
	const product = $derived(allProducts.find((p) => p.id === productId));

	// 3. 💡 Обработка 404: Если товар не найден, выбрасываем ошибку SvelteKit
	// Это вызовет ваш файл +error.svelte
	$effect(() => {
		if (allProducts.length > 0 && !product) {
			// Если данные загружены, но товара нет — это 404
			throw error(404, 'Товар не знайдено');
		}
	});

	const addToCart = () => {
		if (product) {
			console.log(`Товар ${product.title} додано до кошика!`);
			// Здесь будет логика store.update() для корзины
		}
	};
</script>

{#if product}
	<div class="product-detail-page">
		<div class="grid-container">
			<div class="image-section">
				<img src={product.imageUrl} alt={product.title} class="product-image" />
			</div>

			<div class="info-section">
				<h1 class="product-title">{product.title}</h1>

				<div class="price-box">
					<span class="price-label">Ціна:</span>
					<span class="product-price">{product.price} ₴</span>
				</div>

				<div class="details">
					<p>
						<span class="detail-label">Вага:</span>
						<span class="detail-value">{product.weight}</span>
					</p>
					<p>
						<span class="detail-label">Мін. замовлення:</span>
						<span class="detail-value">{product.minOrder} шт.</span>
					</p>
					<p class="description">
						Це детальний опис товару **{product.title}**. Тут має бути повна інформація про
						характеристики, застосування та переваги продукту.
					</p>
				</div>

				<div class="action-section">
					<Button title="До кошика" onclick={addToCart} stretch={true} />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.product-detail-page {
		max-width: 1000px;
		margin: 40px auto;
		padding: 20px;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1.5fr; /* 1:1.5 соотношение для изображения и инфо */
		gap: 40px;
		background-color: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	/* 🖼️ Изображение */
	.image-section {
		overflow: hidden;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-image {
		width: 100%;
		height: auto;
		max-height: 400px;
		object-fit: contain;
	}

	/* 📝 Инфо */
	.product-title {
		font-size: 2.2rem;
		font-weight: 700;
		margin-top: 0;
		margin-bottom: 20px;
		color: #333;
	}

	.price-box {
		background-color: #f7f7f7;
		padding: 15px 20px;
		border-radius: 8px;
		margin-bottom: 20px;
		border-left: 5px solid #007bff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.price-label {
		font-size: 1.1rem;
		color: #6c757d;
	}

	.product-price {
		font-size: 2.5rem;
		font-weight: 800;
		color: #dc3545;
	}

	.details p {
		margin: 8px 0;
		font-size: 1rem;
	}

	.detail-label {
		font-weight: 600;
		color: #333;
		display: inline-block;
		width: 150px; /* Выравнивание */
	}

	.description {
		margin-top: 25px;
		padding: 15px;
		background-color: #f8f9fa;
		border-left: 4px solid #ffc107;
		border-radius: 4px;
	}

	.action-section {
		margin-top: 30px;
		max-width: 300px;
	}

	/* Адаптивность для планшетов и мобильных */
	@media (max-width: 768px) {
		.grid-container {
			grid-template-columns: 1fr; /* Один столбец */
			padding: 20px;
		}
		.product-image {
			max-height: 300px;
		}
	}
</style>

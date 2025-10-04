<script>
	import Product from '$lib/components/layout/Products/Product.svelte';
	import CategoryLink from '$lib/components/layout/Categories/CategoryLink.svelte';

	const { data, params } = $props();

	/** @typedef {import('$lib/types.js').Category} Category */
	/** @type {Category[]} */
	const categories = $derived(data?.shopData?.categories ?? []);

	/** @typedef {import('$lib/types.js').Product} Product */
	/** @type {Product[]} */
	const products = $derived(data?.shopData?.products ?? []);

	const currentCategory = $derived(categories.find((c) => c.slug === params?.slug));

	const categoryProducts = $derived(
		(() => {
			const categoryId = currentCategory?.id;

			if (!categoryId) {
				return [];
			}

			return products.filter((/** @type {Product} */ p) => p.categoryId === categoryId);
		})()
	);
</script>

<div class="category-page-wrapper">
	<div class="category-header">
		{#if currentCategory}
			<h1>Товари в категорії: {currentCategory.title}</h1>
		{:else}
			<h1>Категорія не знайдена: {params?.slug}</h1>
		{/if}
	</div>

	<div class="category-main-content">
		<aside class="category-sidebar">
			<h2 class="sidebar-title">Інші категорії</h2>
			<div class="category-list">
				{#each categories as category (category.id)}
					<CategoryLink {...category} isActive={category.slug === params.slug} />
				{/each}
			</div>
		</aside>
		<main class="product-content-area">
			<div class="product-grid">
				{#each categoryProducts as product (product.id)}
					<Product {...product} />
				{:else}
					<p>В даній категорії товарів не знайдено.</p>
				{/each}
			</div>
		</main>
	</div>
</div>

<style>
	.category-page-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 16px;
	}

	.category-header {
		color: #333;
	}

	.category-main-content {
		display: flex;
		gap: 30px; /* Расстояние между боковой панелью и товарами */
		margin-top: 20px;
	}

	/* 🧭 Боковая панель */
	.category-sidebar {
		flex: 0 0 250px; /* Фиксированная ширина */
		padding: 15px;
		background-color: #f8f9fa;
		border-radius: 8px;
		height: fit-content; /* Чтобы панель не растягивалась на всю высоту */
	}

	.sidebar-title {
		font-size: 1.3rem;
		margin-top: 0;
		margin-bottom: 15px;
		color: #343a40;
		border-bottom: 2px solid #e9ecef;
		padding-bottom: 10px;
	}

	/* 🧱 Область товаров */
	.product-content-area {
		flex-grow: 1; /* Занимает оставшееся пространство */
	}

	/* Стили сетки товаров (как было) */
	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 30px 10px; /* Расстояние между строками 30px, столбцами 20px */
		padding: 20px 0;
		justify-items: center;
	}

	/* 📱 Адаптация для мобильных устройств */
	@media (max-width: 960px) {
		.category-main-content {
			flex-direction: column; /* Боковая панель уходит наверх */
		}
		.category-sidebar {
			flex: 0 0 auto;
			width: 100%;
		}
	}
	@media (max-width: 480px) {
		.product-grid {
			grid-template-columns: 1fr; /* Один товар на строку */
		}
	}
</style>

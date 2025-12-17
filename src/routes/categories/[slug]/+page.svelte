<!-- src/routes/categories/[slug]/+page.svelte -->
<script lang="ts">
	import Products from '$lib/components/layout/products/Products.svelte';
	import CategoryLink from '$lib/components/layout/categories/CategoryLink.svelte';
	import {
		categories,
		currentCategory,
		currentCategorySlug,
		setCurrentCategorySlug
	} from '$lib/stores/categoriesStore';
	import { categoryProducts } from '$lib/stores/productsStore';

	const { params } = $props();

	$effect(() => {
		const slug = params?.slug ?? null;
		setCurrentCategorySlug(slug);
	});
</script>

<div class="category-page-wrapper">
	<div class="category-header">
		{#if $currentCategory}
			<h1>Товари в категорії: {$currentCategory?.title}</h1>
		{:else}
			<h1>Категорія не знайдена</h1>
		{/if}
	</div>

	<div class="category-container">
		<aside class="category-sidebar">
			<div class="category-list">
				{#each $categories as category (category.id)}
					<CategoryLink {...category} isActive={category.slug === $currentCategorySlug} />
				{/each}
			</div>
		</aside>
		<div class="products-section">
			<Products products={$categoryProducts} />
		</div>
	</div>
</div>

<style>
	.category-page-wrapper {
		max-width: 1200px;
		margin: 10px auto;
	}

	.category-header {
		color: #333;
		padding-top: 16px;
	}

	.category-container {
		display: flex;
		gap: 30px;
		margin-top: 20px;
	}

	.category-sidebar {
		flex: 0 0 250px;
		padding: 15px;
		background-color: var(--common-bg-light, #f8f9fa);
		border-radius: 8px;
		height: fit-content; /* Чтобы панель не растягивалась на всю высоту */
	}

	.products-section {
		flex-grow: 1; /* Дозволяє зайняти весь доступний простір, що залишився */
		padding: 0px 15px;
	}

	@media (max-width: 960px) {
		.category-container {
			/* Меняем направление flex-элементов на вертикальное */
			flex-direction: column;
			/* Убираем горизонтальный отступ, если нужно */
			gap: 0;
		}

		.category-sidebar {
			/* Переопределяем flex-свойства для мобильных */
			flex: 0 0 auto; /* Убираем фиксированную ширину */
			width: 100%; /* Занимает всю ширину */
			padding: 15px; /* Сохраняем внутренние отступы */
			margin-bottom: 20px; /* Добавляем отступ после меню */
		}

		.products-section {
			padding: 0px;
		}

		.category-list {
			display: flex; /* Делаем элементы в строку */
			overflow-x: auto; /* Разрешаем горизонтальную прокрутку */
			gap: 10px; /* Небольшой отступ между элементами */
			padding-bottom: 10px; /* Дополнительный отступ для удобства прокрутки */
		}

		.category-list :global(a) {
			flex-shrink: 0; /* Запрещаем сжиматься */
			min-width: fit-content; /* Занимает минимально необходимую ширину */
		}
	}
</style>

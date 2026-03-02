<!-- routes/categories/+page.svelte -->
<script lang="ts">
	import Categories from '$lib/components/layout/categories/Categories.svelte';
	import { categories } from '$lib/stores/categoriesStore';
</script>

<svelte:head>
	<title>Каталог десертів та випічки оптом — Common.Kitchen</title>
	<meta
		name="description"
		content="Каталог десертів та випічки оптом від Common.Kitchen. Широкий вибір, стабільна якість та зручне замовлення для вашого бізнесу."
	/>
</svelte:head>

<div class="categories-container">
	<h1>Каталог десертів та випічки</h1>

	{#if $categories.length > 0}
		<Categories categories={$categories} />
	{:else}
		<p>Наразі категорії товарів відсутні. Спробуйте пізніше.</p>
	{/if}
</div>

<style>
	.categories-container {
		max-width: 1200px;
		margin: 40px auto;
		padding: 20px;
	}

	h1 {
		text-align: center;
		margin: 20px 0px;
		color: var(--main-color);
	}
</style>

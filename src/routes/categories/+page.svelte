<script lang="ts">
	import Categories from '$lib/components/layout/categories/Categories.svelte';
	import { categories } from '$lib/stores/categoriesStore';
</script>

<div class="categories-container">
	<h1>Наша продукція</h1>

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

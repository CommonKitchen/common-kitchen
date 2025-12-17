<script lang="ts">
	import Main from '$lib/components/layout/Main.svelte';
	import Bestsellers from '$lib/components/layout/Bestsellers.svelte';
	import Categories from '$lib/components/layout/categories/Categories.svelte';
	import { categories } from '$lib/stores/categoriesStore';
</script>

<Main />
<Bestsellers />

<div class="container">
	<h2>Наша продукція</h2>
	<Categories categories={$categories} />
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 18px 0px 48px 0px;
		text-align: center;
		color: var(--main-color);
	}
</style>

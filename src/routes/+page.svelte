<script>
	import Main from '$lib/components/layout/Main.svelte';
	import Bestsellers from '$lib/components/layout/Bestsellers.svelte';
	import Categories from '$lib/components/layout/categories/Categories.svelte';

	import { getCategoryContext } from '$lib/context/categoryContext.js';
	import { getProductContext } from '$lib/context/productContext.js';

	const categories = getCategoryContext() ?? [];
	const products = getProductContext() ?? [];
	const bestsellers = $derived(products.filter((product) => product.bestseller));
</script>

<Main />
<Bestsellers products={bestsellers} />

<div class="container">
	<h2>Наша продукція</h2>
	<Categories {categories} />
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

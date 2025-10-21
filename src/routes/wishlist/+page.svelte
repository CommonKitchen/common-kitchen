<script>
	import Products from '$lib/components/layout/products/Products.svelte';
	import { getProductContext } from '$lib/context/productContext.js';
	import { favoriteProducts } from '$lib/stores/favoriteStore';

	/** @typedef {import('$lib/types.js').Product} Product */
	/** @type {Product[]} */
	const allProducts = getProductContext() ?? [];
	const products = $derived(allProducts.filter((item) => $favoriteProducts.has(item.id)));
</script>

<div class="favorite-block">
	<Products {products} />
</div>

<style>
	.favorite-block {
		margin: 20px auto;
	}
</style>

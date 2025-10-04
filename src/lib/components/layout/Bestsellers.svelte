<script>
	import Products from '$lib/components/layout/Products/Products.svelte';

	const { data } = $props();

	/** @typedef {import('$lib/types.js').Product} Product */
	/** @type {Product[]} */
	const AllProducts = $derived(data?.shopData?.products ?? []);

	/** @typedef {import('$lib/types.js').Bestsellers} Bestsellers */
	/** @type {Bestsellers[]} */
	const bestsellers = $derived(data?.shopData?.bestsellers ?? []);
	const productsId = $derived(new Set(bestsellers.map((item) => item.id)));
	const products = $derived(AllProducts.filter((product) => productsId.has(product.id)) ?? []);
</script>

<div class="container">
	<h2>Наші хіти</h2>
	<Products {products} />
</div>

<style>
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 36px 0px 18px 0px;
	}
</style>

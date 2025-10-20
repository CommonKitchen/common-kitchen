<script>
	import Products from '$lib/components/layout/products/Products.svelte';

	const { products } = $props();
</script>

<div class="container">
	<h2>Наші хіти</h2>
	<Products {products} />
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 36px 0px 18px 0px;
	}

	.container h2 {
		text-align: center;
	}
</style>

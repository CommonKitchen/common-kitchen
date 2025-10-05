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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 36px 0px 18px 0px;
	}
</style>

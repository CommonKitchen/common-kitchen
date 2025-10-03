<script>
	import Product from '$lib/components/layout/Products/Product.svelte';

	const { products } = $props();
</script>

<div class="products-grid">
	{#each products as product}
		<Product {...product} />
	{/each}
</div>

<style>
	.products-grid {
		max-width: 1200px;
		padding: 8px 0px;
		margin: 0px auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}
</style>

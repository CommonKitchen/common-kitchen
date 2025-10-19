<script>
	import Product from '$lib/components/layout/products/Product.svelte';

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
		margin: 0px auto;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
		justify-content: space-evenly;
		gap: 20px;
	}
</style>

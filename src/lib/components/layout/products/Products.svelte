<script>
	import Product from '$lib/components/layout/products/Product.svelte';

	const { products } = $props();
</script>

<div class="products-grid">
	{#each products as product (product.id)}
		<Product {...product} />
	{/each}
</div>

<style>
	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
		column-gap: 4px;
		row-gap: 20px;
	}

	@media (min-width: 380px) {
		.products-grid {
			gap: 10px;
		}
	}

	@media (min-width: 460px) {
		.products-grid {
			gap: 20px;
		}
	}
</style>

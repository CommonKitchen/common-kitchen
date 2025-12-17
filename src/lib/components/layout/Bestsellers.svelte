<script lang="ts">
	import Products from '$lib/components/layout/products/Products.svelte';
	import { bestsellers } from '$lib/stores/productsStore';
</script>

<div class="container">
	<h2>Наші хіти</h2>
	<Products products={$bestsellers} />
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
		padding-bottom: 30px;
		color: var(--main-color);
	}
</style>

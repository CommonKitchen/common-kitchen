<script>
	import Cart from '$lib/components/layout/cart/Cart.svelte';

	const { data } = $props();
	const products = $derived(data?.shopData?.products ?? []);
</script>

<div class="cart-container">
	<Cart {products} />
</div>

<style>
	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
</style>

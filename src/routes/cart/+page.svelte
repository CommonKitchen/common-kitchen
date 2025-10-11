<script>
	import Cart from '$lib/components/layout/cart/Cart.svelte';

	const { data } = $props();
	const products = $derived(data?.shopData?.products ?? []);
	const checkoutConfig = $derived(data?.shopData?.checkoutConfig ?? {});
</script>

<div class="cart-container">
	<Cart {products} {checkoutConfig} />
</div>

<style>
	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
</style>

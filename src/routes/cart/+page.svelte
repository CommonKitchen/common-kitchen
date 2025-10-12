<script>
	import Cart from '$lib/components/layout/cart/Cart.svelte';

	const { data } = $props();
	const products = $derived(data?.shopData?.products ?? []);
	const checkoutConfig = $derived(data?.shopData?.checkoutConfig ?? {});
	const customer = $derived(data?.shopData?.customer ?? {});
</script>

<div class="cart-container">
	<Cart {products} {checkoutConfig} {customer} />
</div>

<style>
	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
</style>

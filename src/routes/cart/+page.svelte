<script>
	import Cart from '$lib/components/layout/cart/Cart.svelte';
	import { customer } from '$lib/stores/customerStore.js';

	const { data } = $props();
	const products = $derived(data?.shopData?.products ?? []);
	const checkoutConfig = $derived(data?.shopData?.checkoutConfig ?? {});
	const apiURL = $derived(data?.shopData?.apiURL ?? '');
</script>

<div class="cart-container">
	<Cart {products} {checkoutConfig} customer={$customer} {apiURL} />
</div>

<style>
	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
</style>

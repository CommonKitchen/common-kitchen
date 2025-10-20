<script>
	import Cart from '$lib/components/layout/cart/Cart.svelte';
	import { getProductContext } from '$lib/context/productContext.js';
	import { customer } from '$lib/stores/customerStore.js';

	const { data } = $props();
	const products = getProductContext() ?? [];
	const checkoutConfig = $derived(data?.shopData?.checkoutConfig ?? {});
	const apiURL = $derived(data?.shopData?.apiURL ?? '');
</script>

<div class="cart-block">
	<Cart {products} {checkoutConfig} customer={$customer} {apiURL} />
</div>

<style>
	.cart-block {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	@media (max-width: 480px) {
		.cart-block {
			padding: 0px;
		}
	}
</style>

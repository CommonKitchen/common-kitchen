<!-- src/routes/cart/+page.svelte -->
<script lang="ts">
	import Cart from '$lib/components/layout/cart/Cart.svelte';
	import { setCustomerData } from '$lib/stores/customerStore';

	const { data } = $props();

	const { customer } = data;
	if (customer) {
		setCustomerData(customer);
	}

	const apiURL = $derived(data?.shopData?.apiURL ?? '');
</script>

<svelte:head>
	<title>Кошик — Common.Kitchen</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="cart-block">
	<Cart {customer} {apiURL} />
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

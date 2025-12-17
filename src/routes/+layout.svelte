<!-- /routes/+layout.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/header/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Loader from '$lib/components/ui/Loader.svelte';
	import { setCustomerData } from '$lib/stores/customerStore';
	import { setCheckoutConfig } from '$lib/stores/checkoutConfig';
	import { setProducts } from '$lib/stores/productsStore';
	import { setCategories } from '$lib/stores/categoriesStore';
	import { sessionStore } from '$lib/stores/sessionStore';
	let { children, data } = $props();

	setCategories(data.shopData?.categories ?? []);
	setProducts(data.shopData?.products ?? []);
	setCustomerData(data.shopData?.customer ?? null);
	setCheckoutConfig(data.shopData?.checkoutConfig ?? null);
	sessionStore.set(data.shopData?.sessionId ?? null);

	const isMobile = data?.isMobile ?? false;

	let isLoading = $state(true);

	onMount(() => (isLoading = false));
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Common.Kitchen" />
	<link rel="manifest" href="/site.webmanifest" />
	<title>Common.Kitchen</title>
</svelte:head>

{#if isLoading}
	<Loader />
{:else}
	<Header {isMobile} />
	<div class="content-wrap">
		{@render children?.()}
	</div>
	<Footer />
{/if}

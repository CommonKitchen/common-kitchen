<script lang="ts">
	const { data } = $props();
	const apiURL = $derived(data?.shopData?.apiURL ?? '');

	import Orders from '$lib/components/layout/orders/Orders.svelte';
</script>

<Orders {apiURL} />

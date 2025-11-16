<script>
	const { data } = $props();
	const apiURL = $derived(data?.shopData?.apiURL ?? '');
	import CustomerData from '$lib/components/layout/customer/CustomerData.svelte';
</script>

<CustomerData {apiURL} />

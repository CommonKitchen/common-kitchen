<script>
	import Main from '$lib/components/layout/Main.svelte';
	import Bestsellers from '$lib/components/layout/Bestsellers.svelte';
	import Categories from '$lib/components/layout/Categories/Categories.svelte';

	const { data } = $props();
	const categories = $derived(data?.shopData?.categories ?? []);
</script>

<Main />
<Bestsellers {data} />

<div class="container">
	<h2>Наша продукція</h2>
	<Categories {categories} />
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 18px 0px 48px 0px;
		text-align: center;
	}
</style>

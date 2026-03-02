<!-- route/+page.svelte -->
<script lang="ts">
	import Main from '$lib/components/layout/Main.svelte';
	import Bestsellers from '$lib/components/layout/Bestsellers.svelte';
	import Categories from '$lib/components/layout/categories/Categories.svelte';
	import { categories } from '$lib/stores/categoriesStore';
</script>

<svelte:head>
	<title>Common.Kitchen — Десерти та випічка, що працюють на ваш бізнес</title>
	<meta
		name="description"
		content="Готуємо десерти, що продаються. Стабільна якість, зручне замовлення та асортимент, що приваблює гостей. Спрощуємо роботу вашого закладу!"
	/>
</svelte:head>

<Main />
<Bestsellers />

<div class="container">
	<h2>Десерти та випічка від Common.Kitchen</h2>
	<Categories categories={$categories} />
</div>

<style>
	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 18px 0px 48px 0px;
		text-align: center;
		color: var(--main-color);
	}
</style>

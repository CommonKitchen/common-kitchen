<!-- route/+page.svelte -->
<script lang="ts">
	import Main from '$lib/components/layout/Main.svelte';
	import Bestsellers from '$lib/components/layout/Bestsellers.svelte';
	import Categories from '$lib/components/layout/categories/Categories.svelte';
	import { categories } from '$lib/stores/categoriesStore';

	const imgURL =
		'https://res.cloudinary.com/dwfbj9x06/image/upload/w_600/v1760969457/mlycppkfrcvylzy4wjg6.png';
</script>

<svelte:head>
	<title>Common.Kitchen — Десерти та випічка, що працюють на ваш бізнес</title>
	<meta
		name="description"
		content="Готуємо десерти та випічку, що продаються. Стабільна якість, зручне замовлення та асортимент, що приваблює гостей. Спрощуємо роботу вашого закладу!"
	/>

	<meta property="og:site_name" content="Common.Kitchen" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://common-kitchen.vercel.app" />
	<meta
		property="og:title"
		content="Common.Kitchen — Десерти та випічка, що працюють на ваш бізнес"
	/>
	<meta
		property="og:description"
		content="Готуємо десерти та випічку, що продаються. Стабільна якість, зручне замовлення та асортимент, що приваблює гостей. Спрощуємо роботу вашого закладу!"
	/>

	<meta property="og:image" content={imgURL} />
	<meta property="og:image:width" content="600" />
	<meta property="og:image:height" content="600" />

	<meta name="twitter:card" content="summary" />
	<meta
		name="twitter:title"
		content="Common.Kitchen — Десерти та випічка, що працюють на ваш бізнес"
	/>
	<meta
		name="twitter:description"
		content="Готуємо десерти та випічку, що продаються. Стабільна якість, зручне замовлення та асортимент, що приваблює гостей. Спрощуємо роботу вашого закладу!"
	/>
	<meta name="twitter:image" content={imgURL} />
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

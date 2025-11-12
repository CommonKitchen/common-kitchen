<script>
	import { getCategoryContext } from '$lib/context/categoryContext.js';
	import { customer } from '$lib/stores/customerStore.js';

	/** @typedef {import('$lib/types.js').Category} Category */
	/** @type {Category[]} */
	const categories = $derived(getCategoryContext() ?? []);
	const hasCustomer = !!customer;
	const { close } = $props();
</script>

<div class="menu-content">
	<h4 class="title">Продукція</h4>
	<div class="nav-separator"></div>
	<nav class="nav-list">
		{#each categories as category (category.slug)}
			<a href="/categories/{category.slug}" class="nav-link" onclick={() => close()}>
				{category.title}
			</a>
		{/each}
		<div class="nav-separator"></div>
		<a href="/cart" class="nav-link" onclick={close}>Корзина</a>
		{#if hasCustomer}
			<div class="nav-separator"></div>
			<a href="/orders" class="nav-link" onclick={close}>Мої замовлення</a>
			<a href="/customer" class="nav-link" onclick={close}>Мої дані</a>
		{/if}
	</nav>
</div>

<style>
	.title {
		font-size: 1.3rem;
		font-weight: bold;
		color: var(--main-color);
		margin: 10px 0px;
		padding-bottom: 10px;
	}

	.nav-separator {
		border-bottom: 2px solid var(--common-border);
	}

	.nav-list {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.nav-link {
		display: block; /* Ссылка занимает всю ширину для удобства клика */
		padding: 10px 15px;
		text-decoration: none;
		color: var(--common-text-dark, #495057);
		font-size: 1.2rem;
		border-radius: 4px;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.nav-link:hover {
		background-color: var(--common-bg-hover, #e9ecef);
		color: #000;
	}
</style>

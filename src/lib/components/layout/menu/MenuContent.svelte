<script>
	import { getCategoryContext } from '$lib/context/categoryContext.js';
	import { customer } from '$lib/stores/customerStore.js';

	/** @typedef {import('$lib/types.js').Category} Category */
	/** @type {Category[]} */
	const categories = $derived(getCategoryContext() ?? []);
	const hasCustomer = $derived(!!$customer);
	const { close } = $props();

	let isProductions = $state(false);
</script>

<div class="menu-content">
	<h4 class="title" role="presentation" onclick={() => (isProductions = !isProductions)}>
		{#if isProductions}
			<span class="arrow back"></span>
			Назад
		{:else}
			Продукція
			<span class="arrow forward"></span>
		{/if}
	</h4>
	<div class="nav-separator"></div>
	<nav class="nav-list">
		{#if !isProductions}
			<a href="/cart" class="nav-link" onclick={close}>Корзина</a>
			{#if hasCustomer}
				<div class="nav-separator"></div>
				<a href="/orders" class="nav-link" onclick={close}>Мої замовлення</a>
				<a href="/customer" class="nav-link" onclick={close}>Мої дані</a>
			{/if}
		{:else}
			{#each categories as category (category.slug)}
				<a href="/categories/{category.slug}" class="nav-link" onclick={close}>
					{category.title}
				</a>
			{/each}
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
		display: flex;
		align-items: baseline;
		cursor: pointer;
		padding: 10px 15px;
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

	.arrow {
		display: block;
		position: relative;
		width: 12px;
		height: 12px;
		font-size: 0;
		flex-shrink: 0;
	}

	.arrow::after {
		content: '';
		display: block;
		position: absolute;
		width: 8px;
		height: 8px;
		border-color: var(--main-color, #555);
		border-style: solid;
		border-width: 0 2px 2px 0;
	}

	.arrow.forward {
		margin-left: auto; /* Отодвигает стрелку вправо */
		margin-right: 0; /* Убедимся, что нет лишнего отступа */
	}
	.arrow.forward::after {
		transform: rotate(-45deg);
	}

	.arrow.back {
		margin-right: 8px; /* Отступ от стрелки до текста "Назад" */
		margin-left: 0;
	}
	.arrow.back::after {
		transform: rotate(135deg);
	}
</style>

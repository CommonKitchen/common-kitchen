<script>
	import { onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import { cubicOut, linear } from 'svelte/easing';
	import { getCategoryContext } from '$lib/context/categoryContext.js';

	const BREAKPOINT = 576;
	let isMobile = $state(false);

	function checkWidth() {
		isMobile = window.innerWidth < BREAKPOINT;
	}

	onMount(() => {
		checkWidth();
		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	});

	const { isOpen, close } = $props();

	/** @typedef {import('$lib/types.js').Category} Category */
	/** @type {Category[]} */
	const categories = $derived(getCategoryContext() ?? []);

	$effect(() => {
		if (!isOpen) return;

		/** @param {KeyboardEvent} event */
		function handleKeydown(event) {
			if (event.key === 'Escape') {
				close();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isOpen && isMobile}
	<aside class="menu-panel mobile-fly" transition:fly={{ x: -240, duration: 300, easing: linear }}>
		<div class="menu-content">
			<h4 class="title">Продукція</h4>
			<div class="nav-separator"></div>
			<nav class="nav-list">
				{#each categories as category (category.slug)}
					<a href="/categories/{category.slug}" class="nav-link" onclick={close}>
						{category.title}
					</a>
				{/each}
				<div class="nav-separator"></div>
				<a href="/cart" class="nav-link" onclick={close}>Корзина</a>
			</nav>
		</div>
	</aside>
{:else if isOpen && !isMobile}
	<aside class="menu-panel desktop-slide" transition:slide={{ duration: 300, easing: cubicOut }}>
		<div class="menu-content">
			<h4 class="title">Продукція</h4>
			<div class="nav-separator"></div>
			<nav class="nav-list">
				{#each categories as category (category.slug)}
					<a href="/categories/{category.slug}" class="nav-link" onclick={close}>
						{category.title}
					</a>
				{/each}
				<div class="nav-separator"></div>
				<a href="/cart" class="nav-link" onclick={close}>Корзина</a>
			</nav>
		</div>
	</aside>
{/if}

<style>
	.menu-panel {
		background-color: var(--common-bg-light);
		left: 0;
		width: 240px;
		z-index: 50;
	}

	.menu-panel.mobile-fly {
		position: fixed; /* Должно быть fixed для мобильного меню! */
		top: 56px;
		height: calc(100vh - 56px); /* Полная высота экрана */
		padding: 20px; /* Отступ сверху, чтобы избежать шапки, если она есть */
		border-radius: 0;
	}

	.menu-panel.desktop-slide {
		position: absolute;
		/* Привязываем к левому краю контейнера. (Предполагается, что родительский элемент имеет position: relative) */
		/*left: 0px; /* Здесь должен быть left: 0 или right: 0 в зависимости от Header.svelte */
		height: auto;
		/* Ограничиваем высоту, чтобы оно не занимало весь экран */
		max-height: calc(100vh - 66px);

		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		/* Устанавливаем z-index выше основного контента, но ниже модальных окон */
		overflow-y: auto;
		padding: 12px 20px 20px 20px;
		border-radius: 0 0 8px 8px;
	}

	.title {
		font-size: 1.2rem;
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
		font-size: 1rem;
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

<script>
	import { onMount } from 'svelte';
	import { slide, fly, fade } from 'svelte/transition';
	import { cubicOut, linear } from 'svelte/easing';
	import MenuContent from './MenuContent.svelte';

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

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		/** @param {KeyboardEvent} event */
		function handleKeydown(event) {
			if (event.key === 'Escape') {
				close();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen && isMobile}
	<div
		class="backdrop mobile"
		onclick={close}
		transition:fade={{ duration: 150 }}
		role="presentation"
	></div>
	<aside class="menu-panel mobile-fly" transition:fly={{ x: -240, duration: 300, easing: linear }}>
		<MenuContent {close} />
	</aside>
{:else if isOpen && !isMobile}
	<div
		class="backdrop"
		onclick={close}
		transition:fade={{ duration: 150 }}
		role="presentation"
	></div>
	<aside class="menu-panel desktop-slide" transition:slide={{ duration: 300, easing: cubicOut }}>
		<MenuContent {close} />
	</aside>
{/if}

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 49;
	}

	.backdrop.mobile {
		background-color: rgba(0, 0, 0, 0.5);
	}

	.menu-panel {
		background-color: var(--common-bg-light);
		left: 0;
		z-index: 50;
	}

	.menu-panel.mobile-fly {
		width: 280px;
		position: fixed; /* Должно быть fixed для мобильного меню! */
		top: 56px;
		height: calc(100vh - 56px); /* Полная высота экрана */
		padding: 20px; /* Отступ сверху, чтобы избежать шапки, если она есть */
		border-radius: 0;
	}

	.menu-panel.desktop-slide {
		width: 350px;
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
</style>

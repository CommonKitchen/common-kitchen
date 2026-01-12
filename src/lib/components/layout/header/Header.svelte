<!-- svelte-ignore non_reactive_update -->
<!-- src/lib/components/header/header.svelte -->
<script lang="ts">
	import BurgerMenuButton from '$lib/components/layout/header/BurgerMenuButton.svelte';
	import Menu from '$lib/components/layout/menu/Menu.svelte';
	import ActionIcon from '$lib/components/ui/ActionIcon.svelte';
	import Phone from '$lib/components/ui/Phone.svelte';
	import Search from '$lib/components/layout/header/Search.svelte';
	import Loupe from '$lib/components/layout/icons/Loupe.svelte';
	import logo from '$lib/assets/logo.svg';
	import Login from '$lib/components/layout/icons/Login.svelte';
	import Bag from '$lib/components/layout/icons/Bag.svelte';
	import { cart } from '$lib/stores/cartStore.svelte';
	import Telegram from '$lib/components/ui/Telegram.svelte';
	import { onMount } from 'svelte';

	const { isMobile } = $props();

	const phone = '+380738387677';
	const telegramUser = 'https://t.me/manager_commonkitchen';

	let isSearchOverlay = $state(false);

	function toggleSearchOverlay() {
		isSearchOverlay = !isSearchOverlay;
	}

	let isMenuOpen = $state(false);

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	$effect(() => {
		if (isSearchOverlay) {
			document.body.style.overflow = 'hidden';

			function handleKeydown(event: KeyboardEvent) {
				if (event.key === 'Escape') {
					toggleSearchOverlay();
				}
			}

			document.addEventListener('keydown', handleKeydown);

			return () => {
				document.removeEventListener('keydown', handleKeydown);
			};
		} else {
			document.body.style.overflow = '';
		}
	});
</script>

<header class="main-header">
	<div class="header-content">
		<div class="logo-and-menu-group">
			<div class="header-logo">
				<a href="/">
					<img src={logo} alt="Common.Kitchen" />
				</a>
			</div>
			<div class="logo-placeholder"></div>
			<div class="menu-wrapper">
				<BurgerMenuButton isOpen={isMenuOpen} toggle={toggleMenu} />
				<Menu isOpen={isMenuOpen} close={closeMenu} />
			</div>
		</div>

		<div class="header-actions">
			<div class="search-block">
				<Search isOverlay={isSearchOverlay} {toggleSearchOverlay} />
			</div>
			{#if isMobile}
				<Telegram {telegramUser} />
			{:else}
				<div class="phone-block">
					<Phone {phone} />
				</div>
			{/if}
			<div class="icon-block">
				<div class="icon-loupe">
					<ActionIcon onclick={toggleSearchOverlay} icon={Loupe} />
				</div>
				<ActionIcon href="/login" icon={Login} />
				<!-- <ActionIcon href="/wishlist" icon={Heart} stretch={true} /> -->
				{#if mounted}
					<ActionIcon href="/cart" icon={Bag} count={cart.itemCount} />
				{:else}
					<ActionIcon href="/cart" icon={Bag} />
				{/if}
				<!-- <ActionIcon href="/cart" icon={Bag} count={$itemCount} /> -->
			</div>
		</div>
	</div>
</header>
{#if isSearchOverlay}
	<div class="search-overlay" onclick={toggleSearchOverlay} role="presentation">
		<Search isOverlay={isSearchOverlay} {toggleSearchOverlay} />
	</div>
{/if}

<style>
	.main-header {
		width: 100%;
		height: 56px;
		position: sticky;
		top: 0;
		z-index: 100;
		background-image: linear-gradient(to top, var(--header-background, #e3d8c9), #b4a89c);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		margin: 0px auto;
		padding: 0px 12px;
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: space-between;
		max-width: 1366px;
		position: relative;
		gap: 4px;
	}

	.header-logo {
		position: absolute;
		top: 2px;
		left: 0px;
		height: 62px;
		width: 130px;
	}

	.logo-placeholder {
		width: 130px;
		height: 1px;
		flex-shrink: 0;
	}

	.logo-and-menu-group {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	.menu-wrapper {
		position: relative; /* КРИТИЧНО: Родитель для абсолютно позиционированного SideMenu */
		flex-shrink: 0; /* Гарантируем, что обертка не сжимается */
	}

	.header-actions {
		min-width: 0;
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.icon-block {
		display: flex;
		align-items: flex-end;
		justify-content: space-evenly;
		gap: 10px;
	}

	.search-block,
	.phone-block {
		display: none;
	}

	.search-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 90;
		display: flex;
		justify-content: center;
		padding-top: 66px;
		backdrop-filter: blur(2px); /* Опционально: эффект размытия */
	}

	.search-overlay :global(.search) {
		width: 90%;
		max-width: 400px;
	}

	.search-overlay :global(.search input) {
		width: 100%;
	}

	@media (min-width: 400px) {
		.header-logo,
		.logo-placeholder {
			width: 164px;
		}
	}

	@media (min-width: 528px) {
		.header-content {
			justify-content: space-between;
		}
	}

	@media (min-width: 576px) {
		.phone-block {
			display: block;
		}
	}

	@media (min-width: 768px) {
		.search-block {
			display: block;
		}
		.icon-loupe {
			display: none;
		}
	}
</style>

<script>
	import BurgerMenuButton from '$lib/components/layout/header/BurgerMenuButton.svelte';
	import Menu from '$lib/components/layout/header/Menu.svelte';
	import ActionIcon from '$lib/components/ui/ActionIcon.svelte';
	import Phone from '$lib/components/ui/Phone.svelte';
	import Search from '$lib/components/layout/header/Search.svelte';
	import logo from '$lib/assets/logo.png';
	import heart from '$lib/assets/icon-favorite-24x24.svg';
	import bag from '$lib/assets/icon-bag-24x24.svg';
	import loupe from '$lib/assets/icon-search-24x24.svg';
	import { itemCount } from '$lib/stores/cartStore.js';

	const phone = '+380990011111';

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
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
				<Search />
			</div>
			<div class="phone-block">
				<Phone {phone} />
			</div>
			<div class="icon-block">
				<div class="icon-loupe">
					<ActionIcon href="/search" iconSrc={loupe} />
				</div>
				<ActionIcon href="/wishlist" iconSrc={heart} />
				<ActionIcon href="/cart" iconSrc={bag} count={$itemCount} />
			</div>
		</div>
	</div>
</header>

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
		width: 164px;
	}

	.logo-placeholder {
		width: 164px;
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

<script>
	import ActionIcon from '$lib/components/ui/ActionIcon.svelte';
	import Phone from '$lib/components/ui/Phone.svelte';
	import Search from '$lib/components/layout/header/Search.svelte';
	import logo from '$lib/assets/logo.png';
	import heart from '$lib/assets/icon-favorite-24x24.svg';
	import bag from '$lib/assets/icon-bag-24x24.svg';
	import { itemCount } from '$lib/stores/cartStore.js';

	const phone = '+380990000101';
</script>

<header class="main-header">
	<div class="header-content">
		<div class="header-logo">
			<a href="/">
				<img src={logo} alt="Common.Kitchen" />
			</a>
		</div>
		<div class="logo-placeholder"></div>
		<div class="header-actions">
			<Search />
			<Phone {phone} />
			<ActionIcon href="/wishlist" iconSrc={heart} />
			<ActionIcon href="/cart" iconSrc={bag} count={$itemCount} />
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
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: space-between;
		max-width: 1366px;
		margin: 0 auto;
		position: relative;
	}

	.header-logo {
		position: absolute;
		top: 8px;
		left: 20px;
		height: 62px;
		width: 164px;
	}

	.logo-placeholder {
		width: 194px;
		height: 1px;
		flex-shrink: 0;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 24px;
		padding-right: 16px;
	}
</style>

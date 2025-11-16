<!-- /routes/+layout.svelte -->
<script>
	import { onMount } from 'svelte';
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/header/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { setCategoryContext } from '$lib/context/categoryContext.js';
	import { setProductContext } from '$lib/context/productContext.js';
	import { setCustomerData } from '$lib/stores/customerStore.js';
	import { setFavoriteProducts } from '$lib/stores/favoriteStore.js';
	import { getWebApp } from '$lib/utils/telegram.js';
	import Loader from '$lib/components/ui/Loader.svelte';
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	const apiURL = data.shopData?.apiURL ?? '';

	onMount(() => {
		const webApp = getWebApp();
		// @ts-ignore
		const initData = webApp?.initData;
		if (initData && apiURL) {
			fetchCustomerData(initData);
		} else {
			console.warn('Telegram WebApp.initData не знайдено. Працюємо як звичайний веб-додаток.');
		}
	});

	/**
	 * Завантажує дані клієнта з API, використовуючи initData для автентифікації.
	 * @param {string} initData - Дані, отримані від Telegram.
	 */
	async function fetchCustomerData(initData) {
		if (!initData || !apiURL) {
			console.warn('Неможливо завантажити дані клієнта: відсутній initData або API URL.');
			setCustomerData(null);
			return;
		}

		try {
			const url = `${apiURL}/cakes/hs/shop/customers`;

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Telegram-Init-Data': initData
				}
			});

			if (!response.ok) {
				console.error(`Помилка API при отриманні даних клієнта. Статус: ${response.status}`);
				setCustomerData(null);
				return;
			}

			const data = await response.json();
			const customerData = data.customer || null;

			// Оновлюємо внутрішній стан
			setCustomerData(customerData);
			// setFavoriteProducts([]);
			console.log('Дані клієнта успішно завантажено.');

			if (
				customerData &&
				(!customerData.legalEntities || customerData.legalEntities.length === 0)
			) {
				await goto('/customer', { replaceState: true });

				return;
			}
		} catch (error) {
			console.error('Помилка мережі при завантаженні даних клієнта:', error);
			setCustomerData(null);
		}
	}

	setCategoryContext(data.shopData?.categories ?? []);
	setProductContext(data.shopData?.products ?? []);

	let isLoading = $state(true);

	onMount(() => (isLoading = false));
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Common.Kitchen" />
	<link rel="manifest" href="/site.webmanifest" />
	<title>Common.Kitchen</title>
</svelte:head>

{#if isLoading}
	<Loader />
{:else}
	<Header />
	<div class="content-wrap">
		{@render children?.()}
	</div>
	<Footer />
{/if}

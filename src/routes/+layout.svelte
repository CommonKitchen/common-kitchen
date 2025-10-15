<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/header/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { setCategoryContext } from '$lib/context/categoryContext.js';
	import { setProductContext } from '$lib/context/productContext.js';
	import { setCustomerContext } from '$lib/context/customerContext.js';
	import { getWebApp } from '$lib/utils/telegram.js';

	let { children, data } = $props();

	/** @typedef {import('$lib/types.js').Customer} Customer */
	let customerData = $state(null);

	const apiURL = data.shopData?.apiURL ?? '';

	onMount(() => {
		if (browser) {
			const webApp = getWebApp();

			if (webApp) {
				// @ts-ignore
				webApp.ready();
				// @ts-ignore
				webApp.expand();

				console.log(`webApp.initData ${webApp.initData}`);

				// 2. Запуск завантаження даних клієнта
				// Перевіряємо наявність initData. apiURL вже встановлено з SSR-даних.
				// @ts-ignore
				if (webApp.initData && apiURL) {
					// @ts-ignore
					fetchCustomerData(webApp.initData);
				} else {
					console.warn('Telegram WebApp.initData не знайдено. Працюємо як звичайний веб-додаток.');
				}
			} else {
				console.warn('Telegram WebApp API не знайдено. Працюємо як звичайний веб-додаток.');
			}
		}
	});

	/**
	 * Завантажує дані клієнта з API, використовуючи initData для автентифікації.
	 * @param {string} initData - Дані, отримані від Telegram.
	 */
	async function fetchCustomerData(initData) {
		if (!initData || !apiURL) {
			console.warn('Неможливо завантажити дані клієнта: відсутній initData або API URL.');
			return;
		}

		try {
			const url = `${apiURL}/cakes/hs/shop/customers`;

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// КЛЮЧОВИЙ МОМЕНТ: передаємо initData в заголовку для автентифікації
					'X-Telegram-Init-Data': initData
				}
			});

			if (!response.ok) {
				console.error(`Помилка API при отриманні даних клієнта. Статус: ${response.status}`);
				customerData = null; // Не вдалося автентифікувати або отримати дані
				return;
			}

			const data = await response.json();

			// Оновлюємо внутрішній стан
			customerData = data.customer || null;
			console.log('Дані клієнта успішно завантажено.', customerData);
		} catch (error) {
			console.error('Помилка мережі при завантаженні даних клієнта:', error);
			customerData = null;
		}
	}

	setCategoryContext(data.shopData?.categories ?? []);
	setProductContext(data.shopData?.products ?? []);

	// svelte-ignore state_referenced_locally
	setCustomerContext(customerData);

	// 4. Реактивне оновлення контексту, коли customerData змінюється після onMount
	$effect(() => {
		setCustomerContext(customerData);
	});
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="favicon.svg" />
	<link rel="shortcut icon" href="favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Common.Kitchen" />
	<link rel="manifest" href="site.webmanifest" />
	<title>Common.Kitchen</title>
</svelte:head>

<Header />
<div class="content-wrap">
	{@render children?.()}
</div>
<Footer />

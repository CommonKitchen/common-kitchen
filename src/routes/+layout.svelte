<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import '$lib/styles/global.css';
	import Header from '$lib/components/layout/header/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { setCategoryContext } from '$lib/context/categoryContext.js';
	import { setProductContext } from '$lib/context/productContext.js';
	import { setCustomerData } from '$lib/stores/customerStore.js';
	import { getWebApp } from '$lib/utils/telegram.js';

	let { children, data } = $props();

	const apiURL = data.shopData?.apiURL ?? '';

	onMount(() => {
		const webApp = {
			initData:
				'query_id=AAFsRjIYAAAAAGxGMhg-dsmh&user=%7B%22id%22%3A405948012%2C%22first_name%22%3A%22Olexander%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FYSacqszPFJcQEXl9G11mEpWG1P9Ln3ZNY35WASFaZ8U.svg%22%7D&auth_date=1760520197&signature=4cqSSHlBUnDAdEfDlS-qy78OIwznGjvIURVSyI-5DbFb1BRS6N1c4QMIFdxPAWM9w4L85OzL2_8MGFlkMUgiCg&hash=0e4d6c5ce452bdb6203fae090f8db70efbb057386aa5d85955bcea06e800f381'
		};
		if (webApp.initData && apiURL) {
			// @ts-ignore
			fetchCustomerData(webApp.initData);
		} else {
			console.warn('Telegram WebApp.initData не знайдено. Працюємо як звичайний веб-додаток.');
		}

		// if (browser) {
		// 	const webApp = getWebApp();

		// 	if (webApp) {
		// 		// @ts-ignore
		// 		webApp.ready();
		// 		// @ts-ignore
		// 		webApp.expand();

		// 		// console.log(`webApp.initData ${webApp.initData}`);

		// 		// 2. Запуск завантаження даних клієнта
		// 		// Перевіряємо наявність initData. apiURL вже встановлено з SSR-даних.
		// 		// @ts-ignore
		// 		if (webApp.initData && apiURL) {
		// 			// @ts-ignore
		// 			fetchCustomerData(webApp.initData);
		// 		} else {
		// 			console.warn('Telegram WebApp.initData не знайдено. Працюємо як звичайний веб-додаток.');
		// 		}
		// 	} else {
		// 		console.warn('Telegram WebApp API не знайдено. Працюємо як звичайний веб-додаток.');
		// 	}
		// }
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
					// КЛЮЧОВИЙ МОМЕНТ: передаємо initData в заголовку для автентифікації
					'X-Telegram-Init-Data': initData
				}
			});

			if (!response.ok) {
				console.error(`Помилка API при отриманні даних клієнта. Статус: ${response.status}`);
				setCustomerData(null);
				return;
			}

			const data = await response.json();

			// Оновлюємо внутрішній стан
			setCustomerData(data.customer || null);
			console.log('Дані клієнта успішно завантажено.');
		} catch (error) {
			console.error('Помилка мережі при завантаженні даних клієнта:', error);
			setCustomerData(null);
		}
	}

	setCategoryContext(data.shopData?.categories ?? []);
	setProductContext(data.shopData?.products ?? []);
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

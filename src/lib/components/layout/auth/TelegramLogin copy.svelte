<script lang="ts">
	import { onMount } from 'svelte';
	import QrCode from 'svelte-qrcode';
	import Button from '$lib/components/ui/Button.svelte';
	import { setCustomerData } from '$lib/stores/customerStore';

	const { isMobile, customer } = $props();

	let authorized = $state(false);
	let sessionId = $state('');
	let waiting = $state(false);
	let error = $state(false);

	let evtSource: EventSource | null = null;
	let visibilityHandler: (() => void) | null = null;

	function getSseLink() {
		return `/api/sse?sessionId=${sessionId}`;
	}

	function getLoginLink() {
		return `https://t.me/commonkitchenbot?start=id_${sessionId}`;
	}

	//#region successLogin
	const successLogin = async (id: string) => {
		try {
			const res = await fetch('/api/successlogin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId: id })
			});

			if (!res.ok) {
				console.error('Failed to complete login:', res.status);
				return false;
			}

			const data = await res.json();

			console.log('data', data);

			if (data.customer) {
				setCustomerData(data.customer);
			} else {
				console.warn('No customer data returned from server');
			}

			return true;
		} catch (err) {
			console.error('Error during successLogin:', err);
			return false;
		}
	};

	onMount(() => {
		if ($customer) {
			authorized = true;
			return;
		}

		sessionId = crypto.randomUUID();

		visibilityHandler = () => {
			if (!document.hidden && waiting && !authorized) {
				console.log('Restoring SSE connection...');
				startSSE();
			}
		};

		document.addEventListener('visibilitychange', visibilityHandler);

		if (!isMobile) {
			startLogin();
		}

		return () => {
			evtSource?.close();
			if (visibilityHandler) {
				document.removeEventListener('visibilitychange', visibilityHandler);
			}
		};
	});

	function startSSE() {
		if (!sessionId) {
			console.error('Session ID not ready.');
			return;
		}

		waiting = true;
		error = false;

		if (evtSource) {
			evtSource.close();
		}

		evtSource = new EventSource(getSseLink());

		// Обработчик успешной авторизации
		evtSource.addEventListener('authorized', async (event) => {
			console.log('User authorized');

			await successLogin(sessionId);

			authorized = true;
			waiting = false;
			evtSource?.close();
			evtSource = null;
		});

		// Обработчик ошибок SSE (потеря соединения, ошибка сервера и т.д.)
		evtSource.onerror = () => {
			waiting = false;
			if (authorized) return;
			console.error('SSE connection lost or error occurred');
			error = true;
			evtSource?.close();
			evtSource = null;
		};
	}

	/**
	 * Основная функция запуска логина.
	 * На мобильном открывает окно, на десктопе просто запускает SSE.
	 */
	function startLogin() {
		if (isMobile) {
			window.open(getLoginLink(), '_blank');
		}

		startSSE();
	}
</script>

<div class="login-block">
	{#if authorized}
		<p>Вы авторизовані ✅</p>
	{:else if error}
		<div class="error-message">
			<p>Помилка підключення.</p>
			<button
				onclick={() => {
					sessionId = crypto.randomUUID(); // Генерируем новый ID сразу
					startLogin();
				}}
			>
				Перезапустити авторизацію
			</button>
		</div>
	{:else if isMobile}
		<Button onclick={startLogin} title="Авторизуватися" />
		{#if waiting}
			<p>Очікуємо підтвердження в Telegram...</p>
		{/if}
	{:else if sessionId}
		<div class="qrcode-block">
			<QrCode value={getLoginLink()} errorCorrection="H" size={250} />
			{#if waiting}
				<p>Очікуємо підтвердження в Telegram...</p>
			{:else}
				<p>Запуск авторизації...</p>
			{/if}
		</div>
	{:else}
		<p>Завантаження даних...</p>
	{/if}
</div>

<style>
	.login-block {
		width: 100%;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.qrcode-block {
		margin: 20px auto;
		text-align: center;
	}

	.error-message {
		padding: 15px;
		background-color: #fdd;
		border: 1px solid #c00;
		color: #c00;
		border-radius: 4px;
		text-align: center;
	}
</style>

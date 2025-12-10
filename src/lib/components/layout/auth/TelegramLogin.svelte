<script lang="ts">
	import { onMount } from 'svelte';
	import QrCode from 'svelte-qrcode';
	import Button from '$lib/components/ui/Button.svelte';
	import { setCustomerData } from '$lib/stores/customerStore';
	import { sessionStore } from '$lib/stores/sessionStore';
	import { goto } from '$app/navigation';

	const { isMobile, customer } = $props();

	let authorized = $state(false);
	let sessionId = $state('');
	let waiting = $state(false);
	let error = $state(false);

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
				console.error('Failed to complete login:', res.status, res.statusText);
				// error = true;
				return false;
			}

			const data = await res.json();
			console.log('data', data);

			if (data.customer) {
				setCustomerData(data.customer);
				sessionStore.set(id);
			} else {
				console.warn('No customer data returned from server');
				return false;
			}

			return true;
		} catch (err) {
			console.error('Error during successLogin:', err);
			// error = true;
			return false;
		}
	};

	let pollingInterval: number | null = null;

	function startPolling() {
		if (!sessionId) {
			console.error('Session ID not ready.');
			return;
		}

		waiting = true;
		error = false;

		if (pollingInterval) {
			clearInterval(pollingInterval);
		}

		pollingInterval = setInterval(async () => {
			const success = await successLogin(sessionId);
			if (success) {
				if (pollingInterval) clearInterval(pollingInterval);
				pollingInterval = null;

				// if (success) {
				authorized = true;
				waiting = false;
				goto('/customer');
				// } else {
				// 	waiting = false;
				// }
			}
		}, 2000) as unknown as number;
	}

	onMount(() => {
		if ($customer) {
			authorized = true;
			return;
		}

		sessionId = crypto.randomUUID();

		if (!isMobile) {
			startPolling();
		}

		return () => {
			if (pollingInterval) clearInterval(pollingInterval);
		};
	});

	function startLogin() {
		if (isMobile) {
			window.open(getLoginLink(), '_blank');
		}

		startPolling();
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
					sessionId = crypto.randomUUID();
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

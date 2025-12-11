<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import TelegramLogin from '$lib/components/layout/auth/TelegramLogin.svelte';
	import { customer } from '$lib/stores/customerStore.js';
	const { data } = $props();
	const { isMobile } = data;
</script>

<div class="logo-header">
	<h3>Авторизуватися за допомогою Telegram</h3>
</div>
{#if $customer}
	goto('/customer');
{:else}
	<TelegramLogin {isMobile} {customer} />
{/if}

<style>
	.logo-header {
		width: 100%;
		margin: 12px auto;
		text-align: center;
	}
</style>

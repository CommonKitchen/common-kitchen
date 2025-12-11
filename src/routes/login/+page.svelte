<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import TelegramLogin from '$lib/components/layout/auth/TelegramLogin.svelte';
	import { customer } from '$lib/stores/customerStore.js';
	const { data } = $props();
	const { isMobile } = data;
	if ($customer) goto('/customer');
</script>

<div class="logo-header">
	<h3>Авторизуватися за допомогою Telegram</h3>
</div>
<TelegramLogin {isMobile} {customer} />

<style>
	.logo-header {
		width: 100%;
		margin: 12px auto;
		text-align: center;
	}
</style>

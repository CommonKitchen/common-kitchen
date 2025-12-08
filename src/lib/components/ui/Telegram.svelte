<script>
	import TelegramIcon from '$lib/components/layout/icons/Telegram.svelte';
	const { telegramUser } = $props();
</script>

<a href={telegramUser} class="telegram-link">
	<TelegramIcon />
	Написати менеджеру
</a>

<style>
	.telegram-link {
		display: flex;
		align-items: center;
		gap: 5px;
		color: #373737;
		font-weight: 500;
		font-size: 16px;
		transition: color 0.2s;
		text-decoration: none;
	}

	.telegram-link:hover {
		color: var(--main-color, #e24511);
	}
</style>

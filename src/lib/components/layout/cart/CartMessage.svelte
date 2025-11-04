<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';

	const { option } = $props();
</script>

{#if option === 'success'}
	<div class="message-block">
		<h2>Вашe замовлення успішно оформлено!</h2>
		<p class="empty-message" style="margin-bottom: 10px;">
			Дякуємо за ваш вибір. Деталі замовлення ви завжди можете переглянути в розділі «Мої
			замовлення»
		</p>
		<div style="weight: 300px">
			<div style="margin-top: 20px;">
				<Button title="Перейти до моїх замовлень" stretch={true} onclick={() => goto('/orders')} />
			</div>
			<div style="margin-top: 20px;">
				<Button title="Перейти до продукції" stretch={true} onclick={() => goto('/categories')} />
			</div>
		</div>
	</div>
{:else if option === 'empty'}
	<div class="message-block">
		<h2>Ваш кошик порожній 😔</h2>
		<p class="empty-message">Додайте що-небудь смачне!</p>
		<div>
			<Button onclick={() => goto('/categories')} />
		</div>
	</div>
{/if}

<style>
	.message-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 50px 20px;
		background-color: var(--common-bg-light);
		border-radius: 12px;
		margin: 40px auto;
		max-width: 500px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	}
	.message-block h2 {
		color: var(--common-text-dark);
		font-size: 1.8rem;
		margin-bottom: 10px;
	}
	.message-block p {
		color: #777;
		margin-bottom: 30px;
		font-size: 1.1rem;
	}
</style>

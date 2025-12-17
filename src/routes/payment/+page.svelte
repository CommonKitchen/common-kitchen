<!-- src/routes/payment/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';

	type PageData = {
		paymentStatus: string;
	};
	type PaymentStatusKeys = 'success' | 'declined' | 'error' | 'initial';
	type Message = { title: string; text: string };

	let { data } = $props<{ data: PageData }>();

	const status: string = data.paymentStatus ?? 'initial';

	const messages: Record<PaymentStatusKeys, Message> = {
		success: {
			title: 'Оплата пройшла успішно!',
			text: 'Дякуємо за ваше замовлення.'
		},
		declined: {
			title: 'Оплату відхилено',
			text: 'На жаль, ваш банк або платіжна система відхилили операцію.'
		},
		error: {
			title: 'Виникла помилка',
			text: 'При обробці платежу виникла непередбачена помилка.'
		},
		initial: {
			title: 'Сторінка оплати',
			text: 'Тут відображається результат вашого останнього платежу.'
		}
	};

	const currentMessage: Message = messages[status as PaymentStatusKeys] || messages.error;
</script>

<div class="message-block">
	<h2>{currentMessage.title}</h2>
	<p class="message">
		{currentMessage.text}
	</p>
	<div style="margin-top: 20px;">
		<Button title="Перейти до продукції" onclick={() => goto('/categories')} />
	</div>
</div>

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
		margin-bottom: 10px;
	}
</style>

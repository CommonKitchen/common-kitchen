<!-- src/routes/payment/+page.svelte -->
<script>
	/**
	 * @typedef {object} PageData
	 * @property {string} paymentStatus
	 */

	/**
	 * @typedef {'success' | 'declined' | 'error' | 'initial'} PaymentStatusKeys
	 */

	/** @type {{ data: PageData }} */
	let { data } = $props();

	const status = data.paymentStatus ?? 'initial';

	const messages = {
		success: {
			title: 'Оплата пройшла успішно!',
			text: 'Дякуємо за ваше замовлення.',
			icon: '✅',
			color: {
				background: '#D1FAE5',
				border: '#10B981',
				text: '#065F46',
				button: '#4F46E5',
				buttonHover: '#4338CA'
			}
		},
		declined: {
			title: 'Оплату відхилено',
			text: 'На жаль, ваш банк або платіжна система відхилили операцію.',
			icon: '⛔',
			color: {
				background: '#FEE2E2',
				border: '#F87171',
				text: '#991B1B',
				button: '#DC2626',
				buttonHover: '#B91C1C'
			}
		},
		error: {
			title: 'Виникла помилка',
			text: 'При обробці платежу виникла непередбачена помилка.',
			icon: '❗',
			color: {
				background: '#FFFBEB',
				border: '#F59E0B',
				text: '#92400E',
				button: '#D97706',
				buttonHover: '#B45309'
			}
		},
		initial: {
			title: 'Сторінка оплати',
			text: 'Тут відображається результат вашого останнього платежу.',
			icon: '🔄',
			color: {
				background: '#DBEAFE',
				border: '#3B82F6',
				text: '#1E40AF',
				button: '#6366F1',
				buttonHover: '#4F46E5'
			}
		}
	};

	const currentMessage = messages[/** @type {PaymentStatusKeys} */ (status)] || messages.error;
</script>

<div
	class="page-container"
	style="--message-bg-color: {currentMessage.color
		.background}; --message-border-color: {currentMessage.color
		.border}; --message-text-color: {currentMessage.color.text};"
>
	<div class="card">
		<h1>Результат оплаты</h1>

		<div class="status-message">
			<div class="message-content">
				<div class="message-icon">
					{currentMessage.icon}
				</div>
				<div>
					<h2 class="message-title">
						{currentMessage.title}
					</h2>
					<p class="message-text">
						{currentMessage.text}
					</p>
				</div>
			</div>
		</div>

		{#if status === 'declined' || status === 'error'}
			<div class="action-section">
				<button
					class="btn"
					onclick={() =>
						alert(
							'Начать процесс оплаты заново... (В реальном приложении здесь будет логика повторной оплаты)'
						)}
					style="--btn-bg-color: {currentMessage.color.button}; --btn-hover-color: {currentMessage
						.color.buttonHover};"
				>
					Повторить попытку оплаты
				</button>
				<p class="link-text">
					Или <a href="/">вернуться на главную</a>
				</p>
			</div>
		{:else if status === 'success'}
			<div class="action-section">
				<a
					href="/orders"
					class="btn"
					style="--btn-bg-color: {currentMessage.color.button}; --btn-hover-color: {currentMessage
						.color.buttonHover};"
				>
					Перейти к моим заказам
				</a>
			</div>
		{/if}

		<!-- Техническая информация для отладки, может быть удалена в продакшене -->
		<div class="debug-info">
			<p>
				Текущий статус: <span>{status}</span>
			</p>
		</div>
	</div>
</div>

<style>
	/* Базовые переменные для цветов */
	:root {
		--bg-color: #f9fafb; /* аналог bg-gray-50 */
		--card-bg: #ffffff;
		--shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* аналог shadow-2xl */
		--indigo-primary: #4f46e5; /* аналог indigo-600 */
		--indigo-hover: #4338ca; /* аналог indigo-700 */
		--gray-text: #1f2937; /* аналог text-gray-900 */
		--light-gray-text: #6b7280; /* аналог text-gray-500 */
		--border-color: #e5e7eb; /* аналог border-gray-200 */
	}

	.page-container {
		min-height: 100vh;
		background-color: var(--bg-color);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 1rem; /* p-4 */
	}
	@media (min-width: 640px) {
		.page-container {
			padding: 2rem; /* sm:p-8 */
		}
	}

	.card {
		width: 100%;
		max-width: 32rem; /* max-w-lg - 512px */
		margin-top: 2.5rem; /* mt-10 */
		padding: 1.5rem; /* p-6 */
		background-color: var(--card-bg);
		border-radius: 0.75rem; /* rounded-xl */
		box-shadow: var(--shadow);
		border-top: 8px solid var(--indigo-primary);
	}
	@media (min-width: 640px) {
		.card {
			padding: 2rem; /* sm:p-8 */
		}
	}

	.card h1 {
		font-size: 1.875rem; /* text-3xl */
		font-weight: 700; /* font-bold */
		color: var(--gray-text);
		margin-bottom: 1.5rem; /* mb-6 */
		text-align: center;
	}

	.status-message {
		padding: 1.5rem; /* p-6 */
		border-left: 4px solid var(--message-border-color);
		border-radius: 0.5rem; /* rounded-lg */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1); /* shadow-md */
		transition: all 300ms ease-in-out;
		background-color: var(--message-bg-color);
		color: var(--message-text-color);
	}

	.message-content {
		display: flex;
		align-items: center;
		gap: 1rem; /* space-x-4 */
	}

	.message-icon {
		font-size: 2.25rem; /* text-4xl */
	}

	.message-title {
		font-size: 1.25rem; /* text-xl */
		font-weight: 600; /* font-semibold */
		margin-bottom: 0.25rem; /* mb-1 */
	}

	.message-text {
		font-size: 0.875rem; /* text-sm */
		font-weight: 500; /* font-medium */
	}

	.action-section {
		margin-top: 1.5rem; /* mt-6 */
		text-align: center;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%; /* w-full */
		padding: 0.75rem 1.5rem; /* px-6 py-3 */
		border: 1px solid transparent;
		font-size: 1rem; /* text-base */
		font-weight: 500; /* font-medium */
		border-radius: 0.375rem; /* rounded-md */
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
		color: white;
		background-color: var(--btn-bg-color);
		transition: background-color 150ms ease-in-out;
		cursor: pointer;
		text-decoration: none; /* Для <a> элемента */
	}
	.btn:hover {
		background-color: var(--btn-hover-color);
	}
	.btn:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
		box-shadow:
			0 0 0 2px var(--card-bg),
			0 0 0 4px var(--indigo-primary);
	}
	@media (min-width: 640px) {
		.btn {
			width: auto; /* sm:w-auto */
		}
	}

	.link-text {
		margin-top: 1rem; /* mt-4 */
		font-size: 0.875rem; /* text-sm */
		color: var(--light-gray-text);
	}

	.link-text a {
		color: var(--indigo-primary);
		font-weight: 500; /* font-medium */
		text-decoration: none;
	}
	.link-text a:hover {
		color: var(--indigo-hover);
		text-decoration: underline;
	}

	.debug-info {
		margin-top: 2rem; /* mt-8 */
		padding-top: 1rem; /* pt-4 */
		border-top: 1px solid var(--border-color);
		font-size: 0.875rem; /* text-sm */
		color: var(--light-gray-text);
	}

	.debug-info span {
		font-family: monospace;
		font-weight: 700;
		color: var(--gray-text);
	}
</style>

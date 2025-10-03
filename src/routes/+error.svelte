<script>
	import { goto } from '$app/navigation';

	import { page } from '$app/state';

	const goHome = () => {
		goto('/');
	};
</script>

<div class="error-page">
	<div class="error-content">
		<h1 class="status-code">{page.status}</h1>
		<h2 class="error-message">{page.error?.message || 'Помилка'}</h2>

		{#if page.status === 404}
			<p>
				На жаль, за адресою
				<span class="error-path">{page.url}</span>
				нічого не знайдено.
			</p>
		{:else}
			<p>Сталася непередбачена помилка.</p>
		{/if}

		<button class="home-button" onclick={goHome}> Повернутися на головну </button>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh; /* Занимает почти весь экран */
		background-color: #f8f8f8;
		text-align: center;
		padding: 20px;
	}

	.error-content {
		background: white;
		padding: 40px;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		width: 100%;
	}

	.status-code {
		font-size: 6rem;
		color: #dc3545; /* Красный акцент */
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	.error-message {
		font-size: 1.8rem;
		color: #333;
		margin-bottom: 1.5rem;
	}

	.error-path {
		font-weight: bold;
		color: #dc3545;
		word-break: break-all;
	}

	.home-button {
		padding: 12px 25px;
		background-color: var(--main-color, #dc3545);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
		margin-top: 20px;
	}

	.home-button:hover {
		background-color: var(--main-active-color, #a8330c);
	}
</style>

<script>
	const {
		class: className = 'default',
		title = 'Перейти до продукції',
		stretch = false,
		onclick,
		...restProps
	} = $props();
</script>

<button class={`${className} ${stretch ? 'stretch' : ''}`} {onclick} {...restProps}>{title}</button>

<style>
	.default {
		font-size: 1.2rem;
		display: inline-flex;
		align-self: flex-start;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10px 24px 12px 24px;
		background-color: var(--main-color, #e24511);
		color: white;
		border-radius: 10px;
		border: none;
		cursor: pointer;
		text-decoration: none;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.default:hover {
		background-color: #c43c0f;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.default:active {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		background-color: var(--main-active-color, #a8330c);
	}

	.default:disabled {
		background: #b6b6b6;
		color: #e0e0e0;
		cursor: not-allowed;
		box-shadow: none;
		opacity: 0.6;
	}

	.stretch {
		width: 100%;
	}
</style>

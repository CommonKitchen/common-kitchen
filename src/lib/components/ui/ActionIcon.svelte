<script lang="ts">
	let {
		icon: Icon = null,
		onclick = null,
		tooltip = '',
		color = 'var(--icons-color)',
		width = '32',
		height = '32',
		disabled = false,
		stretch = false,
		count = 0,
		href = ''
	} = $props();

	const commonClasses = `icon-btn ${stretch ? 'stretch' : 'fixed'}`;
</script>

{#if href}
	<a
		class={commonClasses}
		{href}
		title={tooltip}
		style:color
		class:disabled
		style:--btn-width={`${width}px`}
		style:--btn-height={`${height}px`}
	>
		<Icon class="icon-svg" />
		{#if count > 0}
			<span class="icon-count">{count}</span>
		{/if}
	</a>
{:else}
	<button
		class={commonClasses}
		{onclick}
		title={tooltip}
		style:color
		class:disabled
		style:--btn-width={`${width}px`}
		style:--btn-height={`${height}px`}
	>
		<Icon class="icon-svg" />
	</button>
{/if}

<style>
	.icon-btn {
		padding: 0px;
		position: relative;
		display: flex;
		align-items: center;
		border: none;
		background: initial;
		cursor: pointer;
		transition: transform 0.1s;
		transition: color 0.2s ease;
	}

	.stretch {
		width: 100%;
		height: 100%;
	}

	.fixed {
		width: var(--btn-width);
		height: var(--btn-height);
	}

	.icon-btn.disabled {
		cursor: not-allowed;
		opacity: 0.5;
		pointer-events: none;
	}
	.icon-btn.disabled:hover {
		transform: none;
	}

	.icon-btn:hover:not(.disabled) {
		transform: scale(1.05);
		filter: brightness(90%);
	}

	.icon-count {
		position: absolute;
		top: -5px;
		right: -8px;
		min-width: 16px;
		height: 16px;
		line-height: 16px;
		background-color: var(--main-color, #e24511);
		color: white;
		border-radius: 50%;
		font-size: 10px;
		padding: 1px 1px;
		font-weight: bold;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

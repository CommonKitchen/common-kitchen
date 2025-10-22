<script>
	let { href = '', iconSrc, count = 0, onclick = null } = $props();
</script>

{#if href}
	<a {href} class="icon-link">
		<img class="icon-image" src={iconSrc} alt={href} />

		{#if count > 0}
			<span class="icon-count">{count}</span>
		{/if}
	</a>
{:else}
	<button class="icon-btn" {onclick}>
		<img class="icon-image" src={iconSrc} alt="" />
	</button>
{/if}

<style>
	.icon-link,
	.icon-btn {
		position: relative;
		display: flex;
		align-items: center;
		transition: color 0.2s;
	}

	.icon-link {
		color: var(--icons-color, #7d7d7d);
		text-decoration: none;
	}

	.icon-btn {
		border: none;
		background: initial;
		cursor: pointer;
	}

	.icon-image {
		width: 32px;
		height: 32px;
		filter: grayscale(100%) brightness(0.7) opacity(0.85);
		transition: filter 0.2s;
	}

	.icon-image:hover {
		color: var(--main-color, #e24511);
		filter: invert(33%) sepia(85%) saturate(7390%) hue-rotate(352deg) brightness(85%) contrast(98%);
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

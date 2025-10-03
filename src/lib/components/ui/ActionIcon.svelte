<script>
	let { href, iconSrc, count = 0 } = $props();
</script>

<a {href} class="icon-link">
	<img src={iconSrc} alt={href} />

	{#if count > 0}
		<span class="icon-count">{count}</span>
	{/if}
</a>

<style>
	.icon-link {
		position: relative; /* Обязательно для позиционирования счетчика */
		text-decoration: none;
		display: flex;
		align-items: center;
		color: var(--icons-color, #7d7d7d);
		transition: color 0.2s;
	}

	.icon-link img {
		width: 24px;
		height: 24px;
		filter: grayscale(100%) brightness(0.7) opacity(0.85);
		transition: filter 0.2s;
	}

	.icon-link:hover {
		color: var(--main-color, #e24511);
	}
	.icon-link:hover img {
		filter: invert(33%) sepia(85%) saturate(7390%) hue-rotate(352deg) brightness(85%) contrast(98%);
	}

	.icon-count {
		position: absolute;
		top: -5px;
		right: -8px;
		min-width: 16px;
		height: 16px;
		line-height: 16px;
		text-align: center;
		background-color: var(--main-color, #e24511);
		color: white;
		border-radius: 50%;
		font-size: 10px;
		padding: 1px 1px;
		font-weight: bold;
		z-index: 10;
	}
</style>

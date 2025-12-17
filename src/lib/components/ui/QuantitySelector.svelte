<script lang="ts">
	const { quantity, minOrder, changeQuantity, block = false } = $props();

	function handleClick(event: MouseEvent, change: number) {
		event.stopPropagation();
		event.preventDefault();
		changeQuantity(change);
	}
</script>

<div class="quantity-selector">
	<button
		onclick={(e) => handleClick(e, -1)}
		class="quantity-btn"
		disabled={block ? quantity === minOrder : false}
	>
		<!-- SVG Иконка "Минус" -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon-minus"
		>
			<path d="M5 12h14" />
		</svg>
	</button>
	<span class="quantity-display">{quantity}</span>
	<button onclick={(e) => handleClick(e, 1)} class="quantity-btn">
		<!-- SVG Иконка "Плюс" -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon-plus"
		>
			<path d="M12 5v14M5 12h14" />
		</svg>
	</button>
</div>

<style>
	.quantity-selector {
		display: flex;
		flex-shrink: 0;
		border: 1px solid #ccc;
		border-radius: 8px;
		overflow: hidden;
		width: 100%;
	}

	.quantity-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		background-color: transparent;
		border: none;
		min-width: 40px;
		color: #333;
		line-height: 1;
		font-size: 0;
		padding: 10px 14px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.quantity-btn svg {
		color: currentColor;
		transition: color 0.2s ease;
	}

	.quantity-btn:hover {
		background-color: #e0e0e0;
	}

	.quantity-btn:active {
		background-color: #ff6347;
		color: white;
	}

	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: transparent;
		color: #333;
	}

	.quantity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.quantity-display {
		border-left: 1px solid #e0e0e0;
		border-right: 1px solid #e0e0e0;
		padding: 10px 5px;
		color: #333;
		font-size: 1.2rem;
		min-width: 25px;
		text-align: center;
		border-left: 1px solid #ccc;
		border-right: 1px solid #ccc;
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 40px;
		background-color: var(--common-bg-light);
	}
</style>

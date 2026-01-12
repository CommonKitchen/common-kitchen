<script lang="ts">
	const { title, value, isBold = true, symbol = false } = $props();
</script>

<div class="info-group">
	<span class="label">{title}</span>
	<span class="value" class:is-bold={isBold}
		>{value || 'не вказано'}
		{#if symbol}
			<span class="grn">₴</span>
		{/if}
	</span>
</div>

<style>
	.info-group {
		display: flex;
		flex-direction: column;
		padding-bottom: 4px;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--common-text-light, #888);
		text-transform: uppercase;
	}

	.value {
		font-size: 1rem;
		color: var(--common-text-dark, #333);
		font-weight: normal;
	}

	.value.is-bold {
		font-weight: bold;
	}

	.grn {
		font-size: 0.9rem;
	}
</style>

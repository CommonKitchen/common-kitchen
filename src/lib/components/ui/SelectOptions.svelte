<script lang="ts">
	import ActionIcon from './ActionIcon.svelte';

	let { title, value = $bindable(), items, controls = [] } = $props();

	const selectId = `select-control-${Math.random().toString(36).substring(2, 9)}`;
</script>

<div class="select-block">
	<div class="select-header">
		<label for={selectId}>{title}</label>
		{#if controls}
			<div class="controls">
				{#each controls as control (control.key)}
					<ActionIcon
						icon={control.icon}
						onclick={control.action}
						tooltip={control.tooltip}
						color={control.color}
						width="24"
						height="24"
						disabled={control.disabled()}
					/>
				{/each}
			</div>
		{/if}
	</div>
	<select id={selectId} bind:value class="select-control">
		{#each items || [] as item (item.id)}
			<option value={item.id}
				>{item.title}{#if item.address}, {item.address}{/if}</option
			>
		{/each}
	</select>
</div>

<style>
	.select-block {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		margin-top: 20px;
	}

	.select-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.select-header label {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.select-control {
		font-family: 'Roboto', sans-serif;
		border: 1px solid var(--common-border-dark);
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		width: 100%;
		background-color: var(--common-bg-light);
		padding: 12px;
		font-size: 1rem;
		min-width: 180px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
		background-size: 14px;
		padding-right: 30px;
	}

	.select-control:hover {
		border-color: var(--main-color, #e24511);
		box-shadow: 0 0 0 2px rgba(226, 69, 17, 0.1);
	}
</style>

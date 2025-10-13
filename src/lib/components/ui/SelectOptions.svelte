<script>
	let { title, value = $bindable(), items } = $props();

	const selectId = `select-control-${Math.random().toString(36).substring(2, 9)}`;
</script>

<div class="select-block">
	<label for={selectId}>{title}</label>
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
	.select-block label {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.select-control {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		width: 100%;
		background-color: var(--common-bg-light);
		padding: 8px;
		font-size: 1rem;
		min-width: 180px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.select-control:hover {
		border-color: var(--main-color, #e24511);
		box-shadow: 0 0 0 2px rgba(226, 69, 17, 0.1);
	}
</style>

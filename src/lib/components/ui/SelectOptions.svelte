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
		display: grid;
		grid-template-columns: 112px 1fr;
		gap: 8px;
		align-items: center;
		padding: 0px 15px 15px 0px;
	}

	.select-block label {
		grid-column: 1 / 2;
		margin-bottom: 0; /* Убираем margin-bottom, так как Grid управляет spacing */
	}

	.select-control {
		grid-column: 2 / 2;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		width: 100%;
		background-color: var(--common-bg-light);
		padding: 8px;
		font-size: 1rem;
		margin: 0px 12px;
		min-width: 180px;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.select-control:hover {
		border: 1px solid #7d7d7d;
	}
</style>

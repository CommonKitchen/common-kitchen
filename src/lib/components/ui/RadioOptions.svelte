<script lang="ts">
	let { title, options, selectedOption = $bindable(), groupName, info = '' } = $props();
</script>

<div class="radio-options">
	<h3>{title}</h3>

	<div class="radio-group">
		{#each options as option (option.id)}
			<label class="radio-label" for={option.id}>
				<input
					type="radio"
					id={option.id}
					name={groupName}
					value={option.id}
					bind:group={selectedOption}
				/>
				{option.title}
			</label>
		{/each}
	</div>
	<div class="option-info" class:empty={!info}>
		{#if info}
			⚠️ {info}
		{/if}
	</div>
</div>

<style>
	.radio-options {
		margin-top: 20px;
		padding: 0px;
	}

	.radio-options h3 {
		margin: 0px 0px 10px 0px;
		font-size: 1.2rem;
	}

	.option-info {
		padding: 10px;
		font-style: italic;
		color: #555;
		font-size: 1rem;
		background-color: #fff3cd;
		margin: 10px 0px;
	}

	.option-info.empty {
		padding: 20px 0px 21px 0px;
		font-size: 1.1rem;
		background-color: initial;
	}

	.radio-group {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		margin-bottom: 8px;
	}

	.radio-label {
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
		padding: 4px 15px;
		/* border: 1px solid var(--common-border, #ddd); */
		border-radius: 8px;
		background-color: white;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.radio-label input {
		accent-color: var(--main-color);
		width: 1.5rem;
		height: 1.5rem;
	}

	.radio-label:hover {
		background-color: var(--common-bg-light);
		border-color: var(--main-color, #e24511);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}
</style>

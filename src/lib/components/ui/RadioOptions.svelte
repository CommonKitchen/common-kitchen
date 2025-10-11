<script>
	let { title, options, selectedOption = $bindable(), groupName } = $props();
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
				{option.label}
			</label>
		{/each}
	</div>
</div>

<style>
	.radio-options {
		border: 1px solid #ddd;
		padding: 15px;
		border-radius: 8px;
		background-color: #fafafa;
	}

	.radio-options h3 {
		margin-top: 0;
		font-size: 1.2rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 10px;
		margin-bottom: 15px;
	}

	.radio-group {
		display: flex;
		gap: 30px;
		margin-bottom: 15px;
	}

	.radio-label {
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 5px;
		position: relative;
	}

	.radio-label input {
		accent-color: var(--main-color);
		width: 1.5rem;
		height: 1.5rem;
	}
</style>

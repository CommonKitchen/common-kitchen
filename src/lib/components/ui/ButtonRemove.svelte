<script>
	const { onclick } = $props();
</script>

<button {onclick} class="remove-btn" title="Видалити товар"> &times; </button>

<style>
	.remove-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
		line-height: 1;
		padding: 0 5px;
		color: #ff4444;
		transition: opacity 0.2s;
	}

	.remove-btn:hover {
		opacity: 0.7;
	}
</style>

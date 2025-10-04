<script>
	const { title, slug, isActive } = $props();
	const categoryUrl = `/categories/${slug}`;
</script>

<a href={categoryUrl} class="category-link" class:active={isActive}>
	{title}
</a>

<style>
	.category-link {
		display: block;
		padding: 10px 15px;
		margin-bottom: 5px;
		text-decoration: none;
		color: #495057;
		font-size: 1rem;
		border-radius: 4px;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.category-link:hover {
		background-color: #e9ecef;
		color: #000;
	}

	.category-link.active {
		background-color: var(--main-color, #e24511);
		color: white;
		font-weight: bold;
	}

	.category-link.active:hover {
		background-color: var(--main-active-color, #a8330c);
		color: white;
	}
</style>

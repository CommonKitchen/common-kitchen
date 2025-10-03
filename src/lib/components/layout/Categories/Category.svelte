<script>
	const { title, slug, imageUrl } = $props();
</script>

<a href={`/categories/${slug}`} class="category-tile">
	<img src={imageUrl || '/placeholder.png'} alt={title} class="category-image" />
	<h2 class="category-title">{title}</h2>
</a>

<style>
	.category-tile {
		display: block;
		text-decoration: none;
		color: #333;
		background-color: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.2s;
		text-align: center;
		border: 2px solid transparent;
		transition: border-color 0.3s ease;
		padding: 8px;
	}
	/* .product-tile {
        border: 2px solid transparent;
        transition: border-color 0.3s ease;
    } */

	.category-tile:hover {
		/* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); */
		border-color: #ff6347;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}

	/* .product-tile:hover {
		border-color: #ff6347;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	} */

	.category-image {
		width: 100%;
		/* height: 200px; */
		height: 168px;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	/* .category-image:hover {
		transform: scale(1.05);
	} */
	.category-title {
		font-size: 1.4rem;
		padding: 8px 4px;
		margin: 0;
		color: var(--main-color, #e24511);
	}
</style>

<script>
	const { className, alt, src, ...restProps } = $props();
	let isLoading = $state(true);

	function handleImageLoad() {
		isLoading = false;
	}
</script>

<div class={className} class:loaded={!isLoading}>
	<div class="skeleton"></div>
	<img {...restProps} {src} {alt} onload={handleImageLoad} class="image" />
</div>

<style>
	.image-container {
		width: 100%;
		height: 168px;
		overflow: hidden;
	}

	.product-main-image {
		width: 100%;
		max-width: 500px;
		height: auto;
		object-fit: contain;
		border-radius: 8px;
		margin-bottom: 40px;
	}

	.skeleton {
		border-radius: 8px;
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #e0e0e0;
		overflow: hidden;
		background-size: 200% 100%;
		background-position: 100% 0%;

		/* градиент: прозрачный -> белый/светлый -> прозрачный */
		background-image: linear-gradient(
			to right,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.4) 50%,
			rgba(255, 255, 255, 0) 100%
		);

		animation: skeleton-gradient-animation 1s linear infinite;
		z-index: 1;
	}

	.image-container.loaded .skeleton {
		display: none;
	}

	.image {
		border-radius: 8px;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
		z-index: 0;
	}

	.image-container .image:hover {
		transform: scale(1.05);
	}

	@keyframes skeleton-gradient-animation {
		from {
			background-position: 200% 0%;
		}
		to {
			background-position: -200% 0%;
		}
	}
</style>

<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="hero">
	<h1>Готуємо з любов’ю<br />для кожного закладу</h1>
	<h3>Замовляй, куштуй<br />та залишайся з нами</h3>
	<Button onclick={() => goto('/categories')} />
</div>

<style>
	.hero {
		width: 100%;
		height: 100%;
		max-width: 1368px;
		min-height: 480px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		gap: 28px;
		padding-left: 20px;
		overflow: hidden;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: top;
		background-image:
			linear-gradient(180deg, #faeee2 0%, rgba(250, 238, 226, 0) 80%), url($lib/assets/main.webp);
	}

	h1 {
		margin: 80px 0px 0px 0px;
		text-shadow:
			1px 1px 0px var(--background-color),
			-1px -1px 0px var(--background-color),
			1px -1px 0px var(--background-color),
			-1px 1px 0px var(--background-color);
	}

	h3 {
		margin: 0px;
		text-shadow:
			1px 1px 0px var(--background-color),
			-1px -1px 0px var(--background-color),
			1px -1px 0px var(--background-color),
			-1px 1px 0px var(--background-color);
	}

	@media (min-width: 480px) {
		.hero {
			justify-content: center;
			gap: 36px;
			background-image:
				linear-gradient(90deg, #faeee2 0%, rgba(250, 238, 226, 0) 45%), url($lib/assets/main.png);
		}

		h1 {
			margin: 0px;
		}
	}

	@media (min-width: 768px) {
		.hero {
			min-height: 640px;
			padding-left: 58px;
		}
	}

	@media (min-width: 960px) {
		.hero {
			min-height: 769px;
			padding-left: 116px;
		}
	}
</style>

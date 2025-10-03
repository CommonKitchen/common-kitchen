<script>
	import Button from '$lib/components/ui/Button.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="hero">
	<h1>Готуємо з любов’ю<br />для кожного закладу</h1>
	<h3>Замовляй, куштуй<br />та залишайся з нами</h3>
	<Button title="Перейти до продукції" onclick={() => goto('/categories')} />
</div>

<style>
	.hero {
		width: 100%;
		height: 100%;
		max-width: 1368px;
		min-height: 769px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 36px;
		padding-left: 116px;
		overflow: hidden;
		background-image:
			linear-gradient(90deg, #faeee2 0%, rgba(250, 238, 226, 0) 45%), url($lib/assets/main.png);
		background-repeat: no-repeat;
		background-size: cover;
	}

	h1,
	h3 {
		margin: 0px;
	}
</style>

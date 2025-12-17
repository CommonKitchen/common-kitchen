<script lang="ts">
	const { isOpen, toggle } = $props();
</script>

<!-- Кнопка бургер-меню -->
<button
	class="burger-button"
	class:is-open={isOpen}
	aria-expanded={isOpen}
	aria-controls="main-category-menu"
	onclick={toggle}
>
	<!-- text -->
	<div class="burger-line line-top"></div>
	<div class="burger-line line-middle"></div>
	<div class="burger-line line-bottom"></div>
</button>

<style>
	/* Стили для кнопки-контейнера */
	.burger-button {
		width: 40px;
		height: 40px;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		position: relative;
		display: flex; /* Делаем видимым по умолчанию */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2; /* Убедимся, что она выше других элементов */
		transition: transform 0.3s;
		flex-shrink: 0; /* Не давать кнопке сжиматься */
	}

	.burger-button:hover {
		opacity: 0.8;
	}

	/* Стили для полосок */
	.burger-line {
		display: block;
		width: 28px;
		height: 3px;
		background-color: var(--common-text-dark, #333);
		border-radius: 2px;
		margin: 3px 0;
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}

	/* Состояние "Открыто" (анимация крестика) */
	.burger-button.is-open .line-top {
		transform: translateY(9px) rotate(45deg);
	}

	.burger-button.is-open .line-middle {
		opacity: 0;
	}

	.burger-button.is-open .line-bottom {
		transform: translateY(-9px) rotate(-45deg);
	}
</style>

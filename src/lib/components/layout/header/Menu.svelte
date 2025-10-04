<script>
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { getCategoryContext } from '$lib/context/categoryContext.js';

	const { isOpen, close } = $props();

	// Получаем категории из контекста.
	// $derived используется, чтобы гарантировать, что компонент обновится,
	// если категории из контекста каким-то образом изменятся.
	/** @typedef {import('$lib/types.js').Category} Category */
	/** @type {Category[]} */
	const categories = $derived(getCategoryContext() ?? []);

	// Дополнительный эффект для закрытия меню по нажатию клавиши ESC
	$effect(() => {
		if (!isOpen) return;

		/** @param {KeyboardEvent} event */
		function handleKeydown(event) {
			if (event.key === 'Escape') {
				close();
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isOpen}
	<aside class="menu-panel" transition:slide={{ duration: 300, easing: cubicOut }}>
		<div class="menu-content">
			<h4 class="title">Продукція</h4>
			<nav class="nav-list">
				{#each categories as category (category.slug)}
					<!-- При клике на ссылку закрываем меню -->
					<a href="/categories/{category.slug}" class="nav-link" onclick={close}>
						{category.title}
					</a>
				{/each}

				<!-- <a href="/products" class="nav-link" onclick={close}>Товари (Всі)</a>
				<a href="/contacts" class="nav-link" onclick={close}>Контакти</a> -->
			</nav>
		</div>
	</aside>
{/if}

<style>
	.menu-panel {
		position: absolute;
		/* top: 100% размещает меню прямо под кнопкой/хедером */
		top: 100%;
		/* Привязываем к левому краю контейнера. (Предполагается, что родительский элемент имеет position: relative) */
		left: 0px; /* Здесь должен быть left: 0 или right: 0 в зависимости от Header.svelte */

		/* Задаем фиксированную ширину для десктопного меню */
		width: 320px;

		height: auto;
		/* Ограничиваем высоту, чтобы оно не занимало весь экран */
		max-height: calc(100vh - 66px);

		background-color: var(--common-bg-light);
		/* Тень снизу */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		/* Устанавливаем z-index выше основного контента, но ниже модальных окон */
		z-index: 50;
		overflow-y: auto;
		padding: 12px 20px 20px 20px;
		/* Скругление углов только снизу */
		border-radius: 0 0 8px 8px;
	}

	.title {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--main-color);
		margin: 10px 0px;
		border-bottom: 2px solid var(--common-border);
		padding-bottom: 10px;
	}

	.nav-list {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.nav-link {
		display: block; /* Ссылка занимает всю ширину для удобства клика */
		padding: 10px 15px;
		text-decoration: none;
		color: var(--common-text-dark, #495057);
		font-size: 1rem;
		border-radius: 4px; /* Закругленные углы */
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.nav-link:hover {
		background-color: var(--common-bg-hover, #e9ecef);
		color: #000;
	}
</style>

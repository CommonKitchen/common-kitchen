<script>
	import { goto } from '$app/navigation';
	import ico from '$lib/assets/icon-search-24x24.svg';
	import { getProductContext } from '$lib/context/productContext.js';

	/** @typedef {import('$lib/types.js').Product} Product */
	/** @type {Product[]} */
	const products = $derived(getProductContext() ?? []);

	let searchString = $state('');
	let activeIndex = $state(-1);

	/** @type {HTMLInputElement} */
	let searchInput;

	const minimalCharacters = 4;
	const queryLength = $derived(searchString.trim().length);

	const searchResults = $derived(() => {
		const query = searchString.trim().toLowerCase();

		if (query === '' || query.length < minimalCharacters) {
			return [];
		}

		return products.filter((product) => product.title.toLowerCase().includes(query)).slice(0, 5);
	});

	$effect(() => {
		activeIndex = -1;
	});

	/**
	 * Обработчик нажатия клавиш для навигации по результатам.
	 * @param {KeyboardEvent} event
	 */
	function handleKeyDown(event) {
		const resultsCount = searchResults().length;
		if (resultsCount === 0) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault(); // Предотвращаем скролл страницы
				activeIndex = (activeIndex + 1) % resultsCount;
				break;
			case 'ArrowUp':
				event.preventDefault(); // Предотвращаем скролл страницы
				// Обеспечиваем, чтобы индекс не стал отрицательным
				activeIndex = (activeIndex - 1 + resultsCount) % resultsCount;
				break;
			case 'Enter':
				if (activeIndex >= 0) {
					event.preventDefault(); // Предотвращаем отправку формы по умолчанию
					// Имитируем клик по выбранному элементу
					const product = searchResults()[activeIndex];
					// Используем goto для навигации
					goto(`/products/${product.id}`);
					handleResultClick(); // Скрываем список после навигации
				} else {
					// Если Enter нажат, но активен -1, запускаем общий поиск
					handleFormSubmit(event);
				}
				break;
			case 'Escape':
				searchString = '';
				event.preventDefault();
				break;
		}
	}

	/**
	 * @param {Event} event
	 */
	function handleFormSubmit(event) {
		event.preventDefault();
		if (searchString.trim() !== '') {
		}
	}

	function handleResultClick() {
		searchString = '';
		setTimeout(() => searchInput.focus(), 0);
	}
</script>

<form class="search" onsubmit={handleFormSubmit}>
	<input
		type="text"
		placeholder="Пошук продукції"
		aria-label="Пошук продукції"
		bind:value={searchString}
		bind:this={searchInput}
		onkeydown={handleKeyDown}
	/>
	<img src={ico} alt="search" />
</form>

{#if queryLength >= minimalCharacters && searchResults().length > 0}
	<div class="search-results">
		<!-- Отображаем до 5 первых результатов -->
		{#each searchResults().slice(0, 5) as product, index (product.id)}
			<a
				href="/products/{product.id}"
				class="result-item"
				class:active={index === activeIndex}
				onclick={handleResultClick}
				onmouseenter={() => (activeIndex = index)}
				onmouseleave={() => (activeIndex = -1)}
			>
				<img src={product.imageUrl} alt={product.title} class="result-image" />
				<div class="result-text">
					<div class="result-title">{product.title}</div>
					<div class="result-price">{product.price}₴</div>
				</div>
			</a>
		{/each}
		{#if searchResults().length > 5}
			<span class="result-hint"
				>Показано 5 з {searchResults().length}. Натисніть Enter для всіх результатів.</span
			>
		{/if}
	</div>
{:else if queryLength > minimalCharacters}
	<div class="search-results no-results">
		Не знайдено продукції по запиту "{searchString}"
	</div>
{/if}

<style>
	.search {
		display: flex;
		align-items: center;
		background-color: #fff8ec;
		border-radius: 10px;
		padding: 5px 15px;
		border: 1px solid #e0d0c0;
		position: relative; /* Для правильного позиционирования выпадающего списка */
		z-index: 20;
	}

	.search img {
		width: 24px;
		height: 24px;
		margin-left: 10px;
		cursor: pointer;
	}

	.search input {
		width: 140px;
		max-width: 300px;
		border: none;
		background-color: transparent;
		padding: 0;
		outline: none;
		color: #373737;
	}

	.search input::placeholder {
		color: #b4a89c;
	}

	.search:hover {
		border-color: #a5a5a5;
	}

	.search-results {
		position: absolute;
		top: 100%; /* Размещаем сразу под полем ввода */
		left: 0;
		/* Ширина результатов должна соответствовать ширине поля поиска, если нужно */
		width: 100%;
		max-width: 330px; /* Соответствует ширине input + padding */
		background-color: #ffffff;
		border: 1px solid #e0d0c0;
		border-top: none;
		border-radius: 0 0 10px 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		padding: 10px 0;
		z-index: 10;
	}

	.result-item {
		display: flex;
		align-items: center;
		padding: 8px 15px;
		text-decoration: none;
		color: #373737;
		font-size: 0.9rem;
		transition: background-color 0.2s;
	}

	.result-image {
		width: 40px;
		height: 40px;
		object-fit: cover;
		border-radius: 5px;
		margin-right: 10px;
		flex-shrink: 0;
	}

	.result-text {
		display: flex;
		flex-direction: row;
		align-items: center; /* Выравнивание по вертикали */
		flex-grow: 1;
		min-width: 0;
		gap: 10px;
	}

	.result-title {
		font-weight: 500;
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-price {
		color: #888;
		font-size: 0.8rem;
		flex-shrink: 0;
	}
	.result-item:hover,
	.result-item.active {
		background-color: #f0f0f0;
	}

	.result-hint,
	.no-results {
		display: block;
		padding: 8px 15px;
		color: #888;
		font-size: 0.8rem;
		border-top: 1px solid #eee;
		margin-top: 5px;
	}

	@media (min-width: 960px) {
		.search input {
			width: 300px;
		}
	}
</style>

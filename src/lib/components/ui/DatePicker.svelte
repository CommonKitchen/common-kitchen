<script>
	import { onMount } from 'svelte';

	const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
	const MONTH_NAMES = [
		'Січень',
		'Лютий',
		'Березень',
		'Квітень',
		'Травень',
		'Червень',
		'Липень',
		'Серпень',
		'Вересень',
		'Жовтень',
		'Листопад',
		'Грудень'
	];

	const inputId = `date-input-${Math.random().toString(36).substring(2, 9)}`;
	/** @type {HTMLDivElement | undefined} */
	let calendarBlockRef;

	let {
		title,
		selectedDate = $bindable(),
		availableDays = [1, 2, 3, 4, 5],
		blockedDays = [],
		cutOffHour = 10
	} = $props();

	console.log('availableDays', availableDays);

	const NOW = new Date();
	const today = startOfDay(NOW);
	let isCalendarOpen = $state(false);
	let availableDaysKey = $state(availableDays.join(','));

	/** @param {Date} date
	 * @returns {Date} */
	function startOfDay(date) {
		const newDate = new Date(date);
		newDate.setHours(0, 0, 0, 0);
		return newDate;
	}

	/**
	 * @param {Date} date
	 * @returns {string} */
	function toDateString(date) {
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
	}

	/**
	 * Проверяет, является ли день доступным с учетом availableDays и blockedDays.
	 * @param {Date} date
	 * @returns {boolean} */
	function isAvailableDate(date) {
		// 1. Проверка доступных дней недели (1=Пн, 7=Нд)
		const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
		if (!availableDays.includes(dayOfWeek)) {
			return false;
		}

		// 2. Проверка заблокированных дней (YYYY-MM-DD format)
		if (blockedDays.includes(toDateString(date))) {
			return false;
		}

		return true;
	}

	/**
	 * Находит минимальную дату, которая находится после отсечки времени
	 * И которая является доступной (isAvailableDate).
	 * @returns {Date}
	 */
	function findMinimalDate() {
		let date = startOfDay(NOW);
		let daysSearched = 0;
		const MAX_SEARCH_DAYS = 365; // Ограничиваем поиск одним годом

		// 1. Учет отсечки времени
		if (NOW.getHours() >= cutOffHour) {
			date.setDate(date.getDate() + 1);
		}

		// 2. Поиск первого доступного дня
		while (!isAvailableDate(date)) {
			date.setDate(date.getDate() + 1);
			daysSearched++;

			if (daysSearched > MAX_SEARCH_DAYS) {
				return startOfDay(date);
			}
		}

		return date;
	}

	const minimalDate = $derived(findMinimalDate());

	// При изменении minimalDate, обновляем selectedDate, если она раньше минимальной
	$effect(() => {
		if (selectedDate.getTime() < minimalDate.getTime()) {
			selectedDate = new Date(minimalDate);
		}
	});

	$effect(() => {
		const currentAvailableDaysKey = availableDays.join(',');

		if (currentAvailableDaysKey !== availableDaysKey) {
			availableDaysKey = currentAvailableDaysKey;
			selectedDate = new Date(minimalDate);
		}
	});

	let currentMonth = $state(new Date());

	$effect(() => {
		currentMonth = new Date(minimalDate.getFullYear(), minimalDate.getMonth(), 1);
	});

	const isPrevMonthDisabled = $derived(() => {
		return currentMonth.getTime() <= minimalDate.getTime();
	});

	const formattedDate = $derived(() => {
		const date = new Date(selectedDate);
		return date.toLocaleDateString('uk-UA', {
			day: 'numeric',
			month: 'long',
			weekday: 'short',
			year: 'numeric'
		});
	});

	function toggleCalendar() {
		isCalendarOpen = !isCalendarOpen;
		if (isCalendarOpen) {
			currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
			setTimeout(() => {
				document.getElementById('date-picker-popup')?.focus();
			}, 0);
		} else {
			document.getElementById(inputId)?.focus();
		}
	}

	const formattedMonthYear = $derived(
		() => `${MONTH_NAMES[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
	);

	function goToPrevMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function goToNextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	/**
	 * @param {Date} date
	 * @returns {boolean} */
	function isSelectable(date) {
		if (date.getTime() < minimalDate.getTime()) {
			return false;
		}

		return isAvailableDate(date);
	}

	const calendarDays = $derived(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();

		const days = [];

		const firstDayOfMonth = new Date(year, month, 1);
		const firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
		const daysToPrepend = firstDayOfWeek - 1;

		for (let i = daysToPrepend; i > 0; i--) {
			const date = new Date(year, month, 1 - i);
			days.push({
				date,
				isCurrentMonth: false,
				isSelectable: false,
				isToday: false
			});
		}

		const lastDay = new Date(year, month + 1, 0).getDate();
		for (let day = 1; day <= lastDay; day++) {
			const date = startOfDay(new Date(year, month, day));
			days.push({
				date,
				isCurrentMonth: true,
				isSelectable: isSelectable(date),
				isToday: startOfDay(date).getTime() === today.getTime()
			});
		}

		const totalDays = days.length;
		const daysToAppend = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

		for (let i = 1; i <= daysToAppend; i++) {
			const date = new Date(year, month + 1, i);
			days.push({
				date,
				isCurrentMonth: false,
				isSelectable: false,
				isToday: false
			});
		}

		return days;
	});

	/**
	 * @param {Date} date */
	function handleDayClick(date) {
		if (isSelectable(date)) {
			selectedDate = date;
			isCalendarOpen = false;
		}
	}

	/**
	 * @param {Date} date
	 * @returns {boolean} */
	function isSelected(date) {
		return selectedDate.getTime() === date.getTime();
	}

	/**
	 * Обработка нажатия клавиши Escape для закрытия календаря и возврата фокуса.
	 * @param {KeyboardEvent} e
	 */
	function handleEscape(e) {
		if (isCalendarOpen && e.key === 'Escape') {
			isCalendarOpen = false;
			e.stopPropagation();
			e.preventDefault();
			document.getElementById(inputId)?.focus();
		}
	}

	/**
	 * Обработка клика вне календаря для его закрытия.
	 * @param {MouseEvent} event
	 */
	function handleOutsideClick(event) {
		const targetNode = event.target;
		if (
			isCalendarOpen &&
			calendarBlockRef && // Використовуємо локальне посилання
			targetNode instanceof Node &&
			!calendarBlockRef.contains(targetNode) // Перевіряємо, чи клік був поза елементом
		) {
			isCalendarOpen = false;
			document.getElementById(inputId)?.focus();
		}
	}

	onMount(() => {
		// Устанавливаем глобальные слушатели для клика вне и нажатия Escape
		document.addEventListener('click', handleOutsideClick);
		document.addEventListener('keydown', handleEscape);

		return () => {
			// Очищаем слушатели при уничтожении компонента
			document.removeEventListener('click', handleOutsideClick);
			document.removeEventListener('keydown', handleEscape);
		};
	});
</script>

<div class="calendar-block" bind:this={calendarBlockRef}>
	<label for={inputId} class="description-date">{title}</label>

	<button
		type="button"
		id={inputId}
		class="custom-date-control"
		onclick={toggleCalendar}
		aria-expanded={isCalendarOpen}
		aria-controls="date-picker-popup"
	>
		<div class="date-text">{formattedDate()}</div>
		<div class="calendar-icon">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
				<line x1="16" y1="2" x2="16" y2="6" />
				<line x1="8" y1="2" x2="8" y2="6" />
				<line x1="3" y1="10" x2="21" y2="10" />
			</svg>
		</div>
	</button>

	{#if isCalendarOpen}
		<div
			id="date-picker-popup"
			class="calendar-popup"
			role="dialog"
			aria-modal="true"
			aria-labelledby="date-picker-title"
			tabindex="-1"
		>
			<div class="calendar-header">
				<button
					type="button"
					class="nav-button"
					aria-label="Попередній місяць"
					onclick={goToPrevMonth}
					disabled={isPrevMonthDisabled()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg
					>
				</button>
				<span class="month-year">{formattedMonthYear()}</span>
				<button
					type="button"
					class="nav-button"
					aria-label="Наступний місяць"
					onclick={goToNextMonth}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg
					>
				</button>
			</div>

			<div class="day-of-week-header">
				{#each DAYS_OF_WEEK as day}
					<span class="day-label">{day}</span>
				{/each}
			</div>

			<div class="calendar-grid">
				{#each calendarDays() as day (day.date.toISOString())}
					<button
						type="button"
						class:day-cell={true}
						class:current-month={day.isCurrentMonth}
						class:selectable={day.isSelectable}
						class:selected={isSelected(day.date)}
						class:today={day.isToday}
						disabled={!day.isSelectable}
						tabindex={day.isSelectable ? 0 : -1}
						onclick={() => handleDayClick(day.date)}
					>
						{day.date.getDate()}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.calendar-block {
		position: relative; /* Для позиционирования всплывающего календаря */
		margin-top: 20px;
	}

	.calendar-block label {
		font-weight: bold;
		font-size: 1.1rem;
		color: var(--text-color, #2c3e50);
	}

	.description-date {
		display: block;
		margin-bottom: 8px; /* Добавил отступ */
	}

	.custom-date-control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 250px; /* Ограничиваем ширину для лучшего вида */
		padding: 8px 12px; /* Увеличил padding */
		border-radius: 12px; /* Более округлые углы */
		border: 1px solid var(--common-border, #ccc);
		font-size: 1rem;
		background-color: var(--common-bg-light, #f9f9f9);
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.calendar-icon {
		color: var(--icons-color, #e24511); /* Добавил цвет */
	}

	.custom-date-control:hover {
		border-color: var(--main-color, #e24511);
		box-shadow: 0 0 0 2px rgba(226, 69, 17, 0.1);
	}

	.custom-date-control:focus {
		outline: none;
		border-color: var(--main-color, #e24511);
		box-shadow: 0 0 0 3px rgba(226, 69, 17, 0.2);
	}

	.date-text {
		flex-grow: 1;
		text-align: left;
		font-weight: 500;
		color: var(--text-color, #333); /* Добавил цвет */
	}

	.calendar-icon {
		font-size: 1.2rem;
	}

	.calendar-popup {
		position: absolute;
		top: 100%; /* Позиционируем под кнопкой */
		left: 0;
		z-index: 10;
		background: white;
		border: 1px solid #ddd; /* Более светлая граница */
		border-radius: 12px; /* Более округлые углы */
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); /* Более мягкая тень */
		padding: 15px; /* Увеличил padding */
		margin-top: 8px; /* Небольшой отступ */
		width: 300px; /* Фиксированная ширина для календаря */
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.month-year {
		font-weight: bold;
		font-size: 1.1rem;
		color: var(--main-color, #e24511);
	}

	.nav-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 5px;
		display: flex;
		align-items: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.nav-button:hover:not([disabled]) {
		background-color: #eee;
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.nav-button svg {
		stroke: var(--text-color-dark, #333);
	}

	.day-of-week-header {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		font-size: 0.8rem;
		font-weight: 600;
		color: #999;
		margin-bottom: 5px;
	}

	.day-label {
		padding: 5px 0;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.day-cell {
		/* Сброс стилей кнопки */
		all: unset;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 38px;
		height: 38px;
		font-size: 0.95rem;
		border-radius: 50%;
		background-color: transparent;
		color: #333;
		cursor: default;
		transition: background-color 0.2s;
		box-sizing: border-box;
	}

	/* Дни не текущего месяца */
	.day-cell:not(.current-month) {
		color: #aaa;
	}

	/* Доступные и выбираемые дни */
	.day-cell.current-month.selectable {
		cursor: pointer;
	}

	.day-cell.current-month.selectable:hover {
		background-color: #f0f0f0;
	}

	/* Выбранный день */
	.day-cell.selected {
		background-color: var(--main-color, #e24511);
		color: white;
		font-weight: bold;
	}
	.day-cell.selected:hover {
		background-color: var(--main-color, #e24511);
	}

	/* Сегодняшний день (если не выбран) */
	.day-cell.today:not(.selected) {
		border: 2px solid var(--secondary-color, #f98457);
	}

	/* Недоступные дни */
	.day-cell:not(.selectable) {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>

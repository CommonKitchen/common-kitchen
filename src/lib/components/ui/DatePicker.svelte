<script>
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

	const { title, availableDays = [1, 2, 3, 4, 5], blockedDays = [] } = $props();

	// Определение времени отсечения (например, 10:00 утра)
	const CUTOFF_HOUR = 10;

	/**
	 * Вспомогательная функция для создания даты с обнуленным временем (начала дня).
	 * @param {Date} date Исходная дата.
	 * @returns {Date} Новая дата с временем 00:00:00.
	 */
	function startOfDay(date) {
		const newDate = new Date(date);
		newDate.setHours(0, 0, 0, 0);
		return newDate;
	}

	// 1. Получаем текущую дату и час (локальный часовой пояс)
	const NOW = new Date();
	const currentHour = NOW.getHours();

	// 2. Определяем минимальную дату как неизменяемую константу.
	const minimalDate = (() => {
		let date = startOfDay(NOW);

		if (currentHour >= CUTOFF_HOUR) {
			// Если сейчас 10:00 или позже, минимальная дата — завтра.
			date.setDate(date.getDate() + 1);
		}
		// Если сейчас до 10:00, дата остается сегодняшней (00:00:00).
		return date;
	})();

	/** @type {string} Дата, выбранная пользователем. Хранится в формате YYYY-MM-DD. */
	let selectedDate = $state(minimalDate.toISOString().split('T')[0]);

	/**
	 * Форматирует дату в YYYY-MM-DD для атрибута min в <input type="date">.
	 * @param {Date} date
	 * @returns {string}
	 */
	function formatDateForInput(date) {
		return date.toISOString().split('T')[0];
	}

	let isCalendarOpen = $state(false);

	/**
	 * Форматирует дату в читаемый вид (например, "21 Жовтня, Пт").
	 */
	const formattedDate = $derived(() => {
		if (!selectedDate) return 'Обрати дату';
		try {
			// selectedDate is YYYY-MM-DD
			const date = new Date(selectedDate + 'T00:00:00'); // Добавляем T00:00:00, чтобы избежать проблем с часовыми поясами

			// Формат: "21 жовтня, пт" (21 October, Fri)
			return date.toLocaleDateString('uk-UA', {
				day: 'numeric',
				month: 'long',
				weekday: 'short'
			});
		} catch (e) {
			console.error('Error formatting date:', e);
			return 'Некоректна дата';
		}
	});

	function toggleCalendar() {
		isCalendarOpen = !isCalendarOpen;
	}
</script>

<div class="calendar-block">
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
		<div id="date-picker-popup" class="calendar-popup">
			<div class="placeholder">Панель календаря (Шаг 2)</div>
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

		padding: 4px 8px;
		border-radius: 8px;
		border: 1px solid var(--common-border, #ccc);
		font-size: 1.1rem;
		background-color: var(--common-bg-light, #f9f9f9);
		cursor: pointer;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.calendar-icon {
		color: var(--icons-color);
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
		color: #333;
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
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 10px;
		margin-top: 5px; /* Небольшой отступ */
	}

	.placeholder {
		padding: 20px;
		color: #999;
	}
</style>

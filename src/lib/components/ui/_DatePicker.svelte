<script>
	// Константы для логики календаря
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

	const TODAY = new Date();
	TODAY.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения

	/**
	 * @typedef {object} DeliveryDatePickerProps
	 * @property {number[]} [allowedDays=[]] - Разрешенные дни недели (0=Вс, 6=Сб).
	 * @property {(Date|string)[]} [blockedDates=[]] - Явно заблокированные даты.
	 */

	// Входящие пропсы (read-only), используем деструктуризацию и значения по умолчанию.
	/** @type {DeliveryDatePickerProps} */
	let {
		allowedDays = [1, 2, 3, 4, 5], // 0=Вс, 6=Сб (Понедельник=1, Вторник=2, ..., Воскресенье=0)
		blockedDates = []
	} = $props();

	// --- Состояние компонента ---
	let showCalendar = $state(false);
	let currentMonth = $state(new Date());

	/**
	 * Внутренний хелпер для нормализации дат из blockedDates в строку 'YYYY-MM-DD' для быстрого поиска.
	 * @returns {Set<string>} Набор строк дат в формате 'YYYY-MM-DD'.
	 */
	const blockedDateStrings = $derived(() => {
		// Используем Set для O(1) поиска
		const dates = blockedDates || [];
		return new Set(
			dates.map((d) => {
				const date = d instanceof Date ? d : new Date(d);
				// Нормализация до даты
				date.setHours(0, 0, 0, 0);
				return date.toISOString().split('T')[0];
			})
		);
	});

	/**
	 * Находит следующую доступную дату, начиная с завтрашнего дня.
	 * @param {number[]} allowedDays - Разрешенные дни недели (0=Вс, 6=Сб).
	 * @param {Set<string>} blockedDatesSet - Набор строк заблокированных дат ('YYYY-MM-DD').
	 * @returns {Date | null} Ближайшая доступная дата или null, если не найдена.
	 */
	// ИЗМЕНЕНИЕ: Функция теперь принимает Set<string> напрямую
	function findNextAllowedDate(allowedDays, blockedDatesSet) {
		let date = new Date(TODAY);

		// Начинаем проверку со следующего дня
		date.setDate(TODAY.getDate() + 1);

		// Проверяем до 30 дней вперед для надежности
		for (let i = 0; i < 30; i++) {
			const dayOfWeek = date.getDay();
			const dateString = date.toISOString().split('T')[0];

			const isAllowedDayOfWeek = allowedDays.includes(dayOfWeek);
			// ИЗМЕНЕНИЕ: Проверка выполняется прямо на Set, без вызова как функции
			const isExplicitlyBlocked = blockedDatesSet.has(dateString);

			if (isAllowedDayOfWeek && !isExplicitlyBlocked) {
				return date;
			}
			date.setDate(date.getDate() + 1);
		}
		return null; // Возвращаем null, если не найдена
	}

	/**
	 * Получает количество дней в месяце для указанной даты.
	 * @param {Date} date - Дата в месяце.
	 * @returns {number} Количество дней в месяце.
	 */
	function getDaysInMonth(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}

	/**
	 * Получает смещение для первого дня месяца (0=Пн, 6=Вс).
	 * @param {Date} date - Дата для определения месяца.
	 * @returns {number} Смещение первого дня месяца относительно понедельника (0-6).
	 */
	function getStartDayOfMonth(date) {
		const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
		// Преобразование: Пн(1) -> 0, Вс(0) -> 6
		return (startDay + 6) % 7;
	}

	/**
	 * Сменяет текущий отображаемый месяц в календаре.
	 * Блокирует переход к месяцам раньше текущего.
	 * @param {number} delta - Сдвиг месяца (+1 для следующего, -1 для предыдущего).
	 */
	function changeMonth(delta) {
		const newDate = new Date(currentMonth);
		newDate.setMonth(newDate.getMonth() + delta);

		const todayMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
		// Блокируем переход к месяцам раньше текущего
		if (newDate < todayMonth) {
			currentMonth = todayMonth;
		} else {
			currentMonth = newDate;
		}
	}

	// --- Инициализация и состояние ---

	// Устанавливаем ближайшую разрешенную дату по умолчанию, если не указано иное.
	/** @type {Date | null} */
	let defaultDate = null;
	if (allowedDays.length > 0) {
		// ИЗМЕНЕНИЕ: Передаем derived-значение. Предупреждение Svelte устранено.
		defaultDate = findNextAllowedDate(allowedDays, blockedDateStrings());
	}

	/** @type {Date | null} */
	let selectedDate = $state(defaultDate);
	export { selectedDate };

	// --- Вычисляемое состояние ---

	/**
	 * @typedef {object} CalendarDay
	 * @property {number | null} day - Номер дня месяца.
	 * @property {Date | null} date - Объект Date для этого дня.
	 * @property {boolean} [isSpacer] - Флаг для пустой ячейки.
	 * @property {boolean} [isAllowed] - Разрешен ли этот день для выбора.
	 * @property {boolean} [isPast] - Прошедший ли это день.
	 * @property {boolean} [isExplicitlyBlocked] - Заблокирован ли этот день явно.
	 * @property {boolean} [isSelected] - Выбран ли этот день.
	 */

	/**
	 * Генерирует массив объектов для отображения в сетке календаря.
	 * @returns {CalendarDay[]} Массив объектов дней календаря.
	 */
	const calendarDays = $derived(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const daysInMonth = getDaysInMonth(currentMonth);
		const startDayOffset = getStartDayOfMonth(currentMonth);

		/** @type {CalendarDay[]} */
		let days = [];
		// Пустые ячейки для сдвига
		for (let i = 0; i < startDayOffset; i++) {
			days.push({ day: null, date: null, isSpacer: true });
		}

		// Дни месяца
		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			date.setHours(0, 0, 0, 0); // Нормализуем для сравнения
			const dayOfWeek = date.getDay(); // 0-6 (Вс-Сб)
			const dateString = date.toISOString().split('T')[0];

			// 1. Проверка на прошлое
			const isPast = date < TODAY;

			// 2. Проверка на разрешенный день недели (используем пропс)
			const isAllowedDayOfWeek = allowedDays.includes(dayOfWeek);

			// 3. Проверка на блокировку по дате (вызов blockedDateStrings())
			const isExplicitlyBlocked = blockedDateStrings().has(dateString);

			// Дата разрешена, если: (разрешенный день НЕДЕЛИ) И (НЕ в прошлом) И (НЕ заблокирована явно)
			const isAllowed = isAllowedDayOfWeek && !isPast && !isExplicitlyBlocked;

			days.push({
				day: i,
				date,
				isAllowed,
				isPast,
				isExplicitlyBlocked,
				// Явная проверка instanceof Date для безопасности
				isSelected:
					selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString()
			});
		}

		return days;
	});

	/**
	 * Форматирование выбранной даты для отображения в кнопке.
	 * @returns {string} Отформатированная строка даты или 'Оберіть дату'.
	 */
	const formattedSelectedDate = $derived(
		selectedDate
			? selectedDate.toLocaleDateString('uk-UA', {
					day: 'numeric',
					month: 'long',
					year: 'numeric'
				})
			: 'Оберіть дату'
	);

	/**
	 * Обработчик выбора даты. Устанавливает выбранную дату и закрывает календарь.
	 * @param {CalendarDay} day - Объект выбранного дня.
	 */
	function selectDate(day) {
		if (day.isAllowed) {
			selectedDate = day.date;
			showCalendar = false;
		}
	}

	/**
	 * Определяет, является ли текущая выбранная дата невалидной (если она вдруг оказалась в blockedDates
	 * или не соответствует allowedDays, например, если prop'ы изменились после выбора).
	 * @returns {boolean} True, если выбранная дата невалидна.
	 */
	const isCurrentlyInvalid = $derived(() => {
		if (!selectedDate) return false;
		const dateString = selectedDate.toISOString().split('T')[0];
		// ИЗМЕНЕНИЕ: Проверка выполняется прямо на Set, без вызова как функции
		return !allowedDays.includes(selectedDate.getDay()) || blockedDateStrings().has(dateString);
	});

	/**
	 * Форматирует список разрешенных дней недели для отображения в info-блоке.
	 * @returns {string} Строка с сокращенными именами разрешенных дней недели.
	 */
	const allowedDayNames = $derived(() => {
		const days = allowedDays || [];
		return days
			.map((d) => {
				if (d === 0) return DAYS_OF_WEEK[6]; // Воскресенье (0) -> 'Нд' (индекс 6)
				return DAYS_OF_WEEK[d - 1]; // Пн-Сб (1-6) -> 'Пн'-'Сб' (индексы 0-5)
			})
			.join(', ');
	});
</script>

<div class="date-picker-container">
	<button
		class="date-input-fake"
		onclick={() => (showCalendar = !showCalendar)}
		class:invalid-date={isCurrentlyInvalid}
	>
		{formattedSelectedDate}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-calendar"
			><path d="M8 2v4" /><path d="M16 2v4" /><rect
				width="18"
				height="18"
				x="3"
				y="4"
				rx="2"
			/><path d="M3 10h18" /></svg
		>
	</button>

	{#if showCalendar}
		<div class="calendar-dropdown">
			<div class="calendar-header">
				<!-- Блокируем кнопку "назад", если это текущий месяц -->
				<button
					onclick={() => changeMonth(-1)}
					disabled={currentMonth.getMonth() === TODAY.getMonth() &&
						currentMonth.getFullYear() === TODAY.getFullYear()}>&lt;</button
				>
				<div class="month-label">
					{MONTH_NAMES[currentMonth.getMonth()]}
					{currentMonth.getFullYear()}
				</div>
				<button onclick={() => changeMonth(1)}>&gt;</button>
			</div>

			<div class="calendar-grid">
				{#each DAYS_OF_WEEK as day}
					<!-- Воскресенье (индекс 6) -->
					<div class="day-name" class:weekend={day === 'Нд'}>{day}</div>
				{/each}

				{#each calendarDays() as day}
					{#if day.isSpacer}
						<div class="day-cell spacer"></div>
					{:else}
						<button
							class="day-cell"
							disabled={!day.isAllowed || day.isPast || day.isExplicitlyBlocked}
							onclick={() => selectDate(day)}
							class:allowed={day.isAllowed}
							class:selected={day.isSelected}
							class:blocked={day.isExplicitlyBlocked}
						>
							{day.day}
						</button>
					{/if}
				{/each}
			</div>
			<!-- <div class="calendar-info">
				**Зеленым** отмечены доступные дни ({allowedDayNames}).
				{#if (blockedDates || []).length > 0}
					<br />**Красным** отмечены заблокированные даты.
				{/if}
			</div> -->
		</div>
	{/if}
</div>

<style>
	/* --- Стили для кастомного календаря --- */
	.date-picker-container {
		position: relative;
		display: inline-block;
	}

	.date-input-fake {
		padding: 8px 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		outline: none;
		cursor: pointer;
		background: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 180px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.date-input-fake svg {
		margin-left: 10px;
		color: #888;
	}

	.date-input-fake:hover {
		border-color: var(--main-color, #e24511);
	}

	.date-input-fake.invalid-date {
		border: 2px solid #dc3545; /* Красный цвет ошибки */
		box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
	}

	.calendar-dropdown {
		position: absolute;
		top: 100%;
		/* MOBILE/RESPONSIVE FIX: Центрируем выпадающее окно относительно кнопки */
		left: 50%;
		transform: translateX(-50%);

		z-index: 10;
		background: white;
		border: 1px solid #ccc;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 10px;
		margin-top: 5px;
		/* MOBILE/RESPONSIVE FIX: Используем max-width вместо фиксированной ширины */
		width: 100%;
		max-width: 300px;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.calendar-header button {
		background: none;
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
		padding: 5px;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.calendar-header button:hover:not([disabled]) {
		background: #f0f0f0;
	}

	.calendar-header button[disabled] {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.month-label {
		font-weight: 600;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 5px;
		text-align: center;
	}

	.day-name {
		font-size: 0.8rem;
		color: #888;
		font-weight: 500;
		padding: 5px 0;
	}

	.day-name.weekend {
		color: #dc3545;
	}

	.day-cell {
		background: #f7f7f7;
		border: 1px solid #f0f0f0;
		border-radius: 4px;
		padding: 8px 0;
		cursor: pointer;
		font-weight: 500;
		transition:
			background 0.1s,
			border-color 0.1s;
	}

	.day-cell:hover:not([disabled]) {
		background: #e9e9e9;
	}

	/* Недоступные дни (по умолчанию) */
	.day-cell[disabled] {
		background: #fff;
		color: #ccc;
		cursor: not-allowed;
		border: 1px solid #fff;
	}

	/* Разрешенные дни (ВТ/ЧТ) */
	.day-cell.allowed {
		background: #e6ffe6; /* Светло-зеленый фон */
		border-color: #c9e6c9;
		color: #1e8449; /* Темно-зеленый текст */
	}

	.day-cell.allowed:hover:not([disabled]) {
		background: #d4fcd4;
	}

	/* Выбранный день */
	.day-cell.selected {
		background: var(--main-color, #e24511);
		color: white;
		border-color: var(--main-color, #e24511);
	}

	/* Явно заблокированные даты (праздники и т.д.) */
	.day-cell.blocked {
		background: #ffeded; /* Светло-красный фон */
		color: #904040; /* Темный красный текст */
		border-color: #f5c6cb;
		cursor: not-allowed;
	}
	/* Если разрешенный день недели совпадает с заблокированной датой, блокировка имеет приоритет */
	.day-cell.allowed.blocked {
		background: #ffeded;
		color: #904040;
	}

	.spacer {
		background: none;
		border: none;
	}

	.calendar-info {
		margin-top: 10px;
		padding-top: 5px;
		border-top: 1px dashed #eee;
		font-size: 0.9rem;
		color: #666;
		text-align: center;
	}
</style>

<script>
	const { title, availableDays = [1, 2, 3, 4, 5] } = $props();

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
	let deliveryDate = $state(minimalDate.toISOString().split('T')[0]);

	/**
	 * Форматирует дату в YYYY-MM-DD для атрибута min в <input type="date">.
	 * @param {Date} date
	 * @returns {string}
	 */
	function formatDateForInput(date) {
		return date.toISOString().split('T')[0];
	}
</script>

<div class="delivery-date">
	<label for="delivery-date-input" class="description-date">{title}</label>
	<!-- Используем отформатированную дату deliveryDate для значения и minimalDate для атрибута min -->
	<input
		type="date"
		id="delivery-date-input"
		class="input-date"
		min={formatDateForInput(minimalDate)}
		bind:value={deliveryDate}
	/>
</div>

<style>
	.delivery-date {
		margin: 8px 0px 16px 0px;
	}

	.input-date {
		margin: 0px 15px;
		padding: 0.55rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--common-border);
		font-size: 1.2rem;
		background-color: var(--common-bg-light);
	}

	/* .description-date {
	} */
</style>

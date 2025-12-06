<script>
	import SelectOptions from '$lib/components/ui/SelectOptions.svelte';
	import iconRemove from '$lib/components/layout/icons/Remove.svelte';
	import iconPlus from '$lib/components/layout/icons/Plus.svelte';
	import iconEdit from '$lib/components/layout/icons/Pencil.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { customer } from '$lib/stores/customerStore.js';
	import { getWebApp } from '$lib/utils/telegram';

	const { apiURL } = $props();

	/** @typedef {import('$lib/types/types.js').Customer} Customer */
	/** @typedef {import('$lib/types/types.js').legalEntity} legalEntity */
	/** @typedef {import('$lib/types/types.js').CustomerLocation} CustomerLocation */

	let isNewItem = $state(false);
	let editingMode = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);
	let dataSaved = $state(false);
	let errorSendingMessage = $state('');

	const EMPTY_STATE = {
		title: '',
		address: '',
		phone: '',
		taxId: '',
		instagram: '',
		bankAccount: '',
		bankName: '',
		bankCode: ''
	};

	let tmpState = $state({ ...EMPTY_STATE });
	/** @type {string | null} */
	let currentEntityId = $state(null);
	/** @type {string | null} */
	let currentLocationId = $state(null);

	const entities = $derived(() => $customer?.legalEntities ?? []);

	const currentEntity = $derived(() => entities().find((e) => e.id === currentEntityId));

	const currentLocations = $derived(() => {
		return currentEntity()?.customerLocations ?? [];
	});

	const currentLocation = $derived(() => {
		return currentLocations().find((l) => l.id === currentLocationId) ?? null;
	});

	const hasEntity = $derived(() => !!currentEntity());
	const hasMultipleEntities = $derived(() => (entities().length ?? 0) > 1);
	const hasMultipleLocations = $derived(() => currentLocations().length > 1);

	$effect(() => {
		const isCurrentEntityValid = entities().some((e) => e.id === currentEntityId);
		if (!isCurrentEntityValid) {
			currentEntityId = entities()[0]?.id ?? null;
		}

		const locations = currentEntity()?.customerLocations ?? [];
		const isCurrentLocationValid = locations.some((loc) => loc.id === currentLocationId);
		if (!isCurrentLocationValid) {
			currentLocationId = locations[0]?.id ?? null;
		}
	});

	const entityControls = [
		{
			key: 'addEntity',
			icon: iconPlus,
			tooltip: 'Додати нового замовника',
			color: '#4CAF50',
			action: () => initializeEditMode('entity', true),
			disabled: () => false
		},
		{
			key: 'editEntity',
			icon: iconEdit,
			tooltip: 'Редагувати поточного замовника',
			color: '#4682B4',
			action: () => initializeEditMode('entity', false),
			disabled: () => !hasEntity()
		},
		{
			key: 'removeEntity',
			icon: iconRemove,
			tooltip: 'Видалити поточного замовника',
			color: 'var(--main-color)',
			action: removeEntity,
			disabled: () => !hasMultipleEntities()
		}
	];

	const locationControls = [
		{
			key: 'addLoc',
			icon: iconPlus,
			tooltip: 'Додати новий заклад',
			color: '#4CAF50',
			action: () => initializeEditMode('location', true),
			disabled: () => !hasEntity()
		},
		{
			key: 'editLoc',
			icon: iconEdit,
			tooltip: 'Редагувати поточний заклад',
			color: '#4682B4',
			action: () => initializeEditMode('location', false),
			disabled: () => !currentLocation()
		},
		{
			key: 'removeLoc',
			icon: iconRemove,
			tooltip: 'Видалити поточний заклад',
			color: 'var(--main-color)',
			action: removeLocation,
			disabled: () => !hasMultipleLocations()
		}
	];

	/**
	 * Универсальная функция для обновления customer store
	 * @param {(curr: Customer) => Partial<Customer> | void} updater
	 */
	function updateCustomer(updater) {
		customer.update((curr) => {
			if (!curr) return curr;
			const updated = updater(curr);
			return updated ? { ...curr, ...updated } : curr;
		});
	}

	/**
	 * Initializes the editing mode and populates/clears the temporary state variables.
	 * @param {'entity' | 'location'} mode The type of item being edited.
	 * @param {boolean} isNew True if adding a new item (fields should be cleared).
	 */
	function initializeEditMode(mode, isNew = false) {
		editingMode = mode;
		isNewItem = isNew;
		dataSaved = false;

		errorMessage = '';

		tmpState = { ...EMPTY_STATE };

		if (mode === 'entity') {
			const entity = currentEntity();

			if (entity && !isNew) {
				tmpState.title = entity.title ?? '';
				tmpState.phone = entity.phone ?? '';
				tmpState.taxId = entity.taxId ?? '';
				tmpState.bankAccount = entity.bankAccount ?? '';
				tmpState.bankName = entity.bankName ?? '';
				tmpState.bankCode = entity.bankCode ?? '';
			}
		} else if (mode === 'location') {
			const location = currentLocation();
			if (location && !isNew) {
				tmpState.title = location.title ?? '';
				tmpState.address = location.address ?? '';
				tmpState.phone = location.phone ?? '';
				tmpState.instagram = location.instagram ?? '';
			}
		}
	}

	function cancelEdit() {
		tmpState = { ...EMPTY_STATE };
		errorMessage = '';
		editingMode = '';
	}

	/**
	 * Зберігає зміни для замовника (entity)
	 * @param {Customer} curr
	 * @returns {legalEntity[]}
	 */
	function saveEntity(curr) {
		const entityList = curr.legalEntities ?? [];

		if (isNewItem) {
			const newEntity = {
				...tmpState,
				id: crypto.randomUUID(),
				customerLocations: []
			};
			currentEntityId = newEntity.id;
			return [...entityList, newEntity];
		}

		return entityList.map((e) => (e.id === currentEntityId ? { ...e, ...tmpState } : e));
	}

	/**
	 * Зберігає зміни для закладу (location)
	 * @param {Customer} curr
	 * @returns {legalEntity[]}
	 */
	function saveLocation(curr) {
		return curr.legalEntities.map((e) => {
			if (e.id !== currentEntityId) return e;
			const locList = e.customerLocations ?? [];

			if (isNewItem) {
				const newLoc = {
					...tmpState,
					id: crypto.randomUUID(),
					availableDays: []
				};
				currentLocationId = newLoc.id;
				return { ...e, customerLocations: [...locList, newLoc] };
			}

			return {
				...e,
				customerLocations: locList.map((l) =>
					l.id === currentLocationId ? { ...l, ...tmpState } : l
				)
			};
		});
	}

	function saveData() {
		const { title, address } = tmpState;
		if (!title) return (errorMessage = 'Назва є обов’язковим полем!');
		if (editingMode === 'location' && !address)
			return (errorMessage = 'Адреса є обов’язковим полем!');

		if (tmpState.phone && !/^\+380\d{9}$/.test(tmpState.phone)) {
			errorMessage = 'Телефон повинен бути у форматі +380XXXXXXXXX';
			return;
		}

		updateCustomer((curr) => {
			if (editingMode === 'entity') {
				return { legalEntities: saveEntity(curr) };
			}
			if (editingMode === 'location') {
				return { legalEntities: saveLocation(curr) };
			}
		});

		cancelEdit();
	}

	function removeEntity() {
		dataSaved = false;
		customer.update((curr) => {
			if (!curr) return curr;

			// Защита — хотя бы один замовник должен остаться
			if (entities().length <= 1) {
				errorMessage = 'Повинен бути принаймні один замовник.';
				return curr;
			}

			// Удаляем выбранного
			const newEntities = entities().filter((e) => e.id !== currentEntityId);

			// Обновляем currentEntityId (ставим первого оставшегося)
			currentEntityId = newEntities[0]?.id ?? null;

			// Сбрасываем текущую локацию
			currentLocationId = newEntities[0]?.customerLocations?.[0]?.id ?? null;

			return { ...curr, legalEntities: newEntities };
		});

		cancelEdit();
	}

	function removeLocation() {
		dataSaved = false;
		customer.update((curr) => {
			if (!curr) return curr;

			const entity = entities().find((e) => e.id === currentEntityId);
			if (!entity) return curr;

			const locations = entity.customerLocations ?? [];

			// Проверка — хотя бы один заклад должен остаться
			if (locations.length <= 1) {
				errorMessage = 'Повинен бути принаймні один заклад у замовника.';
				return curr;
			}

			// Удаляем выбранный заклад
			const newLocations = locations.filter((l) => l.id !== currentLocationId);

			// Обновляем currentLocationId (ставим первый оставшийся)
			currentLocationId = newLocations[0]?.id ?? null;

			// Обновляем entity в списке
			const updatedEntities = entities().map((e) =>
				e.id === currentEntityId ? { ...e, customerLocations: newLocations } : e
			);

			return { ...curr, legalEntities: updatedEntities };
		});

		errorMessage = '';
	}

	/**
	 * Универсальный обработчик для телефонов.
	 * Фильтрует всё кроме цифр и +, ограничивает длину до maxLength.
	 * @param {Event} e
	 * @param {number} maxLength
	 */
	function handlePhoneInput(e, maxLength = 13) {
		if (!e.target || !(e.target instanceof HTMLInputElement)) return;

		let val = e.target.value.replace(/[^\d+]/g, ''); // оставляем только цифры и '+'
		if (val.length > maxLength) val = val.slice(0, maxLength);
		e.target.value = val;
		tmpState.phone = val;
	}

	//#region saveDataToServer
	async function saveDataToServer() {
		isLoading = true;
		errorSendingMessage = '';

		const webApp = getWebApp();

		// @ts-ignore
		const initData = webApp?.initData;
		if (!initData) {
			console.warn('Telegram WebApp.initData не знайдено. Замовлення неможливе.');
			return;
		}

		try {
			const response = await fetch(`${apiURL}/cakes/hs/shop/customers`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-Telegram-Init-Data': initData
				},
				body: JSON.stringify(entities())
			});

			if (!response.ok) {
				let errorMessage = `Помилка сервера: ${response.status}`;
				console.log(response);
				try {
					const errorBody = await response.json();
					errorMessage = errorBody.message || errorMessage;
				} catch (e) {
					errorMessage = errorMessage;
				}

				console.log(`errorMessage ${errorMessage}`);
				throw new Error(errorMessage);
			} else {
				dataSaved = true;
			}
		} catch (error) {
			errorSendingMessage = 'Не вдалося оформити замовлення. Спробуйте пізніше.';
			console.error('API Checkout Error:', error);
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="customer-block">
	<h2>Мої дані</h2>
	{#if !hasEntity()}
		<div class="warning-block">
			Для подальшої роботи необхідно додати <b>Замовників</b> (платників), на яких будуть
			виставлятися рахунки у випадку безготівкової оплати (на р/р). <br />Також слід прив'язати до
			кожного
			<b>Замовника</b> <b>Заклад</b>, для якого створюється замовлення. Після внесення та збереження
			цієї інформації менеджер повинен її затвердити та призначити дні, дозволені для замовлень
			продукції в цей заклад. Тільки після цього ви отримаєте можливість оформити замовлення.<br /> Повідомлення
			про затвердження надійде від телеграм-бота.
		</div>
	{/if}

	{#if !editingMode}
		<div class="customer-info"><b>Користувач:</b> {$customer?.name} {$customer?.phone}</div>

		<SelectOptions
			title="Замовник:"
			bind:value={currentEntityId}
			items={entities()}
			controls={entityControls}
		/>

		<SelectOptions
			title="Заклад:"
			bind:value={currentLocationId}
			items={currentLocations()}
			controls={locationControls}
		/>

		<div class="btn-save">
			<Button title="Зберегти все" onclick={saveDataToServer} />
		</div>
		{#if dataSaved}
			<div class="success-block">Дані збережено на сервері</div>
		{/if}
	{:else}
		<div class="main-form">
			{#if isNewItem}
				<h2>{`Новий ${editingMode === 'entity' ? 'замовник' : 'заклад'}`}</h2>
			{:else}
				<h2>{`Редагування ${editingMode === 'entity' ? 'замовника' : 'закладу'}`}</h2>
			{/if}

			{#if editingMode === 'entity'}
				<div class="form-section">
					<div class="form-group">
						<label for="customer-name">Назва:</label>
						<input
							id="customer-name"
							type="text"
							placeholder="Назва"
							bind:value={tmpState.title}
							required
						/>
					</div>
					<div class="form-group">
						<label for="customer-phone">Телефон:</label>
						<input
							id="customer-phone"
							type="tel"
							placeholder="+380XX XXX XX XX"
							bind:value={tmpState.phone}
							oninput={handlePhoneInput}
							maxlength="13"
						/>
					</div>
					<div class="form-group">
						<label for="customer-taxId">Код ЄДРПОУ:</label>
						<input id="customer-taxId" type="text" bind:value={tmpState.taxId} />
					</div>
					<div class="warning-block">
						Якщо ви плануєте працювати з нами по безготівковій оплаті, надайте, будь ласка, свої
						банківські реквізити.
					</div>
					<div class="form-group">
						<label for="customer-taxId">Номер рахунку:</label>
						<input id="customer-taxId" type="text" bind:value={tmpState.bankAccount} />
					</div>
					<div class="form-group">
						<label for="customer-taxId">Банк:</label>
						<input id="customer-taxId" type="text" bind:value={tmpState.bankName} />
					</div>
					<div class="form-group">
						<label for="customer-taxId">МФО:</label>
						<input id="customer-taxId" type="text" bind:value={tmpState.bankCode} />
					</div>
				</div>
			{/if}

			{#if editingMode === 'location'}
				<div class="form-section">
					<div class="form-group">
						<label for="est-name">Назва:</label>
						<input
							id="est-name"
							type="text"
							placeholder="Назва"
							bind:value={tmpState.title}
							required
						/>
					</div>
					<div class="form-group">
						<label for="est-address">Адреса:</label>
						<input
							id="est-address"
							type="text"
							placeholder=""
							bind:value={tmpState.address}
							required
						/>
					</div>
					<div class="form-group">
						<label for="est-phone">Контактний телефон менеджера:</label>
						<input
							id="est-phone"
							type="tel"
							placeholder="+380XX XXX XX XX"
							bind:value={tmpState.phone}
							oninput={handlePhoneInput}
							maxlength="13"
						/>
					</div>
					<div class="form-group">
						<label for="est-insta">Посилання на Instagram:</label>
						<input
							id="est-insta"
							type="url"
							placeholder="https://instagram.com/..."
							bind:value={tmpState.instagram}
						/>
					</div>
				</div>
			{/if}

			{#if errorMessage}
				<div class="warning-block">⚠️ {errorMessage}</div>
			{/if}

			<div class="form-footer">
				<Button title="Назад" onclick={cancelEdit} class={'secondary'} />
				<Button title="Готово" onclick={saveData} />
			</div>
		</div>
	{/if}
</div>

<style>
	.customer-block {
		max-width: 800px;
		margin: 20px auto;
		padding: 20px 8px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
		font-family: Arial, sans-serif;
	}

	.customer-block h2 {
		color: var(--main-color);
		text-align: center;
		margin-bottom: 25px;
	}

	.btn-save {
		margin-top: 20px;
	}

	.main-form {
		margin-top: 5px;
		padding: 20px 8px;
		border: 1px solid var(--common-border-dark);
		border-radius: 8px;
		background-color: white;
	}

	.form-section {
		margin-bottom: 25px;
		padding: 20px 8px;
		border: 1px solid var(--common-border-dark);
		border-radius: 6px;
		background-color: var(--common-bg-light);
	}

	.main-form h2 {
		text-align: center;
		color: #555;
		margin-bottom: 10px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.form-group label {
		display: block;
		font-weight: bold;
		color: #555;
		margin-bottom: 5px;
		font-size: 0.9em;
	}

	.main-form input[type='text'],
	.main-form input[type='tel'],
	.main-form input[type='url'] {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.main-form input[type='text']:focus,
	.main-form input[type='tel']:focus,
	.main-form input[type='url']:focus {
		outline: none;
		border-color: var(--main-color);
		box-shadow: 0 0 0 3px rgba(var(--main-color-rgb), 0.25);
	}

	.form-footer {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	.warning-block,
	.success-block {
		background-color: #fff3cd;
		color: #856404;
		border: 1px solid #ffeeba;
		padding: 10px 15px;
		border-radius: 4px;
		margin-bottom: 20px;
		font-weight: 500;
		text-align: left;
		line-height: 1.6;
	}

	.success-block {
		margin-top: 10px;
	}

	@media (min-width: 480px) {
		.customer-block,
		.main-form,
		.form-section {
			padding: 20px;
		}
	}
</style>

//  * @property {object} initDataUnsafe - Розібрані (parsed) дані ініціалізації.
//  * @property {object} initDataUnsafe.user - Об'єкт користувача, який відкрив Mini App.
//  * @property {string} initDataUnsafe.hash - Хеш-сума для перевірки цілісності даних.
//  * @property {string} platform - Платформа, на якій запущено Web App ('ios', 'android', 'tdesktop' тощо).
//  * @property {string} colorScheme - Поточна колірна схема ('light' або 'dark').
//  * @property {function(): void} close - Метод для закриття Mini App.
//  * @property {object} MainButton - Об'єкт для керування головною кнопкою.

/**
 * @typedef {object} TelegramWebApp
 * @property {string} initData - Дані ініціалізації, які передаються Mini App при її відкритті.
 */

/**
 * @returns {TelegramWebApp | null} Об'єкт WebApp або null, якщо не завантажено.
 */
export function getWebApp() {
	const debug = !true;

	if (debug) {
		return {
			initData:
				'query_id=AAFsRjIYAAAAAGxGMhiXftHC&user=%7B%22id%22%3A405948012%2C%22first_name%22%3A%22Olexander%22%2C%22last_name%22%3A%22%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FYSacqszPFJcQEXl9G11mEpWG1P9Ln3ZNY35WASFaZ8U.svg%22%7D&auth_date=1761562755&signature=Xh-V123nFu0o1mGgZNnFL4LYJg8KH_BrXRm3PxChGmhtUm_Lxi7xAo9QL6Uaigyi1nqpUDfcbRUWOI8NBPejAQ&hash=3e36f75e88a81dba351658f714721f07230a43ccc31b606166b829b9b3855a01'
		};
	} else {
		// @ts-ignore
		if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
			// @ts-ignore
			return window.Telegram.WebApp;
		}
	}
	return null;
}

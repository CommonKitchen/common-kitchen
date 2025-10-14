/**
 * @returns {object | null} Об'єкт WebApp або null, якщо не завантажено.
 */
export function getWebApp() {
	// @ts-ignore
	if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
		// @ts-ignore
		return window.Telegram.WebApp;
	}
	return null;
}

import { getContext, setContext } from 'svelte';

// Создаем уникальный ключ для нашего контекста категорий
// Symbol предотвращает коллизии
const CATEGORY_KEY = Symbol('category-context');

/**
 * Устанавливает контекст категорий (вызывается в +layout.svelte).
 * @param {import('$lib/types/types.js').Category[]} categories
 */
export function setCategoryContext(categories) {
	setContext(CATEGORY_KEY, categories);
}

/**
 * Получает контекст категорий (вызывается в SideMenu.svelte).
 * @returns {import('$lib/types/types.js').Category[] | undefined}
 */
export function getCategoryContext() {
	return getContext(CATEGORY_KEY);
}

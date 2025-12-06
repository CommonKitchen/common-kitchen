import { getContext, setContext } from 'svelte';

// Symbol предотвращает коллизии
const PRODUCT_KEY = Symbol('product-context');

/**
 * Устанавливает контекст категорий (вызывается в +layout.svelte).
 * @param {import('$lib/types/types.js').Product[]} products
 */
export function setProductContext(products) {
	setContext(PRODUCT_KEY, products);
}

/**
 * @returns {import('$lib/types/types.js').Product[] | undefined}
 */
export function getProductContext() {
	return getContext(PRODUCT_KEY);
}

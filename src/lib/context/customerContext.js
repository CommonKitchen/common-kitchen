import { getContext, setContext } from 'svelte';

const CUSTOMER_KEY = Symbol('customer');

/**
 * @typedef {import('$lib/types.js').Customer} Customer
 */

/**
 * Встановлює контекст даних клієнта.
 * @param {Customer | null} customerData - Початкові дані клієнта.
 */
export function setCustomerContext(customerData) {
	setContext(CUSTOMER_KEY, customerData);
}

/**
 * Отримує контекст даних клієнта.
 * @returns {() => (Customer | null)} Функція, яка повертає поточні дані клієнта.
 */
export function getCustomerContext() {
	return getContext(CUSTOMER_KEY);
}

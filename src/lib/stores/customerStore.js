import { writable } from 'svelte/store';

/**
 * @typedef {import('$lib/types.js').Customer} Customer
 * @type {import('svelte/store').Writable<Customer | null>}
 */
export const customer = writable(null);

/**
 * Обновляет данные клиента в хранилище.
 * @param {Customer | null} newCustomerData
 */
export function setCustomerData(newCustomerData) {
	customer.set(newCustomerData);
}

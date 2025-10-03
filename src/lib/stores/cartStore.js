// /**
//  * @typedef {object} CartStore
//  * @property {function({ productId: number, title: string, price: number }): void} addItem
//  * @property {function(number): void} removeItem
//  * @property {function(): void} clear
//  * @property {function(number, number): void} updateQuantity
//  */

import { derived, writable } from 'svelte/store';

/**
 * @typedef {object} CartItem
 * @property {number} id - ID товара.
 * @property {number} price - Цена за единицу.
 * @property {number} quantity - Количество в корзине.
 */

/** @type {import('svelte/store').Writable<CartItem[]>} */
export const cart = writable([]);

/** @type {import('svelte/store').Readable<number>} */
export const total = derived(cart, ($cart) => {
	return $cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

/** @type {import('svelte/store').Readable<number>} */
export const itemCount = derived(cart, ($cart) => $cart.length);

/**
 * Устанавливает количество товара в корзине до указанного значения (newQuantity > 0).
 * Если newQuantity <= 0, функция игнорирует вызов.
 * @param {object} item
 * @param {number} item.id
 * @param {number} item.price
 * @param {number} item.newQuantity
 */
export function updateCart({ id, price, newQuantity }) {
	if (newQuantity <= 0) {
		return;
	}

	cart.update((currentCart) => {
		const itemIndex = currentCart.findIndex((i) => i.id === id);

		if (itemIndex > -1) {
			// Товар уже есть: обновляем количество до newQuantity
			currentCart[itemIndex].quantity = newQuantity;
		} else {
			// Товара нет: добавляем как новый элемент
			currentCart.push({ id, price, quantity: newQuantity });
		}

		return currentCart;
	});
}

/**
 * Удаляет товар из корзины по ID.
 * @param {number} id - ID товара для удаления.
 */
export function removeItem(id) {
	cart.update((currentCart) => {
		const itemIndex = currentCart.findIndex((i) => i.id === id);
		if (itemIndex > -1) {
			currentCart.splice(itemIndex, 1);
		}
		return currentCart;
	});
}

export function clearCart() {
	cart.set([]);
}

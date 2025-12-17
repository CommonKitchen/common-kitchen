import { derived, writable, type Writable, type Readable } from 'svelte/store';
import type { CartItem } from '$lib/types/types';

export const cart: Writable<CartItem[]> = writable([]);

export const total: Readable<number> = derived(cart, ($cart) => {
	return $cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

export const itemCount: Readable<number> = derived(cart, ($cart) => $cart.length);

export function updateCart(id: string, price: number, newQuantity: number): void {
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

export function removeItem(id: string): void {
	cart.update((currentCart) => {
		const itemIndex = currentCart.findIndex((i) => i.id === id);
		if (itemIndex > -1) {
			currentCart.splice(itemIndex, 1);
		}
		return currentCart;
	});
}

export function getQuantity(id: string) {
	return derived(cart, ($cart) => {
		const item = $cart.find((i) => i.id === id);
		return item ? item.quantity : 0;
	});
}

export function clearCart() {
	cart.set([]);
}

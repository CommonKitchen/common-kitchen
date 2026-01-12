// src/lib/stores/cartStore.ts.ts
import type { CartItem } from '$lib/types/types.ts';

const items = $state<CartItem[]>([]);
let discount = $state(0);
let deliveryFee = $state(0);

export const cart = {
	set(data: CartItem[]): void {
		items.length = 0;
		items.push(...data);
		discount = 0;
		deliveryFee = 0;
	},

	get items(): ReadonlyArray<CartItem> {
		return items;
	},

	removeItem(id: number): void {
		const index = items.findIndex((item) => item.id === id);
		if (index !== -1) items.splice(index, 1);
	},

	clear(): void {
		items.length = 0;
		discount = 0;
		deliveryFee = 0;
	},

	get itemCount(): number {
		return items.length;
	},

	get totalQuantity(): number {
		return items.reduce((sum, item) => sum + item.quantity, 0);
	},

	set discountPercent(percent: number) {
		discount = Math.min(Math.max(percent, 0), 100);
	},

	get discountPercent(): number {
		return discount;
	},

	set deliveryAmount(amount: number) {
		deliveryFee = Math.max(0, amount);
	},

	get deliveryAmount(): number {
		return deliveryFee;
	},

	get total(): number {
		return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	},

	get subtotalAfterDiscount(): number {
		const amount = this.total * (1 - discount / 100);
		return Math.round(amount);
	},

	get finalTotal(): number {
		return this.subtotalAfterDiscount + deliveryFee;
	},

	getItemQuantity(id: number): number {
		return items.find((item) => item.id === id)?.quantity ?? 0;
	},

	updateQuantity(id: number, price: number, newQuantity: number): void {
		if (newQuantity <= 0) {
			this.removeItem(id);
			return;
		}

		const item = items.find((i) => i.id === id);

		if (item) {
			item.quantity = newQuantity;
		} else {
			items.push({ id, price, quantity: newQuantity });
		}
	}
};

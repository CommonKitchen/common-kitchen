// src/lib/stores/customerStore.ts

import { writable, type Writable } from 'svelte/store';
import type { Customer } from '$lib/types/types';

export const customer: Writable<Customer | null> = writable(null);

export function setCustomerData(newCustomerData: Customer | null): void {
	customer.set(newCustomerData);
}

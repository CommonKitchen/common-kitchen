// $lib/stores/checkoutConfig.ts
import { writable } from 'svelte/store';
import type { CheckoutConfig } from '$lib/types/types.js';

export const checkoutConfig = writable<CheckoutConfig | null>(null);

export function setCheckoutConfig(newCheckoutConfig: CheckoutConfig | null): void {
	checkoutConfig.set(newCheckoutConfig);
}

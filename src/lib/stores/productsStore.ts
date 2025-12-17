// src/lib/stores/productsStore.ts

import type { Product } from '$lib/types/types';
import { writable, type Writable, type Readable, derived } from 'svelte/store';
import { currentCategory, currentCategorySlug } from './categoriesStore';

/**
 * Основное хранилище всех продуктов.
 * @type {Writable<Product[]>}
 */
export const products: Writable<Product[]> = writable([]);

/**
 * Обновляет данные продукции в хранилище.
 * @param {Product[]} newProducts
 */
export function setProducts(newProducts: Product[]): void {
	products.set(newProducts);
}

/**
 * Производное хранилище для получения только бестселлеров (product.bestseller === true).
 * @type {Readable<Product[]>}
 */
export const bestsellers: Readable<Product[]> = derived(
	products,
	($products) => {
		if (!$products) {
			return [];
		}
		return $products.filter((product) => product.bestseller);
	},
	[] // Инициализируем производное хранилище пустым массивом по умолчанию
);

/**
 * Производное хранилище, которое фильтрует продукты по текущей активной категории.
 * Зависит от: [products], [currentCategory], [currentCategorySlug].
 * @type {Readable<Product[]>}
 */
export const categoryProducts: Readable<Product[]> = derived(
	[products, currentCategory, currentCategorySlug],
	([$products, $currentCategory, $currentCategorySlug]) => {
		const categoryId = $currentCategory?.id;
		if (!categoryId) {
			return [];
		} else if ($currentCategorySlug === 'all') {
			return $products;
		}
		return $products.filter((p) => p.categoryId === categoryId);
	},
	[]
);

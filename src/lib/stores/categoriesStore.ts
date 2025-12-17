// src/lib/stores/categoriesStore.ts

import { derived, writable, type Writable, type Readable } from 'svelte/store';
import type { Category } from '$lib/types/types';

/**
 * Основное хранилище всех категорий.
 * @type {Writable<Category[]>}
 */
export const categories: Writable<Category[]> = writable([]);

/**
 * Обновляет данные категорий в хранилище.
 * @param {Category[]} newCategories
 */
export function setCategories(newCategories: Category[]): void {
	categories.set(newCategories);
}

/**
 * @type {Writable<string | null>}
 */
export const currentCategorySlug: Writable<string | null> = writable(null);

/**
 * @param {string | null} slug
 */
export function setCurrentCategorySlug(slug: string | null): void {
	currentCategorySlug.set(slug);
}

/**
 * @type {Readable<Category | undefined>}
 */
export const currentCategory: Readable<Category | undefined> = derived(
	[categories, currentCategorySlug],
	([$categories, $currentCategorySlug]) => {
		if (!$currentCategorySlug) {
			return undefined;
		}
		return $categories.find((c) => c.slug === $currentCategorySlug);
	},
	undefined
);

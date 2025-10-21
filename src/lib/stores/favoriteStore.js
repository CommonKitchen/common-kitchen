import { writable } from 'svelte/store';

export const favoriteProducts = writable(new Set());

/** @param {number} productId */
export function toggleFavorite(productId) {
	favoriteProducts.update((favorites) => {
		const updatedFavorites = new Set(favorites);
		if (updatedFavorites.has(productId)) {
			updatedFavorites.delete(productId);
		} else {
			updatedFavorites.add(productId);
		}
		return updatedFavorites;
	});
}

/** @param {number[]} favoriteIds */
export function setFavoriteProducts(favoriteIds) {
	const favoritesSet = new Set(favoriteIds);
	favoriteProducts.set(favoritesSet);
}

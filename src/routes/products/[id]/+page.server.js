import { error } from '@sveltejs/kit';

/** @typedef {import('$lib/types').Product} Product */

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent }) {
	const id = Number(params.id);
	const { shopData } = await parent();

	/** @type {Product[] | undefined} */
	const products = shopData?.products;
	const product = products?.find(
		/** @param {Product} p */
		(p) => p.id === id
	);

	if (!product) {
		throw error(404, {
			message: `Товар з ID ${id} не знайдений.`
		});
	}

	return { product: product };
}

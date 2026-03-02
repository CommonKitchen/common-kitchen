import { API_SERVER_URL } from '$env/static/private';
import type { ApiData } from '$lib/types/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const API_URL = `https://${API_SERVER_URL}`;
	const siteUrl = 'https://common-kitchen.vercel.app';

	const response = await fetch(`${API_URL}/cakes/hs/shop/data`, {
		method: 'POST',
		headers: { Accept: 'application/json' }
	});

	if (!response.ok) {
		return new Response('Error fetching data', { status: 500 });
	}

	const data: ApiData = await response.json();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${siteUrl}/</loc></url>
        
        ${data.categories
					.map(
						(cat) => `
        <url>
            <loc>${siteUrl}/categories/${cat.slug}</loc>
            <changefreq>weekly</changefreq>
        </url>`
					)
					.join('')}

        ${data.products
					.map(
						(prod) => `
        <url>
            <loc>${siteUrl}/products/${prod.id}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>`
					)
					.join('')}
    </urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};

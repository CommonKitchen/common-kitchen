//src/routes/payment/+page.ts
export function load({ url }) {
	const status = url.searchParams.get('status');
	return {
		paymentStatus: status || 'initial'
	};
}

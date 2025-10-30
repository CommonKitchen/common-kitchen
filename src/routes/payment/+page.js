//src/routes/payment/+page.js
export function load({ url }) {
	const status = url.searchParams.get('status');
	return {
		paymentStatus: status || 'initial'
	};
}

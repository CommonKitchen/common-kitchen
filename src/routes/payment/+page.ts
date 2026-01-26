//src/routes/payment/+page.ts
export function load({ url }) {
	const status = url.searchParams.get('status');
	console.log('+page.ts status:', status);
	return {
		paymentStatus: status || 'initial'
	};
}

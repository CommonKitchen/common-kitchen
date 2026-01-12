// src/lib/types/types.ts

export interface Category {
	id: number;
	title: string;
	slug: string;
	imageUrl: string;
}

export interface Product {
	id: number;
	title: string;
	price: number;
	categoryId: number;
	imageUrl: string;
	weight: string;
	minOrder: number;
	description: string;
	composition: string;
	storageLife: string;
	bestseller: boolean;
}

export interface PickupLocation {
	id: string;
	title: string;
	address: string;
	info: string;
}

export interface PaymentMethod {
	id: string;
	title: string;
	info: string;
}

export interface DeliveryType {
	id: string;
	title: string;
	shippingMethod: string;
	amount: number;
	minAmount: number;
	freeShippingThreshold: number;
	info: string;
}

export interface CheckoutConfig {
	pickupLocations: PickupLocation[]; // Точки самовывоза.
	paymentMethods: PaymentMethod[]; // Способы оплаты.
	deliveryTypes: DeliveryType[]; // Способы доставки.
}

export interface CustomerLocation {
	id: string;
	title: string;
	address: string;
	phone: string;
	instagram: string;
	availableDays: number[];
}

export interface LegalEntity {
	id: string;
	title: string;
	phone: string;
	taxId: string;
	discount: number;
	bankAccount: string;
	bankName: string;
	bankCode: string;
	customerLocations: CustomerLocation[];
}

export interface OrderProduct {
	id: number;
	title: string;
	quantity: number;
	price: number;
	amount: number;
}

export interface Order {
	id: string;
	date: string;
	customer: string;
	location: string;
	deliveryType: string;
	paymentMethod: string;
	total: number;
	deliveryAmount: number;
	note: string;
	products: OrderProduct[];
}

export interface Customer {
	name: string;
	phone: string;
	legalEntities: LegalEntity[]; // Контрагенты
	orders: Order[];
}

export interface ApiData {
	categories: Category[];
	products: Product[];
	customer: Customer;
	checkoutConfig: CheckoutConfig;
}

export interface ShopDataClient extends ApiData {
	apiURL: string;
	sessionId?: string; // sessionId может быть null/undefined, если он не найден
}

export interface LayoutData {
	shopData: ShopDataClient;
	isMobile: boolean;
}

export interface CartItem {
	id: number;
	price: number;
	quantity: number;
}

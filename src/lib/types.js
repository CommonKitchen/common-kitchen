/**
 * @typedef {object} Category
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} imageUrl
 */

/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} title
 * @property {number} price
 * @property {number} categoryId
 * @property {string} imageUrl
 * @property {string} weight
 * @property {number} minOrder
 * @property {string} description
 * @property {string} composition
 * @property {string} storageLife
 * @property {boolean} bestseller
 */

/**
 * @typedef {object} CartItem
 * @property {number} id - ID товара.
 * @property {number} price - Цена за единицу.
 * @property {number} quantity - Количество в корзине.
 */

/**
 * @typedef {object} PickupLocation
 * @property {string} id
 * @property {string} label
 * @property {string} address
 */

/**
 * @typedef {object} PaymentMethod
 * @property {string} id Уникальный идентификатор способа оплаты (e.g., 'card', 'cash').
 * @property {string} label Читабельное название способа оплаты (e.g., 'Банковская карта').
 */

/**
 * @typedef {object} DeliveryType
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {object} CheckoutConfig
 * @property {number} minAmount Сумма минимального заказа.
 * @property {number} shippingAmount Сумма за доставку.
 * @property {number} freeShippingAmount Сумма, начиная с которой доставка бесплатна.
 * @property {PickupLocation[]} pickupLocations Точки самовывоза.
 * @property {PaymentMethod[]} paymentMethods Способы оплаты.
 * @property {DeliveryType[]} deliveryTypes Способы доставки.
 */

/**
 * @typedef {object} ShopData
 * @property {Category[]} categories
 * @property {Product[]} products
 * @property {CheckoutConfig} checkoutConfig
 */

/**
 * @typedef {object} LayoutData
 * @property {ShopData} shopData
 */

export default {};

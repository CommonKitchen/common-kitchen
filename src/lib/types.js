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
 * @typedef {object} CheckoutConfig
 * @property {PickupLocation[]} pickupLocations Точки самовывоза.
 * @property {PaymentMethod[]} paymentMethods Способы оплаты.
 * @property {DeliveryType[]} deliveryTypes Способы доставки.
 */

/**
 * @typedef {object} Customer
 * @property {string} name
 * @property {string} phone
 * @property {legalEntity[]} legalEntities Контрагенты
 * @property {Order[]} orders
 */

/**
 * @typedef {object} legalEntity
 * @property {string} id
 * @property {string} title
 * @property {string} phone
 * @property {string} taxId
 * @property {CustomerLocation[]} customerLocations
 */

/**
 * @typedef {object} CustomerLocation
 * @property {string} id
 * @property {string} title
 * @property {string} address
 * @property {string} phone
 * @property {string} instagram
 * @property {number[]} availableDays
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
 * @property {string} title
 * @property {string} address
 * @property {string} info
 */

/**
 * @typedef {object} PaymentMethod
 * @property {string} id
 * @property {string} title
 * @property {string} info
 */

/**
 * @typedef {object} DeliveryType
 * @property {string} id
 * @property {string} title
 * @property {string} shippingMethod
 * @property {number} amount
 * @property {number} minAmount
 * @property {number} freeShippingThreshold
 * @property {string} info
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

/**
 * @typedef {object} OrderProduct
 * @property {number} id
 * @property {string} title
 * @property {number} quantity
 * @property {number} price
 * @property {number} amount
 * @property {number} discount
 * @property {number} discountedAmount
 */

/**
 * @typedef {object} Order
 * @property {number} id
 * @property {string} date
 * @property {string} customer
 * @property {string} location
 * @property {string} deliveryType
 * @property {string} paymentMethod
 * @property {number} total
 * @property {number} deliveryAmount
 * @property {string} note
 * @property {OrderProduct[]} products
 */

export default {};

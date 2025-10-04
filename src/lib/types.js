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
 */

/**
 * @typedef {object} Bestsellers
 * @property {number} id
 */

/**
 * @typedef {object} ShopData
 * @property {Category[]} categories
 * @property {Product[]} products
 * @property {Bestsellers[]} bestsellers
 */

/**
 * @typedef {object} LayoutData
 * @property {ShopData} shopData
 */

export default {};

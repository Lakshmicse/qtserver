const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
// productService.js
const { Cart, Product } = require('../models');
const tokenService = require('./token.service')


/**
 * Create a new cart item
 * @param {Object} cartData
 * @returns {Promise<Cart>}
 */
const createCart = async (req) => {
  const cartData = req.body;
  const user = req.user;

  const productItem = await Product.findOne({ title: cartData.product.title });

  if (!productItem) {
    throw new Error('Product not found');
  }

  const product = cartData.product;

  console.log(cartData.quantity);

  // Check if the product is already in the user's cart
  let cartItem = await Cart.findOne({ 
    product: product.id, 
    user: user.id 
  });

  if (cartItem) {
    // Product already exists in the cart, increase the count
    cartItem.count += cartData.quantity; // Or any other logic for increment
  } else {
    // Product does not exist in the cart, create a new cart item
    cartItem = new Cart({
      title: cartData.product.title,
      product: cartData.product.id,
      user: user.id,
      mrp: product.mrp,
      discount: product.discount,
      brand: product.brand.id,
      // image: product.images.length > 0 ? product.images[0].url : '',
      count: cartData.quantity // Use the count from the request
    });
  }

  await cartItem.save();
  return cartItem;
};


/**
 * Get cart items with pagination
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryCarts = async (filter, options) => {
  const cart = await Cart.paginate(filter, options);
  return cart;
};

/**
 * Get cart item by id
 * @param {ObjectId} cartId
 * @returns {Promise<Cart>}
 */
const getCartById = async (cartId) => {
  const cart = await Cart.findById(cartId);
  return cart;
};

/**
 * Update cart item by id
 * @param {ObjectId} cartId
 * @param {Object} updateBody
 * @returns {Promise<Cart>}
 */
const updateCartById = async (cartId, updateBody) => {

  console.log(updateBody);
  let cartItem = await Cart.findById(cartId);
  cartItem.count = updateBody.count;

  $result = await cartItem.save();
  return cartItem;
 
};

/**
 * Delete cart item by id
 * @param {ObjectId} cartId
 * @returns {Promise<Cart>}
 */
const deleteCartById = async (cartId) => {
  const cart = await Cart.findByIdAndDelete(cartId);
  return cart;
};

module.exports = {
  createCart,
  queryCarts,
  getCartById,
  updateCartById,
  deleteCartById,
};

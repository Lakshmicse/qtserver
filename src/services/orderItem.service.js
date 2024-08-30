const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
// OrderItem Service.js
const { OrderItem, Order, Product } = require('../models');

/**
 * Query for OrderItems
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrderItems = async (filter, options) => {
  const orderItems = await OrderItem.paginate(filter, options);
  return orderItems;
};

// Create a new order item
const createOrderItem = async (orderItemData) => {
  const { orderId, productId, quantity, unitPrice } = orderItemData;

  // Calculate total price
  const totalPrice = quantity * unitPrice;

  const orderItemPayload = {
    orderId,
    productId,
    quantity,
    unitPrice,
    totalPrice
  };

  const orderItem = new OrderItem(orderItemPayload);

  try {
    const result = await orderItem.save();
    return result;
  } catch (e) {
    console.log(e);
    throw new Error('Error creating order item');
  }
};

// Get an order item by ID
const getOrderItemById = async (orderItemId) => {
  return await OrderItem.findById(orderItemId)
    .populate('productId');
};

// Update an order item by ID
const updateOrderItemById = async (orderItemId, updateData) => {
  const { quantity, unitPrice, ...rest } = updateData;

  // Calculate new total price
  const totalPrice = quantity * unitPrice;

  const updatedOrderItem = await OrderItem.findByIdAndUpdate(orderItemId, {
    ...rest,
    quantity,
    unitPrice,
    totalPrice,
    updatedAt: new Date()
  }, { new: true });

  return updatedOrderItem;
};

// Delete an order item by ID
const deleteOrderItemById = async (orderItemId) => {
  await OrderItem.findByIdAndDelete(orderItemId);
  return { message: 'Order item deleted successfully' };
};

// Get all order items
const getAllOrderItems = async () => {
  return await OrderItem.find()
    .populate('productId');
};

module.exports = {
  createOrderItem,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
  getAllOrderItems,
  queryOrderItems
};

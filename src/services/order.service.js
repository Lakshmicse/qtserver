const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
// productService.js
const { Order, OrderItem, Customer, Payment, Address, Cart, Product } = require('../models');
const { addressService } = require("../services")

/**
 * Query for Orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  try {
    const orders = await Order.paginate(filter, options);
    return orders;
  } catch (error) {
    console.error('Error querying orders:', error);
    throw new Error('Error querying orders');
  }
};


// Create a new order
const createOrder = async (orderData) => {
  const { customerId, items, shippingAddress, paymentMethod, ...rest } = orderData;

  // Create Order
  const orderPayload = {
    customerId,
    shippingAddress: shippingAddress, // Assuming it's an Address ObjectID
    paymentMethod,
    ...rest,
    orderDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const order = new Order(orderPayload);

  // Add Order Items
  const orderItems = items.map(item => ({
    orderId: order._id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice
  }));
  
  await OrderItem.insertMany(orderItems);

  try {
    const result = await order.save();
    return result;
  } catch (e) {
    console.log(e);
    throw new Error('Error creating order');
  }
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate('shippingAddress')
    .populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product', // Ensure the correct model name is used here
      }
    });
};



// Update an order by ID
const updateOrderById = async (orderId, updateData) => {
  const { items, ...rest } = updateData;

  // Update Order
  const updatedOrder = await Order.findByIdAndUpdate(orderId, {
    ...rest,
    updatedAt: new Date()
  }, { new: true });

  // Handle Order Items
  if (items) {
    // Optionally, clear existing items if you want to replace them
    await OrderItem.deleteMany({ orderId });

    const newOrderItems = items.map(item => ({
      orderId: updatedOrder._id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }));
    
    await OrderItem.insertMany(newOrderItems);
  }

  return updatedOrder;
};

// Delete an order by ID
const deleteOrderById = async (orderId) => {
  await Order.findByIdAndDelete(orderId);
  await OrderItem.deleteMany({ orderId });
  return { message: 'Order deleted successfully' };
};
/**
 * Get cart items for a specific user ID.
 * @param {mongoose.Types.ObjectId} userId - The user ID to query.
 * @returns {Promise<Array>} - A promise that resolves to an array of cart items.
 */
const getCartItemsByUserId = async (userId) => {
  try {
    // Ensure the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    // Query the database for cart items by user ID
    const cartItems = await Cart.find({ user: userId });

    return cartItems;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};
const placeOrder = async (req) => {

  const selectedAddress = req.body.selectedAddress;
  const cartItems = req.body.cartItems
  const user = req.user;
  // Fetch cart items for the user
 

  // Validate items and calculate total amount
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cartItems) {
  

    const orderItem = new OrderItem({
      productVariantId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      customizationId : item.customizationId
    });

    totalAmount += orderItem.totalPrice;
    await orderItem.save();
    orderItems.push(orderItem._id);
  }

  // const shippingAddress = await addressService.getShippingAddressesByUserId(user.id);

  const shippingAddress = await Address.findById(selectedAddress.id);
  

  if (cartItems.length === 0) {
    throw new Error('Cart is empty');
  }


  const payload = {
    userId: user.id,
    items: orderItems,
    totalAmount,
    shippingAddress : shippingAddress.id
  }

  // Create a new order
  const order = new Order(payload);

  
  await order.save();

 
  return order;
};

// Get all orders
const getAllOrders = async () => {
  return await Order.find()
    .populate('customerId shippingAddress')
    .populate({ path: 'items', populate: { path: 'productId' } });
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getAllOrders,
  queryOrders,
  placeOrder
};

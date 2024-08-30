const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService } = require('../services');

const create = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.createOrderItem(req.body);
  res.status(httpStatus.CREATED).send(orderItem);
});

const list = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['orderId', 'productId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderItemService.queryOrderItems(filter, options);
  res.send(result);
});

const get = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.getOrderItemById(req.params.orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }
  res.send(orderItem);
});

const update = catchAsync(async (req, res) => {
  const orderItem = await orderItemService.updateOrderItemById(req.params.orderItemId, req.body);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Item not found');
  }
  res.send(orderItem);
});

const deleteById = catchAsync(async (req, res) => {
  await orderItemService.deleteOrderItemById(req.params.orderItemId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  list,
  get,
  update,
  deleteById,
};

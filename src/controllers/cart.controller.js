const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const create = catchAsync(async (req, res) => {

  const cartItem = await cartService.createCart(req);

  res.status(httpStatus.CREATED).send(cartItem);
  
});

const list = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await cartService.queryCarts(filter, options);
  res.send(result);
});

const get = catchAsync(async (req, res) => {

  const cartItem = await cartService.getCartById(req.params.cartItemId);

  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.send(cartItem);
});

const update = catchAsync(async (req, res) => {
  const Cart = await cartService.updateCartById(req.params.cartId, req.body);

  const result = await cartService.queryCarts({}, {});
  res.send(result);
});

const deleteById = catchAsync(async (req, res) => {
  await cartService.deleteCartById(req.params.cartId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  list,
  get,
  update,
  deleteById,
};

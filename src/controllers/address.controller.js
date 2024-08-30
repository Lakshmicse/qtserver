const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const addressService = require('../services/address.service');

/**
 * Create a new address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createAddress = catchAsync(async (req, res) => {
  
  const address = await addressService.createAddress(req);
  res.status(httpStatus.CREATED).send(address);
});

/**
 * Get all addresses with optional filters and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const listAddresses = catchAsync(async (req, res) => {
  const user = req.user;
  const filter = pick(req.query, ['userId', 'addressType']);
  console.log(filter);
  filter.userId = user.id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await addressService.queryAddresses(filter, options);
  res.send(result);
});

/**
 * Get an address by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getAddressById = catchAsync(async (req, res) => {
  const { addressId } = req.params;
  const address = await addressService.getAddressById(addressId);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  res.send(address);
});

/**
 * Update an address by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateAddressById = catchAsync(async (req, res) => {
  const { addressId } = req.params;
  const updateData = req.body;
  const address = await addressService.updateAddressById(addressId, updateData);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  res.send(address);
});

/**
 * Delete an address by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteAddressById = catchAsync(async (req, res) => {
  const { addressId } = req.params;
  await addressService.deleteAddressById(addressId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get all addresses for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getAddressesByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const addresses = await addressService.getAddressesByUserId(userId);
  if (!addresses.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No addresses found for this user');
  }
  res.send(addresses);
});

module.exports = {
  createAddress,
  listAddresses,
  getAddressById,
  updateAddressById,
  deleteAddressById,
  getAddressesByUserId
};

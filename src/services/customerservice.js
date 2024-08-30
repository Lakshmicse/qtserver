require('exceljs');
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');require('exceljs');

/**
 * Query for Driver
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCustomerDriver = async (filter, options) => {
  const CustomersDrivers = await User.paginate(filter, options);
  return CustomersDrivers;
};

/**
 * Create a Driver
 * @param {Object}  CustomerDriverBody
 * @returns {Promise<Driver>}
 */
const createCustomerDriver = async (CustomerDriverBody) => {
  return User.create(CustomerDriverBody);
};

/**
 * Get Driver by id
 * @param {ObjectId} id
 * @returns {Promise<Driver>}
 */

const getCustomerDriverById = async (id) => {
  return User.findById(id);
};

/**
 * Update PF NSDL by id
 * @param {ObjectId} CustomerDriverId
 * @param {Object} CustomerupdateBody
 * @returns {Promise<Driver>}
 */
const updateCustomerDriverById = async (CustomerDriverId, CustomerupdateBody) => {
  const DriversItem = await getCustomerDriverById(CustomerDriverId);
  if (!DriversItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer Driver not fount');
  }

  Object.assign(DriversItem, updateBody);
  await DriversItem.save();
  return DriversItem;
};

/**
 * Delete Driver by id
 * @param {ObjectId} CustomerDriverId
 * @returns {Promise<Driver>}
 */
const deleteCustomerDriverById = async (CustomerDriverId) => {
  const CustomerDriversItem = await getCustomerDriverById(CustomerDriverId);
  if (!CustomerDriversItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not fount');
  }
  await CustomerDriversItem.remove();
  return CustomerDriversItem;
};

module.exports = {
  createCustomerDriver,
  queryCustomerDriver,
  getCustomerDriverById,
  updateCustomerDriverById,
  deleteCustomerDriverById,
};

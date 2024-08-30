require('exceljs');
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for Driver
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDriver = async (filter, options) => {
  const Drivers = await User.paginate(filter, options);
  return Drivers;
};

/**
 * Create a Driver
 * @param {Object}  DriverBody
 * @returns {Promise<Driver>}
 */
const createDriver = async (DriverBody) => {
  return User.create(DriverBody);
};

/**
 * Get Driver by id
 * @param {ObjectId} id
 * @returns {Promise<Driver>}
 */

const getDriverById = async (id) => {
  return User.findById(id);
};

/**
 * Update PF NSDL by id
 * @param {ObjectId} DriverId
 * @param {Object} updateBody
 * @returns {Promise<Driver>}
 */
const updateDriverById = async (DriverId, updateBody) => {
  const DriversItem = await getDriverById(DriverId);
  if (!DriversItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not fount');
  }

  Object.assign(DriversItem, updateBody);
  await DriversItem.save();
  return DriversItem;
};

/**
 * Delete Driver by id
 * @param {ObjectId} DriverId
 * @returns {Promise<Driver>}
 */
const deleteDriverById = async (DriverId) => {
  const DriversItem = await getDriverById(DriverId);
  if (!DriversItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not fount');
  }
  await DriversItem.remove();
  return DriversItem;
};

module.exports = {
  createDriver,
  queryDriver,
  getDriverById,
  updateDriverById,
  deleteDriverById,
};

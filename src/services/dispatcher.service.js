require('exceljs');
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for Dispatcher
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDispatcher = async (filter, options) => {
  const Dispatchers = await User.paginate(filter, options);
  return Dispatchers;
};

/**
 * Create a Dispatcher
 * @param {Object}  DispatcherBody
 * @returns {Promise<Dispatcher>}
 */
const createDispatcher = async (DispatcherBody) => {
  return User.create(DispatcherBody);
};

/**
 * Get Dispatcher by id
 * @param {ObjectId} id
 * @returns {Promise<Dispatcher>}
 */

const getDispatcherById = async (id) => {
  return User.findById(id);
};

/**
 * Update PF NSDL by id
 * @param {ObjectId} DispatcherId
 * @param {Object} updateBody
 * @returns {Promise<Dispatcher>}
 */
const updateDispatcherById = async (DispatcherId, updateBody) => {
  const DispatchersItem = await getDispatcherById(DispatcherId);
  if (!DispatchersItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dispatcher not fount');
  }

  Object.assign(DispatchersItem, updateBody);
  await DispatchersItem.save();
  return DispatchersItem;
};

/**
 * Delete Dispatcher by id
 * @param {ObjectId} DispatcherId
 * @returns {Promise<Dispatcher>}
 */
const deleteDispatcherById = async (DispatcherId) => {
  const DispatchersItem = await getDispatcherById(DispatcherId);
  if (!DispatchersItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dispatcher not fount');
  }
  await DispatchersItem.remove();
  return DispatchersItem;
};

module.exports = {
  createDispatcher,
  queryDispatcher,
  getDispatcherById,
  updateDispatcherById,
  deleteDispatcherById,
};

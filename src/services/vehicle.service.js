require('exceljs');
const httpStatus = require('http-status');
const { Vehicle } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for Vehicle
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVehicle = async (filter, options) => {
  const Vehicles = await Vehicle.paginate(filter, options);
  return Vehicles;
};

/**
 * Create a Vehicle
 * @param {Object}  VehicleBody
 * @returns {Promise<Vehicle>}
 */
const createVehicle = async (VehicleBody) => {
  return Vehicle.create(VehicleBody);
};

/**
 * Get Vehicle by id
 * @param {ObjectId} id
 * @returns {Promise<Vehicle>}
 */

const getVehicleById = async (id) => {
  return Vehicle.findById(id);
};

/**
 * Update PF NSDL by id
 * @param {ObjectId} VehicleId
 * @param {Object} updateBody
 * @returns {Promise<Vehicle>}
 */
const updateVehicleById = async (VehicleId, updateBody) => {
  const VehiclesItem = await getVehicleById(VehicleId);
  if (!VehiclesItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not fount');
  }

  Object.assign(VehiclesItem, updateBody);
  await VehiclesItem.save();
  return VehiclesItem;
};

/**
 * Delete Vehicle by id
 * @param {ObjectId} VehicleId
 * @returns {Promise<Vehicle>}
 */
const deleteVehicleById = async (VehicleId) => {
  const VehiclesItem = await getVehicleById(VehicleId);
  if (!VehiclesItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not fount');
  }
  await VehiclesItem.remove();
  return VehiclesItem;
};

module.exports = {
  createVehicle,
  queryVehicle,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};

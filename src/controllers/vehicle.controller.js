const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vehicleService } = require('../services');

const createVehicle = catchAsync(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(httpStatus.CREATED).send(vehicle);
});

const getVehicleList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await vehicleService.queryVehicle(filter, options);
  res.send(result);
});

const getVehicle = catchAsync(async (req, res) => {
  const Vehicle = await vehicleService.getVehicleById(req.params.VehicleId);
  if (!Vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client Payroll RPA  Detail not found');
  }
  res.send(Vehicle);
});

const updateVehicle = catchAsync(async (req, res) => {
  const Vehicle = await vehicleService.updateVehicleById(req.params.VehicleId, req.body);
  res.send(Vehicle);
});

const deleteVehicle = catchAsync(async (req, res) => {
  await vehicleService.deleteVehicleById(req.params.VehicleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createVehicle,
  getVehicleList,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};

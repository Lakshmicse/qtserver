const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { driverService } = require('../services');

const createDriver = catchAsync(async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  res.status(httpStatus.CREATED).send(driver);
});

const getDriverList = catchAsync(async (req, res) => {
  const filter = { role: 'driver' }; // pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await driverService.queryDriver(filter, options);
  res.send(result);
});

const getDriver = catchAsync(async (req, res) => {
  const Driver = await driverService.getDriverById(req.params.DriverId);
  if (!Driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client Payroll RPA  Detail not found');
  }
  res.send(Driver);
});

const updateDriver = catchAsync(async (req, res) => {
  const Driver = await driverService.updateDriverById(req.params.DriverId, req.body);
  res.send(Driver);
});

const deleteDriver = catchAsync(async (req, res) => {
  await driverService.deleteDriverById(req.params.DriverId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDriver,
  getDriverList,
  getDriver,
  updateDriver,
  deleteDriver,
};

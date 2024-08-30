const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { customerservice } = require('../services');

const createcusDriver = catchAsync(async (req, res) => {
  const driver = await customerservice.createCustomerDriver(req.body);
  res.status(httpStatus.CREATED).send(driver);
});

const getcusDriverList = catchAsync(async (req, res) => {
  const filter = { role: 'driver' }; // pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await customerservice.queryCustomerDriver(filter, options);
  res.send(result);
});

const getcusDriver = catchAsync(async (req, res) => {
  const Driver = await customerservice.getCustomerDriverById(req.params.DriverId);
  if (!Driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  res.send(Driver);
});

const updatecusDriver = catchAsync(async (req, res) => {
  const Driver = await customerservice.updateCustomerDriverById(req.params.DriverId, req.body);
  res.send(Driver);
});

const deletecusDriver = catchAsync(async (req, res) => {
  await customerservice.deleteCustomerDriverById(req.params.DriverId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createcusDriver,
  getcusDriverList,
  getcusDriver,
  updatecusDriver,
  deletecusDriver,
};

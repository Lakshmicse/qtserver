const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { customizationService } = require('../services');

const create = catchAsync(async (req, res) => {
  const user = req.user;

  console.log(req.files?.shoulderLogo[0].filename);
  const payload = req.body;
  payload.userId = user._id; // add user id to payload
  payload.frontLogo = req.files?.frontLogo[0].filename;
  payload.shoulderLogo = req.files?.shoulderLogo[0].filename;
  payload.backLogo = req.files?.backLogo[0].filename;
  // console.log(payload);
  const customization = await customizationService.createCustomization(req.body);
  res.status(httpStatus.CREATED).send(customization);
});

const getcusDriverList = catchAsync(async (req, res) => {
  const filter = { role: 'driver' }; // pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await customizationService.query(filter, options);
  res.send(result);
});

const get = catchAsync(async (req, res) => {
  const customization = await customizationService.getById(req.params.customizationId);
  if (!customization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'customization not found');
  }
  res.send(customization);
});

const update = catchAsync(async (req, res) => {
  const customization = await customizationService.update(req.params.customizationId, req.body);
  res.send(customization);
});

const deleteById = catchAsync(async (req, res) => {
  await customizationService.deleteCustomerDriverById(req.params.customizationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  get,
  update,
  deleteById,
};

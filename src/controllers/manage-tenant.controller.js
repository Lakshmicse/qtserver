const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { manageTenantService } = require('../services');

const createManageTenant = catchAsync(async (req, res) => {
  const manageTenant = await manageTenantService.createManageTenant(req.body);
  res.status(httpStatus.CREATED).send(manageTenant);
});

const getManageTenantList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manageTenantService.queryManageTenant(filter, options);
  res.send(result);
});

const getManageTenant = catchAsync(async (req, res) => {
  const manageTenant = await manageTenantService.getManageTenantById(req.params.tenentId);
  if (!manageTenant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tenant OR User  not found');
  }
  res.send(manageTenant);
});
const getManageTenantbyUser = catchAsync(async (req, res) => {
  const manageTenant = await manageTenantService.getManageTenantByuser(req.params.tenentId);
  if (!manageTenant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tenant OR User  not found');
  }
  res.send(manageTenant);
});

const updateManageTenant = catchAsync(async (req, res) => {
  const manageTenant = await manageTenantService.updateManageTenantById(req.params.tenentId, req.body);
  res.send(manageTenant);
});

const deleteManageTenant = catchAsync(async (req, res) => {
  await manageTenantService.deleteManageTenantById(req.params.tenentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createManageTenant,
  getManageTenantList,
  getManageTenant,
  updateManageTenant,
  deleteManageTenant,
  getManageTenantbyUser,
};

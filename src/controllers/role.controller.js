const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');

const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getRoles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let result;
  if (filter.role) {
    result = await roleService.queryUserbyRole(filter, options);
  } else {
    result = await roleService.queryRoles(filter, options);
  }
  res.send(result);
});
const getRolesByRole = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roleService.queryUserbyRole(filter, options);
  res.send(result);
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  res.send(role);
});
const checkRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleByEmail(req.params.roleEmail);
  if (!role) {
    // throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    res.send({ success: 'role does not exits' });
  } else {
    // res.send(role);
    res.send({ error: 'role already exits' });
  }
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.send(role);
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRoleById(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getroleBySearch = catchAsync(async (req, res) => {
  const resignation = await roleService.getRoleBySearch(req.params.searchId);
  if (!resignation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resignation not found ');
  }
  res.send(resignation);
});
module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  checkRole,
  getroleBySearch,
  getRolesByRole,
};

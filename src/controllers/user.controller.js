const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let result;
  if (filter.role) {
    result = await userService.queryUserbyRole(filter, options);
  } else {
    result = await userService.queryUsers(filter, options);
  }
  res.send(result);
});
const getUsersByRole = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUserbyRole(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
const checkUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.params.userEmail);
  if (!user) {
    // throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    res.send({ success: 'user does not exits' });
  } else {
    // res.send(user);
    res.send({ error: 'user already exits' });
  }
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  if (user) {
    res.status(httpStatus.OK).send(user);
  } else {
    res.status(httpStatus.NOT_FOUND).send({ error: 'User not found' });
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.userId);
  if (user) {
    res.status(httpStatus.NO_CONTENT).send();
  } else {
    res.status(httpStatus.NOT_FOUND).send({ error: 'User not found' });
  }
});
const getuserBySearch = catchAsync(async (req, res) => {
  const resignation = await userService.getUserBySearch(req.params.searchId);
  if (!resignation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resignation not found ');
  }
  res.send(resignation);
});
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  checkUser,
  getuserBySearch,
  getUsersByRole,
};

/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { OTP } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} otpBody
 * @returns {Promise<User>}
 */
const createUser = async (otpBody) => {
  if (await OTP.isEmailTaken(otpBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return OTP.create(otpBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await OTP.paginate(filter, options);
  return users;
};
const queryUserbyRole = async (filter, options) => {
  const statusArray = filter.role.split(',');

  const orArray = [];

  statusArray.forEach((q) => {
    orArray.push({ role: q });
  });

  const statusquery = {
    $or: orArray,
  };
  const result = await OTP.paginate(statusquery, options);
  return result;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return OTP.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return OTP.findOne({ email });
};
const getUserBySearch = async (key) => {
  const usersearch = await OTP.find({
    $or: [{ email: { $regex: key, $options: 'i' } }, { role: { $regex: key, $options: 'i' } }],
  });
  if (!usersearch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Repayments not found');
  }
  return usersearch;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await OTP.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  getUserBySearch,
  deleteUserById,
  queryUserbyRole,
};

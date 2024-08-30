const httpStatus = require('http-status');
const { Role } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a role
 * @param {Object} roleBody
 * @returns {Promise<Role>}
 */
const createRole = async (roleBody) => {
  return Role.create(roleBody);
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  const roles = await Role.paginate(filter, options);
  return roles;
};
const queryRolebyRole = async (filter, options) => {
  const statusArray = filter.role.split(',');

  const orArray = [];

  statusArray.forEach((q) => {
    orArray.push({ role: q });
  });

  const statusquery = {
    $or: orArray,
  };
  const result = await Role.paginate(statusquery, options);
  return result;
};

/**
 * Get role by id
 * @param {ObjectId} id
 * @returns {Promise<Role>}
 */
const getRoleById = async (id) => {
  return Role.findById(id);
};

/**
 * Get role by email
 * @param {string} email
 * @returns {Promise<Role>}
 */
const getRoleByEmail = async (email) => {
  return Role.findOne({ email });
};
const getRoleBySearch = async (key) => {
  const rolesearch = await Role.find({
    $or: [{ email: { $regex: key, $options: 'i' } }, { role: { $regex: key, $options: 'i' } }],
  });
  if (!rolesearch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Repayments not found');
  }
  return rolesearch;
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by id
 * @param {ObjectId} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  await role.remove();
  return role;
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleByEmail,
  updateRoleById,
  getRoleBySearch,
  deleteRoleById,
  queryRolebyRole,
};

require('exceljs');
const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const { ManageTenant, Company, Tenant } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for Client Esi Detail
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryManageTenant = async (filter, options) => {
  const restult = await ManageTenant.aggregate([
    {
      $lookup: {
        from: 'companies',
        localField: 'ClientId',
        foreignField: '_id',
        as: 'managed_tenent',
      },
    },
  ]);
  const manageTenant = await ManageTenant.paginate(filter, options);
  // eslint-disable-next-line no-console
  console.log(manageTenant);
  return restult;
};

/**
 * Create a ManageTenant
 * @param {Object}  ManageTenantBody
 * @returns {Promise<Company>}
 */
const createManageTenant = async (ManageTenantBody) => {
  const company = await Company.findOne({ _id: ObjectId(ManageTenantBody.ClientId) });
  const formBody = ManageTenantBody;
  formBody.ClientId = ObjectId(company._id);
  const result = await ManageTenant.create(formBody);
  return result;
};

/**
 * Get ManageTenant by id
 * @param {ObjectId} id
 * @returns {Promise<ManageTenant>}
 */

const getManageTenantById = async (id) => {
  return ManageTenant.findById(id);
};

/**
 * Update Client Esi Detail by id
 * @param {ObjectId} ManageTenantId
 * @param {Object} updateBody
 * @returns {Promise<ManageTenant>}
 */
const updateManageTenantById = async (ManageTenantId, updateBody) => {
  const manageTenant = await getManageTenantById(ManageTenantId);
  if (!manageTenant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tenent OR Admin not found ');
  }

  Object.assign(manageTenant, updateBody);
  await ManageTenant.save();
  return manageTenant;
};

/**
 * Delete ManageTenant by id
 * @param {ObjectId} ManageTenantId
 * @returns {Promise<ManageTenant>}
 */
const deleteManageTenantById = async (ManageTenantId) => {
  const manageTenant = await getManageTenantById(ManageTenantId);
  if (!manageTenant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client Esi Detail not fount');
  }
  await ManageTenant.remove();
  return manageTenant;
};

const getClientIdFromDbString = async (dbString) => {
  const tenant = await Tenant.findOne({ dbURI: dbString });
  // findOne( { dbURI : "JUMBOTAIL_TECHNOLOGIES_PRIVATE_LIMITED"})
  return tenant.ClientId.toString();
};

module.exports = {
  createManageTenant,
  queryManageTenant,
  getClientIdFromDbString,
  getManageTenantById,
  updateManageTenantById,
  deleteManageTenantById,
};

require('exceljs');
const { AuditLog, Company } = require('../models');

/**
 * Query for Company
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAuditlog = async (filter, options) => {
  const auditlog = await AuditLog.paginate(filter, options);
  return auditlog;
};

/**
 * Create a Auditlog
 * @param {Object}  AuditlogBody
 * @returns {Promise<Company>}
 */
const createAuditlog = async (AuditlogBody) => {
  return Company.create(AuditlogBody);
};

/**
 * Get Auditlog by id
 * @param {ObjectId} id
 * @returns {Promise<AuditLog>}
 */

const getAuditlogById = async (id) => {
  return AuditLog.findById(id);
};

module.exports = {
  createAuditlog,
  queryAuditlog,
  getAuditlogById,
};

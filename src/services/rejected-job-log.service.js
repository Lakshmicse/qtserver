const httpStatus = require('http-status');
const { RejectedJobLog } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a rejectedJobLog
 * @param {Object} rejectedJobLogBody
 * @returns {Promise<RejectedJobLog>}
 */
const createRejectedJobLog = async (rejectedJobLogBody) => {
  return RejectedJobLog.create(rejectedJobLogBody);
};

/**
 * Query for rejectedJobLogs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRejectedJobLogs = async (filter, options) => {
  const rejectedJobLogs = await RejectedJobLog.paginate(filter, options);
  return rejectedJobLogs;
};
const queryRejectedJobLogbyRejectedJobLog = async (filter, options) => {
  const statusArray = filter.rejectedJobLog.split(',');

  const orArray = [];

  statusArray.forEach((q) => {
    orArray.push({ rejectedJobLog: q });
  });

  const statusquery = {
    $or: orArray,
  };
  const result = await RejectedJobLog.paginate(statusquery, options);
  return result;
};

/**
 * Get rejectedJobLog by id
 * @param {ObjectId} id
 * @returns {Promise<RejectedJobLog>}
 */
const getRejectedJobLogById = async (id) => {
  return RejectedJobLog.findById(id);
};

/**
 * Get rejectedJobLog by email
 * @param {string} email
 * @returns {Promise<RejectedJobLog>}
 */
const getRejectedJobLogByEmail = async (email) => {
  return RejectedJobLog.findOne({ email });
};
const getRejectedJobLogBySearch = async (key) => {
  const rejectedJobLogsearch = await RejectedJobLog.find({
    $or: [{ email: { $regex: key, $options: 'i' } }, { rejectedJobLog: { $regex: key, $options: 'i' } }],
  });
  if (!rejectedJobLogsearch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RejectedJobLog not found');
  }
  return rejectedJobLogsearch;
};

/**
 * Update rejectedJobLog by id
 * @param {ObjectId} rejectedJobLogId
 * @param {Object} updateBody
 * @returns {Promise<RejectedJobLog>}
 */
const updateRejectedJobLogById = async (rejectedJobLogId, updateBody) => {
  const rejectedJobLog = await getRejectedJobLogById(rejectedJobLogId);
  if (!rejectedJobLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RejectedJobLog not found');
  }

  Object.assign(rejectedJobLog, updateBody);
  await rejectedJobLog.save();
  return rejectedJobLog;
};

/**
 * Delete rejectedJobLog by id
 * @param {ObjectId} rejectedJobLogId
 * @returns {Promise<RejectedJobLog>}
 */
const deleteRejectedJobLogById = async (rejectedJobLogId) => {
  const rejectedJobLog = await getRejectedJobLogById(rejectedJobLogId);
  if (!rejectedJobLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RejectedJobLog not found');
  }
  await rejectedJobLog.remove();
  return rejectedJobLog;
};

module.exports = {
  createRejectedJobLog,
  queryRejectedJobLogs,
  getRejectedJobLogById,
  getRejectedJobLogByEmail,
  updateRejectedJobLogById,
  getRejectedJobLogBySearch,
  deleteRejectedJobLogById,
  queryRejectedJobLogbyRejectedJobLog,
};

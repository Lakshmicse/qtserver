/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Call } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for  Call
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const query = async (filter, options) => {
  // options.populate = 'driver';
  const options1 = Object.assign(options, {
    populate: 'driver,dispatcher', // Populate the 'driver' field
  });
  // return options1;

  const calls = await Call.paginate(filter, options1);
  return calls;
};

// eslint-disable-next-line no-unused-vars
async function countCallsByDay(filter, options, endDate) {
  try {
    const result = await Call.aggregate([
      {
        $match: {
          pickuptime: {
            $gte: new Date(filter.startDate), // Start of September
            $lt: new Date(filter.endDate), // Start of October
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$pickuptime' },
            month: { $month: '$pickuptime' },
            day: { $dayOfMonth: '$pickuptime' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
          count: 1,
        },
      },
      {
        $sort: {
          year: 1, // Sort by year in ascending order
          month: 1, // Sort by month in ascending order
          day: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function countCallsByMonth() {
  try {
    const result = await Call.aggregate([
      {
        $match: {
          pickuptime: {
            $gte: new Date('2023-01-01'), // Start of September
            $lt: new Date('2023-12-01'), // Start of October
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$pickuptime' },
            month: { $month: '$pickuptime' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
      {
        $sort: {
          year: 1, // Sort by year in ascending order
          month: 1, // Sort by month in ascending order
        },
      },
    ]);

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

// countCallsByMonth();

/**
 * Get Call by id
 * @param {ObjectId} id
 * @returns {Promise<Call>}
 */

const getCallById1 = async (id) => {
  return Call.findById(id);
};

/**
 * Get Call by id
 * @param {ObjectId} id
 * @returns {Promise<Call>}
 */

const getCallById = async (id) => {
  // Execute the aggregation
  const result = await Call.findById(id).populate('driver');
  return result;
};

/**
 * Create a Call
 * @param {Object}  CallBody
 * @returns {Promise<Company>}
 */
const createCall = async (CallBody) => {
  const payload = Object.assign(CallBody, {
    driver: mongoose.Types.ObjectId(CallBody.driver),
    dispatcher: mongoose.Types.ObjectId(CallBody.dispatcher),
  });
  // Other fields...
  return Call.create(CallBody);
};

/**
 * Update Call by id
 * @param {ObjectId} calenserId
 * @param {Object} updateBody
 * @returns {Promise<Call>}
 */
const updateCallById = async (CallId, updateBody) => {
  const call = await getCallById(CallId);
  if (!call) {
    return false;
  }

  Object.assign(call, updateBody);
  await call.save();
  return call;
};

/**
 * Delete Driver by id
 * @param {ObjectId} CallId
 * @returns {Promise<Driver>}
 */
const deleteCallById = async (CallId) => {
  const callItem = await getCallById(CallId);
  if (!callItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not fount');
  }
  await callItem.remove();
  return callItem;
};
/**
 * Update Call by id
 * @param {ObjectId} calenserId
 * @param {Object} updateBody
 * @returns {Promise<Call>}
 */
const updateCallCompanyId = async (CompanyId, updateBody) => {
  const updateQuery = { CompanyId, Year: updateBody.Year };
  const call = await Call.findOneAndUpdate(updateQuery, updateBody, { upsert: true, new: true });
  return call;
};

module.exports = {
  createCall,
  countCallsByDay,
  countCallsByMonth,
  query,
  getCallById,
  updateCallById,
  updateCallCompanyId,
  deleteCallById,
};

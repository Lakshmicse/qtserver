require('exceljs');
const { FormSelectOption } = require('../models');

/**
 * Query for Form Select Option
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFormSelectOption = async (filter) => {
  const reult = await FormSelectOption.findOne(filter);
  return reult;
};

/**
 * Create a FormSelectOption
 * @param {Object}  FormSelectOptionBody
 * @returns {Promise<Company>}
 */
const createFormSelectOption = async (FormSelectOptionBody) => {
  return FormSelectOption.create(FormSelectOptionBody);
};

/**
 * Get FormSelectOption by id
 * @param {ObjectId} id
 * @returns {Promise<FormSelectOption>}
 */

const getFormSelectOptionById = async (id) => {
  return FormSelectOption.findById(id);
};
const getDatesBetweenDates = (startDate, endDate) => {
  let dates = [];
  // to avoid modifying the original date
  const theDate = new Date(startDate);
  while (theDate < endDate) {
    const newDate = new Date(theDate);
    dates = [...dates, newDate.getDate()];
    theDate.setDate(theDate.getDate() + 1);
  }
  return dates;
};

module.exports = {
  createFormSelectOption,
  queryFormSelectOption,
  getFormSelectOptionById,
  getDatesBetweenDates,
};

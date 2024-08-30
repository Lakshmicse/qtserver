const { PayrollCalender } = require('../models');

/**
 * Query for Payroll Calender
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPayrollCalender = async (filter, options) => {
  const payrollCalenders = await PayrollCalender.paginate(filter, options);
  return payrollCalenders;
};

/**
 * Create a PayrollCalender
 * @param {Object}  PayrollCalenderBody
 * @returns {Promise<Company>}
 */
const createPayrollCalender = async (PayrollCalenderBody) => {
  return PayrollCalender.create(PayrollCalenderBody);
};

/**
 * Get PayrollCalender by id
 * @param {ObjectId} id
 * @returns {Promise<PayrollCalender>}
 */

const getPayrollCalenderById = async (id) => {
  return PayrollCalender.findById(id);
};
const getDatesBetweenDates = (startDate, endDate) => {
  let dates = [];
  // to avoid modifying the original date
  const theDate = new Date(startDate);
  while (theDate <= endDate) {
    const newDate = new Date(theDate);
    dates = [...dates, newDate.getDate()];
    theDate.setDate(theDate.getDate() + 1);
  }
  return dates;
};

/**
 * Update Calender by id
 * @param {ObjectId} calenserId
 * @param {Object} updateBody
 * @returns {Promise<Calender>}
 */
const updatePayrollCalenderById = async (calenderId, updateBody) => {
  const calender = await getPayrollCalenderById(calenderId);
  if (!calender) {
    return false;
  }

  Object.assign(calender, updateBody);
  await calender.save();
  return calender;
};

/**
 * Update Calender by id
 * @param {ObjectId} calenserId
 * @param {Object} updateBody
 * @returns {Promise<Calender>}
 */
const updatePayrollCalenderCompanyId = async (CompanyId, updateBody) => {
  const updateQuery = { CompanyId, Year: updateBody.Year };
  const calender = await PayrollCalender.findOneAndUpdate(updateQuery, updateBody, { upsert: true, new: true });
  return calender;
};
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const isLockPeriod = async (ClientId) => {
  const today = new Date();
  const month = parseInt(today.getMonth(), 10);
  const monthName = monthNames[month];
  const currentDate = parseInt(today.getDate(), 10);
  // const monthName = monthNames[month];
  const year = today.getFullYear();

  const query = { CompanyId: ClientId, Year: year };
  const currentCalender = await PayrollCalender.findOne(query);
  const calenderMonth = currentCalender[monthName];
  const lockStartDate = calenderMonth.lock_date_start;
  const lockEndDate = calenderMonth.lock_date_end;
  const threedaysFromNow = new Date(today);
  threedaysFromNow.setDate(threedaysFromNow.getDate() + 3);

  const dates = getDatesBetweenDates(lockStartDate, lockEndDate);
  let LockPeriod = true;
  if (dates.indexOf(currentDate) === -1) {
    LockPeriod = false;
  }

  return LockPeriod;
};

module.exports = {
  createPayrollCalender,
  queryPayrollCalender,
  getPayrollCalenderById,
  getDatesBetweenDates,
  updatePayrollCalenderById,
  updatePayrollCalenderCompanyId,
  monthNames,
  isLockPeriod,
};

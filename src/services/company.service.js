const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const { Company, Tenant, PayrollCalender } = require('../models');
const ApiError = require('../utils/ApiError');

const { userService } = require('./index');

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

const today = new Date();
const cMonth = today.getMonth();
const cYear = today.getFullYear();
// eslint-disable-next-line no-unused-vars
const month = monthNames[cMonth];
/**
 * Create a Company
 * @param {Object} companyBody
 * @returns {Promise<Company>}
 */
const createCompany = async (companyBody) => {
  try {
    const company = await Company.create(companyBody);
    let companyName = company.ClientName; // .replaceAll(' ', '_');
    companyName = companyName.replace('.', '');
    const companyId = company.id;
    const onjId = ObjectId(companyId);
    const tenantDetail = { ClientId: onjId, dbURI: companyName.replace(/\s+/g, '_') };
    await Tenant.create(tenantDetail);
    return company;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.info(err);
    return { err };
  }
};

/**
 * Query for Company
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCompany = async (filter, options) => {
  const companies = await Company.paginate(filter, options);
  return companies;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Company>}
 */
const getCompanyById = async (id) => {
  return Company.findById(id);
};

const getCompanyBySearch = async (id) => {
  const company = await Company.find({
    $or: [{ ClientName: { $regex: id, $options: 'i' } }, { GSTN: { $regex: id, $options: 'i' } }],
  });
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  return company;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Company>}
 */
const getCompanyByEmail = async (email) => {
  return Company.findOne({ email });
};

/**
 * Update Company by id
 * @param {ObjectId} companyId
 * @param {Object} updateBody
 * @returns {Promise<Company>}
 */
const updateCompanyById = async (companyId, updateBody) => {
  // eslint-disable-next-line camelcase
  const { HrProcessorEmail, HrApprover } = updateBody;
  const company = await getCompanyById(companyId);

  let newUserStatus = null;
  let newUserStatus1 = null;
  // eslint-disable-next-line camelcase
  if (HrProcessorEmail !== undefined) {
    const newHrProcessor = {
      name: 'Hr Processor',
      email: HrProcessorEmail,
      password: 'admin123',
      role: 'hradmin',
      isEmailVerified: true,
      companyId,
    };

    // eslint-disable-next-line no-unused-vars

    if (!userService.getUserByEmail(newHrProcessor.email)) {
      newUserStatus = await userService.createUser(newHrProcessor);
    }
  }

  if (HrApprover !== undefined) {
    const newHrApprover = {
      name: 'Hr Approver',
      email: updateBody.HrProcessorEmail,
      password: 'admin123',
      role: 'hrapprover',
      isEmailVerified: true,
    };

    if (!userService.getUserByEmail(newHrApprover.email)) {
      newUserStatus1 = await userService.createUser(newHrApprover);
    }
  }

  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  Object.assign(company, updateBody);
  const result = await company.save();
  return { result, newUserStatus, newUserStatus1 };
};

/**
 * Delete Company by id
 * @param {ObjectId} companyId
 * @returns {Promise<Company>}
 */
const deleteCompanyById = async (companyId) => {
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  company.status = 'Inactive';
  delete company._id;
  const result = updateCompanyById(companyId, company);
  // await company.remove();
  return result;
};
const getPayrollCompanyById = async (companyId) => {
  const payrollCalender = await PayrollCalender.findOne({ $and: [{ CompanyId: companyId }, { Year: cYear }] });
  if (!payrollCalender) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  return payrollCalender;
};
const getPayrollCompanyByIdpreviousyear = async (companyId) => {
  const prevyear = cYear - 1;
  const payrollCalender = await PayrollCalender.findOne({ $and: [{ CompanyId: companyId }, { Year: prevyear }] });
  if (!payrollCalender) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  return payrollCalender;
};
async function getCompanyPayroll(companyid) {
  const payrollData = await PayrollCalender.findOne({ $and: [{ CompanyId: companyid }, { Year: cYear }] });
  let monthNamePayroll;
  // eslint-disable-next-line no-unused-vars
  const monthname = monthNames.forEach((val) => {
    let dateFrom;
    let dateTo;
    let datelockend;
    const ind = monthNames.indexOf(val);
    const prevmonth = monthNames[ind - 1];
    if (monthNames.indexOf(val) === 0) {
      dateFrom = payrollData.December.lock_date_end;
      dateTo = payrollData[val].lock_date_start;
      datelockend = payrollData[val].lock_date_end;
    } else {
      dateFrom = payrollData[prevmonth].lock_date_end;
      dateTo = payrollData[val].lock_date_start;
      datelockend = payrollData[val].lock_date_end;
    }

    const from = Date.parse(dateFrom);
    const to = Date.parse(dateTo);
    const lock = Date.parse(datelockend);
    const check = Date.parse(today);
    if (check <= to && check >= from) {
      monthNamePayroll = val;
    }
    if (check <= lock && check >= to) {
      monthNamePayroll = monthNames[ind + 1];
    }
  });
  return monthNamePayroll;
}
async function getCompanyPayrollgreytip(companyid) {
  const payrollData = await PayrollCalender.findOne({ $and: [{ CompanyId: companyid }, { Year: cYear }] });
  let monthNamePayroll;
  // eslint-disable-next-line no-unused-vars
  const monthname = monthNames.forEach((val) => {
    let dateFrom;
    let dateTo;
    let datelockend;
    const ind = monthNames.indexOf(val);
    const prevmonth = monthNames[ind - 1];
    if (monthNames.indexOf(val) === 0) {
      dateFrom = payrollData.December.lock_date_end;
      dateTo = payrollData[val].lock_date_start;
      datelockend = payrollData[val].lock_date_end;
    } else {
      dateFrom = payrollData[prevmonth].lock_date_end;
      dateTo = payrollData[val].lock_date_start;
      datelockend = payrollData[val].lock_date_end;
    }

    const from = Date.parse(dateFrom);
    const to = Date.parse(dateTo);
    const lock = Date.parse(datelockend);
    const check = Date.parse(today);
    if (check <= to && check >= from) {
      monthNamePayroll = val;
    }
    if (check <= lock && check >= to) {
      monthNamePayroll = val;
    }
  });
  return monthNamePayroll;
}
const lockPayrollprocessedEmployees = async (companyId) => {
  const prevyear = cYear - 1;
  const payrollCalender = await PayrollCalender.findOne({ $and: [{ CompanyId: companyId }, { Year: prevyear }] });
  if (!payrollCalender) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  return payrollCalender;
};
module.exports = {
  createCompany,
  queryCompany,
  getCompanyById,
  getCompanyByEmail,
  updateCompanyById,
  deleteCompanyById,
  getCompanyBySearch,
  getPayrollCompanyById,
  getPayrollCompanyByIdpreviousyear,
  lockPayrollprocessedEmployees,
  getCompanyPayroll,
  getCompanyPayrollgreytip,
};

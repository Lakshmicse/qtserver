const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { calenderService, employeeService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createCalender = catchAsync(async (req, res) => {
  const calender = await calenderService.createPayrollCalender(req.body);
  res.status(httpStatus.CREATED).send(calender);
});
const getCalenders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['CompanyId', 'Year']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await calenderService.queryPayrollCalender(filter, options);
  res.send(result);
});

const getCalender = catchAsync(async (req, res) => {
  const calender = await calenderService.getPayrollCalenderById(req.params.calenderId);
  if (!calender) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payroll  Calender   not found');
  }
  res.send(calender);
});

const updateCalender = catchAsync(async (req, res) => {
  const calender = await calenderService.updatePayrollCalenderById(req.params.calenderId, req.body);
  res.send(calender);
});

const updateCalenderByCompanyId = catchAsync(async (req, res) => {
  const calender = await calenderService.updatePayrollCalenderCompanyId(req.params.companyId, req.body);
  res.send(calender);
});
const deleteCalender = catchAsync(async (req, res) => {
  await calenderService.deletePayrollCalendarById(req.params.calenderId);
  res.status(httpStatus.NO_CONTENT).send();
});

const lockRecords = catchAsync(async (req, res) => {
  const isLockPeriod = await calenderService.isLockPeriod();

  let results = [];
  if (!isLockPeriod) {
    results = await employeeService.lockEmployees();
  }
  res.send(results);
});

const unLockRecords = catchAsync(async (req, res) => {
  const isLockPeriod = await calenderService.isLockPeriod();

  let results = [];
  if (!isLockPeriod) {
    results = await employeeService.unLockEmployees();
  }

  res.send(results);
});

const getDatesBetweenDates = (startDate, endDate) => {
  let dates = [];
  const theDate = new Date(startDate);
  while (theDate < endDate) {
    dates = [...dates, new Date(theDate)];
    theDate.setDate(theDate.getDate() + 1);
  }
  return dates;
};
module.exports = {
  createCalender,
  getCalenders,
  getCalender,
  getDatesBetweenDates,
  lockRecords,
  unLockRecords,
  updateCalender,
  deleteCalender,
  updateCalenderByCompanyId,
};

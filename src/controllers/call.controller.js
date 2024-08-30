const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { callService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createCall = catchAsync(async (req, res) => {
  const call = await callService.createCall(req.body);
  res.status(httpStatus.CREATED).send(call);
});
const getCalls = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['CompanyId', 'Year']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await callService.query(filter, options);
  res.send(result);
});

// countCallsByDay
const countCallsByDay = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['startDate', 'endDate']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await callService.countCallsByDay(filter, options);
  res.send({ results: result });
});

const countCallsByMonth = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['startDate', 'endDate']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await callService.countCallsByMonth(filter, options);
  res.send({ results: result });
});

const getCall = catchAsync(async (req, res) => {
  const call = await callService.getCallById(req.params.callId);
  if (!call) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Call   not found');
  }
  res.send(call);
});

const updateCall = catchAsync(async (req, res) => {
  const call = await callService.updateCallById(req.params.callId, req.body);
  res.send(call);
});

const deleteCall = catchAsync(async (req, res) => {
  await callService.deleteCallById(req.params.callId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCall,
  getCalls,
  getCall,
  updateCall,
  deleteCall,
  countCallsByDay,
  countCallsByMonth,
};

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dispatcherService } = require('../services');

const createDispatcher = catchAsync(async (req, res) => {
  const dispatcher = await dispatcherService.createDispatcher(req.body);
  res.status(httpStatus.CREATED).send(dispatcher);
});

const getDispatcherList = catchAsync(async (req, res) => {
  const filter = { role: 'dispatcher' }; // pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await dispatcherService.queryDispatcher(filter, options);
  res.send(result);
});

const getDispatcher = catchAsync(async (req, res) => {
  const Dispatcher = await dispatcherService.getDispatcherById(req.params.DispatcherId);
  if (!Dispatcher) {
    throw new ApiError(httpStatus.NOT_FOUND, '');
  }
  res.send(Dispatcher);
});

const updateDispatcher = catchAsync(async (req, res) => {
  const Dispatcher = await dispatcherService.updateDispatcherById(req.params.DispatcherId, req.body);
  res.send(Dispatcher);
});

const deleteDispatcher = catchAsync(async (req, res) => {
  await dispatcherService.deleteDispatcherById(req.params.DispatcherId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDispatcher,
  getDispatcherList,
  getDispatcher,
  updateDispatcher,
  deleteDispatcher,
};

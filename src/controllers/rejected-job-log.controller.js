const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { rejectedJobLogService } = require('../services');

const createJob = catchAsync(async (req, res) => {
  const job = await rejectedJobLogService.createRejectedJobLog(req.body);
  res.status(httpStatus.CREATED).send(job);
});

const getJobs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'job']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let result;
  if (filter.job) {
    result = await rejectedJobLogService.queryRejectedJobLogs(filter, options);
  } else {
    result = await rejectedJobLogService.queryRejectedJobLogs(filter, options);
  }
  res.send(result);
});

const getJob = catchAsync(async (req, res) => {
  const job = await rejectedJobLogService.getRejectedJobLogById(req.params.jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  res.send(job);
});

const updateJob = catchAsync(async (req, res) => {
  const job = await rejectedJobLogService.updateRejectedJobLogById(req.params.jobId, req.body);
  res.send(job);
});

const deleteJob = catchAsync(async (req, res) => {
  await rejectedJobLogService.deleteRejectedJobLogById(req.params.jobId);
  res.status(httpStatus.NO_CONTENT).send();
});
const getjobBySearch = catchAsync(async (req, res) => {
  const resignation = await rejectedJobLogService.getJobBySearch(req.params.searchId);
  if (!resignation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resignation not found ');
  }
  res.send(resignation);
});
module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getjobBySearch,
};

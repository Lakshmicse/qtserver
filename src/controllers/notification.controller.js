/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
// const formSettings = require('../services/formSettings');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body, req.tenant.dbURI);
  res.status(httpStatus.CREATED).send(notification);
});

const getNotification = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await notificationService.queryNotification(filter, options, req.tenant.dbURI);
  res.send(result);
});

const getNotificationByID = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.NotificationId, req.tenant.dbURI);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  res.send(notification);
});

const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotificationById(req.params.NotificationId, req.body, req.tenant.dbURI);
  res.send(notification);
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.NotificationId, req.tenant.dbURI);
  res.status(httpStatus.NO_CONTENT).send();
});
const getNotificationBySearch = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const Notification = await notificationService.getNotificationBySearch(req.params.searchId, filter, req.tenant.dbURI);
  if (!Notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found ');
  }
  res.send(Notification);
});
const getReceived = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const Notification = await notificationService.getReceivedNotification(req.params.searchId, filter, req.tenant.dbURI);
  if (!Notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found ');
  }
  res.send(Notification);
});
const getsent = catchAsync(async (req, res) => {
  const Notification = await notificationService.getSentNotification(req.params.searchId, req.tenant.dbURI);
  if (!Notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found ');
  }
  res.send(Notification);
});




module.exports = {
  createNotification,
  getNotificationByID,
  getNotification,
  updateNotification,
  deleteNotification,
  getNotificationBySearch,
  getReceived,
  getsent
};

/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

// const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { switchDB, getDBModel } = require('../db/utility');
// const { Notification } = require('../models');

const NotificationSchema = require('../schemas/notification.schema');

const ApiError = require('../utils/ApiError');

const TenantSchemas = new Map([['Notification', NotificationSchema]]);

/**
 * Query for Loss of pay Days
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
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
const createNotification = async (NotificationBody, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);

  const Notification = await getDBModel(tenantDB, 'Notification');
  Notification.create(NotificationBody);
};
const queryNotification = async (filter, options, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Notification = await getDBModel(tenantDB, 'Notification');
  const result = await Notification.paginate(filter, options);
  return result;
};
/**
 * Create a Notification
 * @param {Object}  NotificationBody
 * @returns {Promise<Company>}
 */

const getNotificationBySearch = async (id, filter, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Notification = await getDBModel(tenantDB, 'Notification');
  const {role} = filter;
  if (role === 'hradmin'){
  const notification = await Notification.find({$and: [{ 'from': { $ne:id} },{'hradmin':{$eq: true}}]}).sort({"createdAt": -1}).limit(10);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification  not found');
  }
  return notification;
}
  const notification = await Notification.find({$and: [{ 'from': { $ne:id} },{'payrolladmin':{$eq: true}}]});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification  not found');
  }
  return notification;
};
const getReceivedNotification = async (id, filter, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Notification = await getDBModel(tenantDB, 'Notification');
  const {role} = filter;
  if (role === 'hradmin'){
  const notification = await Notification.find({$and: [{ 'from': { $ne:id} },{'hradmin':{$eq: true}}]}).sort({"createdAt": -1});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification  not found');
  }
  return notification;
}
  const notification = await Notification.find({$and: [{ 'from': { $ne:id} },{'payrolladmin':{$eq: true}}]}).sort({"createdAt": -1});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification  not found');
  }
  return notification;
  
};
const getSentNotification = async (id, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Notification = await getDBModel(tenantDB, 'Notification');

  const notification = await Notification.find({ 'from': { $eq:id} }).sort({"createdAt": -1});
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification  not found');
  }
  return notification;
};

/**
 * Get Notification by id
 * @param {ObjectId} id
 * @returns {Promise<Notification>}
 */

const getNotificationById = async (id, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Notification = await getDBModel(tenantDB, 'Notification');
  return Notification.findById(id);
};

/**
 * Update lop days by id
 * @param {ObjectId} lopid
 * @param {Object} updateBody
 * @returns {Promise<Notification>}
 */
const updateNotificationById = async (notificationId, updateBody, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Notification = await getDBModel(tenantDB, 'Notification');
  const notification = await getNotificationById(notificationId, dbURI);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  Object.assign(notification, updateBody);
  await notification.save();
  return notification;
};

/**
 * Delete Lop by id
 * @param {ObjectId} NotificationId
 * @returns {Promise<Notification>}
 */
const deleteNotificationById = async (NotificationId, dbURI) => {
  const notification = await getNotificationById(NotificationId, dbURI);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  await notification.remove();
  return notification;
};

module.exports = {
  createNotification,
  queryNotification,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  getNotificationBySearch,
  getReceivedNotification,
  getSentNotification
};

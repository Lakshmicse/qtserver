/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
const ExcelJS = require('exceljs');
const { MongoClient, ObjectId } = require('mongodb');
const moment = require('moment');
// const mongoose = require('mongoose');
const httpStatus = require('http-status');
const path = require('path');
const readXlsxFile = require('read-excel-file/node');
const Ajv = require('ajv');
const fs = require('fs');

const { switchDB, getDBModel } = require('../db/utility');
// const { mapping } = require('../db/greyTipMapping');
// const { LopDays } = require('../models');

const FileSendSchema = require('../schemas/filesend.schema');

const config = require('../config/config');

const ApiError = require('../utils/ApiError');

const formSettingsService = require('./form-settings.service');
const downloadService = require('./download.service');
const { companyService, employeeService, notificationService, emailService } = require('./index');
const { AuditLog, Tenant } = require('../models');

const TenantSchemas = new Map([['Document', FileSendSchema]]);
const AuditLogService = require('./auditlogonetime.service');
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
const monthNumber = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};
const formname = 'File Send';

const createFileSendCreation = async (DocumentBody, dbURI) => {
  // eslint-disable-next-line no-console
  console.log(DocumentBody);
  let client;
  let db;
  try {
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const dCollection = db.collection('documents');

    // eslint-disable-next-line no-param-reassign
    DocumentBody.createdAt = new Date();
    // eslint-disable-next-line no-param-reassign
    DocumentBody.updatedAt = new Date();

    const result = await dCollection.insertOne(DocumentBody);
    const notification = await notificationService.createNotification(DocumentBody, dbURI);
    await emailService.DocumentSharingMail(DocumentBody.from, DocumentBody.to, DocumentBody.fileName, DocumentBody.message);
    const action = 'created';
    await AuditLogService.createAuditLog(
      DocumentBody,
      dbURI,
      action,
      DocumentBody['Employee Number'],
      DocumentBody['Employee Name'],
      DocumentBody.user,
      formname
    );
    // eslint-disable-next-line no-console
    // console.log(LopDaysBody.updatedAt, LopDaysBody.createdAt, new Date(date), date, LopDaysBody);
    return result;
  } catch (err) {
    return {
      msg: 'Unable to create Employee',
      acknowledged: false,
      data: err,
    };
  }
};
const queryAllfileslist = async (filter, options, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Documents = await getDBModel(tenantDB, 'Document');
  const result = await Documents.paginate(filter, options);
  return result;
};
/**
 * Create a Documents
 * @param {Object}  NotificationBody
 * @returns {Promise<Company>}
 */

const getfilesBySearch = async (id, filter, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Documents = await getDBModel(tenantDB, 'Document');
  const {role} = filter;
  if (role === 'hradmin'){
  const documents = await Documents.find({$and: [{ 'from': { $ne:id} },{'hradmin':{$eq: true}}]}).sort({"createdAt": -1}).limit(10);
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File  not found');
  }
  return documents;
}
  const documents = await Documents.find({$and: [{ 'from': { $ne:id} },{'payrolladmin':{$eq: true}}]});
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File  not found');
  }
  return documents;
};
const getReceivedfiles = async (id, filter, dbURI, user) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Documents = await getDBModel(tenantDB, 'Document');
  const {role} = filter;
  if (role === 'hradmin'){
  const documents = await Documents.find({$and: [{ 'from': { $ne:id} },{'hradmin':{$eq: true}},{ to: { $in: user.email } }]}).sort({"createdAt": -1});
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File  not found');
  }
  return documents;
}
  const documents = await Documents.find({$and: [{ 'from': { $ne:id} },{'payrolladmin':{$eq: true}}]}).sort({"createdAt": -1});
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File  not found');
  }
  return documents;
  
};
const getSentfiles = async (id, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Documents = await getDBModel(tenantDB, 'Document');

  const documents = await Documents.find({ 'from': { $eq:id} }).sort({"createdAt": -1});
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File  not found');
  }
  return documents;
};

/**
 * Get Documents by id
 * @param {ObjectId} id
 * @returns {Promise<documents>}
 */

const getfilesById = async (id, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Documents = await getDBModel(tenantDB, 'Document');
  return Documents.findById(id);
};

/**
 * Update lop days by id
 * @param {ObjectId} lopid
 * @param {Object} updateBody
 * @returns {Promise<Documents>}
 */
const updatefilesById = async (DocumentsId, updateBody, dbURI, res) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const Documents = await getDBModel(tenantDB, 'Document');
  const documents = await getfilesById(DocumentsId, dbURI);
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  updateBody = documents;
  updateBody.type = 'Downloaded';
  Object.assign(documents, updateBody);
  await documents.save();
  const filePath =`${updateBody.filePath}\\${updateBody.fileName}`;// Replace with the actual filepath
  const filePathnew =  path.join(__dirname, '..', '..', 'resource',dbURI,updateBody.fileName);// path.resolve(filePath);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send('File not found');
      return;
    }

    // Set the appropriate headers
    res.setHeader('Content-disposition', `attachment; filename=${updateBody.fileName}`); // Replace 'file.ext' with the desired filename
    res.setHeader('Content-type', 'application/octet-stream'); // Set the appropriate content type
    res.sendFile(filePath, function a(err1) {
      if (err1) {
        // next(err);
        // eslint-disable-next-line no-console
        console.log('Sent:', filePath);
      } else {
        // eslint-disable-next-line no-console
        console.log('Sent:', filePath);
      }
    });
    // Create a read stream from the file and pipe it to the response
    const fileStream =  fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
  

  Object.assign(documents, updateBody);
  await documents.save();
  return documents;
};

/**
 * Delete Lop by id
 * @param {ObjectId} DocumentsId
 * @returns {Promise<documents>}
 */
const deletefilesById = async (DocumentsId, dbURI) => {
  const documents = await getfilesById(DocumentsId, dbURI);
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  await documents.remove();
  return documents;
};


module.exports = {
    createFileSendCreation,
    queryAllfileslist,
    getfilesBySearch,
    getReceivedfiles,
    getSentfiles,
    getfilesById,
    updatefilesById,
    deletefilesById
};

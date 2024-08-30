/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
const ExcelJS = require('exceljs');
const { MongoClient, ObjectId } = require('mongodb');

// const mongoose = require('mongoose');
const httpStatus = require('http-status');
const path = require('path');
const readXlsxFile = require('read-excel-file/node');
const Ajv = require('ajv');

const { switchDB, getDBModel } = require('../db/utility');
// const { mapping } = require('../db/greyTipMapping');
// const { LopDays } = require('../models');

const AuditLogSchema = require('../schemas/auditlog.schema');

const config = require('../config/config');

const ApiError = require('../utils/ApiError');
const downloadService = require('./download.service');
const formSettingsService = require('./form-settings.service');
const { companyService, employeeService } = require('./index');

const TenantSchemas = new Map([['auditlogs', AuditLogSchema]]);

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
const datenewhandle = () => {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const nd = new Date(utc + 3600000 * +5.5);
  const ist = nd.toLocaleString();
  const value = new Date(ist);
  return ist;
};
/**
 * Query for Loss of pay Days
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAuditLog = async (filter, options, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const AuditLog = await getDBModel(tenantDB, 'auditlogs');
  const result = await AuditLog.paginate(filter, options);
  return result;
};
const getAuditLogBySearch = async (id, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const AuditLog = await getDBModel(tenantDB, 'auditlogs');

  const auditLog = await AuditLog.find({
    $or: [{ 'Employee Name': { $regex: id, $options: 'i' } }, { 'Employee Number': { $regex: id, $options: 'i' } }],
  });
  if (!auditLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary Revision  not found');
  }
  return auditLog;
};

const getAuditLogById = async (id, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const AuditLog = await getDBModel(tenantDB, 'auditlogs');
  const result = AuditLog.findById(id);
  return result;
};
const createAuditLog = async (AuditlogBody, dbURI, Action, employeenumber, employeename, user, formname) => {
  let client;
  let db;
  try {
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const dCollection = db.collection('auditlogs');
    const date = datenewhandle();
    if( Action === 'created' || Action === 'deleted'){
      AuditlogBody={};
    }
    AuditlogBody.FormName = formname;
    AuditlogBody.createdAt = new Date(date);
    AuditlogBody.updatedAt = new Date(date);
    AuditlogBody.date = new Date(date);
    AuditlogBody.Action = Action;
    AuditlogBody['Employee Number'] = employeenumber;
    AuditlogBody['Employee Name'] = employeename;
    AuditlogBody.UserId = user;
    if(AuditlogBody.id) {
      delete AuditlogBody.id;
    }

    // eslint-disable-next-line no-console
    console.log(AuditlogBody.updatedAt, AuditlogBody.createdAt, new Date(date), date, AuditlogBody);
    const result = await dCollection.insertOne(AuditlogBody);

    // return result;
  } catch (err) {
    return {
      msg: 'Unable to create Auditlog',
      acknowledged: false,
      data: err,
    };
  }
};
const getEmployeeById = async (id, dbURI) => {
  let client;
  let db;
  try {
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const dCollection = db.collection('auditlogs');
    // eslint-disable-next-line no-console

    const result = await dCollection.findOne({ _id: ObjectId(id) });
    // let result = await dCollection.countDocuments();
    // your other codes ....
    // eslint-disable-next-line no-console

    return result;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
/**
 * Update lop days by id
 * @param {ObjectId} lopid
 * @param {Object} updateBody
 * @returns {Promise<AuditLog>}
 */

/**
 * Delete Lop by id
 * @param {ObjectId} AuditLogId
 * @returns {Promise<AuditLog>}
 */
const deleteAuditLogById = async (AuditLogId, dbURI) => {
  const auditLog = await getAuditLogById(AuditLogId, dbURI);
  if (!auditLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary Revision not found');
  }
  await auditLog.remove();
  return auditLog;
};
const deleteAuditLogBydate = async (auditlogbody, dbURI) => {
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const AuditLog = await getDBModel(tenantDB, 'auditlogs');

  const auditLog = await AuditLog.deleteMany({"createdAt":{"$lte":new Date(auditlogbody.Date)}});
  if (!auditLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary Revision  not found');
  }
  return auditLog;
};
const compareJSON = function (obj1, obj2) {
  const ret = {};
  for (const i in obj2) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj2[i] !== obj1[i]) {
      ret[i] = {
        Previous: obj1[i],
        Modified: obj2[i],
      };
    }
  }
  return ret;
};
module.exports = {
  queryAuditLog,
  getAuditLogById,
  createAuditLog,
  deleteAuditLogById,
  getAuditLogBySearch,
  deleteAuditLogBydate,
  compareJSON,
};

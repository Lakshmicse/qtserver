/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const path = require('path');
const ExcelJS = require('exceljs');
const { ObjectId } = require('mongodb');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Tenant } = require('../models');
const { auditLogService, formSettingsService } = require('../services');

const getAuditLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await auditLogService.queryAuditLog(filter, options, req.tenant.dbURI);
  res.send(result);
});

const getAuditLog = catchAsync(async (req, res) => {
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.body.companyid) });
  const dburl = tenant.dbURI;
  const auditLog = await auditLogService.getAuditLogById(req.params.AuditLogId, dburl);
  if (!auditLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LOP Days not found');
  }
  res.send(auditLog);
});

const deleteAuditLog = catchAsync(async (req, res) => {
  await auditLogService.deleteAuditLogById(req.params.AuditLogId, req.tenant.dbURI);
  res.status(httpStatus.NO_CONTENT).send();
});
const getAuditLogBySearch = catchAsync(async (req, res) => {
  const auditLog = await auditLogService.getAuditLogBySearch(req.params.searchId, req.tenant.dbURI);
  if (!auditLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lop Days not found ');
  }
  res.send(auditLog);
});
const getAuditLogByCompanyId = catchAsync(async (req, res) => {
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const dburl = tenant.dbURI;
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await auditLogService.queryAuditLog(filter, options, dburl);
  res.send(result);
});
const deleteAuditLogByDate = catchAsync(async (req, res) => {
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const dburl = tenant.dbURI;
  await auditLogService.deleteAuditLogBydate(req.body, dburl);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
    getAuditLogs,
  getAuditLog,
  deleteAuditLog,
  getAuditLogBySearch,
  getAuditLogByCompanyId,
  deleteAuditLogByDate,
};

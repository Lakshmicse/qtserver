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

const ResignationSchema = require('../schemas/resignation.schema');

const config = require('../config/config');

const ApiError = require('../utils/ApiError');

const formSettingsService = require('./form-settings.service');
const tenantService = require('./tenant.service');
const { companyService } = require('./index');
const { AuditLog, Tenant, PayrollCalender, Company, User } = require('../models');

const TenantSchemas = new Map([['Resignation', ResignationSchema]]);

const { employeeService } = require('./index');

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
/**
 * Query for One Time Deduction
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDashboard = async (dbURI, req) => {
  let client;
  let db;
  const stats = {};
  const tenantDB = await switchDB(dbURI, TenantSchemas);
  const today = new Date();
  const cMonth = today.getMonth();
  const cYear = today.getFullYear();
  const month = monthNames[cMonth];
  try {
    const clientId = await tenantService.getClientIdFromDbString(dbURI);
    const payrollCalender = await PayrollCalender.findOne({ $and: [{ CompanyId: clientId }, { Year: cYear }] });
    if (payrollCalender) {
      stats.lockDays = payrollCalender[month].lock_date_start;
    }
    const companies = await Company.find({}).count();
    if (companies) {
      stats.companies = companies;
    }
    const payrolluser = await User.find({ role: 'payrolladmin' }).count();
    if (payrolluser) {
      stats.payrolluser = payrolluser;
    }
    const hruser = await User.find({ role: 'hradmin' }).count();
    if (hruser) {
      stats.hruser = hruser;
    }
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const dCollection = db.collection('employees');
    // const result = await dCollection.findOne({ 'Personal Information.Employee Number': EmployeeNumber });
    const totalEmployees = await dCollection.countDocuments({ status: { $ne: 'RESIGNED' } });
    let tobeApproved;
    if (req.user.role !== 'payrolladmin') {
      tobeApproved = await dCollection.countDocuments({
        $or: [{ WorkflowStatus: { $eq: 'HR_NEW' } }, { WorkflowStatus: { $eq: 'HR_DRAFT' } }],
      });
    } else {
      tobeApproved = await dCollection.countDocuments({
        $or: [{ WorkflowStatus: { $eq: 'HR_APPROVED' } }],
      });
    }
    const totalResigned = await dCollection.countDocuments({ status: { $eq: 'RESIGNED' } });
    const totalNewJoinee = await dCollection.countDocuments({ status: { $eq: 'NEW_JOINEE' } });

    if (totalEmployees) {
      stats.totalEmployees = totalEmployees;
    }
    if (tobeApproved) {
      stats.tobeApproved = tobeApproved;
    }
    if (totalResigned) {
      stats.totalResigned = totalResigned;
    }
    if (totalNewJoinee) {
      stats.totalNewJoinee = totalNewJoinee;
    }
    const pipelinenew = [
      { $group: { _id: { month: { $month: { $toDate: '$createdAt' } } }, totalnewJoinees: { $sum: 1 } } },
    ];

    const newJoinee = await dCollection.aggregate(pipelinenew);
    const newJoineeArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const doc of newJoinee) {
      newJoineeArray.push(doc);
    }
    if (newJoineeArray) {
      stats.newJoineeData = newJoineeArray;
    }
    const pipelinegender = [{ $group: { _id: '$Personal Information.Gender', count: { $sum: 1 } } }];

    const genderRatio = await dCollection.aggregate(pipelinegender);
    const genderRatioArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const doc of genderRatio) {
      genderRatioArray.push(doc);
    }
    if (genderRatioArray) {
      stats.genderRatioArray = genderRatioArray;
    }
    const pipelinedepartment = [{ $group: { _id: { department: '$Company.Department' }, count: { $sum: 1 } } }];

    const DepartmentRatio = await dCollection.aggregate(pipelinedepartment);
    const DepartmentRatioArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const doc of DepartmentRatio) {
      DepartmentRatioArray.push(doc);
    }
    if (DepartmentRatioArray) {
      stats.departmentData = DepartmentRatioArray;
    }

    const Resignation = await getDBModel(tenantDB, 'Resignation');

    const resignationData = await Resignation.aggregate([
      { $group: { _id: { month: { $month: { $toDate: '$Date of Resignation' } } }, totalResignations: { $sum: 1 } } },
    ]);
    if (resignationData) {
      stats.resignationData = resignationData;
    }
    const resignationCount = await Resignation.find({}).count();
    if (resignationCount) {
      stats.resignationCount = resignationCount;
    }
    return stats;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
const collectionname = [
  'employees',
  'salaryrevisions',
  'interstatetransfers',
  'transitionchanges',
  'onetimepayments',
  'onetimedeductions',
  'lopdays',
  'loandetails',
  'repayments',
  'resignations',
  'lopreversals',
];
const getData = async (dbURI, collection, role) => {
  let client;
  let db;
  const dCollectionEmployee = db.collection(collection);
  let tobeApprovedEmployee;
  if (role !== 'payrolladmin') {
    tobeApprovedEmployee = await dCollectionEmployee.countDocuments({
      $or: [{ WorkflowStatus: { $eq: 'HR_NEW' } }, { WorkflowStatus: { $eq: 'HR_DRAFT' } }],
    });
  } else {
    tobeApprovedEmployee = await dCollectionEmployee.countDocuments({
      $or: [{ WorkflowStatus: { $eq: 'HR_APPROVED' } }],
    });
  }
  return tobeApprovedEmployee;
};
const approvalpending = async (dbURI, req, filter) => {
  let client;
  let db;
  const stats = {};

  const tenantDB = await switchDB(dbURI, TenantSchemas);
  try {
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const approves = {};
    const dCollectionEmployee = db.collection('employees');
    let tobeApprovedEmployee;
    const monthname = filter.month;
    const yearname = parseInt(filter.year, 10);
    const role = 'hradmin';
    const employeequeryhr = {
      $and: [
        { status: { $ne: 'RESIGNED' } },
        {
          $or: [
            { $and: [{ WorkflowStatus: 'HR_DRAFT' }, { month: monthname }, { year: yearname }] },
            { $and: [{ WorkflowStatus: 'HR_NEW' }, { month: monthname }, { year: yearname }] },
          ],
        },
      ],
    };
    const employeequerypayroll = {
      $and: [
        { status: { $ne: 'RESIGNED' } },
        { $or: [{ $and: [{ WorkflowStatus: { $eq: 'HR_APPROVED' } }, { month: monthname }, { year: yearname }] }] },
      ],
    };
    const otherhr = {
      $or: [
        { $and: [{ WorkflowStatus: 'HR_DRAFT' }, { month: monthname }, { year: yearname }] },
        { $and: [{ WorkflowStatus: 'HR_NEW' }, { month: monthname }, { year: yearname }] },
      ],
    };
    const otherPAYROLL = {
      $or: [{ $and: [{ WorkflowStatus: 'HR_APPROVED' }, { month: monthname }, { year: yearname }] }],
    };

    if (req.user.role !== 'payrolladmin') {
      tobeApprovedEmployee = await dCollectionEmployee.countDocuments(employeequeryhr);
    } else {
      tobeApprovedEmployee = await dCollectionEmployee.countDocuments(employeequerypayroll);
    }
    approves.employee = tobeApprovedEmployee;
    const dCollectionSalary = db.collection('salaryrevisions');
    let tobeApprovedSalary;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedSalary = await dCollectionSalary.countDocuments(otherhr);
    } else {
      tobeApprovedSalary = await dCollectionSalary.countDocuments(otherPAYROLL);
    }
    approves.salary = tobeApprovedSalary;
    const dCollectionInter = db.collection('interstatetransfers');
    let tobeApprovedInter;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedInter = await dCollectionInter.countDocuments(otherhr);
    } else {
      tobeApprovedInter = await dCollectionInter.countDocuments(otherPAYROLL);
    }
    approves.Inter = tobeApprovedInter;
    const dCollectionTrans = db.collection('transitionchanges');
    let tobeApprovedTrans;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedTrans = await dCollectionTrans.countDocuments(otherhr);
    } else {
      tobeApprovedTrans = await dCollectionTrans.countDocuments(otherPAYROLL);
    }
    approves.Trans = tobeApprovedTrans;
    const dCollectiononetimepaymets = db.collection('onetimepayments');
    let tobeApprovedonetimepayments;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonetimepayments = await dCollectiononetimepaymets.countDocuments(otherhr);
    } else {
      tobeApprovedonetimepayments = await dCollectiononetimepaymets.countDocuments(otherPAYROLL);
    }
    approves.onetimepayments = tobeApprovedonetimepayments;
    const dCollectiononetimedeductions = db.collection('onetimedeductions');
    let tobeApprovedonetimedeductions;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonetimedeductions = await dCollectiononetimedeductions.countDocuments(otherhr);
    } else {
      tobeApprovedonetimedeductions = await dCollectiononetimedeductions.countDocuments(otherPAYROLL);
    }
    approves.onetimedeductions = tobeApprovedonetimedeductions;
    const dCollectionlopdays = db.collection('lopdays');
    let tobeApprovedonlopdays;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonlopdays = await dCollectionlopdays.countDocuments(otherhr);
    } else {
      tobeApprovedonlopdays = await dCollectionlopdays.countDocuments(otherPAYROLL);
    }
    approves.lopdays = tobeApprovedonlopdays;

    const dCollectionloandetails = db.collection('loandetails');
    let tobeApprovedonloandetails;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonloandetails = await dCollectionloandetails.countDocuments(otherhr);
    } else {
      tobeApprovedonloandetails = await dCollectionloandetails.countDocuments(otherPAYROLL);
    }
    approves.loandetails = tobeApprovedonloandetails;
    const dCollectionresignations = db.collection('resignations');
    let tobeApprovedonresignations;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonresignations = await dCollectionresignations.countDocuments(otherhr);
    } else {
      tobeApprovedonresignations = await dCollectionresignations.countDocuments(otherPAYROLL);
    }
    approves.resignations = tobeApprovedonresignations;
    const dCollectionrepayments = db.collection('repayments');
    let tobeApprovedonrepayments;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonrepayments = await dCollectionrepayments.countDocuments(otherhr);
    } else {
      tobeApprovedonrepayments = await dCollectionrepayments.countDocuments(otherPAYROLL);
    }
    approves.repayments = tobeApprovedonrepayments;
    const dCollectionlopreversals = db.collection('lopreversals');
    let tobeApprovedonlopreversals;
    if (req.user.role !== 'payrolladmin') {
      tobeApprovedonlopreversals = await dCollectionlopreversals.countDocuments(otherhr);
    } else {
      tobeApprovedonlopreversals = await dCollectionlopreversals.countDocuments(otherPAYROLL);
    }
    approves.lopreversals = tobeApprovedonlopreversals;

    return approves;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
const querysuperAdminDashboard = async () => {
  let client;
  let db;
  const stats = {};
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  try {
    const companies = await Company.find({}).count();
    if (companies) {
      stats.companies = companies;
    }
    const currentmonthonboards = await Company.find({
      OnboardingDate: { $gte: new Date(firstDay), $lt: new Date(lastDay) },
    }).count();
    if (currentmonthonboards) {
      stats.currentmonthonboards = currentmonthonboards;
    }
    const payrolluser = await User.find({ role: 'payrolladmin' }).count();
    if (payrolluser) {
      stats.payrolluser = payrolluser;
    }
    const hruser = await User.find({ role: 'hradmin' }).count();
    if (hruser) {
      stats.hruser = hruser;
    }
    return stats;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

module.exports = {
  queryDashboard,
  querysuperAdminDashboard,
  approvalpending,
};

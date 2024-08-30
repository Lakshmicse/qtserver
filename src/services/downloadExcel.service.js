/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
// import dateformat from 'dateformat';

const ExcelJS = require('exceljs');
const { MongoClient, ObjectId } = require('mongodb');
const httpStatus = require('http-status');
require('exceljs');
const Ajv = require('ajv');

const fs = require('fs');
const mime = require('mime');
const request = require('request');

const moment = require('moment');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const callenderService = require('./calender.service');
const downloadService = require('./download.service');
const { switchDB, getDBModel } = require('../db/utility');
// const { mapping } = require('../db/greyTipMapping');
// const { LopDays } = require('../models');

const config = require('../config/config');
// eslint-disable-next-line no-unused-vars
const { Employee, AuditLog, Tenant } = require('../models');
const { companyService } = require('./index');

const formSettingsService = require('./form-settings.service');
const externalApiValidationService = require('./external-api-validation.service');
const ApiError = require('../utils/ApiError');

const AuditLogService = require('./auditlogonetime.service');

const TenantSchemas = new Map([]);

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
// let formElements = await formSettingsService.getFormColumnElements(req.params.companyId, 'LOP Days');
const Exceltemplates = [
  {
    FormName: 'Employee',
    collName: 'employees',
    Fields: [
      'PAN Number',
      'Employee Number',
      'Name as per PAN',
      'Employee Name',
      "Father's Name",
      'Aadhaar Number',
      'Name as per Aadhaar Number',
      'ESI Number',
      'PF UAN Number',
      'Gender',
      'Date of Birth',
      'Official Email ID',
      'Email ID',
      'Locality and City',
      'Address - Permanent/Current',
      'Company',
      'Remarks',
      'Date of Joining',
      'Designation',
      'Cost Center',
      'Department',
      'Function',
      'Grade',
      'Total CTC',
      'Basic (Th)',
      'FDA (Th)',
      'HRA (Th)',
      'CEA (Th)',
      'Stipend (Th)',
      'VDA (Th)',
      'Conveyance (Th)',
      'Shift Allowance (Th)',
      'Attendance Bonus (Th)',
      'Plating Allowance (Th)',
      'Plant Maintainance (Th)',
      'Skill Allowance (Th)',
      'Special Allowance (Th)',
      'Annual Fixed CTC',
      'Annual Variable CTC',
      'Monthly Fixed',
      'Total Earning (Th)',
      'Bank Name',
      'Bank Account Number',
      'Bank IFSC',
      'Name As Per Bank',
      'Bank Branch',
      'Salary Payment Mode',
      'Dispensary/IMP/mEUD',
      'Dispensary/IMP/mEUD State',
      'Dispensary/IMP/mEUD District',
      'Dispensary/IMP/mEUD Near Hospital',
      'Dispensary/IMP/mEUD Family Members',
      'Dispensary/IMP/mEUD Family Members State',
      'Dispensary/IMP/mEUD Family Members District',
      'Dispensary/IMP/mEUD near ESI hospital',
      'Nominee Name',
      'Nominee Relationship',
      'Nominee Address',
      'Nominee State',
      'Nominee District',
      'Nominee mobile number',
      'Family Members Name',
      'Family Members DOB',
      'Family Members Relationship',
    ],
  },
  {
    FormName: 'Salary Revision',
    collName: 'salaryrevisions',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Revision Effective Date',
      'States',
      'Districts',
      'Department',
      'Designation',
      'Cost Center',
      'Function',
      'Grade',
      'Remarks',
      'Basic (Th)',
      'FDA (Th)',
      'HRA (Th)',
      'CEA (Th)',
      'Stipend (Th)',
      'VDA (Th)',
      'Conveyance (Th)',
      'Shift Allowance (Th)',
      'Attendance Bonus (Th)',
      'Plating Allowance (Th)',
      'Plant Maintainance (Th)',
      'Skill Allowance (Th)',
      'Special Allowance (Th)',
      'Annual Fixed CTC',
      'Annual Variable CTC',
      'Monthly Fixed',
      'Total CTC',
      'Total Earning (Th)',
      'Annual Variable',
    ],
  },
  {
    FormName: 'Interstate Transfers',
    collName: 'interstatetransfers',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Date of Joining',
      'Transfer Date',
      'Transferred from State',
      'Transferred to State',
      'New Location',
      'Remarks',
    ],
  },
  {
    FormName: 'Transition Changes',
    collName: 'transitionchanges',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Effective Date',
      'Designation',
      'Cost Center',
      'Current Department',
      'New Department',
      'Function',
      'Grade',
    ],
  },
  {
    FormName: 'One time Payment',
    collName: 'onetimepayments',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Type of Allowance',
      'Any Other type of One Time Allowance',
      'Amount',
      'OverTime Hours',
      'SAB Amount',
      'Category',
      'Recall Hours',
      'Night Shift Days',
      'Remarks',
      'Remarks 2',
    ],
  },
  {
    FormName: 'One time Deduction',
    collName: 'onetimedeductions',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Type of Deduction',
      'Any other type of Deduction',
      'Mention Start/Stop',
      'Amount',
      'LoanType',
      'Closure Amount',
      'Remarks',
      'Remarks 2',
    ],
  },
  {
    FormName: 'LOP Reversal',
    collName: 'lopreversals',
    Fields: ['Employee Number', 'Employee Name', 'LOP Reversal Days', 'Reversal Month', 'Remarks'],
  },
  {
    FormName: 'LOP Days',
    collName: 'lopdays',
    Fields: ['Employee Number', 'Employee Name', 'LOP Days', 'LOP Month', 'Remarks', 'Reason'],
  },
  {
    FormName: 'Loan Repayment Outside',
    collName: 'repayments',
    Fields: ['Employee Number', 'Employee Name', 'Loan Details', 'Loan Type', 'Closure Amount', 'Remarks'],
  },
  {
    FormName: 'Employee Loan Detail',
    collName: 'loandetails',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Loan Type',
      'Loan Component',
      'Amount Sanctioned',
      'No of Months',
      'Monthly EMI',
      'Rate of Interest',
      'Perquisite Rate',
      'Loan Start Date',
      'Remarks',
    ],
  },
  {
    FormName: 'Employee Resignation',
    collName: 'resignations',
    Fields: [
      'Employee Number',
      'Employee Name',
      'Date of Joining',
      'Date of Resignation',
      'Date of Leaving',
      'Reason for Leaving',
      'No of days to be paid',
      'Leave Encash Days',
      'Notice Period Payment',
      'NSA Days',
      'SAB',
      'Overtime Hrs (Incentive)',
      'One time (if any)',
      'Notice Period Recovery Days',
      'Canteen Deduction',
      'Other Deductions',
      'Remarks',
      'Investments (amount)',
      'Investment Type (Eg, Rent, LIC, ELSS Etc)',
    ],
  },
];
const flattenObj = (ob) => {
  // The object which contains the
  // final result
  const result = {};

  // loop through the object "ob"
  for (const i in ob) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    if (typeof ob[i] === 'object' && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        // Store temp in result
        // result[`${i}.${j}`] = temp[j];
        result[`${j}`] = temp[j];
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = ob[i];
    }
  }
  return result;
};
const dateHandler = (dateISO) => {
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const offset = '+5.5';
  if (dateISO !== '' && dateISO !== null && dateISO !== undefined) {
    const date = new Date(dateISO);
    // date.setDate(date.getDate() + 1);
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * offset);
    const getdate = nd.getDate().toString().padStart(2, '0');
    const getmonth = month[nd.getMonth()];
    const getyear = nd.getFullYear();
    const getTwodigitYear = getyear;
    const datelocal = `${getdate}-${getmonth}-${getTwodigitYear}`;
    const datevalue = datelocal;
    return new Date(datelocal);
    // eslint-disable-next-line no-else-return
  } else {
    return '';
  }
};
const dateHandler1 = (dateISO) => {
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const offset = '+5.5';
  if (dateISO !== '' && dateISO !== null) {
    const date = new Date(dateISO);
    // const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsLong = {
      January: '0',
      February: '1',
      March: '2',
      April: '3',
      May: '4',
      June: '5',
      July: '6',
      August: '7',
      September: '8',
      October: '9',
      November: '10',
      December: '11',
    };
    const month1 = date.getMonth();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // firstDay.setDate(firstDay.getDate() + 1);
    const datelocal = `${firstDay.getDate().toString().padStart(2, '0')}-${month[month1]}-${firstDay.getFullYear()}`;
    const datevalue = datelocal.toString();
    return new Date(datelocal);
    // eslint-disable-next-line no-else-return
  } else {
    return '';
  }
};

// const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'download-greytip.xlsx');

const ExcelWriter = async (dbURI, collectionname, FormName, Query, companyId, Fields, sheetName) => {
  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(dbURI);
  const formcollection = db.collection(collectionname);
  const formresult = await formcollection.find(Query);
  const results = await formresult.toArray();
  const excelcolumns = [];
  try {
    Fields.forEach((ele) => {
      excelcolumns.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    sheetName.columns = excelcolumns;
    results.forEach((row) => {
      const frow = flattenObj(row);
      const editedRow = {};
      Fields.forEach((gcol) => {
        if (gcol === 'Date of Birth' || gcol === 'Date of Joining') {
          const value = dateHandler(frow[gcol]);
          const vald = moment(value).format('D-MMM-YY');
          editedRow[gcol] = vald;
        } else {
          editedRow[gcol] = frow[gcol];
        }
      });
      sheetName.addRow(editedRow);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`OOOOOOO this is the error: ${err}`);
  }
};
const downloadExcelAll = async (req, res) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'download-greytip.xlsx');
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const Query = {
    $and: [{ WorkflowStatus: 'P_APPROVED' }, { createdAt: { $gte: new Date(firstDay), $lt: new Date(lastDay) } }],
  };
  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(tenant.dbURI);
  try {
    const workbook = new ExcelJS.Workbook();
    const empData = Exceltemplates.find((key) => key.FormName === 'Employee');
    const employeecollection = db.collection(empData.collName);
    const employeeresult = await employeecollection.find(Query);
    const employeeresults = await employeeresult.toArray();
    const excelcolumns = [];
    const Employees = workbook.addWorksheet(empData.FormName);
    empData.Fields.forEach((ele) => {
      excelcolumns.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees.columns = excelcolumns;
    employeeresults.forEach((row) => {
      const frow = flattenObj(row);
      const editedRow = {};
      empData.Fields.forEach((gcol) => {
        if (gcol === 'Date of Birth' || gcol === 'Date of Joining') {
          if (frow[gcol] !== undefined && frow[gcol] !== null && frow[gcol] !== '') {
            const value = dateHandler(frow[gcol]);
            const vald = moment(value).format('D-MMM-YY');
            editedRow[gcol] = vald;
          } else {
            editedRow[gcol] = frow[gcol];
          }
        } else {
          editedRow[gcol] = frow[gcol];
        }
      });
      Employees.addRow(editedRow);
    });
    const empData1 = Exceltemplates.find((key) => key.FormName === 'Salary Revision');
    const employeecollection1 = db.collection(empData1.collName);
    const employeeresult1 = await employeecollection1.find(Query);
    const employeeresults1 = await employeeresult1.toArray();
    const excelcolumns1 = [];
    const Employees1 = workbook.addWorksheet(empData1.FormName);
    empData1.Fields.forEach((ele) => {
      excelcolumns1.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees1.columns = excelcolumns1;
    employeeresults1.forEach((row1) => {
      const frow1 = flattenObj(row1);
      const editedRow1 = {};
      empData1.Fields.forEach((gcol1) => {
        if (gcol1 === 'Revision Effective Date') {
          if (frow1[gcol1] !== undefined && frow1[gcol1] !== null && frow1[gcol1] !== '') {
            const value1 = dateHandler(frow1[gcol1]);
            const vald1 = moment(value1).format('D-MMM-YY');
            editedRow1[gcol1] = vald1;
          } else {
            editedRow1[gcol1] = frow1[gcol1];
          }
        } else {
          editedRow1[gcol1] = frow1[gcol1];
        }
      });
      Employees1.addRow(editedRow1);
    });
    const empData2 = Exceltemplates.find((key) => key.FormName === 'Interstate Transfers');
    const employeecollection2 = db.collection(empData2.collName);
    const employeeresult2 = await employeecollection2.find(Query);
    const employeeresults2 = await employeeresult2.toArray();
    const excelcolumns2 = [];
    const Employees2 = workbook.addWorksheet(empData2.FormName);
    empData2.Fields.forEach((ele) => {
      excelcolumns2.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees2.columns = excelcolumns2;
    employeeresults2.forEach((row2) => {
      const frow2 = flattenObj(row2);
      const editedRow2 = {};
      empData2.Fields.forEach((gcol2) => {
        if (gcol2 === 'Transfer Date' || gcol2 === 'Date of Joining') {
          if (frow2[gcol2] !== undefined && frow2[gcol2] !== null && frow2[gcol2] !== '') {
            const value2 = dateHandler(frow2[gcol2]);
            const vald2 = moment(value2).format('D-MMM-YY');
            editedRow2[gcol2] = vald2;
          } else {
            editedRow2[gcol2] = frow2[gcol2];
          }
        } else {
          editedRow2[gcol2] = frow2[gcol2];
        }
      });
      Employees2.addRow(editedRow2);
    });
    const empData3 = Exceltemplates.find((key) => key.FormName === 'Transition Changes');
    const employeecollection3 = db.collection(empData3.collName);
    const employeeresult3 = await employeecollection3.find(Query);
    const employeeresults3 = await employeeresult3.toArray();
    const excelcolumns3 = [];
    const Employees3 = workbook.addWorksheet(empData3.FormName);
    empData3.Fields.forEach((ele) => {
      excelcolumns3.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees3.columns = excelcolumns3;
    employeeresults3.forEach((row3) => {
      const frow3 = flattenObj(row3);
      const editedRow3 = {};
      empData3.Fields.forEach((gcol3) => {
        if (gcol3 === 'Effective Date' || gcol3 === 'Date of Joining') {
          if (frow3[gcol3] !== undefined && frow3[gcol3] !== null && frow3[gcol3] !== '') {
            const value3 = dateHandler(frow3[gcol3]);
            const vald3 = moment(value3).format('D-MMM-YY');
            editedRow3[gcol3] = vald3;
          } else {
            editedRow3[gcol3] = frow3[gcol3];
          }
        } else {
          editedRow3[gcol3] = frow3[gcol3];
        }
      });
      Employees3.addRow(editedRow3);
    });
    const empData4 = Exceltemplates.find((key) => key.FormName === 'One time Payment');
    const employeecollection4 = db.collection(empData4.collName);
    const employeeresult4 = await employeecollection4.find(Query);
    const employeeresults4 = await employeeresult4.toArray();
    const excelcolumns4 = [];
    const Employees4 = workbook.addWorksheet(empData4.FormName);
    empData4.Fields.forEach((ele) => {
      excelcolumns4.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees4.columns = excelcolumns4;
    employeeresults4.forEach((row4) => {
      const frow4 = flattenObj(row4);
      const editedRow4 = {};
      empData4.Fields.forEach((gcol4) => {
        if (gcol4 === 'Transfer Date' || gcol4 === 'Date of Joining') {
          if (frow4[gcol4] !== undefined && frow4[gcol4] !== null && frow4[gcol4] !== '') {
            const value4 = dateHandler(frow4[gcol4]);
            const vald4 = moment(value4).format('D-MMM-YY');
            editedRow4[gcol4] = vald4;
          } else {
            editedRow4[gcol4] = frow4[gcol4];
          }
        } else {
          editedRow4[gcol4] = frow4[gcol4];
        }
      });
      Employees4.addRow(editedRow4);
    });
    const empData5 = Exceltemplates.find((key) => key.FormName === 'One time Deduction');
    const employeecollection5 = db.collection(empData5.collName);
    const employeeresult5 = await employeecollection5.find(Query);
    const employeeresults5 = await employeeresult5.toArray();
    const excelcolumns5 = [];
    const Employees5 = workbook.addWorksheet(empData5.FormName);
    empData5.Fields.forEach((ele) => {
      excelcolumns5.push({ header: ele, key: ele, width: 50 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees5.columns = excelcolumns5;
    employeeresults5.forEach((row5) => {
      const frow5 = flattenObj(row5);
      const editedRow5 = {};
      empData5.Fields.forEach((gcol5) => {
        if (gcol5 === 'Transfer Date' || gcol5 === 'Date of Joining') {
          if (frow5[gcol5] !== undefined && frow5[gcol5] !== null && frow5[gcol5] !== '') {
            const value5 = dateHandler(frow5[gcol5]);
            const vald5 = moment(value5).format('D-MMM-YY');
            editedRow5[gcol5] = vald5;
          } else {
            editedRow5[gcol5] = frow5[gcol5];
          }
        } else {
          editedRow5[gcol5] = frow5[gcol5];
        }
      });
      Employees5.addRow(editedRow5);
    });
    const empData6 = Exceltemplates.find((key) => key.FormName === 'LOP Reversal');
    const employeecollection6 = db.collection(empData6.collName);
    const employeeresult6 = await employeecollection6.find(Query);
    const employeeresults6 = await employeeresult6.toArray();
    const excelcolumns6 = [];
    const Employees6 = workbook.addWorksheet(empData6.FormName);
    empData6.Fields.forEach((ele) => {
      excelcolumns6.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees6.columns = excelcolumns6;
    employeeresults6.forEach((row6) => {
      const frow6 = flattenObj(row6);
      const editedRow6 = {};
      empData6.Fields.forEach((gcol6) => {
        if (gcol6 === 'Transfer Date' || gcol6 === 'Date of Joining') {
          if (frow6[gcol6] !== undefined && frow6[gcol6] !== null && frow6[gcol6] !== '') {
            const value6 = dateHandler(frow6[gcol6]);
            const vald6 = moment(value6).format('D-MMM-YY');
            editedRow6[gcol6] = vald6;
          } else {
            editedRow6[gcol6] = frow6[gcol6];
          }
        } else {
          editedRow6[gcol6] = frow6[gcol6];
        }
      });
      Employees6.addRow(editedRow6);
    });
    const empData7 = Exceltemplates.find((key) => key.FormName === 'LOP Days');
    const employeecollection7 = db.collection(empData7.collName);
    const employeeresult7 = await employeecollection7.find(Query);
    const employeeresults7 = await employeeresult7.toArray();
    const excelcolumns7 = [];
    const Employees7 = workbook.addWorksheet(empData7.FormName);
    empData7.Fields.forEach((ele) => {
      excelcolumns7.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees7.columns = excelcolumns7;
    employeeresults7.forEach((row7) => {
      const frow7 = flattenObj(row7);
      const editedRow7 = {};
      empData7.Fields.forEach((gcol7) => {
        if (gcol7 === 'Transfer Date' || gcol7 === 'Date of Joining') {
          if (frow7[gcol7] !== undefined && frow7[gcol7] !== null && frow7[gcol7] !== '') {
            const value7 = dateHandler(frow7[gcol7]);
            const vald7 = moment(value7).format('D-MMM-YY');
            editedRow7[gcol7] = vald7;
          } else {
            editedRow7[gcol7] = frow7[gcol7];
          }
        } else {
          editedRow7[gcol7] = frow7[gcol7];
        }
      });
      Employees7.addRow(editedRow7);
    });
    const empData8 = Exceltemplates.find((key) => key.FormName === 'Loan Repayment Outside');
    const employeecollection8 = db.collection(empData8.collName);
    const employeeresult8 = await employeecollection8.find(Query);
    const employeeresults8 = await employeeresult8.toArray();
    const excelcolumns8 = [];
    const Employees8 = workbook.addWorksheet(empData8.FormName);
    empData8.Fields.forEach((ele) => {
      excelcolumns8.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees8.columns = excelcolumns8;
    employeeresults8.forEach((row8) => {
      const frow8 = flattenObj(row8);
      const editedRow8 = {};
      empData8.Fields.forEach((gcol8) => {
        if (gcol8 === 'Transfer Date' || gcol8 === 'Date of Joining') {
          if (frow8[gcol8] !== undefined && frow8[gcol8] !== null && frow8[gcol8] !== '') {
            const value8 = dateHandler(frow8[gcol8]);
            const vald8 = moment(value8).format('D-MMM-YY');
            editedRow8[gcol8] = vald8;
          } else {
            editedRow8[gcol8] = frow8[gcol8];
          }
        } else {
          editedRow8[gcol8] = frow8[gcol8];
        }
      });
      Employees8.addRow(editedRow8);
    });
    const empData9 = Exceltemplates.find((key) => key.FormName === 'Employee Loan Detail');
    const employeecollection9 = db.collection(empData9.collName);
    const employeeresult9 = await employeecollection9.find(Query);
    const employeeresults9 = await employeeresult9.toArray();
    const excelcolumns9 = [];
    const Employees9 = workbook.addWorksheet(empData9.FormName);
    empData9.Fields.forEach((ele) => {
      excelcolumns9.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees9.columns = excelcolumns9;
    employeeresults9.forEach((row9) => {
      const frow9 = flattenObj(row9);
      const editedRow9 = {};
      empData9.Fields.forEach((gcol9) => {
        if (gcol9 === 'Transfer Date' || gcol9 === 'Loan Start Date') {
          if (frow9[gcol9] !== undefined && frow9[gcol9] !== null && frow9[gcol9] !== '') {
            const value = dateHandler(frow9[gcol9]);
            const vald = moment(value).format('D-MMM-YY');
            editedRow9[gcol9] = vald;
          } else {
            editedRow9[gcol9] = frow9[gcol9];
          }
        } else {
          editedRow9[gcol9] = frow9[gcol9];
        }
      });
      Employees9.addRow(editedRow9);
    });
    const empData10 = Exceltemplates.find((key) => key.FormName === 'Employee Resignation');
    const employeecollection10 = db.collection(empData10.collName);
    const employeeresult10 = await employeecollection10.find(Query);
    const employeeresults10 = await employeeresult10.toArray();
    const excelcolumns10 = [];
    const Employees10 = workbook.addWorksheet(empData10.FormName);
    empData10.Fields.forEach((ele) => {
      excelcolumns10.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees10.columns = excelcolumns10;
    employeeresults10.forEach((row10) => {
      const frow10 = flattenObj(row10);
      const editedRow10 = {};
      empData10.Fields.forEach((gcol10) => {
        if (gcol10 === 'Date of Resignation' || gcol10 === 'Date of Joining' || gcol10 === 'Date of Joining') {
          if (frow10[gcol10] !== undefined && frow10[gcol10] !== null && frow10[gcol10] !== '') {
            const value10 = dateHandler(frow10[gcol10]);
            const vald10 = moment(value10).format('D-MMM-YY');
            editedRow10[gcol10] = vald10;
          } else {
            editedRow10[gcol10] = frow10[gcol10];
          }
        } else {
          editedRow10[gcol10] = frow10[gcol10];
        }
      });
      Employees10.addRow(editedRow10);
    });

    workbook.xlsx.writeFile(tempFilePath).then(function () {
      // eslint-disable-next-line no-console
      console.log('file is written');
      const d = new Date();
      downloadService.uploadToOneDrive(
        `${tenant.dbURI}/${monthNames[d.getMonth()]}`,
        `This Month Payroll Templates.xlsx`,
        req.query.oneDriveToken
      );
      res.sendFile(tempFilePath, function (err) {
        if (err) {
          // next(err);
          // eslint-disable-next-line no-console
          console.log('Sent:', tempFilePath);
        } else {
          // eslint-disable-next-line no-console
          console.log('Sent:', tempFilePath);
        }
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`OOOOOOO this is the error: ${err}`);
  }
};
const dateEndString = '00:00.000Z';
const downloadExcelThismonth = async (req, res) => {
  const date = new Date();
  const payrollMonth = await companyService.getCompanyPayrollgreytip(req.params.companyId);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'download-greytip.xlsx');
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const Query = {
    $and: [{ WorkflowStatus: 'P_APPROVED' }, { month: payrollMonth }, { year: date.getFullYear() }],
  };
  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(tenant.dbURI);
  try {
    const workbook = new ExcelJS.Workbook();
    const empData = Exceltemplates.find((key) => key.FormName === 'Employee');
    const EmployeeformElements = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Employee'
    );
    const employeecollection = db.collection(empData.collName);
    const employeeresult = await employeecollection.find(Query);
    const employeeresults = await employeeresult.toArray();
    const excelcolumns = [];
    const Employees = workbook.addWorksheet(empData.FormName);
    EmployeeformElements.forEach((ele) => {
      excelcolumns.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees.columns = excelcolumns;
    employeeresults.forEach((row) => {
      const frow = flattenObj(row);
      const editedRow = {};
      let dateValues;
      EmployeeformElements.forEach((gcol) => {
        if (frow[gcol] !== undefined && frow[gcol] !== null && frow[gcol] !== '') {
          frow[gcol] = frow[gcol].toString();
          dateValues = frow[gcol];
        } else {
          dateValues = '';
        }
        // eslint-disable-next-line no-console
        console.log(gcol, frow[gcol]);
        if (gcol === 'Date of Birth' || gcol === 'Date of Joining' || dateValues.includes(dateEndString)) {
          if (frow[gcol] !== undefined && frow[gcol] !== null && frow[gcol] !== '') {
            const value = dateHandler(frow[gcol]);
            const vald = moment(value).format('D-MMM-YY');
            editedRow[gcol] = vald;
          } else {
            editedRow[gcol] = frow[gcol];
          }
        } else {
          editedRow[gcol] = frow[gcol];
        }
      });
      Employees.addRow(editedRow);
    });
    const EmployeeformElements1 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Salary Revision'
    );
    const empData1 = Exceltemplates.find((key) => key.FormName === 'Salary Revision');
    const employeecollection1 = db.collection(empData1.collName);
    const employeeresult1 = await employeecollection1.find(Query);
    const employeeresults1 = await employeeresult1.toArray();
    const excelcolumns1 = [];
    const Employees1 = workbook.addWorksheet(empData1.FormName);
    EmployeeformElements1.forEach((ele) => {
      excelcolumns1.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees1.columns = excelcolumns1;
    employeeresults1.forEach((row1) => {
      const frow1 = flattenObj(row1);
      const editedRow1 = {};
      let dateValues1;
      EmployeeformElements1.forEach((gcol1) => {
        if (frow1[gcol1] !== undefined && frow1[gcol1] !== null && frow1[gcol1] !== '') {
          frow1[gcol1] = frow1[gcol1].toString();
          dateValues1 = frow1[gcol1];
        } else {
          dateValues1 = '';
        }
        if (gcol1 === 'Revision Effective Date' || dateValues1.includes(dateEndString)) {
          if (frow1[gcol1] !== undefined && frow1[gcol1] !== null && frow1[gcol1] !== '') {
            const value1 = dateHandler(frow1[gcol1]);
            const vald1 = moment(value1).format('D-MMM-YY');
            editedRow1[gcol1] = vald1;
          } else {
            editedRow1[gcol1] = frow1[gcol1];
          }
        } else {
          editedRow1[gcol1] = frow1[gcol1];
        }
      });
      Employees1.addRow(editedRow1);
    });
    const EmployeeformElements2 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Interstate Transfers'
    );
    const empData2 = Exceltemplates.find((key) => key.FormName === 'Interstate Transfers');
    const employeecollection2 = db.collection(empData2.collName);
    const employeeresult2 = await employeecollection2.find(Query);
    const employeeresults2 = await employeeresult2.toArray();
    const excelcolumns2 = [];
    const Employees2 = workbook.addWorksheet(empData2.FormName);
    EmployeeformElements2.forEach((ele) => {
      excelcolumns2.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees2.columns = excelcolumns2;
    employeeresults2.forEach((row2) => {
      const frow2 = flattenObj(row2);
      const editedRow2 = {};
      let dateValues2;
      EmployeeformElements2.forEach((gcol2) => {
        if (frow2[gcol2] !== undefined && frow2[gcol2] !== null && frow2[gcol2] !== '') {
          frow2[gcol2] = frow2[gcol2].toString();
          dateValues2 = frow2[gcol2];
        } else {
          dateValues2 = '';
        }
        if (gcol2 === 'Transfer Date' || gcol2 === 'Date of Joining' || dateValues2.includes(dateEndString)) {
          if (frow2[gcol2] !== undefined && frow2[gcol2] !== null && frow2[gcol2] !== '') {
            const value2 = dateHandler(frow2[gcol2]);
            const vald2 = moment(value2).format('D-MMM-YY');
            editedRow2[gcol2] = vald2;
          } else {
            editedRow2[gcol2] = frow2[gcol2];
          }
        } else {
          editedRow2[gcol2] = frow2[gcol2];
        }
      });
      Employees2.addRow(editedRow2);
    });
    const EmployeeformElements3 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Transition Changes'
    );
    const empData3 = Exceltemplates.find((key) => key.FormName === 'Transition Changes');
    const employeecollection3 = db.collection(empData3.collName);
    const employeeresult3 = await employeecollection3.find(Query);
    const employeeresults3 = await employeeresult3.toArray();
    const excelcolumns3 = [];
    const Employees3 = workbook.addWorksheet(empData3.FormName);
    EmployeeformElements3.forEach((ele) => {
      excelcolumns3.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees3.columns = excelcolumns3;
    employeeresults3.forEach((row3) => {
      const frow3 = flattenObj(row3);
      const editedRow3 = {};
      let dateValues3;
      EmployeeformElements3.forEach((gcol3) => {
        if (frow3[gcol3] !== undefined && frow3[gcol3] !== null && frow3[gcol3] !== '') {
          frow3[gcol3] = frow3[gcol3].toString();
          dateValues3 = frow3[gcol3];
        } else {
          dateValues3 = '';
        }
        if (gcol3 === 'Effective Date' || gcol3 === 'Date of Joining' || dateValues3.includes(dateEndString)) {
          if (frow3[gcol3] !== undefined && frow3[gcol3] !== null && frow3[gcol3] !== '') {
            const value3 = dateHandler(frow3[gcol3]);
            const vald3 = moment(value3).format('D-MMM-YY');
            editedRow3[gcol3] = vald3;
          } else {
            editedRow3[gcol3] = frow3[gcol3];
          }
        } else {
          editedRow3[gcol3] = frow3[gcol3];
        }
      });
      Employees3.addRow(editedRow3);
    });
    const EmployeeformElements4 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'One time Payment'
    );
    const empData4 = Exceltemplates.find((key) => key.FormName === 'One time Payment');
    const employeecollection4 = db.collection(empData4.collName);
    const employeeresult4 = await employeecollection4.find(Query);
    const employeeresults4 = await employeeresult4.toArray();
    const excelcolumns4 = [];
    const Employees4 = workbook.addWorksheet(empData4.FormName);
    EmployeeformElements4.forEach((ele) => {
      excelcolumns4.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees4.columns = excelcolumns4;
    employeeresults4.forEach((row4) => {
      const frow4 = flattenObj(row4);
      const editedRow4 = {};
      let dateValues4;
      EmployeeformElements4.forEach((gcol4) => {
        if (frow4[gcol4] !== undefined && frow4[gcol4] !== null && frow4[gcol4] !== '') {
          frow4[gcol4] = frow4[gcol4].toString();
          dateValues4 = frow4[gcol4];
        } else {
          dateValues4 = '';
        }
        if (gcol4 === 'Transfer Date' || gcol4 === 'Date of Joining' || dateValues4.includes(dateEndString)) {
          if (frow4[gcol4] !== undefined && frow4[gcol4] !== null && frow4[gcol4] !== '') {
            const value4 = dateHandler(frow4[gcol4]);
            const vald4 = moment(value4).format('D-MMM-YY');
            editedRow4[gcol4] = vald4;
          } else {
            editedRow4[gcol4] = frow4[gcol4];
          }
        } else {
          editedRow4[gcol4] = frow4[gcol4];
        }
      });
      Employees4.addRow(editedRow4);
    });
    const EmployeeformElements5 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'One time Deduction'
    );
    const empData5 = Exceltemplates.find((key) => key.FormName === 'One time Deduction');
    const employeecollection5 = db.collection(empData5.collName);
    const employeeresult5 = await employeecollection5.find(Query);
    const employeeresults5 = await employeeresult5.toArray();
    const excelcolumns5 = [];
    const Employees5 = workbook.addWorksheet(empData5.FormName);
    EmployeeformElements5.forEach((ele) => {
      excelcolumns5.push({ header: ele, key: ele, width: 50 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees5.columns = excelcolumns5;
    employeeresults5.forEach((row5) => {
      const frow5 = flattenObj(row5);
      const editedRow5 = {};
      let dateValues5;
      EmployeeformElements5.forEach((gcol5) => {
        if (frow5[gcol5] !== undefined && frow5[gcol5] !== null && frow5[gcol5] !== '') {
          frow5[gcol5] = frow5[gcol5].toString();
          dateValues5 = frow5[gcol5];
        } else {
          dateValues5 = '';
        }
        if (gcol5 === 'Transfer Date' || gcol5 === 'Date of Joining' || dateValues5.includes(dateEndString)) {
          if (frow5[gcol5] !== undefined && frow5[gcol5] !== null && frow5[gcol5] !== '') {
            const value5 = dateHandler(frow5[gcol5]);
            const vald5 = moment(value5).format('D-MMM-YY');
            editedRow5[gcol5] = vald5;
          } else {
            editedRow5[gcol5] = frow5[gcol5];
          }
        } else {
          editedRow5[gcol5] = frow5[gcol5];
        }
      });
      Employees5.addRow(editedRow5);
    });
    const EmployeeformElements6 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'LOP Reversal'
    );
    const empData6 = Exceltemplates.find((key) => key.FormName === 'LOP Reversal');
    const employeecollection6 = db.collection(empData6.collName);
    const employeeresult6 = await employeecollection6.find(Query);
    const employeeresults6 = await employeeresult6.toArray();
    const excelcolumns6 = [];
    const Employees6 = workbook.addWorksheet(empData6.FormName);
    EmployeeformElements6.forEach((ele) => {
      excelcolumns6.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees6.columns = excelcolumns6;
    employeeresults6.forEach((row6) => {
      const frow6 = flattenObj(row6);
      const editedRow6 = {};
      let dateValues6;
      EmployeeformElements6.forEach((gcol6) => {
        if (frow6[gcol6] !== undefined && frow6[gcol6] !== null && frow6[gcol6] !== '') {
          frow6[gcol6] = frow6[gcol6].toString();
          dateValues6 = frow6[gcol6];
        } else {
          dateValues6 = '';
        }
        if (gcol6 === 'Transfer Date' || gcol6 === 'Date of Joining' || dateValues6.includes(dateEndString)) {
          if (frow6[gcol6] !== undefined && frow6[gcol6] !== null && frow6[gcol6] !== '') {
            const value6 = dateHandler(frow6[gcol6]);
            const vald6 = moment(value6).format('D-MMM-YY');
            editedRow6[gcol6] = vald6;
          } else {
            editedRow6[gcol6] = frow6[gcol6];
          }
        } else {
          editedRow6[gcol6] = frow6[gcol6];
        }
      });
      Employees6.addRow(editedRow6);
    });
    const EmployeeformElements7 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'LOP Days'
    );
    const empData7 = Exceltemplates.find((key) => key.FormName === 'LOP Days');
    const employeecollection7 = db.collection(empData7.collName);
    const employeeresult7 = await employeecollection7.find(Query);
    const employeeresults7 = await employeeresult7.toArray();
    const excelcolumns7 = [];
    const Employees7 = workbook.addWorksheet(empData7.FormName);
    EmployeeformElements7.forEach((ele) => {
      excelcolumns7.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees7.columns = excelcolumns7;
    employeeresults7.forEach((row7) => {
      const frow7 = flattenObj(row7);
      const editedRow7 = {};
      let dateValues7;
      EmployeeformElements7.forEach((gcol7) => {
        if (frow7[gcol7] !== undefined && frow7[gcol7] !== null && frow7[gcol7] !== '') {
          frow7[gcol7] = frow7[gcol7].toString();
          dateValues7 = frow7[gcol7];
        } else {
          dateValues7 = '';
        }
        if (gcol7 === 'Transfer Date' || gcol7 === 'Date of Joining' || dateValues7.includes(dateEndString)) {
          if (frow7[gcol7] !== undefined && frow7[gcol7] !== null && frow7[gcol7] !== '') {
            const value7 = dateHandler(frow7[gcol7]);
            const vald7 = moment(value7).format('D-MMM-YY');
            editedRow7[gcol7] = vald7;
          } else {
            editedRow7[gcol7] = frow7[gcol7];
          }
        } else {
          editedRow7[gcol7] = frow7[gcol7];
        }
      });
      Employees7.addRow(editedRow7);
    });
    const EmployeeformElements8 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Loan Repayment Outside'
    );
    const empData8 = Exceltemplates.find((key) => key.FormName === 'Loan Repayment Outside');
    const employeecollection8 = db.collection(empData8.collName);
    const employeeresult8 = await employeecollection8.find(Query);
    const employeeresults8 = await employeeresult8.toArray();
    const excelcolumns8 = [];
    const Employees8 = workbook.addWorksheet(empData8.FormName);
    EmployeeformElements8.forEach((ele) => {
      excelcolumns8.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees8.columns = excelcolumns8;
    employeeresults8.forEach((row8) => {
      const frow8 = flattenObj(row8);
      const editedRow8 = {};
      let dateValues8;
      EmployeeformElements8.forEach((gcol8) => {
        if (frow8[gcol8] !== undefined && frow8[gcol8] !== null && frow8[gcol8] !== '') {
          frow8[gcol8] = frow8[gcol8].toString();
          dateValues8 = frow8[gcol8];
        } else {
          dateValues8 = '';
        }
        if (gcol8 === 'Transfer Date' || gcol8 === 'Date of Joining' || dateValues8.includes(dateEndString)) {
          if (frow8[gcol8] !== undefined && frow8[gcol8] !== null && frow8[gcol8] !== '') {
            const value8 = dateHandler(frow8[gcol8]);
            const vald8 = moment(value8).format('D-MMM-YY');
            editedRow8[gcol8] = vald8;
          } else {
            editedRow8[gcol8] = frow8[gcol8];
          }
        } else {
          editedRow8[gcol8] = frow8[gcol8];
        }
      });
      Employees8.addRow(editedRow8);
    });
    const EmployeeformElements9 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Employee Loan Detail'
    );
    const empData9 = Exceltemplates.find((key) => key.FormName === 'Employee Loan Detail');
    const employeecollection9 = db.collection(empData9.collName);
    const employeeresult9 = await employeecollection9.find(Query);
    const employeeresults9 = await employeeresult9.toArray();
    const excelcolumns9 = [];
    const Employees9 = workbook.addWorksheet(empData9.FormName);
    EmployeeformElements9.forEach((ele) => {
      excelcolumns9.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees9.columns = excelcolumns9;
    employeeresults9.forEach((row9) => {
      const frow9 = flattenObj(row9);
      const editedRow9 = {};
      let dateValues9;
      EmployeeformElements9.forEach((gcol9) => {
        if (frow9[gcol9] !== undefined && frow9[gcol9] !== null && frow9[gcol9] !== '') {
          frow9[gcol9] = frow9[gcol9].toString();
          dateValues9 = frow9[gcol9];
        } else {
          dateValues9 = '';
        }
        if (gcol9 === 'Transfer Date' || gcol9 === 'Loan Start Date' || dateValues9.includes(dateEndString)) {
          if (frow9[gcol9] !== undefined && frow9[gcol9] !== null && frow9[gcol9] !== '') {
            const value9 = dateHandler(frow9[gcol9]);
            const vald9 = moment(value9).format('D-MMM-YY');
            editedRow9[gcol9] = vald9;
          } else {
            editedRow9[gcol9] = frow9[gcol9];
          }
        } else {
          editedRow9[gcol9] = frow9[gcol9];
        }
      });
      Employees9.addRow(editedRow9);
    });
    const EmployeeformElements10 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Employee Resignation'
    );
    const empData10 = Exceltemplates.find((key) => key.FormName === 'Employee Resignation');
    const employeecollection10 = db.collection(empData10.collName);
    const employeeresult10 = await employeecollection10.find(Query);
    const employeeresults10 = await employeeresult10.toArray();
    const excelcolumns10 = [];
    const Employees10 = workbook.addWorksheet(empData10.FormName);
    EmployeeformElements10.forEach((ele) => {
      excelcolumns10.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees10.columns = excelcolumns10;
    employeeresults10.forEach((row10) => {
      const frow10 = flattenObj(row10);
      const editedRow10 = {};
      let dateValues10;
      EmployeeformElements10.forEach((gcol10) => {
        if (frow10[gcol10] !== undefined && frow10[gcol10] !== null && frow10[gcol10] !== '') {
          frow10[gcol10] = frow10[gcol10].toString();
          dateValues10 = frow10[gcol10];
        } else {
          dateValues10 = '';
        }
        if (
          gcol10 === 'Date of Resignation' ||
          gcol10 === 'Date of Joining' ||
          gcol10 === 'Date of Joining' ||
          dateValues10.includes(dateEndString)
        ) {
          if (frow10[gcol10] !== undefined && frow10[gcol10] !== null && frow10[gcol10] !== '') {
            const value10 = dateHandler(frow10[gcol10]);
            const vald10 = moment(value10).format('D-MMM-YY');
            editedRow10[gcol10] = vald10;
          } else {
            editedRow10[gcol10] = frow10[gcol10];
          }
        } else {
          editedRow10[gcol10] = frow10[gcol10];
        }
      });
      Employees10.addRow(editedRow10);
    });

    workbook.xlsx.writeFile(tempFilePath).then(function () {
      // eslint-disable-next-line no-console
      console.log('file is written');
      const d = new Date();
      downloadService.uploadToOneDrive(
        `${tenant.dbURI}/${monthNames[d.getMonth()]}`,
        `This Month Payroll Templates.xlsx`,
        req.query.oneDriveToken
      );
      res.sendFile(tempFilePath, function (err) {
        if (err) {
          // next(err);
          // eslint-disable-next-line no-console
          console.log('Sent:', tempFilePath);
        } else {
          // eslint-disable-next-line no-console
          console.log('Sent:', tempFilePath);
        }
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`OOOOOOO this is the error: ${err}`);
  }
};

const downloadExcelSelectMonth = async (req, res, date1) => {
  const date = new Date(date1);
  const monthName = date.toLocaleString('default', { month: 'long' });

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'download-greytip.xlsx');
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const Query = {
    $and: [{ WorkflowStatus: 'P_APPROVED' }, { month: monthName }, { year: date.getFullYear() }],
  };
  const client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
  const db = client.db(tenant.dbURI);
  try {
    const workbook = new ExcelJS.Workbook();
    const EmployeeformElements = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Employee'
    );
    const empData = Exceltemplates.find((key) => key.FormName === 'Employee');
    const employeecollection = db.collection(empData.collName);
    const employeeresult = await employeecollection.find(Query);
    const employeeresults = await employeeresult.toArray();
    const excelcolumns = [];
    const Employees = workbook.addWorksheet(empData.FormName);
    EmployeeformElements.forEach((ele) => {
      excelcolumns.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees.columns = excelcolumns;
    employeeresults.forEach((row) => {
      const frow = flattenObj(row);
      const editedRow = {};
      let dateValues;
      EmployeeformElements.forEach((gcol) => {
        if (frow[gcol] !== undefined && frow[gcol] !== null && frow[gcol] !== '') {
          frow[gcol] = frow[gcol].toString();
          dateValues = frow[gcol];
        } else {
          dateValues = '';
        }
        if (gcol === 'Date of Birth' || gcol === 'Date of Joining' || dateValues.includes(dateEndString)) {
          if (frow[gcol] !== undefined && frow[gcol] !== null && frow[gcol] !== '') {
            const value = dateHandler(frow[gcol]);
            const vald = moment(value).format('D-MMM-YY');
            editedRow[gcol] = vald;
          } else {
            editedRow[gcol] = frow[gcol];
          }
        } else {
          editedRow[gcol] = frow[gcol];
        }
      });
      Employees.addRow(editedRow);
    });
    const EmployeeformElements1 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Salary Revision'
    );
    const empData1 = Exceltemplates.find((key) => key.FormName === 'Salary Revision');
    const employeecollection1 = db.collection(empData1.collName);
    const employeeresult1 = await employeecollection1.find(Query);
    const employeeresults1 = await employeeresult1.toArray();
    const excelcolumns1 = [];
    const Employees1 = workbook.addWorksheet(empData1.FormName);
    EmployeeformElements1.forEach((ele) => {
      excelcolumns1.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees1.columns = excelcolumns1;
    employeeresults1.forEach((row1) => {
      const frow1 = flattenObj(row1);
      const editedRow1 = {};
      let dateValues1;
      EmployeeformElements1.forEach((gcol1) => {
        if (frow1[gcol1] !== undefined && frow1[gcol1] !== null && frow1[gcol1] !== '') {
          frow1[gcol1] = frow1[gcol1].toString();
          dateValues1 = frow1[gcol1];
        } else {
          dateValues1 = '';
        }
        if (gcol1 === 'Revision Effective Date' || dateValues1.includes(dateEndString)) {
          if (frow1[gcol1] !== undefined && frow1[gcol1] !== null && frow1[gcol1] !== '') {
            const value1 = dateHandler(frow1[gcol1]);
            const vald1 = moment(value1).format('D-MMM-YY');
            editedRow1[gcol1] = vald1;
          } else {
            editedRow1[gcol1] = frow1[gcol1];
          }
        } else {
          editedRow1[gcol1] = frow1[gcol1];
        }
      });
      Employees1.addRow(editedRow1);
    });
    const EmployeeformElements2 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Interstate Transfers'
    );
    const empData2 = Exceltemplates.find((key) => key.FormName === 'Interstate Transfers');
    const employeecollection2 = db.collection(empData2.collName);
    const employeeresult2 = await employeecollection2.find(Query);
    const employeeresults2 = await employeeresult2.toArray();
    const excelcolumns2 = [];
    const Employees2 = workbook.addWorksheet(empData2.FormName);
    EmployeeformElements2.forEach((ele) => {
      excelcolumns2.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees2.columns = excelcolumns2;
    employeeresults2.forEach((row2) => {
      const frow2 = flattenObj(row2);
      const editedRow2 = {};
      let dateValues2;
      EmployeeformElements2.forEach((gcol2) => {
        if (frow2[gcol2] !== undefined && frow2[gcol2] !== null && frow2[gcol2] !== '') {
          frow2[gcol2] = frow2[gcol2].toString();
          dateValues2 = frow2[gcol2];
        } else {
          dateValues2 = '';
        }
        if (gcol2 === 'Transfer Date' || gcol2 === 'Date of Joining' || dateValues2.includes(dateEndString)) {
          if (frow2[gcol2] !== undefined && frow2[gcol2] !== null && frow2[gcol2] !== '') {
            const value2 = dateHandler(frow2[gcol2]);
            const vald2 = moment(value2).format('D-MMM-YY');
            editedRow2[gcol2] = vald2;
          } else {
            editedRow2[gcol2] = frow2[gcol2];
          }
        } else {
          editedRow2[gcol2] = frow2[gcol2];
        }
      });
      Employees2.addRow(editedRow2);
    });
    const EmployeeformElements3 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Transition Changes'
    );
    const empData3 = Exceltemplates.find((key) => key.FormName === 'Transition Changes');
    const employeecollection3 = db.collection(empData3.collName);
    const employeeresult3 = await employeecollection3.find(Query);
    const employeeresults3 = await employeeresult3.toArray();
    const excelcolumns3 = [];
    const Employees3 = workbook.addWorksheet(empData3.FormName);
    EmployeeformElements3.forEach((ele) => {
      excelcolumns3.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees3.columns = excelcolumns3;
    employeeresults3.forEach((row3) => {
      const frow3 = flattenObj(row3);
      const editedRow3 = {};
      let dateValues3;
      EmployeeformElements3.forEach((gcol3) => {
        if (frow3[gcol3] !== undefined && frow3[gcol3] !== null && frow3[gcol3] !== '') {
          frow3[gcol3] = frow3[gcol3].toString();
          dateValues3 = frow3[gcol3];
        } else {
          dateValues3 = '';
        }
        if (gcol3 === 'Effective Date' || gcol3 === 'Date of Joining' || dateValues3.includes(dateEndString)) {
          if (frow3[gcol3] !== undefined && frow3[gcol3] !== null && frow3[gcol3] !== '') {
            const value3 = dateHandler(frow3[gcol3]);
            const vald3 = moment(value3).format('D-MMM-YY');
            editedRow3[gcol3] = vald3;
          } else {
            editedRow3[gcol3] = frow3[gcol3];
          }
        } else {
          editedRow3[gcol3] = frow3[gcol3];
        }
      });
      Employees3.addRow(editedRow3);
    });
    const EmployeeformElement4 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'One time Payment'
    );
    const empData4 = Exceltemplates.find((key) => key.FormName === 'One time Payment');
    const employeecollection4 = db.collection(empData4.collName);
    const employeeresult4 = await employeecollection4.find(Query);
    const employeeresults4 = await employeeresult4.toArray();
    const excelcolumns4 = [];
    const Employees4 = workbook.addWorksheet(empData4.FormName);
    EmployeeformElement4.forEach((ele) => {
      excelcolumns4.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees4.columns = excelcolumns4;
    employeeresults4.forEach((row4) => {
      const frow4 = flattenObj(row4);
      const editedRow4 = {};
      let dateValues4;
      EmployeeformElement4.forEach((gcol4) => {
        if (frow4[gcol4] !== undefined && frow4[gcol4] !== null && frow4[gcol4] !== '') {
          frow4[gcol4] = frow4[gcol4].toString();
          dateValues4 = frow4[gcol4];
        } else {
          dateValues4 = '';
        }
        if (gcol4 === 'Transfer Date' || gcol4 === 'Date of Joining' || dateValues4.includes(dateEndString)) {
          if (frow4[gcol4] !== undefined && frow4[gcol4] !== null && frow4[gcol4] !== '') {
            const value4 = dateHandler(frow4[gcol4]);
            const vald4 = moment(value4).format('D-MMM-YY');
            editedRow4[gcol4] = vald4;
          } else {
            editedRow4[gcol4] = frow4[gcol4];
          }
        } else {
          editedRow4[gcol4] = frow4[gcol4];
        }
      });
      Employees4.addRow(editedRow4);
    });
    const EmployeeformElements5 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'One time Deduction'
    );
    const empData5 = Exceltemplates.find((key) => key.FormName === 'One time Deduction');
    const employeecollection5 = db.collection(empData5.collName);
    const employeeresult5 = await employeecollection5.find(Query);
    const employeeresults5 = await employeeresult5.toArray();
    const excelcolumns5 = [];
    const Employees5 = workbook.addWorksheet(empData5.FormName);
    EmployeeformElements5.forEach((ele) => {
      excelcolumns5.push({ header: ele, key: ele, width: 50 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees5.columns = excelcolumns5;
    employeeresults5.forEach((row5) => {
      const frow5 = flattenObj(row5);
      const editedRow5 = {};
      let dateValues5;
      EmployeeformElements5.forEach((gcol5) => {
        if (frow5[gcol5] !== undefined && frow5[gcol5] !== null && frow5[gcol5] !== '') {
          frow5[gcol5] = frow5[gcol5].toString();
          dateValues5 = frow5[gcol5];
        } else {
          dateValues5 = '';
        }
        if (gcol5 === 'Transfer Date' || gcol5 === 'Date of Joining' || dateValues5.includes(dateEndString)) {
          if (frow5[gcol5] !== undefined && frow5[gcol5] !== null && frow5[gcol5] !== '') {
            const value5 = dateHandler(frow5[gcol5]);
            const vald5 = moment(value5).format('D-MMM-YY');
            editedRow5[gcol5] = vald5;
          } else {
            editedRow5[gcol5] = frow5[gcol5];
          }
        } else {
          editedRow5[gcol5] = frow5[gcol5];
        }
      });
      Employees5.addRow(editedRow5);
    });
    const EmployeeformElements6 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'LOP Reversal'
    );
    const empData6 = Exceltemplates.find((key) => key.FormName === 'LOP Reversal');
    const employeecollection6 = db.collection(empData6.collName);
    const employeeresult6 = await employeecollection6.find(Query);
    const employeeresults6 = await employeeresult6.toArray();
    const excelcolumns6 = [];
    const Employees6 = workbook.addWorksheet(empData6.FormName);
    EmployeeformElements6.forEach((ele) => {
      excelcolumns6.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees6.columns = excelcolumns6;
    employeeresults6.forEach((row6) => {
      const frow6 = flattenObj(row6);
      const editedRow6 = {};
      let dateValues6;
      EmployeeformElements6.forEach((gcol6) => {
        if (frow6[gcol6] !== undefined && frow6[gcol6] !== null && frow6[gcol6] !== '') {
          frow6[gcol6] = frow6[gcol6].toString();
          dateValues6 = frow6[gcol6];
        } else {
          dateValues6 = '';
        }
        if (gcol6 === 'Transfer Date' || gcol6 === 'Date of Joining' || dateValues6.includes(dateEndString)) {
          if (frow6[gcol6] !== undefined && frow6[gcol6] !== null && frow6[gcol6] !== '') {
            const value6 = dateHandler(frow6[gcol6]);
            const vald6 = moment(value6).format('D-MMM-YY');
            editedRow6[gcol6] = vald6;
          } else {
            editedRow6[gcol6] = frow6[gcol6];
          }
        } else {
          editedRow6[gcol6] = frow6[gcol6];
        }
      });
      Employees6.addRow(editedRow6);
    });
    const EmployeeformElements7 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'LOP Days'
    );
    const empData7 = Exceltemplates.find((key) => key.FormName === 'LOP Days');
    const employeecollection7 = db.collection(empData7.collName);
    const employeeresult7 = await employeecollection7.find(Query);
    const employeeresults7 = await employeeresult7.toArray();
    const excelcolumns7 = [];
    const Employees7 = workbook.addWorksheet(empData7.FormName);
    EmployeeformElements7.forEach((ele) => {
      excelcolumns7.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees7.columns = excelcolumns7;
    employeeresults7.forEach((row7) => {
      const frow7 = flattenObj(row7);
      const editedRow7 = {};
      let dateValues7;
      EmployeeformElements7.forEach((gcol7) => {
        if (frow7[gcol7] !== undefined && frow7[gcol7] !== null && frow7[gcol7] !== '') {
          frow7[gcol7] = frow7[gcol7].toString();
          dateValues7 = frow7[gcol7];
        } else {
          dateValues7 = '';
        }
        if (gcol7 === 'Transfer Date' || gcol7 === 'Date of Joining' || dateValues7.includes(dateEndString)) {
          if (frow7[gcol7] !== undefined && frow7[gcol7] !== null && frow7[gcol7] !== '') {
            const value7 = dateHandler(frow7[gcol7]);
            const vald7 = moment(value7).format('D-MMM-YY');
            editedRow7[gcol7] = vald7;
          } else {
            editedRow7[gcol7] = frow7[gcol7];
          }
        } else {
          editedRow7[gcol7] = frow7[gcol7];
        }
      });
      Employees7.addRow(editedRow7);
    });
    const EmployeeformElements8 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Loan Repayment Outside'
    );
    const empData8 = Exceltemplates.find((key) => key.FormName === 'Loan Repayment Outside');
    const employeecollection8 = db.collection(empData8.collName);
    const employeeresult8 = await employeecollection8.find(Query);
    const employeeresults8 = await employeeresult8.toArray();
    const excelcolumns8 = [];
    const Employees8 = workbook.addWorksheet(empData8.FormName);
    EmployeeformElements8.forEach((ele) => {
      excelcolumns8.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees8.columns = excelcolumns8;
    employeeresults8.forEach((row8) => {
      const frow8 = flattenObj(row8);
      const editedRow8 = {};
      let dateValues8;
      EmployeeformElements8.forEach((gcol8) => {
        if (frow8[gcol8] !== undefined && frow8[gcol8] !== null && frow8[gcol8] !== '') {
          frow8[gcol8] = frow8[gcol8].toString();
          dateValues8 = frow8[gcol8];
        } else {
          dateValues8 = '';
        }
        if (gcol8 === 'Transfer Date' || gcol8 === 'Date of Joining' || dateValues8.includes(dateEndString)) {
          if (frow8[gcol8] !== undefined && frow8[gcol8] !== null && frow8[gcol8] !== '') {
            const value8 = dateHandler(frow8[gcol8]);
            const vald8 = moment(value8).format('D-MMM-YY');
            editedRow8[gcol8] = vald8;
          } else {
            editedRow8[gcol8] = frow8[gcol8];
          }
        } else {
          editedRow8[gcol8] = frow8[gcol8];
        }
      });
      Employees8.addRow(editedRow8);
    });
    const EmployeeformElements9 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Employee Loan Detail'
    );
    const empData9 = Exceltemplates.find((key) => key.FormName === 'Employee Loan Detail');
    const employeecollection9 = db.collection(empData9.collName);
    const employeeresult9 = await employeecollection9.find(Query);
    const employeeresults9 = await employeeresult9.toArray();
    const excelcolumns9 = [];
    const Employees9 = workbook.addWorksheet(empData9.FormName);
    EmployeeformElements9.forEach((ele) => {
      excelcolumns9.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees9.columns = excelcolumns9;
    employeeresults9.forEach((row9) => {
      const frow9 = flattenObj(row9);
      const editedRow9 = {};
      let dateValues9;
      EmployeeformElements9.forEach((gcol9) => {
        if (frow9[gcol9] !== undefined && frow9[gcol9] !== null && frow9[gcol9] !== '') {
          frow9[gcol9] = frow9[gcol9].toString();
          dateValues9 = frow9[gcol9];
        } else {
          dateValues9 = '';
        }
        if (gcol9 === 'Transfer Date' || gcol9 === 'Loan Start Date' || dateValues9.includes(dateEndString)) {
          if (frow9[gcol9] !== undefined && frow9[gcol9] !== null && frow9[gcol9] !== '') {
            const value9 = dateHandler(frow9[gcol9]);
            const vald9 = moment(value9).format('D-MMM-YY');
            editedRow9[gcol9] = vald9;
          } else {
            editedRow9[gcol9] = frow9[gcol9];
          }
        } else {
          editedRow9[gcol9] = frow9[gcol9];
        }
      });
      Employees9.addRow(editedRow9);
    });
    const EmployeeformElements10 = await formSettingsService.getFormColumnElementsForDownloadcenter(
      req.params.companyId,
      'Employee Resignation'
    );
    const empData10 = Exceltemplates.find((key) => key.FormName === 'Employee Resignation');
    const employeecollection10 = db.collection(empData10.collName);
    const employeeresult10 = await employeecollection10.find(Query);
    const employeeresults10 = await employeeresult10.toArray();
    const excelcolumns10 = [];
    const Employees10 = workbook.addWorksheet(empData10.FormName);
    EmployeeformElements10.forEach((ele) => {
      excelcolumns10.push({ header: ele, key: ele, width: 30 });
    });
    // eslint-disable-next-line no-param-reassign
    Employees10.columns = excelcolumns10;
    employeeresults10.forEach((row10) => {
      const frow10 = flattenObj(row10);
      const editedRow10 = {};
      let dateValues10;
      EmployeeformElements10.forEach((gcol10) => {
        if (frow10[gcol10] !== undefined && frow10[gcol10] !== null && frow10[gcol10] !== '') {
          frow10[gcol10] = frow10[gcol10].toString();
          dateValues10 = frow10[gcol10];
        } else {
          dateValues10 = '';
        }
        if (
          gcol10 === 'Date of Resignation' ||
          gcol10 === 'Date of Joining' ||
          gcol10 === 'Date of Joining' ||
          dateValues10.includes(dateEndString)
        ) {
          if (frow10[gcol10] !== undefined && frow10[gcol10] !== null && frow10[gcol10] !== '') {
            const value10 = dateHandler(frow10[gcol10]);
            const vald10 = moment(value10).format('D-MMM-YY');
            editedRow10[gcol10] = vald10;
          } else {
            editedRow10[gcol10] = frow10[gcol10];
          }
        } else {
          editedRow10[gcol10] = frow10[gcol10];
        }
      });
      Employees10.addRow(editedRow10);
    });

    workbook.xlsx.writeFile(tempFilePath).then(function () {
      // eslint-disable-next-line no-console
      console.log('file is written');
      const d = new Date();
      downloadService.uploadToOneDrive(
        `${tenant.dbURI}/${monthNames[d.getMonth()]}`,
        `Select month Templates.xlsx`,
        req.query.oneDriveToken
      );
      res.sendFile(tempFilePath, function (err) {
        if (err) {
          // next(err);
          // eslint-disable-next-line no-console
          console.log('Sent:', tempFilePath);
        } else {
          // eslint-disable-next-line no-console
          console.log('Sent:', tempFilePath);
        }
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`OOOOOOO this is the error: ${err}`);
  }
};
const approvalpending = async (dbURI, req, date) => {
  const extractdate = new Date(date);
  const monthnumber = extractdate.getMonth();
  const lockmonth = monthNames[monthnumber];
  const lockyear = extractdate.getFullYear();
  let client;
  let db;
  const stats = {};

  const tenantDB = await switchDB(dbURI, TenantSchemas);
  try {
    client = await MongoClient.connect(config.mongoose.url, { useNewUrlParser: true });
    db = client.db(dbURI);
    const approves = {};
    const dCollectionEmployee = db.collection('employees');
    const tobeApprovedEmployee = await dCollectionEmployee.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectionSalary = db.collection('salaryrevisions');
    const tobeApprovedSalary = await dCollectionSalary.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectionInter = db.collection('interstatetransfers');
    const tobeApprovedInter = await dCollectionInter.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectionTrans = db.collection('transitionchanges');
    const tobeApprovedTrans = await dCollectionTrans.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectiononetimepaymets = db.collection('onetimepayments');
    const tobeApprovedonetimepayments = await dCollectiononetimepaymets.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectiononetimedeductions = db.collection('onetimedeductions');
    const tobeApprovedonetimedeductions = await dCollectiononetimedeductions.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );
    const dCollectionlopdays = db.collection('lopdays');
    const tobeApprovedonlopdays = await dCollectionlopdays.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectionloandetails = db.collection('loandetails');
    const tobeApprovedonloandetails = await dCollectionloandetails.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    const dCollectionresignations = db.collection('resignations');
    const tobeApprovedonresignations = await dCollectionresignations.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );
    const dCollectionrepayments = db.collection('repayments');
    const tobeApprovedonrepayments = await dCollectionrepayments.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );
    const dCollectionlopreversals = db.collection('lopreversals');
    const tobeApprovedonlopreversals = await dCollectionlopreversals.updateMany(
      { WorkflowStatus: 'P_APPROVED', month: lockmonth, year: lockyear },
      { $set: { lock: 'locked' } }
    );

    return tobeApprovedonlopreversals;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
module.exports = {
  downloadExcelAll,
  downloadExcelThismonth,
  downloadExcelSelectMonth,
  approvalpending,
};

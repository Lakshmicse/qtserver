/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const path = require('path');
const ExcelJS = require('exceljs');
const { ObjectId } = require('mongodb');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { Tenant } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { interStateTransferService, formSettingsService, employeeService } = require('../services');

const createInterStateTransfer = catchAsync(async (req, res) => {
  const interStateTransfer = await interStateTransferService.createInterStateTransfer(req.body, req.tenant.dbURI);
  res.status(httpStatus.CREATED).send(interStateTransfer);
});

const getInterStateTransferList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status', 'month', 'year']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await interStateTransferService.queryInterStateTransfer(filter, options, req.tenant.dbURI, req.user.role);
  res.send(result);
});
const checkduplicates = catchAsync(async (req, res) => {
  const lopDays = await interStateTransferService.checkDuplicatesBySearch(req.body, req.tenant.dbURI);
  res.send(lopDays);
});
const getInterStateTransfer = catchAsync(async (req, res) => {
  const interStateTransfer = await interStateTransferService.getInterStateTransferById(
    req.params.interStateTransferId,
    req.tenant.dbURI
  );
  if (!interStateTransfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'InterState Transfers not found');
  }
  res.send(interStateTransfer);
});

const updateInterStateTransfer = catchAsync(async (req, res) => {
  const interStateTransfer = await interStateTransferService.updateInterStateTransferById(
    req.params.interStateTransferId,
    req.body,
    req.tenant.dbURI
  );
  res.send(interStateTransfer);
});

const deleteInterStateTransfer = catchAsync(async (req, res) => {
  await interStateTransferService.deleteInterStateTransferById(req.params.interStateTransferId, req.tenant.dbURI);
  res.status(httpStatus.NO_CONTENT).send();
});
const getinterStateTransferBySearch = catchAsync(async (req, res) => {
  const interStateTransfer = await interStateTransferService.getInterStateTransferBySearch(
    req.params.searchId,
    req.tenant.dbURI,
    req.user.role
  );
  if (!interStateTransfer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'InterState Transfer  not found ');
  }
  res.send(interStateTransfer);
});
const downloadTemplate = catchAsync(async (req, res) => {
  const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'bulk-upload.xlsx');

  const formColumns = await formSettingsService.getFormColumnNames(req.params.companyId, 'Interstate Transfers');
  const formElements = await formSettingsService.getFormColumnElements(req.params.companyId, 'Interstate Transfers');
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const dburl = tenant.dbURI;
  const employees = await employeeService.queryEmployeeByCompanyId(req.params.companyId, dburl);
  
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Import Template');
    const WorkSheet2 = await workbook.addWorksheet('AllDropdownvalues');
    const columnsele = [];
    // const columns = [];
    // formColumns.forEach((ele) => {
    //   columns.push({ header: ele, key: ele, width: 10 });
    // });
    formElements.forEach((ele) => {
      if (ele.isChecked) {
      columnsele.push({ header: ele.name, key: ele.name, width: 10 });
      }
    });

    worksheet.columns = columnsele;
    WorkSheet2.columns = columnsele;
    let index = 2;
    let min;
    let max;
    employees.forEach((record) => {
      worksheet.insertRow(index, {
        'Employee Number': record['Personal Information']['Employee Number'],
        'Employee Name': record['Personal Information']['Employee Name'],
      });
      index += 1;
    });
    formElements.forEach((ele) => {
      if (ele.isChecked) {
      if (ele.mandatory === true) {
        worksheet.getColumn(ele.name).font = { color: { argb: 'FFFF0000' } };
      }  else {
        worksheet.getColumn(ele.name).font = { color: { argb: '00000000' } };
      }
      if (ele.dataType === 'autocomplete' || ele.dataType === 'dropdown') {
        const idCol = worksheet.getColumn(ele.name);
        const idCol2 = WorkSheet2.getColumn(ele.name);
        const newFirstElement = idCol2._header;
        const newArray = [newFirstElement].concat(ele.enum);
        idCol2.values = newArray;
        const celladdress = idCol.letter;
        const valuecell = `${celladdress}2:${celladdress}9999`;
        const columnname2 = `AllDropdownvalues!$${celladdress}$2:$${celladdress}$500`;
        worksheet.dataValidations.add(valuecell, {
          type: 'list',
          allowBlank: true,
          formulae: [columnname2],
          showInputMessage: true,
          prompt: `Please Select Value from the Existed Dropdown`,
        });
      }
      WorkSheet2.state = 'hidden';
      if (ele.dataType === 'number' && ele.validation.minValue !== null && ele.validation.maxValue !== null) {
        worksheet.getColumn(ele.name).font = { color: { argb: 'FF0000FF' } };
        const idCol = worksheet.getColumn(ele.name);
        const celladdress = idCol.letter;
        min = parseInt(ele.validation.minValue, 10);
        max = parseInt(ele.validation.maxValue, 10);
        // eslint-disable-next-line no-plusplus
        for (let row = 1; row <= 9999; row++) {
          const cell = worksheet.getCell(`${celladdress}${row}`);
          worksheet.getCell(`${celladdress}${row}`).alignment = { horizontal: 'right' };
          cell.dataValidation = {
            type: 'whole',
            operator: 'between',
            showErrorMessage: true,
            errorStyle: 'error',
            error: `The ${ele.name} must between ${min} and ${max}`,
            errorTitle: 'Value Range',
            showInputMessage: true,
            prompt: `The ${ele.name} must between ${min} and ${max}`,
            formulae: [min, max], // Minimum value
            // formula2: ele.validation.maxLength, // Maximum value (a very large number)
          };
        }
      }
      if (
        ele.dataType === 'number' &&
        ele.validation.minLength !== null &&
        ele.validation.maxLength !== null &&
        ele.validation.minLength !== ele.validation.maxLength
      ) {
        worksheet.getColumn(ele.name).font = { color: { argb: 'FF0000FF' } };
        const idCol = worksheet.getColumn(ele.name);
        const celladdress = idCol.letter;
        min = parseInt(ele.validation.minLength, 10);
        max = parseInt(ele.validation.maxLength, 10);
        // eslint-disable-next-line no-plusplus
        for (let row = 1; row <= 9999; row++) {
          const cell = worksheet.getCell(`${celladdress}${row}`);
          worksheet.getCell(`${celladdress}${row}`).alignment = { horizontal: 'right' };
          cell.dataValidation = {
            type: 'textLength',
            operator: 'between',
            showErrorMessage: true,
            errorStyle: 'error',
            error: `The ${ele.name} length must between ${min} and ${max} characters`,
            errorTitle: 'Character Limit',
            showInputMessage: true,
            prompt: `The ${ele.name} length must between ${min} and ${max} characters`,
            formulae: [min, max], // Minimum value
            // formula2: ele.validation.maxLength, // Maximum value (a very large number)
          };
        }
      }
      if (
        ele.dataType === 'number' &&
        ele.validation.minLength !== null &&
        ele.validation.maxLength !== null &&
        ele.validation.minLength === ele.validation.maxLength
      ) {
        worksheet.getColumn(ele.name).font = { color: { argb: 'FF0000FF' } };
        const idCol = worksheet.getColumn(ele.name);
        const celladdress = idCol.letter;
        min = parseInt(ele.validation.minLength, 10);
        max = parseInt(ele.validation.maxLength, 10);
        // eslint-disable-next-line no-plusplus
        for (let row = 1; row <= 9999; row++) {
          const cell = worksheet.getCell(`${celladdress}${row}`);
          worksheet.getCell(`${celladdress}${row}`).alignment = { horizontal: 'right' };
          cell.dataValidation = {
            type: 'textLength',
            operator: 'equal',
            showErrorMessage: true,
            errorStyle: 'error',
            error: `The ${ele.name} must be equal ${min} Digits`,
            errorTitle: 'Character Limit',
            showInputMessage: true,
            prompt: `The ${ele.name} must be equal ${min} Digits`,
            formulae: [min], // Minimum value
            // formula2: ele.validation.maxLength, // Maximum value (a very large number)
          };
        }
      }
      if (
        ele.dataType === 'number' &&
        ele.validation.minLength === null &&
        ele.validation.maxLength === null &&
        ele.validation.minValue === null &&
        ele.validation.maxValue === null
      ) {
        worksheet.getColumn(ele.name).font = { color: { argb: 'FF0000FF' } };
        const idCol = worksheet.getColumn(ele.name);
        const celladdress = idCol.letter;
        // eslint-disable-next-line no-plusplus
        for (let row = 1; row <= 9999; row++) {
          const cell = worksheet.getCell(`${celladdress}${row}`);
          worksheet.getCell(`${celladdress}${row}`).alignment = { horizontal: 'right' };
        }
      }
      if (
        ele.dataType === 'string' &&
        ele.validation.minLength !== null &&
        ele.validation.maxLength !== null &&
        ele.validation.minLength !== ele.validation.maxLength
      ) {
        const idCol = worksheet.getColumn(ele.name);
        const celladdress = idCol.letter;
        min = parseInt(ele.validation.minLength, 10);
        max = parseInt(ele.validation.maxLength, 10);
        // eslint-disable-next-line no-plusplus
        for (let row = 1; row <= 9999; row++) {
          const cell = worksheet.getCell(`${celladdress}${row}`);
          cell.dataValidation = {
            type: 'textLength',
            operator: 'between',
            showErrorMessage: true,
            errorStyle: 'error',
            error: `The ${ele.name} length must between ${min} and ${max} characters`,
            errorTitle: 'Character Limit',
            showInputMessage: true,
            prompt: `The ${ele.name} length must between ${min} and ${max} characters`,
            formulae: [min, max], // Minimum value
            // formula2: ele.validation.maxLength, // Maximum value (a very large number)
          };
        }
      }
      if (
        ele.dataType === 'string' &&
        ele.validation.minLength !== null &&
        ele.validation.maxLength !== null &&
        ele.validation.minLength === ele.validation.maxLength
      ) {
        const idCol = worksheet.getColumn(ele.name);
        const celladdress = idCol.letter;
        min = parseInt(ele.validation.minLength, 10);
        max = parseInt(ele.validation.maxLength, 10);
        // eslint-disable-next-line no-plusplus
        for (let row = 1; row <= 9999; row++) {
          const cell = worksheet.getCell(`${celladdress}${row}`);
          cell.dataValidation = {
            type: 'textLength',
            operator: 'equal',
            showErrorMessage: true,
            errorStyle: 'error',
            error: `The ${ele.name} must be equal to ${min} characters`,
            errorTitle: 'Character Limit',
            showInputMessage: true,
            prompt: `The ${ele.name} must be equal to ${min} characters`,
            formulae: [min], // Minimum value
            // formula2: ele.validation.maxLength, // Maximum value (a very large number)
          };
        }
      }
    }
    });
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    workbook.xlsx.writeFile(tempFilePath).then(function () {
      // eslint-disable-next-line no-console
      console.log('file is written');
      res.setHeader('Content-Disposition', 'attachment; filename=InterState Transfers.xlsx');
      res.setHeader('Content-Transfer-Encoding', 'binary');
      res.setHeader('Content-Type', 'application/octet-stream');
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
});
const downloadGeytip = catchAsync(async (req, res) => {
  interStateTransferService.downloadGreytip(req, res);
});
const bulkImport = catchAsync(async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send('Please upload an excel file!');
    }

    const ExcelFilePath = req.file.path;
    let dburl;
    if (req.tenant === null) {
      const tenant = await Tenant.findOne({ ClientId: ObjectId(req.body.companyId) });
      dburl = tenant.dbURI;
    } else {
      dburl = req.tenant.dbURI;
    }
    const response = await interStateTransferService.bulkImport(ExcelFilePath, req, res, dburl);
    res.status(200).send(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}`,
    });
  }
});
const postBulkApproval = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id', 'type', 'remarks', 'month', 'year']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await interStateTransferService.bulkUpdateSalary(filter, options, req.tenant.dbURI);
  res.send(result);
});
const postDelete = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['id', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await interStateTransferService.bulkdelete(filter, options, req.tenant.dbURI);
  res.send(result);
});
module.exports = {
  createInterStateTransfer,
  getInterStateTransfer,
  getInterStateTransferList,
  updateInterStateTransfer,
  deleteInterStateTransfer,
  getinterStateTransferBySearch,
  bulkImport,
  downloadTemplate,
  downloadGeytip,
  postBulkApproval,
  checkduplicates,
  postDelete,
};

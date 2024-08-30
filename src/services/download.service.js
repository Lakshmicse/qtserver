/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const path = require('path');
const ExcelJS = require('exceljs');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const mime = require('mime');
const request = require('request');
const catchAsync = require('../utils/catchAsync');
const {  formSettingsService } = require('.');
const config = require('../config/config');


const { switchDB, getDBModel } = require('../db/utility');
// const { mapping } = require('../db/greyTipMapping');
const {Tenant } = require('../models');

const TenantSchemas = new Map([]);
const downloadTemplate = catchAsync(async (res, companyId, resourceType) => {
  const tempFilePath = `${resourceType}.xlsx`;
  const options = {
    root: path.join(__dirname, '..', '..', 'resource'),
  }

  const formColumns = await formSettingsService.getFormColumnNames(companyId, resourceType);

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Import Template');
    const columns = [];
    formColumns.forEach((ele) => {
      columns.push({ header: ele, key: ele, width: 10 });
    });

    worksheet.columns = columns;

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    workbook.xlsx.writeFile(tempFilePath).then(function () {
      // eslint-disable-next-line no-console
      res.setHeader('Content-Disposition', `attachment; filename=${resourceType}.xlsx`);
      res.setHeader('Content-Transfer-Encoding', 'binary');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.sendFile(tempFilePath, options, function (err) {
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
const downloadGreytip = async (req, res) => {
  const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'download-greytip.xlsx');
  const tenant = await Tenant.findOne({ ClientId: ObjectId(req.params.companyId) });
  const tenantDB = await switchDB(tenant.dbURI, TenantSchemas);
  const SalaryRevision = await getDBModel(tenantDB, 'SalaryRevisions');

  // eslint-disable-next-line array-callback-return
  const greyTipTemplate = mapping.categories.find((item) => {
    if (item.name === 'Bulk Salary Information Of Employees') return true;
  });

  const results = await SalaryRevision.find({ WorkflowStatus: 'P_APPROVED' });
  const greytipMapping = {};
  greyTipTemplate.fields.forEach((gcol) => {
    greytipMapping[gcol.name] = gcol.system_field;
  });
  const scolumns = Object.keys(greytipMapping);

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Greytip Upload Template');
    const columns = [];
    scolumns.forEach((ele) => {
      columns.push({ header: ele, key: ele, width: 30 });
    });

    const i = [];
    worksheet.columns = columns;
    results.forEach((row) => {
      const editedRow = {};
      i.push(row);
      scolumns.forEach((gcol) => {
        const mappedCol = greytipMapping[gcol];
        editedRow[gcol] = row[mappedCol];
      });
      worksheet.addRow(editedRow);
    });

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    workbook.xlsx.writeFile(tempFilePath).then(function () {
      // eslint-disable-next-line no-console
      console.log('file is written');
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

const uploadToOneDrive = async (folder, file, token) => {
  // const file = tempFilePath; // Filename you want to upload on your local PC
      const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'download-greytip.xlsx');
      // console.log("OnmeDriveToken",token,";");
      fs.readFile(tempFilePath, function read(e, f) {
        request.put(
          {
            url: `https://graph.microsoft.com/v1.0/drive/root:/${folder}/${file}:/content`,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': mime.getType(file), // When you use old version, please modify this to "mime.lookup(file)",
            },
            body: f,
          },
          function (er, re, bo) {
            // console.log(bo);
            // eslint-disable-next-line no-console
            console.log(er);
          }
        );
      });
}
const getGreytipFiles = async (req, res, filename, file) => {
  try {
    // const folderpath = 'G:\\Pierian_New\\Gandhada Gudi\\Payroll Templates\\ABC_PRIVATE_LIMITED\\2023\\March\\LOP Reversal Importer.xlsx';
    // res.setHeader('Content-Type', 'text/plain');
    // res.setHeader('Content-Disposition', `attachment; filename=${file}.xlsx`);
      res.sendFile(filename, function (err) {
        if (err) {
          // next(err);
          // eslint-disable-next-line no-console
          console.log('Sent:', filename);
        } else {
          // eslint-disable-next-line no-console
          console.log('Sent:', filename);
        }
      });
    // });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`OOOOOOO this is the error: ${err}`);
  }
};

module.exports = {
  downloadTemplate,
  downloadGreytip,
  uploadToOneDrive,
  getGreytipFiles
};

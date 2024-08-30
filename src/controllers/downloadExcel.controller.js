/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const path = require('path');
const ExcelJS = require('exceljs');
const fs = require('fs');

const { ObjectId } = require('mongodb');
const catchAsync = require('../utils/catchAsync');
const { downloadExcel, auditlogService, downloadService } = require('../services');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

const { Tenant } = require('../models');

const downloadexcelall = catchAsync(async (req, res) => {
  downloadExcel.downloadExcelAll(req, res);
});
const downloadexcelthisMonth = catchAsync(async (req, res) => {
  downloadExcel.downloadExcelThismonth(req, res);
});
const downloadexcelselectMonth = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'date']);
  downloadExcel.downloadExcelSelectMonth(req, res, filter.date);
});
const LockselectMonth = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'date']);
  downloadExcel.approvalpending(req.tenant.dbURI, res, filter.date);
});
const getGreytipFilesList = async (req, res) => {
  const filter = pick(req.query, ['ClientName', 'Year', 'Month']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
 const folderpath1 = path.join(__dirname, '..', '..', '..', 'Payroll Templates', filter.ClientName);
  const folderpath2 = path.join(__dirname, '..', '..', '..', 'Payroll Templates', filter.ClientName, filter.Year);

  const folderpath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'Payroll Templates',
    filter.ClientName,
    filter.Year,
    filter.Month
  );
  let tempfilepath;
  const response = [];
   if (fs.existsSync(folderpath1)) {
    if (fs.existsSync(folderpath2)) {
      if (fs.existsSync(folderpath)) {
        fs.readdirSync(folderpath).forEach(async function (file) {
           tempfilepath = `${folderpath}\\${file}`;
           response[file] = tempfilepath;
          response.push(file);
        });
      } else {
       res.send('803: The requested resource was not found.');
      }
    } else {
      res.send('802: The requested resource was not found.');
    }
  } else {
   res.send('801: The requested resource was not found.');
  }
  res.send(response);
};
const getGreytipFiles = async (req, res) => {
  const filter = pick(req.query, ['ClientName', 'Year', 'Month', 'Filename']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const folderpath1 = path.join(__dirname, '..', '..', '..', 'Payroll Templates', filter.ClientName);
  const folderpath2 = path.join(__dirname, '..', '..', '..', 'Payroll Templates', filter.ClientName, filter.Year);
  const folderpath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'Payroll Templates',
    filter.ClientName,
    filter.Year,
    filter.Month
  );
  if (fs.existsSync(folderpath1)) {
   if (fs.existsSync(folderpath2)) {
     if (fs.existsSync(folderpath)) {
try{
        const filename = filter.Filename.replaceAll("'", '');
        const fileName = `${filter.ClientName}_${filename}.xlsx`;
        const tempfilepath = `${folderpath}/${filename}.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const readStream = fs.createReadStream(tempfilepath);
        readStream.pipe(res);
    } catch { 
      
        res.send('801: The requested resource was not found.');

}
      } else {
        res.send('803: The requested resource was not found.');
      }
    }else {
      res.send('802: The requested resource was not found.');
   }
 } else {
    res.send('801: The requested resource was not found.');
  }
};
// const getGreytipFiles = async (req, res) => {
//   const filter = pick(req.query, ['ClientName', 'Year', 'Month']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const folderpath = 'G:\\Pierian_New\\Gandhada Gudi\\Payroll Templates\\ABC_PRIVATE_LIMITED\\2023\\March';
//   const newfilepath = path.join(__dirname, '..');
//   // const tempFilePath = path.join(
//   //   __dirname,
//   //   '..',
//   //   '..',
//   //   '..',
//   //   'Payroll Templates',
//   //   tenant.dbURI,
//   //   yearstring,
//   //   monthname,
//   //   `${Template['Payroll Form Name']}.xlsx`
//   // );
//   let tempfilepath;
//   // let data;
//   fs.readdirSync(folderpath).forEach(async function (file) {
//     // console.log(file);
//     tempfilepath = `${folderpath}\\${file}`;
//     fs.readFile(tempfilepath, (err, data) => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.end(data);
//     });
//     await res.sendFile(tempfilepath, async function (err) {
//       if (err) {
//         // next(err);
//         // eslint-disable-next-line no-console
//         await console.log('Sent:', tempfilepath);
//       } else {
//         // eslint-disable-next-line no-console
//         console.log('Sent:', tempfilepath);
//       }
//     });

//     // data = await downloadService.getGreytipFiles(req, res, tempfilepath, file);
//   });

//   // const data = downloadService.getGreytipFiles(req, res);
//   // eslint-disable-next-line no-console
//   // console.log(data);
// };

module.exports = {
  downloadexcelall,
  downloadexcelthisMonth,
  downloadexcelselectMonth,
  getGreytipFilesList,
  getGreytipFiles,
  LockselectMonth,
};

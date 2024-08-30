const path = require('path');
const ExcelJS = require('exceljs');
const catchAsync = require('../utils/catchAsync');
const { auditlogService } = require('../services');

const getSummery = catchAsync(async (req, res) => {
  const tempFilePath = path.join(__dirname, '..', '..', 'resource', 'auit_log.xlsx');
  const auditLog = await auditlogService.getAuditlogById(req.params.auditLogId);

  const data = JSON.parse(auditLog.Data);
  const columns = [];

  // console.log( data );

  // eslint-disable-next-line no-console
  console.log('================================');
  try {
    const workbook = new ExcelJS.Workbook();
    const successworksheet = workbook.addWorksheet('Imported Employeed');
    const rejectedWorksheet = workbook.addWorksheet('Rejected Employeed', { properties: { tabColor: { argb: 'FFC0000' } } });
    // const columns = ['Error'];

    let headerRow;

    if (data.success.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      headerRow = data.success[0];
    } else if (data.rejected.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      headerRow = data.rejected[0];
    } else {
      headerRow = { msg: '' };
    }

    const keys = Object.keys(headerRow);
    keys.forEach((ele) => {
      columns.push({ header: ele, key: ele, width: 30 });
    });

    successworksheet.columns = columns;

    rejectedWorksheet.columns = columns;

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
    res.status(500).send({ message: 'Error In code' });
  }
});
module.exports = { getSummery };

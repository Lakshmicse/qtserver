/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');

const { ObjectId } = require('mongodb');
const fs = require('fs');
const moment = require('moment');
const { Tenant } = require('../models');

const excelFilter = async (req, file, cb) => {
  if (file.mimetype.includes('excel')|| file.mimetype.includes('application/x-zip-compressed') || file.mimetype.includes('spreadsheetml')|| file.mimetype.includes('application/pdf')|| file.mimetype.includes('application/zip') || file.mimetype.includes('openxmlformats-officedocument') || file.mimetype.includes('document') ||  file.mimetype.includes('wordprocessingml') || file.mimetype.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')||  file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};

// const tenant = await Tenant.findOne({ ClientId: ObjectId(req.body.companyId) });
// req.dburl = tenant.dbURI;
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const tenant = await Tenant.findOne({ ClientId: ObjectId(req.user.companyId) });
    const dburl = tenant.dbURI;
    const uploadPath = path.join(__dirname, '..', '..', 'resource',dburl);
    if (!fs.existsSync(uploadPath)) {
        await fs.mkdirSync(uploadPath);
      }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // eslint-disable-next-line no-console
//     console.log(file.originalname);
//     const fileNameWithExtension = path.basename(file.originalname);
//   const fileName = path.parse(fileNameWithExtension).name;
  
    
//     const extension = path.extname(file.originalname);
//     const newFileName = `${fileName} - ${dateformat}${extension}`;
    // const filename = file.originalname;
    // Rename the file
    // fs.renameSync(filename, newFileName);
    const date = new Date()
    const dateformat = moment(date).format('DD_MM_yyyy_HH_mm');
    const fileNameWithExtension = path.basename(file.originalname);
    let fileName = path.parse(fileNameWithExtension).name;
    fileName = fileName.replace(/\s+/g, '_') 
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const newFileName = `${fileName}_${dateformat}`; // Implement your own logic to generate a new filename
    const finalFileName = newFileName + extension;
    cb(null, finalFileName);
    
    // cb(null, `${newFileName}`);
  },
});

const uploadFile = multer({ storage, fileFilter: excelFilter });
module.exports = uploadFile;

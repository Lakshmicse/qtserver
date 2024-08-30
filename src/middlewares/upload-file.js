// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');

const excelFilter = (req, file, cb) => {
  if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'resource');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // eslint-disable-next-line no-console
    console.log(file.originalname);
    cb(null, `${file.originalname}`);
  },
});

const uploadFile = multer({ storage, fileFilter: excelFilter });
module.exports = uploadFile;

// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');

const imageFiter = (req, file, cb) => {
  if (file.mimetype.includes('jpeg') || file.mimetype.includes('png')) {
    cb(null, true);
  } else {
    cb('Please upload only image file.', false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/product');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // eslint-disable-next-line no-console
    console.log(file.originalname);
    cb(null, `${file.originalname}`);
  },
});

const uploadFile = multer({ storage});
module.exports = uploadFile;

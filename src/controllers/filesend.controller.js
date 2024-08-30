/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const path = require('path');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { companyService } = require('../services');
const {  fileSend } = require('../services');
const ApiError = require('../utils/ApiError');
const { Tenant } = require('../models');

const createSendFile = catchAsync(async (req, res) => {
  const uploadPath = path.join(__dirname, '..', '..', 'resource',req.tenant.dbURI);
  const date = new Date()
  const dateformat = moment(date).format('DD_MM_yyyy_HH_mm');
  const fileNameWithExtension = path.basename(req.body.fileName);
  let fileName = path.parse(fileNameWithExtension).name;
  fileName = fileName.replace(/\s+/g, '_') 
  const originalName = req.body.fileName;
  const extension = path.extname(originalName);
  const newFileName = `${fileName}_${dateformat}`; // Implement your own logic to generate a new filename
  const finalFileName = newFileName + extension;
  req.body.filePath = uploadPath;
  req.body.fileName = finalFileName;
    const filesend = await fileSend.createFileSendCreation(req.body, req.tenant.dbURI);
    res.status(httpStatus.CREATED).send(filesend);
});

const uploadLogo = catchAsync(async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).send('Please upload logo file!');
    }
    const { companyId } = req.body;

    const selectedCompny = await companyService.getCompanyById(companyId);
    // selectedCompny.logo = req.file.filename;
    try {
      const updateBody = { logo: req.file.filename };
      Object.assign(selectedCompny, updateBody);
      // selectedCompny.save();
    } catch (error) {
      res.status(500).send({
        message: `Could not update db`,
      });
    }
    res.status(200).send(req.file);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).send({
      message: `Could not upload the image: ${req.file.originalname}`,
    });
  }
});
const getDocuments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await fileSend.queryAllfileslist(filter, options, req.tenant.dbURI);
  res.send(result);
});

const getDocumentsByID = catchAsync(async (req, res) => {
  const documents = await fileSend.getfilesById(req.params.DocumentId, req.tenant.dbURI);
  if (!documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Documents not found');
  }
  res.send(documents);
});

const updateDocuments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status', 'companyid' ]);
  const tenant = await Tenant.findOne({ ClientId: ObjectId(filter.companyid) });
  const dburl = tenant.dbURI;
  const documents = await fileSend.updatefilesById(req.params.DocumentId, req.body, dburl, res);
  res.send(documents);
});

const deleteDocuments = catchAsync(async (req, res) => {
  await fileSend.deletefilesById(req.params.DocumentId, req.tenant.dbURI);
  res.status(httpStatus.NO_CONTENT).send();
});
const getDocumentsBySearch = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const Documents = await fileSend.getfilesBySearch(req.params.searchId, filter, req.tenant.dbURI);
  if (!Documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Documents not found ');
  }
  res.send(Documents);
});
const getReceived = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const Documents = await fileSend.getReceivedfiles(req.params.searchId, filter, req.tenant.dbURI, req.user);
  if (!Documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Documents not found ');
  }
  res.send(Documents);
});
const getsent = catchAsync(async (req, res) => {
  const Documents = await fileSend.getSentfiles(req.params.searchId, req.tenant.dbURI);
  if (!Documents) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Documents not found ');
  }
  res.send(Documents);
});

module.exports = {
  uploadLogo,
  createSendFile,
  getDocuments,
  getDocumentsByID,
  updateDocuments,
  deleteDocuments,
  getDocumentsBySearch,
  getReceived,
  getsent
};

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { contactUsService } = require('../services/');

const create = catchAsync(async (req, res) => {
  const contactUsSubmission = await contactUsService.createContactUs(req.body);
  res.status(httpStatus.CREATED).send(contactUsSubmission);
});

const list = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'phone', 'deliveryZipCode']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await contactUsService.queryContactUs(filter, options);
  res.send(result);
});

const get = catchAsync(async (req, res) => {
  const contactUsSubmission = await contactUsService.getContactUsById(req.params.contactUsId);

  if (!contactUsSubmission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact submission not found');
  }
  res.send(contactUsSubmission);
});

const update = catchAsync(async (req, res) => {
  const updatedContactUsSubmission = await contactUsService.updateContactUsById(req.params.contactUsId, req.body);

  if (!updatedContactUsSubmission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact submission not found');
  }
  res.send(updatedContactUsSubmission);
});

const deleteById = catchAsync(async (req, res) => {
  await contactUsService.deleteContactUsById(req.params.contactUsId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  list,
  get,
  update,
  deleteById,
};
const catchAsync = require('../utils/catchAsync');
const { externalApiValidationService } = require('../services');

const validatePan = catchAsync(async (req, res) => {
  const { PAN } = req.params;
  const result = await externalApiValidationService.panValidator(PAN);
  // eslint-disable-next-line no-console
  // console.log(res);
  res.send(result);
});

const validateGstn = catchAsync(async (req, res) => {
  const { GSTN } = req.params;
  const result = await externalApiValidationService.gstnValidator(GSTN);
  res.send(result);
});

const validateAadhaar = catchAsync(async (req, res) => {
  const { aadhaar } = req.params;
  const result = await externalApiValidationService.aadhaarValidator(aadhaar);
  res.send(result);
});

module.exports = {
  validatePan,
  validateGstn,
  validateAadhaar,
};

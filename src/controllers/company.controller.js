const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { companyService } = require('../services');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const getCompanies = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['ClientName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await companyService.queryCompany(filter, options);
  res.send(result);
});
const createCompany = catchAsync(async (req, res) => {
  const company = await companyService.createCompany(req.body);
  res.status(httpStatus.CREATED).send(company);
});

const getCompany = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  res.send(company);
});
const getCompanyBySearch = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyBySearch(req.params.searchId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found ');
  }
  res.send(company);
});

const updateCompany = catchAsync(async (req, res) => {
  const user = await companyService.updateCompanyById(req.params.companyId, req.body);
  res.send(user);
});

const deleteCompany = catchAsync(async (req, res) => {
  const result = await companyService.deleteCompanyById(req.params.companyId);
  res.send(result);
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
      selectedCompny.save();
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
const getPayrollCompany = catchAsync(async (req, res) => {
  const company = await companyService.getPayrollCompanyById(req.params.companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  res.send(company);
});
const getPayrollCompanypreviousyear = catchAsync(async (req, res) => {
  const company = await companyService.getPayrollCompanyByIdpreviousyear(req.params.companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  res.send(company);
});

module.exports = {
  getCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  uploadLogo,
  getCompanyBySearch,
  getPayrollCompany,
  getPayrollCompanypreviousyear,
};

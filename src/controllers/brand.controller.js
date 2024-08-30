const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const brandService = require('../services/brand.service');


// Create a new brand
const create = catchAsync(async (req, res) => {

  const brand = await brandService.createBrand(req.body);
  res.status(httpStatus.CREATED).send(brand);
});

// List all brands with optional filters and pagination
const list = catchAsync(async (req, res) => {

  const filter = pick(req.query, ['name']); // Adjust filters as needed
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await brandService.queryBrands(filter, options);
  res.send(result);
});

// Get a brand by ID
const get = catchAsync(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  res.send(brand);
});

// Update a brand by ID
const update = catchAsync(async (req, res) => {
  const updatedBrand = await brandService.updateBrandById(req.params.brandId, req.body);
  if (!updatedBrand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  res.send(updatedBrand);
});

// Delete a brand by ID
const deleteById = catchAsync(async (req, res) => {
  await brandService.deleteBrandById(req.params.brandId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  list,
  get,
  update,
  deleteById
};

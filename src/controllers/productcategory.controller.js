const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const productCategoryService = require('../services/productcategory.service');

// Create a new category
const create = catchAsync(async (req, res) => {
  const category = await productCategoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

// List all categories with optional filters and pagination
const list = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']); // Adjust filters as needed
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productCategoryService.queryCategories(filter, options);
  res.send(result);
});

// Get a category by ID
const get = catchAsync(async (req, res) => {
  const category = await productCategoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  res.send(category);
});

// Update a category by ID
const update = catchAsync(async (req, res) => {
  const updatedCategory = await productCategoryService.updateCategoryById(req.params.categoryId, req.body);
  if (!updatedCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  res.send(updatedCategory);
});

// Delete a category by ID
const deleteById = catchAsync(async (req, res) => {
  await productCategoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  list,
  get,
  update,
  deleteById
};
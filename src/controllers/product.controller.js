const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const create = catchAsync(async (req, res) => {

  const product = await productService.createProduct(req.body,req.files);
  res.status(httpStatus.CREATED).send(product);
  
});

const list = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['filterData']);
  const { page, filterData } = req.query;
  

  const filters = filterData?.brand ? {
    brand: filterData.brand ? { $in: filterData.brand } : undefined,
    // Add other filters here if needed
  } : {};

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  const result = await productService.queryProducts(filters, options);
  res.send(result);
});


const get = catchAsync(async (req, res) => {

  console.log(req.params);
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const update = catchAsync(async (req, res) => {
  const Driver = await productService.updateDriverById(req.params.DriverId, req.body);
  res.send(Driver);
});

const deleteById = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});


const filterData = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['filterData']);

  const { page, filterData } = req.query;
  const filters = {
    title: filterData.title || '',
    brand: filterData.brand ? { $in: filterData.brand } : undefined,
    discount: filterData.discount ? { $in: filterData.discount } : undefined
  };

  // Build the query object
  const query = {};
  if (filters.title) query.title = filters.title;
  if (filters.brand) query.brand = filters.brand;
  if (filters.discount) query.discount = filters.discount;

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

module.exports = {
  create,
  list,
  get,
  update,
  deleteById,
  filterData
};

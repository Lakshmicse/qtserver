const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const variantService = require('../services/variant.service');

/**
 * Create a new variant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createVariant = catchAsync(async (req, res) => {
  
  const variant = await variantService.createVariant(req.body,req.file);
  res.status(httpStatus.CREATED).send(variant);
});

/**
 * Get all variantes with optional filters and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const listVariantes = catchAsync(async (req, res) => {
  const user = req.user;
  const filter = pick(req.query, ['userId', 'variantType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await variantService.getVariants(filter, options);
  res.send(result);
});

/**
 * Get an variant by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getVariantById = catchAsync(async (req, res) => {
  const { variantId } = req.params;
  const variant = await variantService.getVariantById(variantId);
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Variant not found');
  }
  res.send(variant);
});

/**
 * Update an variant by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateVariantById = catchAsync(async (req, res) => {
  const { variantId } = req.params;
  const updateData = req.body;
  const variant = await variantService.updateVariantById(variantId, updateData);
  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Variant not found');
  }
  res.send(variant);
});

/**
 * Delete an variant by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const deleteVariantById = catchAsync(async (req, res) => {
  const { variantId } = req.params;
  await variantService.deleteVariantById(variantId);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get all variantes for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getVariantesByProductId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const variantes = await variantService.getVariantesByUserId(userId);
  if (!variantes.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No variantes found for this user');
  }
  res.send(variantes);
});

module.exports = {
  createVariant,
  listVariantes,
  getVariantById,
  updateVariantById,
  deleteVariantById,
  getVariantesByProductId
};

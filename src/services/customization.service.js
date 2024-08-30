const mongoose = require('mongoose');
const { Customization } = require('../models'); // Adjust the path if necessary

/**
 * Create a new customization
 * @param {Object} customizationData - The data to create a new customization
 * @returns {Promise<Customization>}
 */
const createCustomization = async (customizationData) => {
  
  const customization = await Customization.create(customizationData);
  return customization;
};

/**
 * Get a customization by ID
 * @param {ObjectId} customizationId - The ID of the customization to retrieve
 * @returns {Promise<Customization>}
 */
const getCustomizationById = async (customizationId) => {
  const customization = await Customization.findById(customizationId).exec();
  return customization;
};

/**
 * Get all customizations with pagination
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Pagination options
 * @returns {Promise<QueryResult>}
 */
const queryCustomizations = async (filter, options) => {
  const customizations = await Customization.paginate(filter, options);
  return customizations;
};

/**
 * Update a customization by ID
 * @param {ObjectId} customizationId - The ID of the customization to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Customization>}
 */
const updateCustomizationById = async (customizationId, updateData) => {
  const customization = await Customization.findByIdAndUpdate(customizationId, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return customization;
};

/**
 * Delete a customization by ID
 * @param {ObjectId} customizationId - The ID of the customization to delete
 * @returns {Promise<Customization>}
 */
const deleteCustomizationById = async (customizationId) => {
  const customization = await Customization.findByIdAndDelete(customizationId).exec();
  return customization;
};

module.exports = {
  createCustomization,
  getCustomizationById,
  queryCustomizations,
  updateCustomizationById,
  deleteCustomizationById,
};

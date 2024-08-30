const { Brand } = require('../models');

/**
 * Query for Brands
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBrands = async (filter = {}, options = {}) => {
  const brands = await Brand.paginate(filter, options);
  return brands;
};

// Create a new brand
const createBrand = async (brandData) => {
  const brand = new Brand(brandData);
  
  try {
    const result = await brand.save();
    return result;
  } catch (e) {
    console.log(e);
    throw new Error('Error creating brand');
  }
};

// Get a brand by ID
const getBrandById = async (brandId) => {
  return await Brand.findById(brandId);
};

// Update a brand by ID
const updateBrandById = async (brandId, updateData) => {
  const updatedBrand = await Brand.findByIdAndUpdate(brandId, {
    ...updateData,
    updatedAt: new Date()
  }, { new: true });

  return updatedBrand;
};

// Delete a brand by ID
const deleteBrandById = async (brandId) => {
  await Brand.findByIdAndDelete(brandId);
  return { message: 'Brand deleted successfully' };
};

// Get all brands
const getAllBrands = async () => {
  return await Brand.find();
};

module.exports = {
  createBrand,
  getBrandById,
  updateBrandById,
  deleteBrandById,
  getAllBrands,
  queryBrands
};

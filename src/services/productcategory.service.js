
/**
 * Query for Product Categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter = {}, options = {}) => {
  const categories = await ProductCategory.paginate(filter, options);
  return categories;
};

// Create a new category
const createCategory = async (categoryData) => {
  const category = new ProductCategory(categoryData);
  
  try {
    const result = await category.save();
    return result;
  } catch (e) {
    console.log(e);
    throw new Error('Error creating category');
  }
};

// Get a category by ID
const getCategoryById = async (categoryId) => {
  return await ProductCategory.findById(categoryId);
};

// Update a category by ID
const updateCategoryById = async (categoryId, updateData) => {
  const updatedCategory = await ProductCategory.findByIdAndUpdate(categoryId, {
    ...updateData,
    updatedAt: new Date()
  }, { new: true });

  return updatedCategory;
};

// Delete a category by ID
const deleteCategoryById = async (categoryId) => {
  await ProductCategory.findByIdAndDelete(categoryId);
  return { message: 'Category deleted successfully' };
};

// Get all categories
const getAllCategories = async () => {
  return await ProductCategory.find();
};

module.exports = {
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
  queryCategories
};
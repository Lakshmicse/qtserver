const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
// productService.js
const { Product, Image, ProductSpec, ProductCategory, ProductColor } = require('../models');

/**
 * Query for Company
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const product = await Product.paginate(filter, options);
  return product;
};
// Create a new product
const createProduct = async (productData,imagesArray = []) => {


  const  productDetail  = JSON.parse(productData.product);

  const newImages = await Image.insertMany(imagesArray.map(img => ({ src: img.filename })));
 

  const productCategory = await ProductCategory.findOne({name : "Truck Tyres"});

  
  const productPayload = {
    ...productDetail,
    category: productCategory._id,
   createdAt: new Date().toISOString(),
   images : newImages.map(img => (img._id)),
   brand: new mongoose.Types.ObjectId(productDetail.brand)
  }

  const product = new Product(productPayload);

  try{

   const result =  await product.save();
  
   return result;
  }catch(e){
    console.log(e);
  }
  
};

// Get a product by ID
const getProductById = async (productId) => {
  return await Product.findById(productId).populate('images');
};

// Update a product by ID
const updateProductById = async (productId, updateData) => {
  const { images, specs, category, color, ...rest } = updateData;

  const newImages = await Image.insertMany(images.map(img => ({ src: img })));
  const newSpecs = await ProductSpec.insertMany(specs.map(spec => ({ title: spec.title, desc: spec.desc })));

  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    ...rest,
    image: newImages.map(img => img._id),
    productSpec: newSpecs.map(spec => spec._id),
    category: await ProductCategory.findById(category),
    color: await ProductColor.findById(color)
  }, { new: true });

  return updatedProduct;
};

// Delete a product by ID
const deleteProductById = async (productId) => {
  await Product.findByIdAndDelete(productId);
  return { message: 'Product deleted successfully' };
};

// Get all products
const getAllProducts = async () => {
  return await Product.find().populate('category brand ideaFor image productInfo productSpec color');
};

module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getAllProducts,
  queryProducts
};

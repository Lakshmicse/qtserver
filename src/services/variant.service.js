// src/services/variantService.js
const { Variant, Attribute , Product} = require('../models');
const fs = require('fs');
const path = require('path');

/**
 * Create a new attribute or find an existing one
 * @param {Object} attributeData - Data for creating a new attribute
 * @returns {Promise<Attribute>}
 */
const findOrCreateAttribute = async (attributeData) => {
 
  const attribute = await Attribute.findOne(attributeData);
  if (attribute) {
    return attribute;
  }
  return Attribute.create(attributeData);
};

/**
 * Upload an image and return the file path
 * @param {Object} file - Image file to upload
 * @returns {String} - File path or URL of the uploaded image
 */
const uploadImage = (file) => {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  
  const filePath = path.join(uploadDir, file.originalname);
  fs.writeFileSync(filePath, file.buffer);
  
  return `/uploads/${file.originalname}`;
};

/**
 * Create a new variant
 * @param {Object} variantData - Data for creating a new variant
 * @param {Object} file - Image file to upload
 * @returns {Promise<Variant>}
 */
const createVariant = async (variantData, file) => {


    const productId = variantData.productId;
   const payload = {};  
   payload.sku = variantData.sku;
   payload.price = variantData.price;
   delete(variantData.sku);
   delete(variantData.price);

    const attributes = await Promise.all(
        Object.entries(variantData).map(async ([key, value]) => {
            
          const result = await findOrCreateAttribute({ name : key ,  value });
          return result._id;
        })
      );
      
  payload.attributes = attributes;
  //variantData.attributes = attributes
  
  payload.image = file.filename;


  console.log(payload)   ;
  const variant = await Variant.create(payload);

  // Find the Product and update its variant field
const product = await Product.findById(productId); // Assuming you have the productId
product.variant.push(variant._id); // Push the new variant's ID into the variant array

// Save the updated Product
await product.save();

  return variant;
};

/**
 * Get a variant by ID
 * @param {ObjectId} id - ID of the variant
 * @returns {Promise<Variant>}
 */
const getVariantById = async (id) => {
  const variant = await Variant.findById(id).populate('attributes');
  return variant;
};

/**
 * Get all variants with pagination
 * @param {Object} filter - MongoDB filter object
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - { data: variants, total: totalVariants }
 */
const getVariants = async (filter, options) => {
  const variants = await Variant.paginate(filter, options);
  return variants;
};

/**
 * Update a variant by ID
 * @param {ObjectId} id - ID of the variant
 * @param {Object} updateData - Data to update the variant with
 * @param {Object} file - Image file to upload
 * @returns {Promise<Variant>}
 */
const updateVariantById = async (id, updateData, file) => {
  if (updateData.attributes) {
    const attributes = await Promise.all(
      updateData.attributes.map(attr => findOrCreateAttribute(attr))
    );
    updateData.attributes = attributes.map(attr => attr._id);
  }

  if (file) {
    updateData.image = uploadImage(file);
  }

  const variant = await Variant.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('attributes');
  return variant;
};

/**
 * Delete a variant by ID
 * @param {ObjectId} id - ID of the variant
 * @returns {Promise<Variant>}
 */
const deleteVariantById = async (id) => {
  const variant = await Variant.findByIdAndDelete(id);
  return variant;
};

module.exports = {
  createVariant,
  getVariantById,
  getVariants,
  updateVariantById,
  deleteVariantById,
};

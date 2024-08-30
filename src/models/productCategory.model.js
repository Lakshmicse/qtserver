const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Product Category Schema
const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});




// add plugin that converts mongoose to json
productCategorySchema.plugin(toJSON);
productCategorySchema.plugin(paginate);


const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports =  ProductCategory;

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Product Specification Schema
const productSpecSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
});
// add plugin that converts mongoose to json
productSpecSchema.plugin(toJSON);
productSpecSchema.plugin(paginate);


const ProductSpec = mongoose.model('ProductSpec', productSpecSchema);

module.exports = ProductSpec;

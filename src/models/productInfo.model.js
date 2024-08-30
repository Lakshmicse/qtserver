const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Product Info Schema
const productInfoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true }
});

// add plugin that converts mongoose to json
productInfoSchema.plugin(toJSON);
productInfoSchema.plugin(paginate);


const ProductInfo = mongoose.model('ProductInfo', productInfoSchema);

module.exports = ProductInfo;

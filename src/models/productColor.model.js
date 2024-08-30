const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Product Color Schema
const productColorSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  hexCode: { type: String, required: true }
});
// add plugin that converts mongoose to json
productColorSchema.plugin(toJSON);
productColorSchema.plugin(paginate);


const ProductColor = mongoose.model('ProductColor', productColorSchema);

module.exports =  ProductColor;


const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Product Schema
const productSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
  inStock: { type: Boolean, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true,autopopulate: true },
  title: { type: String, required: true },
  description: { type: String },
  mrp: { type: Number, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand',autopopulate: true },
  ideaFor: { type: mongoose.Schema.Types.ObjectId, ref: 'IdealFor', autopopulate: true },
  discount: { type: String, required: false },
  rating: { type: Number, required: false },
  reviews: { type: Number, required: false },
  color: { type: String },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' , autopopulate: true }],
  variant : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' , autopopulate: true }],
  SKU: { type: String, required: true },
  productInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductInfo', autopopulate: true }],
  productSpec: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductSpec' , autopopulate: true}]
});

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.plugin(require('mongoose-autopopulate'));

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

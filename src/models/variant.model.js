// src/models/Variant.js

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const VariantSchema = new Schema({
  sku: { 
    type: String, 
    required: true, 
    unique: true, // Ensure SKU is unique
  },
  attributes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Attribute' ,
    autopopulate: true 
  }],
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    // required: true 
  },
  image: { 
    type: String, // Store the URL or path of the uploaded image
    required: false 
  },
});


VariantSchema.plugin(require('mongoose-autopopulate'));

// Add plugins that convert Mongoose to JSON and add pagination
VariantSchema.plugin(toJSON);
VariantSchema.plugin(paginate);

const Variant = mongoose.model('Variant', VariantSchema);

module.exports = Variant;

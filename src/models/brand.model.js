const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Brand Schema
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  logoUrl: {
    type: String,
    required: false
  },
  websiteUrl: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});



// add plugin that converts mongoose to json
brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);


const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
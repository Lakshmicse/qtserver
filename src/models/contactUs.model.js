const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Contact Us Schema
const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  deliveryZipCode: {
    type: String,
    required: false,
    trim: false
  },
  tireSearch: {
    type: String,
    required: false,
    trim: true
  },
  tireQuantity: {
    type: Number,
    required: false
  },
  message: {
    type: String,
    required: true,
    trim: true
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
contactUsSchema.plugin(toJSON);
contactUsSchema.plugin(paginate);

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;

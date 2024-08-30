const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema;

// Schema for storing customizations
const CustomizationSchema = new Schema({
 
  productVariantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Variant',  // Reference to the Product model
    required: true,
    autopopulate: true
    
},
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 
  shoulderLogo: {
    type: String,
    required: false, // Assuming logo is optional
  },
  frontLogo: {
    type: String,
    required: false, // Assuming logo is optional
  },
  backLogo: {
    type: String,
    required: false, // Assuming logo is optional
  },
  frontText: {
    type: String,
    required: false, // Any custom text added by the user
  },
  backText: {
    type: String,
    required: false, // Font type for custom text
  },

 
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// add plugin that converts mongoose to json
CustomizationSchema.plugin(toJSON);
CustomizationSchema.plugin(paginate);


const Customization = mongoose.model('Customization', CustomizationSchema);



module.exports = Customization;

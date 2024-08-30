const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Address Schema
const addressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  addressType: { 
    type: String, 
    enum: ['Shipping', 'Billing'], 
    required: true 
  },
  addressLine1: { 
    type: String, 
    required: true 
  },
  addressLine2: { 
    type: String 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
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

// Add createdAt and updatedAt hooks
addressSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});



// add plugin that converts mongoose to json
addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);


const Address = mongoose.model('Address', addressSchema);

module.exports = Address;

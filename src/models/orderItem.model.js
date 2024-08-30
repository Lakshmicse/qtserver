const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { default: mongooseAutoPopulate } = require('mongoose-autopopulate');

// Define the OrderItem schema
const orderItemSchema = new mongoose.Schema({
  
    productVariantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',  // Reference to the Product model
        required: true,
        autopopulate: true
        
    },
    customizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customization',  // Reference to the Product model
        autopopulate: true
        
    },

    quantity: {
        type: Number,
        required: true,
        min: 1  // Ensure quantity is at least 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0  // Ensure price is not negative
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0  // Ensure total price is not negative
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

// Update the updatedAt field before saving
orderItemSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

orderItemSchema.plugin(toJSON);
orderItemSchema.plugin(paginate);
// Create and export the OrderItem model
orderItemSchema.plugin(require('mongoose-autopopulate'));

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;


const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderDate: { type: Date, default: Date.now },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'], default: 'Pending' },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' , required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', autopopulate: true }],
    paymentMethod: String,
    trackingNumber: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.plugin(require('mongoose-autopopulate'));

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

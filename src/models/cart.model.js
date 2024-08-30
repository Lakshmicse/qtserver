const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Cart Item Schema
const cartSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true,autopopulate: true },
  mrp: { type: Number, required: true },
  discount: { type: String, required: true },
  brand: { type: String,  },
  image: { type: String,  },
  count: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,autopopulate: true },
  
});
// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

cartSchema.plugin(require('mongoose-autopopulate'));

const Cart = mongoose.model('CartItem', cartSchema);
module.exports = Cart;

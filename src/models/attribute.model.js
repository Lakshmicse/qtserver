const mongoose = require('mongoose');
const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');


const AttributeSchema = new Schema({
  name: { type: String, required: true }, // e.g., Size, Color
  value: { type: String, required: true }  // e.g., M, Red
});

// add plugin that converts mongoose to  json
AttributeSchema.plugin(toJSON);
AttributeSchema.plugin(paginate);



const Attribute = mongoose.model('Attribute', AttributeSchema);

module.exports = Attribute;


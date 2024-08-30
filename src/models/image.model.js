const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Image Schema
const imageSchema = new mongoose.Schema({
  src: { type: String, required: true }
});
// add plugin that converts mongoose to json
imageSchema.plugin(toJSON);
imageSchema.plugin(paginate);


const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Ideal For Schema
const idealForSchema = new mongoose.Schema({
  name: { type: String, required: true }
});


// add plugin that converts mongoose to json
idealForSchema.plugin(toJSON);
idealForSchema.plugin(paginate);


const IdealFor = mongoose.model('IdealFor', idealForSchema);

module.exports = IdealFor;

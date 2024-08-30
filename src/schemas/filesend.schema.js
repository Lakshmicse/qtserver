/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const FileSendSchema = new mongoose.Schema(
  {
    from: { type: String},
    date: Date,
    message: { type: String },
    name: { type: String },
    requestType: { type: String },
    role: { type: String },
    type:{ type: String },
    hradmin: {
      type: Boolean
    },
    payrolladmin: {
      type: Boolean
    },
    filePath:{ type: String },
    fileName:{ type: String },
    to: {type: Array,
      default: [],},
    
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
FileSendSchema.plugin(toJSON);
FileSendSchema.plugin(paginate);

module.exports = FileSendSchema;
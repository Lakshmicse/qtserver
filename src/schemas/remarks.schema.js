/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const RemarksSchema = new mongoose.Schema(
  {
    user: { type: String},
    userRole: { type: String},
    date: Date,
    message: { type: String },
    formname: { type: String },
    actionType: { type: String },
    'Employee Number': { type: String },
    'Employee Name':{ type: String },
    collectionid:{ type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
RemarksSchema.plugin(toJSON);
RemarksSchema.plugin(paginate);

module.exports = RemarksSchema;
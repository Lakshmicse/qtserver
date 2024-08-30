/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const NotificationSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
NotificationSchema.plugin(toJSON);
NotificationSchema.plugin(paginate);

module.exports = NotificationSchema;
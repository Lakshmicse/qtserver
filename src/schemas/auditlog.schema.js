/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const AuditLogsSchema = new mongoose.Schema(
  {
    user: { type: String},
    date: Date,
    FormName: { type: String },
    Action: { type: String },
    UserId: { type: String },
    'Employee Number': { type: String },
    'Employee Nmae':{ type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
AuditLogsSchema.plugin(toJSON);
AuditLogsSchema.plugin(paginate);

module.exports = AuditLogsSchema;
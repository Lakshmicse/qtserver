/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const MailTemplateschema = new mongoose.Schema(
  {
    eventname: { type: String},
    role: { type: String},
    'Action Done': { type: String },
    'Request Action': { type: String },
    cc: { type: String },
    Subject:{ type: String },
    to: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
MailTemplateschema.plugin(toJSON);
MailTemplateschema.plugin(paginate);

// const MailTemplate = mongoose.model('mailtemplates', MailTemplateschema);
module.exports = MailTemplateschema;
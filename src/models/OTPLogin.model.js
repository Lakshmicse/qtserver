/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const OTPSchemaLogin = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    otp: { type: Number },
    expirytime: Date,
    token: { type: String },
    userId: mongoose.SchemaTypes.ObjectId,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
OTPSchemaLogin.plugin(toJSON);
OTPSchemaLogin.plugin(paginate);

const OTPLogin = mongoose.model('OTPLogin', OTPSchemaLogin);
module.exports = OTPLogin;

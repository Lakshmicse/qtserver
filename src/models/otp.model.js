/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const OTPSchema = new mongoose.Schema(
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
OTPSchema.plugin(toJSON);
OTPSchema.plugin(paginate);

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;

/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CallSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dispatcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    serviceType: {
      type: String,
      enum: ['22651 (K) - PARKED OVER 72 HOURS','22651 (O) - EXPIRED REGISTRATION','Accident', 'Jump Start', 'Battery Installation','Storage','Tow',
    'GOA','Jump Start', 'Tire Service', 'Fuel Delivery', 'Lockout', 'Winch Out','Other'],
      required: true,
    },
    client: {
      type: String,
    },
    jobId: {
      type: String,
    },
    pickuptime: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Canceled'],
      default: 'Pending',
    },
    notes: String
    
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
CallSchema.plugin(toJSON);
CallSchema.plugin(paginate);

module.exports = CallSchema;
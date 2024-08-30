const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Define the DriverActivity schema
const driverActivitySchema = new mongoose.Schema({
  slNo: {
    type: Number,
  },
  driverName: {
    type: String,
    required: true,
  },
  shiftTiming: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    required: true,
  },
  lunchTime: {
    type: Date,
  },
  logoutTime: {
    type: Date,
    required: true,
  },
  tireService: {
    type: Boolean,
    default: false,
  },
  lockout: {
    type: Boolean,
    default: false,
  },
  fuelDelivery: {
    type: Boolean,
    default: false,
  },
  jumpStart: {
    type: Boolean,
    default: false,
  },
  tow: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['On Duty', 'Off Duty', 'Break', 'Unavailable'], // Define possible status values
  },
  availability: {
    type: String,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  jobId: {
    type: String,
  },
  jobStatus: {
    type: String,
    enum: ['en route', 'at a customer location', 'in transit', 'completed'], // Define possible status values
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // You can store location as a GeoJSON point
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default coordinates (longitude, latitude)
    },
  },
});

// add plugin that converts mongoose to json
driverActivitySchema.plugin(toJSON);
driverActivitySchema.plugin(paginate);

// Create the DriverActivity model
const Driver = mongoose.model('Driver', driverActivitySchema);

module.exports = Driver;

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Define the Driver Status schema
const driverStatusSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver', // Reference to the Driver model (assuming you have a Driver model)
    required: true,
  },
  status: {
    type: String,
    enum: ['On Duty', 'Off Duty', 'Break', 'Unavailable'], // Define possible status values
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  jobStatus: {
    type: String,
    enum: ['en route', 'at a customer location', 'in transit', 'completed'], // Define possible status values
    required: true,
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a geospatial index on the 'location' field for spatial queries
driverStatusSchema.index({ location: '2dsphere' });

// add plugin that converts mongoose to json
driverStatusSchema.plugin(toJSON);
driverStatusSchema.plugin(paginate);

// Create the DriverStatus model
const DriverStatus = mongoose.model('DriverStatus', driverStatusSchema);

module.exports = DriverStatus;

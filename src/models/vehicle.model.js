const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const VehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    VIN: {
      type: String,
      unique: true,
      required: true,
    },
    color: String,
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    /* owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to a user model (if you have one)
      required: true,
    },
    maintenanceHistory: [
      {
        date: {
          type: Date,
          // required: true,
        },
        description: String,
        cost: Number,
      },
    ], */
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
VehicleSchema.plugin(toJSON);
VehicleSchema.plugin(paginate);

const Vehicle = mongoose.model('vehicle', VehicleSchema);
module.exports = Vehicle;

const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ManageTenantSchema = new mongoose.Schema(
  {
    ClientId: { type: Schema.Types.ObjectId, ref: 'companies', unique: true },
    ClientName: { type: String },
    payrollAdmin: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ManageTenantSchema.plugin(toJSON);
ManageTenantSchema.plugin(paginate);

const ManageTenant = mongoose.model('manage_tenant', ManageTenantSchema);
module.exports = ManageTenant;

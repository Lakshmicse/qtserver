const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const { toJSON, paginate } = require('./plugins');

const TenantSchema = new mongoose.Schema(
  {
    ClientId: { type: Schema.Types.ObjectId, ref: 'companies', unique: true },
    ClientName: { type: String },
    dbURI: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
TenantSchema.plugin(toJSON);
TenantSchema.plugin(paginate);

const Tenant = mongoose.model('tenant', TenantSchema);
module.exports = Tenant;

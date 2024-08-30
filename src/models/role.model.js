const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const roleSchema = mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The role's email
 * @param {ObjectId} [excludeRoleId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
roleSchema.statics.isEmailTaken = async function (email, excludeRoleId) {
  const role = await this.findOne({ email, _id: { $ne: excludeRoleId } });
  return !!role;
};

/**
 * Check if password matches the role's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
roleSchema.methods.isPasswordMatch = async function (password) {
  const role = this;
  return bcrypt.compare(password, role.password);
};

roleSchema.pre('save', async function (next) {
  const role = this;
  if (role.isModified('password')) {
    role.password = await bcrypt.hash(role.password, 8);
  }
  next();
});

/**
 * @typedef Role
 */
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;

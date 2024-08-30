const httpStatus = require('http-status');
const { Address } = require('../models'); // Adjust the path according to your project structure
const ApiError = require('../utils/ApiError');
const { pick } = require('../utils/pick');

/**
 * Query for Addresses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAddresses = async (filter, options) => {
  const addresses = await Address.paginate(filter, options);
  return addresses;
};

// Create a new address
const createAddress = async (req) => {
  const addressData = req.body;
  const user = req.user;

  const payload = {...addressData, userId : user.id};
  const address = new Address(payload);

  try {
    const result = await address.save();
    return result;
  } catch (e) {
    console.log(e)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating address');
  }
};

// Get an address by ID
const getAddressById = async (addressId) => {
  const address = await Address.findById(addressId);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  return address;
};

// Update an address by ID
const updateAddressById = async (addressId, updateData) => {
  const address = await Address.findByIdAndUpdate(addressId, updateData, { new: true });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  return address;
};

// Delete an address by ID
const deleteAddressById = async (addressId) => {
  const address = await Address.findByIdAndDelete(addressId);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  return { message: 'Address deleted successfully' };
};

// Get all addresses for a user
const getAddressesByUserId = async (userId) => {
  const addresses = await Address.find({ userId });
  if (!addresses) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No addresses found for this user');
  }
  return addresses;
};

// Get all addresses for a user
const getShippingAddressesByUserId = async (userId) => {
  const addresses = await Address.find({ userId , addressType : "Shipping" });
  if (!addresses) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Shipping addresses found for this user');
  }
  return addresses;
};

// Get all addresses for a user
const getBillingAddressesByUserId = async (userId) => {
  const addresses = await Address.find({ userId , addressType : "Billing" });
  if (!addresses) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Billing addresses found for this user');
  }
  return addresses;
};


module.exports = {
  queryAddresses,
  createAddress,
  getAddressById,
  updateAddressById,
  deleteAddressById,
  getAddressesByUserId,
  getShippingAddressesByUserId,
  getBillingAddressesByUserId
};

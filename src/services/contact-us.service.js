const ContactUs = require('../models/contactUs.model');

/**
 * Query for Contact Us submissions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryContactUs = async (filter = {}, options = {}) => {
  const contactus = await ContactUs.paginate(filter, options);
  return contactus;
};

// Create a new Contact Us submission
const createContactUs = async (contactData) => {
  const contactUsSubmission = new ContactUs(contactData);

  try {
    const result = await contactUsSubmission.save();
    return result;
  } catch (e) {
    console.log(e);
    throw new Error('Error creating contact submission');
  }
};

// Get a Contact Us submission by ID
const getContactUsById = async (contactId) => {
  return await ContactUs.findById(contactId);
};

// Update a Contact Us submission by ID
const updateContactUsById = async (contactId, updateData) => {
  const updatedContactUsSubmission = await ContactUs.findByIdAndUpdate(contactId, {
    ...updateData,
    updatedAt: new Date()
  }, { new: true });

  return updatedContactUsSubmission;
};

// Delete a Contact Us submission by ID
const deleteContactUsById = async (contactId) => {
  await ContactUs.findByIdAndDelete(contactId);
  return { message: 'Contact submission deleted successfully' };
};

// Get all Contact Us submissions
const getAllContactUs = async () => {
  return await ContactUs.find();
};

module.exports = {
  createContactUs,
  getContactUsById,
  updateContactUsById,
  deleteContactUsById,
  getAllContactUs,
  queryContactUs
};

const mongoose = require('mongoose');

const callSchema = require('../schemas/call.schema');

// Create the DriverActivity model
const Call = mongoose.model('Call', callSchema);

module.exports = Call;

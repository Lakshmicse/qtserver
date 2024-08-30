/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ResignationSchema = new mongoose.Schema(
  {
    EmployeeId: { type: String },
    'Employee Name': String,
    'Employee Number': { type: String },
    'Date of Joining': { type: Date },
    'Date of Resignation': { type: Date },
    'Date of Leaving': { type: Date },
    'Reason for Leaving': { type: String },
    'No of days to be paid': { type: String },
    'Leave Encash Days': { type: String },
    'Notice Period Payment': { type: String },
    'NSA Days': { type: String },
    'SAB': { type: String },
    'Overtime Hrs (Incentive)': { type: String },
    'One time (if any)': { type: String },
    'Notice Period Recovery Days': { type: String },
    'Canteen Deduction': { type: String },
    'Other Deductions': { type: String },
    'Remarks': { type: String },
    'Investments (amount)': { type: String },
    'Investment Type (Eg, Rent, LIC, ELSS Etc)': { type: String },
    WorkflowStatus: { type: String, default: 'HR_DRAFT' },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// eslint-disable-next-line prettier/prettier

ResignationSchema.plugin(toJSON);
ResignationSchema.plugin(paginate);

// const Resignation = mongoose.model('resignation', ResignationSchema);
module.exports = ResignationSchema;

const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Social Welfare benefit must have a name'],
    },
    description: {
      type: String,
      required: [true, 'A Social Welfare benefit must have a description'],
    },
    eligibility: {
      type: String,
      required: [true, 'A Social Welfare benefit must have an eligibility'],
    },
    summary: {
      type: String,
      required: [true, 'A Social Welfare must have a summary'],
    },

    requiredDocuments: String,

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

const Benefit = mongoose.model('Benefit', benefitSchema);
module.exports = Benefit;

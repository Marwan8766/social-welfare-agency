const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const caseSchema = new mongoose.Schema(
  {
    notes: {
      type: String,
      default:
        'Your Application was successfully submited and your case is under review, please keep checking your case status and notes for any updates.',
    },
    status: {
      type: String,
      required: [true, 'A Case must have a Status'],
      enum: ['under review', 'accepted', 'declined'],
      default: 'under review',
      index: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'user id is required'],
      index: true,
    },
    benefit: {
      type: mongoose.Schema.ObjectId,
      ref: 'Benefit',
      required: [true, 'benefit id is required'],
    },

    application: {
      userName: {
        type: String,
        required: [true, 'An Application must have a user name'],
      },
      phone: {
        type: Number,
        required: [true, 'An Application must have a user phone'],
      },
      email: {
        type: String,
        required: [true, 'An Application must have a user email'],
      },
      nationalIdProof: {
        type: String,
        required: [true, 'An Application must have a user national id proof'],
      },
      gender: {
        type: String,
        required: [true, 'An Application must have a user gender'],
      },
      birthDate: {
        type: Date,
        required: [true, 'An Application must have a user birth date'],
      },
      income: {
        type: Number,
        min: 0,
        default: 0,
        required: [true, 'An Application must have a user income'],
      },
      incomeProof: {
        type: String,
        validate: {
          validator: function (value) {
            return this.application.income > 0 || value !== undefined;
          },
          message: 'If you have income you must provide a proof to it',
        },
      },
      employment: {
        type: Boolean,
        required: [
          true,
          'An Application must have a user employment condition',
        ],
      },
      lastEmploymentDate: Date,
      disability: {
        type: Boolean,
        required: [
          true,
          'An Application must have a user disability condition',
        ],
      },
      disabilityProof: {
        type: String,
        validate: {
          validator: function (value) {
            return this.application.disability === true || value !== undefined;
          },
          message:
            'Disability proof must be provided if disability condition is true',
        },
      },
      question1: String,
      question2: String,
      editAllowed: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true, // Add timestamps option
  }
);

caseSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  const caseDoc = await this.constructor.findOne({
    user: this.user,
    benefit: this.benefit,
    status: { $ne: 'declined' },
  });

  if (caseDoc)
    return next(new AppError('You already have a case for this benefit', 400));

  next();
});

const Case = mongoose.model('Case', caseSchema);
module.exports = Case;

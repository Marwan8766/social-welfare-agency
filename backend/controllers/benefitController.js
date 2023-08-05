const Benefit = require('../models/benefitModel');
const catchAsync = require('../utils/catchAsync');

const handlerFactory = require('./handlerFactory');

exports.setBodyBenefit = (req, res, next) => {
  const bodyObj = {
    name: req.body.name,
    description: req.body.description,
    summary: req.body.summary,
    eligibility: req.body.eligibility,
    requiredDocuments: req.body.requiredDocuments,
    active: req.body.active,
  };

  req.body = bodyObj;

  next();
};

exports.createBenefit = handlerFactory.createOne(Benefit);
exports.updateBenefit = handlerFactory.updateOne(Benefit);
exports.deleteBenefit = handlerFactory.deleteOne(Benefit);
exports.getOneBenefit = handlerFactory.getOne(Benefit);
// exports.getAllBenefits = handlerFactory.getAll(Benefit);
exports.getAllBenefits = catchAsync(async (req, res, next) => {
  const benefits = await Benefit.find();

  if (benefits.length === 0)
    return next(new AppError('No benefits were found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: benefits,
    },
  });
});

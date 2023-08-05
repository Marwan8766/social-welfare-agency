const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found for that ID', 404));
    res.status(204).json({
      status: 'success',
      data: 'null',
    });
  });

// exports.updateOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!doc) return next(new AppError('No document found for that ID', 404));
//     res.status(200).json({
//       status: 'success',
//       data: {
//         data: doc,
//       },
//     });
//   });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = { _id: req.params.id };
    const update = { ...req.body, updatedAt: Date.now() }; // Manually set the updatedAt field to the current date
    const options = { new: true, runValidators: true };
    const doc = await Model.updateOne(filter, update, options);
    if (!doc.nModified)
      return next(new AppError('No document found for that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: update, // return the updated data
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // populate virtual population bec it is now null so we need
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError('No document found for that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const doc = await Model.find().skip(skip).limit(limit);

    // Send response
    res.status(200).json({
      status: 'success',
      page,
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });

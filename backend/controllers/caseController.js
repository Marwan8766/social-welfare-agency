// const io = require('../utils/socket').get();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const socketIo = require('socket.io');
// const { getSocketIo } = require('../utils/socket');
// const io = getSocketIo();

const { protectSocket } = require('./authController');

const {
  deleteImageCloudinary,
  uploadFileToCloudinary,
} = require('../utils/cloudinary');

const Case = require('../models/caseModel');

const handlerFactory = require('./handlerFactory');

// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//   },
// });

exports.validateCreateMiddleware = catchAsync(async (req, res, next) => {
  const { benefit, income, disability } = req.body;
  const { nationalIdProof, incomeProof, disabilityProof } = req.files;

  if (!benefit) return next(new AppError('Benefit ID is required', 400));

  if (!nationalIdProof)
    return next(new AppError('You must provide your national id photo', 400));
  if (income > 0 && !incomeProof)
    return next(new AppError('You must provide your income proof photo', 400));
  if (disability === true && !disabilityProof)
    return next(
      new AppError('You must provide your disability proof photo', 400)
    );

  next();
});

exports.uploadCreatePhotos = catchAsync(async (req, res, next) => {
  const { nationalIdProof, incomeProof, disabilityProof } = req.files;

  let nationalIdProofUrl = null;
  let incomeProofUrl = null;
  let disabilityProofUrl = null;

  const uploadPromises = [];

  if (nationalIdProof) {
    uploadPromises.push(
      uploadFileToCloudinary(nationalIdProof[0], 'nationalIdProof')
    );
  }

  if (incomeProof) {
    uploadPromises.push(uploadFileToCloudinary(incomeProof[0], 'incomeProof'));
  }

  if (disabilityProof) {
    uploadPromises.push(
      uploadFileToCloudinary(disabilityProof[0], 'disabilityProof')
    );
  }

  const uploadedUrls = await Promise.all(uploadPromises);

  // Store the URLs in their respective variables
  uploadedUrls.forEach((item) => {
    if (item.fieldName === 'nationalIdProof') {
      nationalIdProofUrl = item.url;
    } else if (item.fieldName === 'incomeProof') {
      incomeProofUrl = item.url;
    } else if (item.fieldName === 'disabilityProof') {
      disabilityProofUrl = item.url;
    }
  });

  // Store the URLs on the request object
  req.nationalIdProofUrl = nationalIdProofUrl;
  req.incomeProofUrl = incomeProofUrl;
  req.disabilityProofUrl = disabilityProofUrl;

  next();
});

exports.setCaseBody = catchAsync(async (req, res, next) => {
  const bodyObj = {
    user: req.user._id,
    benefit: req.body.benefit,
    application: {
      userName: req.body.userName,
      phone: req.body.phone,
      email: req.body.email,
      nationalIdProof: req.nationalIdProofUrl,
      gender: req.body.gender,
      birthDate: new Date(req.body.birthDate),
      income: req.body.income,
      incomeProof: req.incomeProofUrl,
      employment: req.body.employment,
      lastEmploymentDate: req.body.lastEmploymentDate,
      disability: req.body.disability,
      disabilityProof: req.disabilityProofUrl,
      question1: req.body.question1,
      question2: req.body.question2,
    },
  };

  req.body = bodyObj;

  next();
});

exports.createCase = catchAsync(async (req, res, next) => {
  const doc = await Case.create(req.body);

  // emit the fetchCaseList event
  const io = process.io;
  io.emit('casesListChanged');

  // Emit the fetchCase event to notify clients viewing this case
  io.emit('caseChanged', doc._id);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.validateUpdateAuthMiddleware = catchAsync(async (req, res, next) => {
  const user = req.user;

  // find the case
  const currentCase = await Case.findById(req.params.id);
  if (!currentCase)
    return next(new AppError("This case couldn't be found", 404));

  // check if the current user have the authority to update the application
  if (
    user.role !== 'admin' &&
    currentCase.user.toString() !== user._id.toString()
  )
    return next(
      new AppError("You don't have the authority to update this case", 403)
    );

  // check if the user is allowed to update the case
  if (user.role !== 'admin' && !currentCase.application.editAllowed)
    return next(
      new AppError(
        'Once the application is submitted you donot have the authority to update it unless you were asked to',
        403
      )
    );

  // if everything is ok call next and put case on req
  req.case = currentCase;
  next();
});

exports.uploadPhotosUpdate = catchAsync(async (req, res, next) => {
  // Check that the current user is not an admin
  if (req.user.role !== 'user') return next();

  const { nationalIdProof, incomeProof, disabilityProof } = req.files;

  const uploadPromises = [];

  let nationalIdProofUrl = null;
  let incomeProofUrl = null;
  let disabilityProofUrl = null;

  // Check for new photos and upload them
  if (nationalIdProof) {
    uploadPromises.push(
      uploadFileToCloudinary(nationalIdProof[0], 'nationalIdProof')
    );
  }

  if (incomeProof) {
    uploadPromises.push(uploadFileToCloudinary(incomeProof[0], 'incomeProof'));
  }

  if (disabilityProof) {
    uploadPromises.push(
      uploadFileToCloudinary(disabilityProof[0], 'disabilityProof')
    );
  }

  const uploadedUrls = await Promise.all(uploadPromises);

  // Store the URLs in their respective variables
  const updatedUrls = {};
  uploadedUrls.forEach((item) => {
    if (item.fieldName === 'nationalIdProof') {
      nationalIdProofUrl = item.url;
    } else if (item.fieldName === 'incomeProof') {
      incomeProofUrl = item.url;
    } else if (item.fieldName === 'disabilityProof') {
      disabilityProofUrl = item.url;
    }
  });

  // Store the updated URLs on the request object
  req.nationalIdProofUrl = nationalIdProofUrl;
  req.incomeProofUrl = incomeProofUrl;
  req.disabilityProofUrl = disabilityProofUrl;
  // Continue with the rest of the code
  next();
});

exports.deletePhotosUpdate = catchAsync(async (req, res, next) => {
  // check that the current user isnot admin
  if (req.user.role !== 'user') return next();

  // get the photos uploaded from the req
  const { nationalIdProofUrl, incomeProofUrl, disabilityProofUrl } = req;

  // get the case document
  const caseDoc = req.case;

  // construct the delete array
  const deletePromises = [];

  // add delete old photos promises which were updated to be deleted
  if (nationalIdProofUrl !== null)
    deletePromises.push(deleteImageCloudinary(caseDoc.nationalIdProof));

  if (incomeProofUrl !== null)
    deletePromises.push(deleteImageCloudinary(caseDoc.incomeProof));

  if (disabilityProofUrl)
    deletePromises.push(deleteImageCloudinary(caseDoc.disabilityProof));

  // run the delete promises
  await Promise.all(deletePromises);

  // call next
  next();
});

exports.setBodyUpdate = catchAsync(async (req, res, next) => {
  const { user } = req;

  // set the body in user case
  if (user.role === 'user') {
    const bodyObj = {
      userName: req.body.userName,
      phone: req.body.phone,
      email: req.body.email,
      nationalIdProof: req.nationalIdProofUrl,
      gender: req.body.gender,
      birthDate: new Date(req.body.birthDate),
      income: req.body.income,
      incomeProof: req.incomeProofUrl,
      employment: req.body.employment,
      lastEmploymentDate: req.body.lastEmploymentDate,
      disability: req.body.disability,
      disabilityProof: req.disabilityProofUrl,
      question1: req.body.question1,
      question2: req.body.question2,
    };
    req.body = bodyObj;
    // set the body in admin case
  } else if (user.role === 'admin') {
    const bodyObj = {
      status: req.body.status,
      notes: req.body.notes,
      editAllowed: req.body.editAllowed,
    };
    req.body = bodyObj;
  }

  next();
});

exports.updateCase = catchAsync(async (req, res, next) => {
  const {
    userName,
    phone,
    email,
    nationalIdProof,
    gender,
    birthDate,
    income,
    incomeProof,
    employment,
    lastEmploymentDate,
    disability,
    disabilityProof,
    question1,
    question2,
    status,
    notes,
    editAllowed,
  } = req.body;

  const caseDoc = req.case;

  if (userName) caseDoc.application.userName = userName;
  if (phone) caseDoc.application.phone = phone;
  if (email) caseDoc.application.email = email;
  if (nationalIdProof) caseDoc.application.nationalIdProof = nationalIdProof;
  if (gender) caseDoc.application.gender = gender;
  if (birthDate) caseDoc.application.birthDate = birthDate;
  if (income) caseDoc.application.income = income;
  if (incomeProof) caseDoc.application.incomeProof = incomeProof;
  if (employment) caseDoc.application.employment = employment;
  if (lastEmploymentDate)
    caseDoc.application.lastEmploymentDate = lastEmploymentDate;
  if (disability) caseDoc.application.disability = disability;
  if (disabilityProof) caseDoc.application.disabilityProof = disabilityProof;
  if (question1) caseDoc.application.question1 = question1;
  if (question2) caseDoc.application.question2 = question2;
  if (status) caseDoc.status = status;
  if (notes) caseDoc.notes = notes;
  if (editAllowed !== undefined && req.user.role === 'admin')
    caseDoc.application.editAllowed = editAllowed;
  if (req.user.role !== 'admin') caseDoc.application.editAllowed = false;

  const updatedCase = await caseDoc.save({ validateModifiedOnly: true });
  if (!updatedCase) return next(new AppError('Error updating this case', 400));

  // emit the fetchCaseList event
  const io = process.io;
  io.emit('casesListChanged');

  // Emit the fetchCase event to notify clients viewing this case
  io.emit('caseChanged', updatedCase._id);

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedCase,
    },
  });
});

exports.deleteCaseValidation = catchAsync(async (req, res, next) => {
  // find the case
  const caseDoc = await Case.findById(req.params.id);
  if (!caseDoc) return next(new AppError("This case couldn't be found", 404));

  // check if the user has AUTH to delete it
  if (
    caseDoc.user.toString() !== req.user._id.toString() ||
    caseDoc.status === 'accepted'
  )
    return next(
      new AppError("You don't have the authority to delete this case", 403)
    );

  // if yes put it on req and call next
  req.case = caseDoc;
  next();
});

exports.deleteCasePhotos = catchAsync(async (req, res, next) => {
  const { caseDoc } = req;

  // construct the delete photos promises array
  const deletePromises = [];

  // add the delete promises to the array
  if (caseDoc.nationalIdProof)
    deletePromises.push(deleteImageCloudinary(caseDoc.nationalIdProof));
  if (caseDoc.incomeProof)
    deletePromises.push(deleteImageCloudinary(caseDoc.incomeProof));
  if (caseDoc.disabilityProof)
    deletePromises.push(deleteImageCloudinary(caseDoc.disabilityProof));

  // perform the promises
  await Promise.all(deletePromises);

  // call next
  next();
});

exports.deleteCase = catchAsync(async (req, res, next) => {
  const deletedCase = await Case.findByIdAndDelete(req.case._id);
  if (!deletedCase) return next(new AppError("Couldn't delete this case", 400));

  // emit the fetchCaseList event
  const io = process.io;
  io.emit('casesListChanged');

  io.emit('caseChanged', req.case._id);

  res.status(204).json({
    status: 'success',
    data: 'null',
  });
});

exports.getOneCase = async (user, caseId) => {
  let query = { _id: caseId };

  // if the user isnot the admin find the case with the current user
  if (user.role !== 'admin') query.user = user._id;

  // find the case
  const caseDoc = await Case.findOne(query).populate('benefit user');
  if (!caseDoc) return new Error("This case couldn't be found");

  // return the case
  return caseDoc;
};

exports.getAllCases = async (user) => {
  let query = {};

  // check if the current user isnot an admin then find all cases for that user
  if (user.role !== 'admin') query.user = user._id;

  // find the cases
  const cases = await Case.find(query).populate('benefit');

  // return cases
  return cases;
};

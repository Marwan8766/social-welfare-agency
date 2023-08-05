const express = require('express');

const authController = require('../controllers/authController');
const caseController = require('../controllers/caseController');

const { myMulter, fileValidation } = require('../utils/multer');

const { configureCloudinary } = require('../utils/cloudinary');

///////////////////

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .post(
    myMulter(fileValidation.image),
    configureCloudinary,
    caseController.validateCreateMiddleware,
    caseController.uploadCreatePhotos,
    caseController.setCaseBody,
    caseController.createCase
  );

router
  .route('/:id')
  .patch(
    myMulter(fileValidation.image),
    configureCloudinary,
    caseController.validateUpdateAuthMiddleware,
    caseController.uploadPhotosUpdate,
    caseController.deletePhotosUpdate,
    caseController.setBodyUpdate,
    caseController.updateCase
  )
  .delete(
    configureCloudinary,
    caseController.deleteCaseValidation,
    caseController.deleteCasePhotos,
    caseController.deleteCase
  );

module.exports = router;

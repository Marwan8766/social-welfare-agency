const express = require('express');

const authController = require('../controllers/authController');
const benefitController = require('../controllers/benefitController');
///////////////////

const router = express.Router();

router.get('/', benefitController.getAllBenefits);

router.get('/:id', benefitController.getOneBenefit);

// Protect all routes after this middleware
router.use(authController.protect);

// Restrict all routes after that middleware to only admin
router.use(authController.restrictTo('admin'));

router.post(
  '/',
  benefitController.setBodyBenefit,
  benefitController.createBenefit
);

router
  .route('/:id')
  .patch(benefitController.setBodyBenefit, benefitController.updateBenefit)
  .delete(benefitController.deleteBenefit);

module.exports = router;

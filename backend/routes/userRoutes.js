const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

///////////////////

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/').get(userController.getMe).patch(userController.updateMe);

module.exports = router;

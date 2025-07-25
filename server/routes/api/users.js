const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  userController.registerUser
);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.loginUser
);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, userController.updateUserProfile);

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', [auth, adminAuth], userController.getAllUsers);

module.exports = router;

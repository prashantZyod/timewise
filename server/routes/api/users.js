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
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    // Custom validation for name fields
    check('name').optional().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    check('firstName').optional().isLength({ min: 1 }).withMessage('First name cannot be empty'),
    check('lastName').optional().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
    // Custom validator to ensure either name or firstName is provided
    check().custom((value, { req }) => {
      if (!req.body.name && !req.body.firstName) {
        throw new Error('Either name or firstName is required');
      }
      return true;
    })
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

// @route   POST api/users/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, userController.logoutUser);

// @route   POST api/users/refresh-token
// @desc    Refresh authentication token
// @access  Public
router.post('/refresh-token', userController.refreshToken);

// @route   POST api/users/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  userController.forgotPassword
);

// @route   POST api/users/reset-password
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  userController.resetPassword
);

// @route   POST api/users/verify-email
// @desc    Verify email address
// @access  Public
router.post(
  '/verify-email',
  [check('token', 'Token is required').not().isEmpty()],
  userController.verifyEmail
);

// @route   POST api/users/resend-verification
// @desc    Resend email verification
// @access  Public
router.post(
  '/resend-verification',
  [check('email', 'Please include a valid email').isEmail()],
  userController.resendVerification
);

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', [auth, adminAuth], userController.getAllUsers);

module.exports = router;

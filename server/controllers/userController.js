const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, firstName, lastName, email, password, role } = req.body;

    // Handle name splitting if firstName and lastName are not provided
    let userFirstName = firstName;
    let userLastName = lastName;
    
    if (!firstName && !lastName && name) {
      const nameParts = name.trim().split(' ');
      userFirstName = nameParts[0];
      userLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
    }
    
    // Ensure we have values for required fields
    if (!userFirstName) {
      userFirstName = 'User';
    }
    if (!userLastName) {
      userLastName = 'User';
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      firstName: userFirstName,
      lastName: userLastName,
      email,
      password, // Password will be hashed automatically by the User model's pre-save middleware
      role: role || 'staff' // Default to staff if not specified
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getUserProfile:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error('Error in updateUserProfile:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error in getAllUsers:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
exports.logoutUser = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the token
    // For now, we'll just return success as the client will remove the token
    res.json({ msg: 'User logged out successfully' });
  } catch (err) {
    console.error('Error in logoutUser:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Refresh authentication token
// @route   POST /api/users/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ msg: 'No refresh token provided' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }

    // Create new access token
    const payload = { user: { id: user.id, role: user.role } };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
    
    res.json({ token: newToken, user });
  } catch (err) {
    console.error('Error in refreshToken:', err.message);
    res.status(401).json({ msg: 'Invalid refresh token' });
  }
};

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate reset token (in production, this should be properly implemented with email sending)
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // In a real implementation, you would send this token via email
    res.json({ 
      msg: 'Password reset token generated',
      resetToken, // Remove this in production
      instructions: 'Use this token to reset your password'
    });
  } catch (err) {
    console.error('Error in forgotPassword:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;
    
    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'Invalid reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Error in resetPassword:', err.message);
    res.status(400).json({ msg: 'Invalid or expired reset token' });
  }
};

// @desc    Verify email address
// @route   POST /api/users/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;
    
    // Verify email token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'Invalid verification token' });
    }

    // Mark email as verified
    user.emailVerified = true;
    await user.save();
    
    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error('Error in verifyEmail:', err.message);
    res.status(400).json({ msg: 'Invalid or expired verification token' });
  }
};

// @desc    Resend email verification
// @route   POST /api/users/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ msg: 'Email already verified' });
    }

    // Generate verification token
    const verificationToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // In a real implementation, you would send this token via email
    res.json({ 
      msg: 'Verification email sent',
      verificationToken, // Remove this in production
      instructions: 'Use this token to verify your email'
    });
  } catch (err) {
    console.error('Error in resendVerification:', err.message);
    res.status(500).send('Server error');
  }
};

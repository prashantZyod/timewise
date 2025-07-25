const dotenv = require('dotenv');
const connectDB = require('./config/database');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const ErrorResponse = require('./utils/errorResponse');
const { check } = require('express-validator');
const adminController = require('../controllers/adminController');
const geofenceController = require('../../controllers/geofenceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, staffAndAbove } = require('../../middleware/roleMiddleware');
const { validate } = require('../middleware/validateRequest');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/geofences', require('./routes/geofenceRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'TimeWise API is running' });
});

// 404 handler
app.use((req, res, next) => {
  next(new ErrorResponse(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Apply middleware to all admin routes
app.use('/api/admin', protect, adminOnly);

// @route   POST /api/admin/users
// @desc    Create user
// @access  Private/Admin
app.post(
  '/api/admin/users',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  validate,
  adminController.createUser
);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
app.get('/api/admin/users', adminController.getUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Private/Admin
app.get('/api/admin/users/:id', adminController.getUser);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
app.put(
  '/api/admin/users/:id',
  [
    check('name', 'Name is required if provided').optional().not().isEmpty(),
    check('role', 'Role must be valid').optional().isIn(['staff', 'admin'])
  ],
  validate,
  adminController.updateUser
);

// @route   PUT /api/admin/users/:id/deactivate
// @desc    Deactivate user
// @access  Private/Admin
app.put('/api/admin/users/:id/deactivate', adminController.deactivateUser);

// @route   PUT /api/admin/users/:id/reactivate
// @desc    Reactivate user
// @access  Private/Admin
app.put('/api/admin/users/:id/reactivate', adminController.reactivateUser);

// @route   PUT /api/admin/users/:id/reset-password
// @desc    Reset user password
// @access  Private/Admin
app.put('/api/admin/users/:id/reset-password', adminController.resetUserPassword);

// Apply protection middleware to all geofence routes
app.use('/api/geofences', protect);

// @route   GET /api/geofences
// @desc    Get all geofences
// @access  Private/Admin & Staff
app.get('/api/geofences', staffAndAbove, geofenceController.getGeofences);

// @route   GET /api/geofences/:id
// @desc    Get single geofence
// @access  Private/Admin & Staff
app.get('/api/geofences/:id', staffAndAbove, geofenceController.getGeofence);

// @route   POST /api/geofences
// @desc    Create a new geofence
// @access  Private/Admin
app.post(
  '/api/geofences',
  adminOnly,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('branch', 'Branch ID is required').not().isEmpty(),
    check('coordinates', 'Valid coordinates are required').isArray(),
    check('radius', 'Radius must be a positive number').optional().isNumeric().isFloat({ min: 1 })
  ],
  validate,
  geofenceController.createGeofence
);

// @route   PUT /api/geofences/:id
// @desc    Update geofence
// @access  Private/Admin
app.put(
  '/api/geofences/:id',
  adminOnly,
  [
    check('name', 'Name is required if provided').optional().not().isEmpty(),
    check('coordinates', 'Valid coordinates are required if provided').optional().isArray(),
    check('radius', 'Radius must be a positive number').optional().isNumeric().isFloat({ min: 1 })
  ],
  validate,
  geofenceController.updateGeofence
);

// @route   DELETE /api/geofences/:id
// @desc    Delete geofence
// @access  Private/Admin
app.delete('/api/geofences/:id', adminOnly, geofenceController.deleteGeofence);

// @route   GET /api/geofences/branch/:branchId
// @desc    Get geofences for a specific branch
// @access  Private/Admin & Staff
app.get('/api/geofences/branch/:branchId', staffAndAbove, geofenceController.getBranchGeofences);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
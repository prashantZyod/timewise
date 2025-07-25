const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config({ path: './server/.env' });

// Import routes
const userRoutes = require('./routes/api/users');
const staffRoutes = require('./routes/api/staff');
const branchRoutes = require('./routes/api/branches');
const attendanceRoutes = require('./routes/api/attendance');
const deviceRoutes = require('./routes/api/devices');
const geofenceRoutes = require('./routes/api/geofences');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to TimeWise API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/geofences', geofenceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timewise')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

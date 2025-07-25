const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    radius: {
      type: Number,
      default: 250, // Default radius in meters
      min: 50,
      max: 5000
    }
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  contactNumber: String,
  email: String,
  isActive: {
    type: Boolean,
    default: true
  },
  customGeofence: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    radius: {
      type: Number,
      default: 250
    }
  },
  operatingHours: {
    monday: {
      start: String,
      end: String,
      isClosed: Boolean
    },
    tuesday: {
      start: String,
      end: String,
      isClosed: Boolean
    },
    wednesday: {
      start: String,
      end: String,
      isClosed: Boolean
    },
    thursday: {
      start: String,
      end: String,
      isClosed: Boolean
    },
    friday: {
      start: String,
      end: String,
      isClosed: Boolean
    },
    saturday: {
      start: String,
      end: String,
      isClosed: Boolean
    },
    sunday: {
      start: String,
      end: String,
      isClosed: Boolean
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create geospatial index for geofencing queries
BranchSchema.index({ 'customGeofence.coordinates': '2dsphere' });

module.exports = mongoose.model('Branch', BranchSchema);

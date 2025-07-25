const mongoose = require('mongoose');

const GeofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a geofence name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  type: {
    type: String,
    enum: ['circle', 'polygon'],
    default: 'circle'
  },
  coordinates: {
    type: [Number], // [longitude, latitude] for circle center
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length === 2;
      },
      message: 'Coordinates must be in format [longitude, latitude]'
    }
  },
  radius: {
    type: Number,
    min: [1, 'Radius must be at least 1 meter'],
    default: 100 // in meters, used for circle type
  },
  vertices: {
    type: [[Number]], // Array of [longitude, latitude] points for polygon
    validate: {
      validator: function(v) {
        if (this.type !== 'polygon') return true;
        return v && Array.isArray(v) && v.length >= 3;
      },
      message: 'Polygon must have at least 3 vertices'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
GeofenceSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Geofence', GeofenceSchema);

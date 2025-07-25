const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: {
      type: Date,
      default: null
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      isWithinGeofence: {
        type: Boolean,
        default: false
      },
      distance: Number, // distance from branch in meters
      radius: Number, // branch radius at time of check-in
      locationName: String // branch or custom premise name
    },
    deviceInfo: {
      deviceId: String,
      browser: String,
      os: String
    },
    notes: String
  },
  checkOut: {
    time: {
      type: Date,
      default: null
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      isWithinGeofence: {
        type: Boolean,
        default: false
      },
      distance: Number,
      radius: Number
    },
    deviceInfo: {
      deviceId: String,
      browser: String,
      os: String
    },
    notes: String
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'on_leave', 'pending'],
    default: 'pending'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  locationTrackingData: [{
    timestamp: Date,
    latitude: Number,
    longitude: Number,
    isWithinGeofence: Boolean,
    distance: Number // distance from branch in meters
  }],
  customPremiseUsed: {
    type: Boolean,
    default: false
  },
  customPremiseData: {
    name: String,
    latitude: Number,
    longitude: Number,
    radius: Number
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

// Create compound index for efficient querying
AttendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);

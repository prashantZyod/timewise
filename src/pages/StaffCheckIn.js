import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useGeoLocation, GeoLocationProvider } from '../contexts/GeoLocationContext';
import AttendanceService from '../services/AttendanceService';
import BranchService from '../services/BranchService';
import CustomPremiseForm from '../components/CustomPremiseForm';
import LocationPermissionRequest from '../components/common/LocationPermissionRequest';
import { getAccuracyDescription } from '../utils/geolocationUtils';
import { Link } from 'react-router-dom';

// Main component that uses the GeoLocation context
function StaffCheckInContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState('checking'); // checking, in-range, out-of-range
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState({
    id: 1,
    name: "Factory Main Building",
    address: "Industrial Area, Sector 34, Gurgaon, 122004",
    radius: 250
  });
  const [checkInStep, setCheckInStep] = useState('permission'); // permission, location, success
  const [attendanceId, setAttendanceId] = useState(null);
  const [showCustomPremiseForm, setShowCustomPremiseForm] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  
  // Get geo location context
  const { 
    currentLocation, 
    locationError, 
    isWithinBranchRadius,
    isWithinCustomPremise,
    customPremiseLocation,
    getCurrentLocation,
    startLocationTracking,
    verifyBranchLocation,
    checkCustomPremiseLocation
  } = useGeoLocation();
  
  // Handle successful location permission
  const handleLocationGranted = (locationData) => {
    setLocationPermissionGranted(true);
    setCheckInStep('location');
  };
  
  // Handle location permission denied
  const handleLocationDenied = (reason) => {
    console.error('Location access denied:', reason);
  };
  
  // Handle location retrieval errors
  const handleLocationError = (error) => {
    console.error('Location error:', error);
  };

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Start location tracking
    startLocationTracking();
    
    // Load branch data
    const loadBranch = async () => {
      try {
        const branch = await BranchService.getById(1); // Get first branch
        if (branch) {
          setSelectedBranch(branch);
        }
      } catch (error) {
        console.error("Error loading branch:", error);
      }
    };
    
    loadBranch();
    
    return () => clearInterval(timer);
  }, [startLocationTracking]);
  
  // Check if user is within the geofence when location changes
  useEffect(() => {
    if (currentLocation) {
      if (customPremiseLocation) {
        // Check against custom premise location
        const customPremiseResult = checkCustomPremiseLocation();
        if (customPremiseResult.isWithin) {
          setLocationStatus('in-range');
        } else {
          setLocationStatus('out-of-range');
        }
      } else if (selectedBranch) {
        // Check against branch location
        const result = verifyBranchLocation(selectedBranch);
        if (result.isWithin) {
          setLocationStatus('in-range');
        } else {
          setLocationStatus('out-of-range');
        }
      }
      
      setGpsAccuracy(`±${Math.round(currentLocation.accuracy || 0)}m`);
    }
  }, [currentLocation, selectedBranch, customPremiseLocation, verifyBranchLocation, checkCustomPremiseLocation]);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${month} ${day}, ${year}`;
  };

  // Handle the check-in process
  const handleCheckIn = async () => {
    if (locationStatus !== 'in-range') {
      alert('You must be within the factory premises to check in');
      return;
    }
    
    setCheckInStep('checking');
    
    try {
      // Get fresh location
      const location = await getCurrentLocation();
      
      if (!location) {
        throw new Error('Could not get current location');
      }
      
      // Create mock user for demo
      const user = {
        id: 'user123',
        name: 'Factory Employee'
      };
      
      // Determine which location to verify against
      let verification;
      let locationName;
      
      if (customPremiseLocation) {
        verification = checkCustomPremiseLocation();
        locationName = customPremiseLocation.name;
      } else {
        verification = verifyBranchLocation(selectedBranch);
        locationName = selectedBranch.name;
      }
      
      // Prepare location data for check-in
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        isWithinGeofence: verification.isWithin,
        distance: verification.distance,
        radius: verification.radius || 250,
        locationName: locationName
      };
      
      // Check in with location data
      const checkInData = {
        staff_id: user.id,
        branch_id: selectedBranch.id,
        device_id: 'web-device', // Mock device ID
        location: locationData
      };
      
      // In a real app, this would call the actual service
      // For demo purposes, we'll simulate successful check-in
      setAttendanceId('att-' + Date.now());
      
      // Show success
      setTimeout(() => {
        setCheckInStep('success');
      }, 1000);
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Error checking in: ' + (error.message || 'Unknown error'));
      setCheckInStep('location');
    }
  };

  // Handle custom premise form save
  const handleCustomPremiseSave = () => {
    setShowCustomPremiseForm(false);
    // Get updated status
    if (currentLocation) {
      const result = checkCustomPremiseLocation();
      if (result.isWithin) {
        setLocationStatus('in-range');
      } else {
        setLocationStatus('out-of-range');
      }
    }
  };

  // If showing custom premise form
  if (showCustomPremiseForm) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <CustomPremiseForm 
          onSave={handleCustomPremiseSave}
          onCancel={() => setShowCustomPremiseForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Staff Attendance</h1>
        <p className="text-slate-600 mt-2">Secure attendance tracking with geofencing</p>
      </div>

      {/* Clock Display */}
      <Card className="mb-6 bg-emerald-500 text-white">
        <CardContent className="flex flex-col items-center py-12">
          <div className="text-7xl font-bold tracking-wider mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-xl">
            {formatDate(currentTime)}
          </div>
        </CardContent>
      </Card>

      {/* Location Permission Request */}
      {checkInStep === 'permission' && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Location Access Required</h2>
            <p className="text-slate-600 mb-6">
              To use the attendance system, we need your permission to access your location.
              This helps verify you are at the factory premises.
            </p>
            
            <LocationPermissionRequest 
              onLocationGranted={handleLocationGranted}
              onLocationDenied={handleLocationDenied}
              onLocationError={handleLocationError}
              autoRequest={true}
              className="mb-4"
            />
          </CardContent>
        </Card>
      )}

      {/* Location & Security Status */}
      {checkInStep === 'location' && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <MapPin className="mr-2" /> Location Status
              </h2>
              <Link to="/custom-premise-settings">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-1" /> Location Settings
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-slate-600">Factory Location:</div>
              <div className="font-medium">
                {customPremiseLocation ? customPremiseLocation.name : selectedBranch.name}
              </div>
            </div>
            
            {customPremiseLocation && (
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                Using custom factory location with {customPremiseLocation.radius}m radius
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="text-slate-600">Location:</div>
              <div>
                {locationStatus === 'checking' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Checking...</span>
                )}
                {locationStatus === 'in-range' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">In Range</span>
                )}
                {locationStatus === 'out-of-range' && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">Out of Range</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-slate-600">GPS Accuracy:</div>
              <div className="text-slate-600">{gpsAccuracy || 'Calculating...'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Check In Button */}
      {checkInStep === 'location' ? (
        <div className="flex flex-col space-y-4">
          <Button 
            className="w-full h-16 text-lg"
            disabled={locationStatus !== 'in-range'}
            onClick={handleCheckIn}
          >
            {locationStatus === 'in-range' ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Check In Now
              </>
            ) : locationStatus === 'out-of-range' ? (
              <>
                <AlertTriangle className="mr-2 h-5 w-5" />
                Out of Factory Range
              </>
            ) : (
              <>
                <Clock className="mr-2 h-5 w-5 animate-spin" />
                Checking Location...
              </>
            )}
          </Button>
          
          {locationStatus === 'out-of-range' && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="flex items-center text-amber-700 font-medium mb-2">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Not Within Factory Range
              </h3>
              <p className="text-amber-600 text-sm">
                You must be within the factory premises ({customPremiseLocation?.radius || selectedBranch.radius}m radius) to check in. Please move closer to the location or set a custom factory location.
              </p>
            </div>
          )}
        </div>
      ) : checkInStep === 'checking' ? (
        <div className="text-center p-8">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-600">Processing check-in...</p>
        </div>
      ) : (
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-medium text-emerald-800 mb-2">Check-In Successful!</h3>
          <p className="text-emerald-700 mb-4">
            Your attendance has been recorded successfully.
          </p>
          <p className="text-sm text-emerald-600">
            Attendance ID: {attendanceId}<br />
            Time: {formatTime(new Date())}
          </p>
        </div>
      )}
    </div>
  );
}

// Since GeoLocationProvider is now included in AppProviders, 
// we don't need to wrap it here
const StaffCheckIn = StaffCheckInContent;

export default StaffCheckIn;

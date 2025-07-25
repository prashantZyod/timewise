import React, { useState, useEffect } from 'react';
import { useGeoLocation } from '../contexts/GeoLocationContext';
import GeoLocationService from '../services/GeoLocationService';
import GeoLocationServiceBackend from '../services/GeoLocationServiceBackend';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { 
  MapPin, Check, AlertTriangle, Loader2, RefreshCw, 
  LogIn, LogOut, Map, Shield, Info, Settings
} from 'lucide-react';
import { Progress } from './ui/progress';
import { Link } from 'react-router-dom';
import CustomPremiseForm from './CustomPremiseForm';

/**
 * GeoFencedCheckIn Component
 * Handles location-based check-in/out functionality
 */
const GeoFencedCheckIn = ({ 
  user,
  branch,
  onCheckIn,
  onCheckOut,
  attendance,
  isCheckedIn = false,
  disableUI = false
}) => {
  // State
  const [checkingStatus, setCheckingStatus] = useState('idle'); // idle, checking, success, error
  const [statusMessage, setStatusMessage] = useState('');
  const [locationVerification, setLocationVerification] = useState(null);
  const [showCustomPremiseForm, setShowCustomPremiseForm] = useState(false);
  
  // Get geo location context
  const { 
    currentLocation, 
    locationError, 
    isLocationTracking,
    loadingLocation,
    isWithinBranchRadius,
    isWithinCustomPremise,
    customPremiseLocation,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    verifyBranchLocation,
    checkCustomPremiseLocation
  } = useGeoLocation();
  
  // Start location tracking when component mounts
  useEffect(() => {
    if (!isLocationTracking && !locationError) {
      startLocationTracking();
    }
    
    // Clean up when unmounting
    return () => {
      stopLocationTracking();
    };
  }, [startLocationTracking, stopLocationTracking, isLocationTracking, locationError]);
  
  // Verify location when branch or current location changes
  useEffect(() => {
    if (currentLocation) {
      let result;
      
      if (customPremiseLocation) {
        // Use custom premise location if available
        result = GeoLocationService.isWithinCustomPremise(currentLocation);
      } else if (branch && branch.location) {
        // Otherwise use branch location
        const branchLocation = {
          latitude: branch.location.latitude,
          longitude: branch.location.longitude
        };
        
        result = GeoLocationService.isWithinRadius(
          currentLocation,
          branchLocation,
          branch.location.radius || 250
        );
      }
      
      if (result) {
        setLocationVerification(result);
      }
    }
  }, [branch, currentLocation, customPremiseLocation]);
  
  // Format distance to be more readable
  const formatDistance = (meters) => {
    if (!meters) return 'Unknown';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(2)}km`;
  };
  
  // Handle check-in process
  const handleCheckIn = async () => {
    if (!user) {
      setStatusMessage('Missing user information to check in');
      return;
    }
    
    // Ensure we have a location to check against (branch or custom)
    if (!customPremiseLocation && (!branch || !branch.location)) {
      setStatusMessage('No location configured for check-in');
      return;
    }
    
    if (!currentLocation) {
      setStatusMessage('Cannot get your current location');
      return;
    }
    
    setCheckingStatus('checking');
    setStatusMessage('Verifying your location...');
    
    try {
      // Get fresh location for accuracy
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Could not get current location');
      }
      
      // Determine which location to check against
      let verification;
      let locationName;
      let radius;
      let geofenceId;
      
      if (customPremiseLocation) {
        // Use custom premise location
        verification = GeoLocationService.isWithinCustomPremise(location);
        locationName = customPremiseLocation.name;
        radius = customPremiseLocation.radius;
        // If we have custom premise ID from backend
        geofenceId = customPremiseLocation._id || null;
      } else {
        // Use branch location
        const branchLocation = {
          latitude: branch.location.latitude,
          longitude: branch.location.longitude
        };
        
        verification = GeoLocationService.isWithinRadius(
          location,
          branchLocation,
          branch.location.radius
        );
        
        locationName = branch.name;
        radius = branch.location.radius;
        // If we have branch geofence ID
        geofenceId = branch.geofenceId || null;
      }
      
      setLocationVerification(verification);
      
      // Check if user is within geofence
      if (!verification.isWithin) {
        setCheckingStatus('error');
        setStatusMessage(`You must be within ${radius}m of ${locationName} to check in.`);
        return;
      }
      
      // Prepare location data for check-in
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        isWithinGeofence: verification.isWithin,
        distance: verification.distance,
        radius: verification.radius,
        locationName: locationName
      };
      
      // Try to use backend service if geofenceId is available
      if (geofenceId && user.id && branch?.id) {
        try {
          // Get device info
          const deviceInfo = {
            userAgent: navigator.userAgent,
            deviceId: localStorage.getItem('deviceId') || 'unknown',
            name: navigator.platform || 'Web Browser'
          };
          
          // Use backend service for check-in
          const backendResult = await GeoLocationServiceBackend.checkIn(
            user.id,
            branch.id,
            deviceInfo,
            '', // notes
            customPremiseLocation ? { 
              name: customPremiseLocation.name,
              location: {
                latitude: customPremiseLocation.latitude,
                longitude: customPremiseLocation.longitude
              },
              radius: customPremiseLocation.radius
            } : null
          );
          
          // Add backend data to locationData
          locationData.backendVerified = true;
          locationData.attendanceId = backendResult.data?.id;
        } catch (backendError) {
          console.warn('Backend check-in failed, falling back to local:', backendError);
          locationData.backendVerified = false;
        }
      }
      
      // Call parent handler
      if (onCheckIn) {
        await onCheckIn(locationData);
      }
      
      setCheckingStatus('success');
      setStatusMessage('Successfully checked in!');
      
      // Reset status after delay
      setTimeout(() => {
        setCheckingStatus('idle');
        setStatusMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Check-in error:', error);
      setCheckingStatus('error');
      setStatusMessage(error.message || 'Error processing check-in');
    }
  };
  
  // Handle check-out process
  const handleCheckOut = async () => {
    if (!user || !branch || !currentLocation || !attendance) {
      setStatusMessage('Missing required information to check out');
      return;
    }
    
    setCheckingStatus('checking');
    setStatusMessage('Verifying your location for check-out...');
    
    try {
      // Get fresh location for accuracy
      const location = await getCurrentLocation();
      if (!location) {
        throw new Error('Could not get current location');
      }
      
      // Verify if within branch geofence
      const branchLocation = {
        latitude: branch.location.latitude,
        longitude: branch.location.longitude
      };
      
      const verification = GeoLocationService.isWithinRadius(
        location,
        branchLocation,
        branch.location.radius
      );
      
      setLocationVerification(verification);
      
      // Proceed with check-out
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        isWithinGeofence: verification.isWithin,
        distance: verification.distance,
        radius: verification.radius
      };
      
      // Try to use backend service if we have the necessary IDs
      if (user.id && attendance) {
        try {
          // Get device info
          const deviceInfo = {
            userAgent: navigator.userAgent,
            deviceId: localStorage.getItem('deviceId') || 'unknown',
            name: navigator.platform || 'Web Browser'
          };
          
          // Use backend service for check-out
          const backendResult = await GeoLocationServiceBackend.checkOut(
            user.id,
            deviceInfo,
            '' // notes
          );
          
          // Add backend data to locationData
          locationData.backendVerified = true;
          locationData.checkoutTime = backendResult.data?.checkoutTime;
        } catch (backendError) {
          console.warn('Backend check-out failed, falling back to local:', backendError);
          locationData.backendVerified = false;
        }
      }
      
      // Call parent handler
      if (onCheckOut) {
        await onCheckOut(attendance.id, locationData);
      }
      
      setCheckingStatus('success');
      setStatusMessage('Successfully checked out!');
      
      // Reset status after delay
      setTimeout(() => {
        setCheckingStatus('idle');
        setStatusMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Check-out error:', error);
      setCheckingStatus('error');
      setStatusMessage(error.message || 'Error processing check-out');
    }
  };
  
  // Refresh location manually
  const refreshLocation = async () => {
    setStatusMessage('Refreshing your location...');
    await getCurrentLocation();
    setStatusMessage('Location updated');
    
    // Clear message after delay
    setTimeout(() => {
      setStatusMessage('');
    }, 2000);
  };
  
  // Handle custom premise form save
  const handleCustomPremiseSave = async (customLocation) => {
    setShowCustomPremiseForm(false);
    
    // Try to save to backend if branch is available
    if (branch?.id && customLocation) {
      try {
        await GeoLocationServiceBackend.saveCustomPremiseLocationToBackend(
          customLocation,
          branch.id
        );
        setStatusMessage('Custom location saved to backend');
        
        // Set a timeout to clear the message
        setTimeout(() => {
          setStatusMessage('');
        }, 2000);
      } catch (error) {
        console.error('Failed to save custom location to backend:', error);
      }
    }
    
    // Verify location with new custom premise
    if (currentLocation) {
      const result = checkCustomPremiseLocation();
      setLocationVerification(result);
    }
  };

  // Show error UI if there's a location error
  if (locationError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="bg-destructive/15 text-destructive">
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Location Error
          </CardTitle>
          <CardDescription className="text-destructive/90">
            Cannot access your location
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Required</AlertTitle>
            <AlertDescription>
              {locationError}
            </AlertDescription>
          </Alert>
          <p className="text-sm mb-4">
            TimeWise requires your location to verify your presence at the branch. 
            Please enable location services for this site in your browser settings.
          </p>
          <Button 
            onClick={refreshLocation} 
            variant="outline" 
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </CardTitle>
        <CardDescription>
          {branch ? `Factory Location: ${branch.name}` : 'Verify you are within factory premises'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Custom Premise Form */}
        {showCustomPremiseForm ? (
          <div className="mb-4">
            <CustomPremiseForm 
              onSave={handleCustomPremiseSave}
              onCancel={() => setShowCustomPremiseForm(false)}
              initialLocation={currentLocation}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {customPremiseLocation ? 'Custom Location Active' : 'Default Branch Location'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCustomPremiseForm(true)}
            >
              {customPremiseLocation ? 'Edit Custom' : 'Set Custom'}
            </Button>
          </div>
        )}

        {/* Status message */}
        {statusMessage && (
          <Alert className={`mb-4 ${
            checkingStatus === 'error' ? 'bg-destructive/15 text-destructive' : 
            checkingStatus === 'success' ? 'bg-emerald-500/15 text-emerald-600' :
            'bg-primary/15'
          }`}>
            {checkingStatus === 'error' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : checkingStatus === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <AlertTitle>
              {checkingStatus === 'error' ? 'Error' : 
              checkingStatus === 'success' ? 'Success' : 
              'Status'}
            </AlertTitle>
            <AlertDescription>
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Loading state */}
        {loadingLocation && !currentLocation && (
          <div className="space-y-2 py-4">
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <p className="text-sm">Determining your location...</p>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        )}
        
        {/* Location information */}
        {currentLocation && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Your Location</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshLocation}
                disabled={checkingStatus === 'checking'}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Verification status */}
            {locationVerification && (
              <div className="rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center">
                  {locationVerification.isWithin ? (
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-1 mr-3">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1 mr-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">
                      {locationVerification.isWithin 
                        ? (customPremiseLocation ? 'Within Custom Premises' : 'Within Branch Radius')
                        : (customPremiseLocation ? 'Outside Custom Premises' : 'Outside Branch Radius')}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Distance: {formatDistance(locationVerification.distance)}
                      {!locationVerification.isWithin && (
                        <span> (Radius: {formatDistance(locationVerification.radius)})</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        {!isCheckedIn ? (
          <Button
            className="w-full"
            onClick={handleCheckIn}
            disabled={checkingStatus === 'checking' || !currentLocation || (locationVerification && !locationVerification.isWithin)}
          >
            {checkingStatus === 'checking' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Check In Now
              </>
            )}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleCheckOut}
            disabled={checkingStatus === 'checking' || !currentLocation}
          >
            {checkingStatus === 'checking' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Check Out Now
              </>
            )}
          </Button>
        )}
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (customPremiseLocation) {
              window.open(`https://maps.google.com/maps?q=${customPremiseLocation.latitude},${customPremiseLocation.longitude}`, '_blank');
            } else if (branch && branch.location) {
              window.open(`https://maps.google.com/maps?q=${branch.location.latitude},${branch.location.longitude}`, '_blank');
            }
          }}
          disabled={!branch && !customPremiseLocation}
        >
          <Map className="mr-2 h-4 w-4" />
          View Location on Map
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeoFencedCheckIn;

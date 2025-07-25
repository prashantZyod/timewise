import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Loader2, Check, AlertTriangle, RefreshCw, Server } from 'lucide-react';
import GeoLocationServiceBackend from '../services/GeoLocationServiceBackend';
import api from '../services/api';

/**
 * Demo component to show backend integration features
 */
const BackendIntegrationDemo = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [locationResult, setLocationResult] = useState(null);
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const [staff, setStaff] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [locationTracker, setLocationTracker] = useState(null);

  // Get geofences from backend
  useEffect(() => {
    const fetchGeofences = async () => {
      setLoading(true);
      try {
        const response = await api.geofence.getAllGeofences();
        setGeofences(response.data);
        if (response.data.length > 0) {
          setSelectedGeofence(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching geofences:', error);
        setMessage('Failed to fetch geofences');
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    const getDeviceInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        deviceId: generateDeviceId(),
        name: `${navigator.platform} Browser`,
        type: 'browser'
      };
      setDeviceInfo(info);
    };

    fetchGeofences();
    getDeviceInfo();
  }, []);

  // Generate a simple device ID
  const generateDeviceId = () => {
    const existingId = localStorage.getItem('deviceId');
    if (existingId) return existingId;
    
    const newId = 'dev_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('deviceId', newId);
    return newId;
  };

  // Check current location against selected geofence
  const checkLocationWithGeofence = async () => {
    if (!selectedGeofence) {
      setMessage('No geofence selected');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('loading');
    setMessage('Checking your location...');

    try {
      const result = await GeoLocationServiceBackend.getCurrentLocationWithGeofenceCheck(
        selectedGeofence._id
      );
      
      setLocationResult(result);
      setStatus('success');
      setMessage(
        result.isWithinGeofence 
          ? `You are within the ${selectedGeofence.name} geofence!` 
          : `You are outside the ${selectedGeofence.name} geofence. Distance: ${Math.round(result.distance)}m`
      );
    } catch (error) {
      console.error('Error checking location:', error);
      setStatus('error');
      setMessage('Failed to check location: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Register current device
  const registerDevice = async () => {
    if (!deviceInfo) {
      setMessage('No device info available');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('loading');
    setMessage('Registering device...');

    try {
      // First, get current staff (for demo purposes)
      const staffResponse = await api.staff.getAllStaff();
      if (staffResponse.data.length === 0) {
        throw new Error('No staff found');
      }
      
      const staffMember = staffResponse.data[0];
      setStaff(staffMember);
      
      // Register device
      const result = await GeoLocationServiceBackend.registerDevice(
        staffMember._id,
        deviceInfo.deviceId,
        deviceInfo.name,
        deviceInfo.type,
        { userAgent: deviceInfo.userAgent },
        { platform: navigator.platform }
      );
      
      setStatus('success');
      setMessage(`Device registered successfully for ${staffMember.name}`);
    } catch (error) {
      console.error('Error registering device:', error);
      setStatus('error');
      setMessage('Failed to register device: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Start location tracking
  const startTracking = () => {
    if (!staff) {
      setMessage('No staff selected');
      setStatus('error');
      return;
    }

    try {
      const tracker = GeoLocationServiceBackend.startLocationTracking(staff._id, 1); // 1 minute intervals
      setLocationTracker(tracker);
      setStatus('success');
      setMessage('Location tracking started');
    } catch (error) {
      console.error('Error starting tracking:', error);
      setStatus('error');
      setMessage('Failed to start tracking: ' + error.message);
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (locationTracker) {
      locationTracker.stop();
      setLocationTracker(null);
      setStatus('success');
      setMessage('Location tracking stopped');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2 h-5 w-5" />
          Backend Integration Demo
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {status !== 'idle' && (
          <Alert className={`
            ${status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
            ${status === 'error' ? 'bg-red-50 border-red-200 text-red-800' : ''}
            ${status === 'loading' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
          `}>
            <AlertTitle className="flex items-center">
              {status === 'loading' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {status === 'success' && <Check className="h-4 w-4 mr-2" />}
              {status === 'error' && <AlertTriangle className="h-4 w-4 mr-2" />}
              {status === 'loading' ? 'Processing...' : status === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        {geofences.length > 0 ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Geofence:</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedGeofence?._id || ''}
              onChange={(e) => {
                const selected = geofences.find(g => g._id === e.target.value);
                setSelectedGeofence(selected);
              }}
            >
              {geofences.map(geofence => (
                <option key={geofence._id} value={geofence._id}>
                  {geofence.name} ({geofence.radius}m)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Alert>
            <AlertTitle>No Geofences</AlertTitle>
            <AlertDescription>
              No geofences found. Please create at least one geofence in the admin panel.
            </AlertDescription>
          </Alert>
        )}
        
        {locationResult && (
          <div className="bg-slate-50 p-3 rounded-md">
            <h3 className="font-medium mb-2">Last Location Check:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Latitude:</div>
              <div>{locationResult.latitude.toFixed(6)}</div>
              
              <div>Longitude:</div>
              <div>{locationResult.longitude.toFixed(6)}</div>
              
              <div>Within Geofence:</div>
              <div>{locationResult.isWithinGeofence ? 'Yes' : 'No'}</div>
              
              <div>Distance:</div>
              <div>{Math.round(locationResult.distance)}m</div>
              
              <div>Radius:</div>
              <div>{locationResult.radius}m</div>
            </div>
          </div>
        )}
        
        {locationTracker && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Location Tracking Active
            </AlertTitle>
            <AlertDescription>
              Your location is being tracked and sent to the server.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-3">
        <Button 
          onClick={checkLocationWithGeofence}
          disabled={loading || !selectedGeofence}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Check Location
        </Button>
        
        <Button 
          onClick={registerDevice}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Register Device
        </Button>
        
        {!locationTracker ? (
          <Button 
            onClick={startTracking}
            disabled={loading || !staff}
            className="bg-green-600 hover:bg-green-700"
          >
            Start Tracking
          </Button>
        ) : (
          <Button 
            onClick={stopTracking}
            className="bg-red-600 hover:bg-red-700"
          >
            Stop Tracking
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BackendIntegrationDemo;

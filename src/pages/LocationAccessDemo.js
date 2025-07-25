import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import LocationPermissionRequest from '../components/common/LocationPermissionRequest';
import { GeoLocationProvider } from '../contexts/GeoLocationContext';

const LocationAccessDemoContent = () => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestManually, setRequestManually] = useState(false);
  
  // Handle successful location retrieval
  const handleLocationGranted = (locationData) => {
    setLocation(locationData);
    setErrorMessage('');
    console.log('Location granted:', locationData);
  };
  
  // Handle location permission denied
  const handleLocationDenied = (reason) => {
    setErrorMessage(`Location access denied: ${reason}`);
    console.error('Location denied:', reason);
  };
  
  // Handle location retrieval errors
  const handleLocationError = (error) => {
    setErrorMessage(`Error getting location: ${error.message}`);
    console.error('Location error:', error);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Location Access Demo</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automatic Location Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-600">
              This component automatically requests location access when it loads.
            </p>
            
            <LocationPermissionRequest 
              onLocationGranted={handleLocationGranted}
              onLocationDenied={handleLocationDenied}
              onLocationError={handleLocationError}
              autoRequest={true}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Manual Location Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-600">
              Click the button below to manually request location access.
            </p>
            
            {!requestManually ? (
              <Button 
                onClick={() => setRequestManually(true)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Request Location Access
              </Button>
            ) : (
              <LocationPermissionRequest 
                onLocationGranted={handleLocationGranted}
                onLocationDenied={handleLocationDenied}
                onLocationError={handleLocationError}
                autoRequest={false}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {location && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-500" />
              Current Location Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
              <p><strong>Latitude:</strong> {location.latitude}</p>
              <p><strong>Longitude:</strong> {location.longitude}</p>
              {location.accuracy && (
                <p><strong>Accuracy:</strong> {location.accuracy} meters</p>
              )}
              {location.timestamp && (
                <p><strong>Timestamp:</strong> {new Date(location.timestamp).toLocaleString()}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-500">
              This location data can be used for attendance check-ins, geofencing, and branch verification.
            </p>
          </CardFooter>
        </Card>
      )}
      
      {errorMessage && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <h3 className="font-medium mb-1">Error</h3>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-medium text-blue-800 mb-2">Implementation Notes</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
          <li>This component uses the GeoLocationContext from your application</li>
          <li>It handles permission requests, success states, and error scenarios</li>
          <li>Customize the UI by passing a className prop</li>
          <li>Choose between automatic or manual permission requests</li>
          <li>Callback functions provide location data or error information</li>
        </ul>
      </div>
    </div>
  );
};

// Since GeoLocationProvider is now included in AppProviders, 
// we don't need to wrap it again here
const LocationAccessDemo = LocationAccessDemoContent;

export default LocationAccessDemo;

import React, { useState, useEffect, useRef } from 'react';
import { useGeoLocation } from '../contexts/GeoLocationContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { MapPin, Save, RefreshCw, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import GeoLocationService from '../services/GeoLocationService';

/**
 * Custom Premise Form Component
 * Allows users to set custom factory location for geofencing
 */
const CustomPremiseForm = ({ onSave, onCancel }) => {
  const { 
    currentLocation, 
    customPremiseLocation,
    saveCustomPremiseLocation,
    getCurrentLocation
  } = useGeoLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [locationData, setLocationData] = useState({
    name: customPremiseLocation?.name || 'My Factory',
    latitude: customPremiseLocation?.latitude || (currentLocation?.latitude || 0),
    longitude: customPremiseLocation?.longitude || (currentLocation?.longitude || 0),
    radius: customPremiseLocation?.radius || 250
  });
  
  // Update form when location changes
  useEffect(() => {
    if (currentLocation && !customPremiseLocation) {
      setLocationData(prev => ({
        ...prev,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      }));
    }
  }, [currentLocation, customPremiseLocation]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: name === 'radius' ? parseInt(value, 10) : value
    }));
  };
  
  // Get current location and automatically save it
  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const location = await getCurrentLocation();
      
      if (!location) {
        throw new Error('Could not get current location. Please check your location permissions and try again.');
      }
      
      // Validate location data
      if (!GeoLocationService.validateCoordinates(location)) {
        throw new Error('Invalid location coordinates received. Please try again.');
      }
      
      // Update form data with current location
      const updatedLocation = {
        ...locationData,
        latitude: location.latitude,
        longitude: location.longitude
      };
      
      setLocationData(updatedLocation);
      
      // Create the custom location object with proper type conversion
      const customLocation = {
        name: updatedLocation.name.trim() || 'My Factory',
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        radius: parseInt(updatedLocation.radius, 10) || 250 // Ensure a default radius
      };
      
      // Save custom location immediately
      const success = saveCustomPremiseLocation(customLocation);
      
      if (!success) {
        throw new Error('Failed to save custom premise location. Please try again.');
      }
      
      setSuccess(true);
      
      // Call onSave callback if provided, passing the location data
      if (onSave) {
        setTimeout(() => {
          onSave(customLocation);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Error getting current location');
    } finally {
      setLoading(false);
    }
  };
  
  // Save custom premise location
  const handleSave = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Basic validation
      if (!locationData.name.trim()) {
        throw new Error('Please enter a name for this location');
      }
      
      if (!GeoLocationService.validateCoordinates({
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude)
      })) {
        throw new Error('Please enter valid coordinates');
      }
      
      // Create the custom location object
      const customLocation = {
        name: locationData.name.trim(),
        latitude: parseFloat(locationData.latitude),
        longitude: parseFloat(locationData.longitude),
        radius: parseInt(locationData.radius, 10)
      };
      
      // Save custom location locally
      const success = saveCustomPremiseLocation(customLocation);
      
      if (!success) {
        throw new Error('Failed to save custom premise location');
      }
      
      setSuccess(true);
      
      // Call onSave callback if provided, passing the location data
      if (onSave) {
        setTimeout(() => {
          onSave(customLocation);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Error saving custom premise location');
    } finally {
      setLoading(false);
    }
  };
  
  /**
 * Simple Mock Map Visualization Component
 * This is a placeholder that shows the selected location and radius visually
 */
const MockMapVisualization = ({ latitude, longitude, radius }) => {
  const mapRef = useRef(null);
  
  // Draw the map and circle when component mounts or when props change
  useEffect(() => {
    if (!mapRef.current) return;
    
    const canvas = mapRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background (light gray)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Center point
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Radius for visualization (scale down to fit canvas)
    // For this mock, 250m = 100px, so 1m = 0.4px
    const scaledRadius = Math.min(radius * 0.4, Math.min(width, height) / 2 - 10);
    
    // Draw geofence circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'; // Light green
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)'; // Dark green
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw center point (factory location)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981'; // Green
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw coordinates text
    ctx.font = '12px Arial';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText(`Lat: ${parseFloat(latitude).toFixed(6)}, Lng: ${parseFloat(longitude).toFixed(6)}`, centerX, height - 15);
    
    // Draw radius text
    ctx.fillText(`Radius: ${radius}m`, centerX, height - 35);
    
  }, [latitude, longitude, radius]);
  
  return (
    <div className="relative border rounded-md overflow-hidden">
      <canvas 
        ref={mapRef} 
        width={400} 
        height={250}
        className="w-full h-auto"
      />
      <div className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded">
        Mock visualization
      </div>
    </div>
  );
};

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Set Custom Factory Location
        </CardTitle>
        <CardDescription>
          Configure your factory location for geofencing attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Success message */}
        {success && (
          <Alert className="bg-emerald-500/15 text-emerald-600">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Custom factory location has been saved successfully.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Location Name</Label>
          <Input
            id="name"
            name="name"
            value={locationData.name}
            onChange={handleChange}
            placeholder="My Factory"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="0.000001"
              value={locationData.latitude}
              onChange={handleChange}
              placeholder="Latitude"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="0.000001"
              value={locationData.longitude}
              onChange={handleChange}
              placeholder="Longitude"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="radius">Geofence Radius: {locationData.radius} meters</Label>
          </div>
          <Slider
            id="radius"
            name="radius"
            min={50}
            max={1000}
            step={10}
            value={[locationData.radius]}
            onValueChange={(value) => handleChange({ target: { name: 'radius', value: value[0] } })}
          />
          <p className="text-xs text-muted-foreground">
            Staff must be within this radius (default: 250m) to check in/out.
          </p>
        </div>
        
        {/* Mock map visualization */}
        <div>
          <Label>Location Visualization</Label>
          <MockMapVisualization
            latitude={locationData.latitude}
            longitude={locationData.longitude}
            radius={locationData.radius}
          />
        </div>
        
        <Button
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
          )}
          Use & Save My Current Location
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={loading} className="flex-1">
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Factory Location
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomPremiseForm;

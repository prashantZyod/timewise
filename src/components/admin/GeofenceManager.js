import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { TimeInput } from '../ui/time-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Save, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import BranchService from '../../services/BranchService';
import GeoLocationService from '../../services/GeoLocationService';

/**
 * Geofence Manager Component for Admin Panel
 * Allows admins to configure branch geofence settings
 */
const GeofenceManager = ({ branch, onBranchUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState({
    latitude: branch?.location?.latitude || 0,
    longitude: branch?.location?.longitude || 0,
    radius: branch?.location?.radius || 100,
    address: branch?.location?.address || ''
  });
  
  const [settings, setSettings] = useState({
    requireGeofencing: branch?.attendance_settings?.requireGeofencing || true,
    requirePhotoVerification: branch?.attendance_settings?.requirePhotoVerification || true,
    maxDistanceOutside: branch?.attendance_settings?.maxDistanceOutside || 500,
    checkInStartTime: branch?.attendance_settings?.checkInStartTime || '08:00',
    checkInEndTime: branch?.attendance_settings?.checkInEndTime || '10:00',
    checkOutStartTime: branch?.attendance_settings?.checkOutStartTime || '16:00',
    checkOutEndTime: branch?.attendance_settings?.checkOutEndTime || '18:00',
    allowWeekendCheckin: branch?.attendance_settings?.allowWeekendCheckin || false,
    overrideHolidays: branch?.attendance_settings?.overrideHolidays || false
  });
  
  // Update state when branch changes
  useEffect(() => {
    if (branch) {
      setLocation({
        latitude: branch.location?.latitude || 0,
        longitude: branch.location?.longitude || 0,
        radius: branch.location?.radius || 100,
        address: branch.location?.address || ''
      });
      
      setSettings({
        requireGeofencing: branch.attendance_settings?.requireGeofencing || true,
        requirePhotoVerification: branch.attendance_settings?.requirePhotoVerification || true,
        maxDistanceOutside: branch.attendance_settings?.maxDistanceOutside || 500,
        checkInStartTime: branch.attendance_settings?.checkInStartTime || '08:00',
        checkInEndTime: branch.attendance_settings?.checkInEndTime || '10:00',
        checkOutStartTime: branch.attendance_settings?.checkOutStartTime || '16:00',
        checkOutEndTime: branch.attendance_settings?.checkOutEndTime || '18:00',
        allowWeekendCheckin: branch.attendance_settings?.allowWeekendCheckin || false,
        overrideHolidays: branch.attendance_settings?.overrideHolidays || false
      });
    }
  }, [branch]);
  
  // Update location fields
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: name === 'radius' ? parseInt(value, 10) : value
    }));
  };
  
  // Update settings fields
  const handleSettingsChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get current location from browser
  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await GeoLocationService.getCurrentPosition();
      setLocation(prev => ({
        ...prev,
        latitude: position.latitude,
        longitude: position.longitude
      }));
      
      // Try to get address (would use a real geocoding service in production)
      const address = await GeoLocationService.getAddressFromCoordinates(position);
      setLocation(prev => ({
        ...prev,
        address
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Save branch geofence settings
  const saveBranchSettings = async () => {
    if (!branch) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Update branch with new settings
      const updatedBranch = await BranchService.update(branch.id, {
        location: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          radius: parseInt(location.radius, 10),
          address: location.address,
          lastUpdated: new Date().toISOString()
        },
        attendance_settings: settings
      });
      
      setSuccess(true);
      if (onBranchUpdate) {
        onBranchUpdate(updatedBranch);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update branch settings');
    } finally {
      setLoading(false);
    }
  };
  
  if (!branch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geofence Configuration</CardTitle>
          <CardDescription>No branch selected</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No Branch Selected</AlertTitle>
            <AlertDescription>
              Please select a branch to configure its geofence settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Geofence Configuration
        </CardTitle>
        <CardDescription>
          Configure location-based attendance settings for {branch.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success message */}
        {success && (
          <Alert className="bg-emerald-500/15 text-emerald-600">
            <Info className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Branch geofence settings have been updated successfully.
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
        
        {/* Location settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Branch Location</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="0.000001"
                value={location.latitude}
                onChange={handleLocationChange}
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
                value={location.longitude}
                onChange={handleLocationChange}
                placeholder="Longitude"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={location.address}
              onChange={handleLocationChange}
              placeholder="Address"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="radius">Geofence Radius: {location.radius} meters</Label>
            </div>
            <Slider
              id="radius"
              name="radius"
              min={50}
              max={1000}
              step={10}
              value={[location.radius]}
              onValueChange={(value) => handleLocationChange({ target: { name: 'radius', value: value[0] } })}
            />
            <p className="text-xs text-muted-foreground">
              Set the radius within which staff can check in. Smaller radius ensures staff are physically present.
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            Get Current Location
          </Button>
          
          <div className="bg-muted p-3 rounded-md text-xs">
            <p className="font-medium mb-1">Tip: How to set geofence correctly</p>
            <p>
              For best results, stand at the center of your branch location when using "Get Current Location". 
              Adjust the radius to cover your entire branch but not extend too far beyond it.
            </p>
          </div>
        </div>
        
        {/* Attendance settings */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Attendance Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireGeofencing">Require Geofencing</Label>
                <p className="text-xs text-muted-foreground">
                  Staff must be within the geofence radius to check in
                </p>
              </div>
              <Switch
                id="requireGeofencing"
                checked={settings.requireGeofencing}
                onCheckedChange={(checked) => handleSettingsChange('requireGeofencing', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requirePhotoVerification">Require Photo Verification</Label>
                <p className="text-xs text-muted-foreground">
                  Staff must take a photo for check-in/out
                </p>
              </div>
              <Switch
                id="requirePhotoVerification"
                checked={settings.requirePhotoVerification}
                onCheckedChange={(checked) => handleSettingsChange('requirePhotoVerification', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="maxDistanceOutside">Max Distance Outside Geofence: {settings.maxDistanceOutside}m</Label>
              </div>
              <Slider
                id="maxDistanceOutside"
                min={0}
                max={2000}
                step={50}
                value={[settings.maxDistanceOutside]}
                onValueChange={(value) => handleSettingsChange('maxDistanceOutside', value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Maximum distance outside geofence where check-in is still allowed (with warning)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInStartTime">Check-in Start Time</Label>
                <Input
                  id="checkInStartTime"
                  type="time"
                  value={settings.checkInStartTime}
                  onChange={(e) => handleSettingsChange('checkInStartTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkInEndTime">Check-in End Time</Label>
                <Input
                  id="checkInEndTime"
                  type="time"
                  value={settings.checkInEndTime}
                  onChange={(e) => handleSettingsChange('checkInEndTime', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkOutStartTime">Check-out Start Time</Label>
                <Input
                  id="checkOutStartTime"
                  type="time"
                  value={settings.checkOutStartTime}
                  onChange={(e) => handleSettingsChange('checkOutStartTime', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutEndTime">Check-out End Time</Label>
                <Input
                  id="checkOutEndTime"
                  type="time"
                  value={settings.checkOutEndTime}
                  onChange={(e) => handleSettingsChange('checkOutEndTime', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowWeekendCheckin">Allow Weekend Check-in</Label>
                <p className="text-xs text-muted-foreground">
                  Enable staff to check in on weekends
                </p>
              </div>
              <Switch
                id="allowWeekendCheckin"
                checked={settings.allowWeekendCheckin}
                onCheckedChange={(checked) => handleSettingsChange('allowWeekendCheckin', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overrideHolidays">Override Holidays</Label>
                <p className="text-xs text-muted-foreground">
                  Require attendance even on holidays
                </p>
              </div>
              <Switch
                id="overrideHolidays"
                checked={settings.overrideHolidays}
                onCheckedChange={(checked) => handleSettingsChange('overrideHolidays', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveBranchSettings} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Geofence Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeofenceManager;

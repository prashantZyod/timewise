import React from 'react';
import { GeoLocationProvider } from '../contexts/GeoLocationContext';
import CustomPremiseForm from '../components/CustomPremiseForm';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

function CustomPremiseSettingsContent() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Factory Location Settings</h1>
        <p className="text-slate-600 mt-2">Configure your custom factory location for geofenced attendance tracking</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CustomPremiseForm />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>About Custom Locations</CardTitle>
              <CardDescription>
                How custom factory locations work
              </CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-slate-800 mb-1">Why set a custom location?</h3>
                <p className="text-sm text-slate-600">
                  Setting a custom factory location allows you to define the exact coordinates 
                  of your workplace for more accurate attendance tracking.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-800 mb-1">Geofence Radius</h3>
                <p className="text-sm text-slate-600">
                  The radius defines how far from the central point an employee can be 
                  while still being considered "at the factory." The default is 250 meters.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-800 mb-1">How to get accurate coordinates</h3>
                <p className="text-sm text-slate-600">
                  For best results, stand at the center of your factory location and click "Use My Current Location." 
                  You can also manually enter coordinates if you know them.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-800 mb-1">Privacy Note</h3>
                <p className="text-sm text-slate-600">
                  Your custom location is stored only on this device and is used only for 
                  verifying attendance within the geofence.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Wrapper with GeoLocationProvider
function CustomPremiseSettings() {
  return (
    <GeoLocationProvider>
      <CustomPremiseSettingsContent />
    </GeoLocationProvider>
  );
}

export default CustomPremiseSettings;

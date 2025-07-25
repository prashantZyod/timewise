import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { MapPin, Users, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Geofence Map View Component
 * Displays a map visualization of branch location with geofence boundary
 * and staff check-in locations
 */
const GeofenceMapView = ({ branch, attendanceRecords }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  // Load map when component mounts
  useEffect(() => {
    // Mock implementation - in a real application this would use a mapping library
    // like Google Maps, Mapbox, or Leaflet
    const loadMap = () => {
      if (!branch || !branch.geofence) {
        setError('Branch location not available');
        return;
      }
      
      try {
        // This is a placeholder for actual map initialization
        setTimeout(() => {
          if (mapRef.current) {
            // Draw mock map canvas
            const canvas = document.createElement('canvas');
            canvas.width = mapRef.current.clientWidth;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // Draw background
            ctx.fillStyle = '#e9eef2';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid lines
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1;
            
            // Horizontal grid lines
            for (let y = 50; y < canvas.height; y += 50) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(canvas.width, y);
              ctx.stroke();
            }
            
            // Vertical grid lines
            for (let x = 50; x < canvas.width; x += 50) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, canvas.height);
              ctx.stroke();
            }
            
            // Draw geofence circle
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 100; // would be scaled based on actual geofence radius
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw branch location
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#10b981';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw attendance locations
            if (attendanceRecords && attendanceRecords.length > 0) {
              attendanceRecords.forEach((record, index) => {
                // This would use actual coordinates in a real implementation
                // Here we just distribute points around the center
                const angle = (index / attendanceRecords.length) * Math.PI * 2;
                const distance = record.is_within_geofence ? 
                  (Math.random() * 80) : // Inside geofence
                  (radius + 20 + Math.random() * 50); // Outside geofence
                
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fillStyle = record.is_within_geofence ? '#3b82f6' : '#f59e0b';
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
              });
            }
            
            // Add map to DOM
            mapRef.current.innerHTML = '';
            mapRef.current.appendChild(canvas);
            setMapLoaded(true);
          }
        }, 500);
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map visualization');
      }
    };
    
    loadMap();
  }, [branch, attendanceRecords]);
  
  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geofence Map View</CardTitle>
          <CardDescription>Branch location visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render loading state or map
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geofence Map View</CardTitle>
        <CardDescription>
          {branch?.name ? `${branch.name} Location` : 'Branch location visualization'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-[400px] bg-muted rounded-md relative overflow-hidden">
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        {mapLoaded && (
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <span>Branch Location</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Within Geofence</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Outside Geofence</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeofenceMapView;

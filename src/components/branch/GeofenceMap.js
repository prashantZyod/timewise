import React, { useEffect, useRef } from 'react';
import { useGeoLocation } from '../../contexts/GeoLocationContext';
import { MapPin, AlertCircle } from 'lucide-react';

// This component assumes you have a Google Maps API key
// You'll need to include the Google Maps script in your index.html
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY" async defer></script>

const GeofenceMap = ({ branch, width = '100%', height = '300px' }) => {
  const mapRef = useRef(null);
  const { currentPosition, getPosition, loading, error } = useGeoLocation();
  
  useEffect(() => {
    // Load the user's position when component mounts
    getPosition().catch(err => console.error('Could not get position:', err));
  }, [getPosition]);
  
  useEffect(() => {
    // Initialize the map when we have branch coordinates and Google Maps is loaded
    if (branch && branch.latitude && branch.longitude && window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: branch.latitude, lng: branch.longitude },
        zoom: 16,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      });
      
      // Create a marker for the branch
      new window.google.maps.Marker({
        position: { lat: branch.latitude, lng: branch.longitude },
        map,
        title: branch.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });
      
      // Draw the geofence circle
      new window.google.maps.Circle({
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        map,
        center: { lat: branch.latitude, lng: branch.longitude },
        radius: branch.geofenceRadius || 100
      });
      
      // If we have the user's current position, add a marker for it
      if (currentPosition) {
        const userLatLng = { 
          lat: currentPosition.latitude, 
          lng: currentPosition.longitude 
        };
        
        new window.google.maps.Marker({
          position: userLatLng,
          map,
          title: 'Your Location',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });
        
        // Create bounds that include both the branch and user position
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(new window.google.maps.LatLng(branch.latitude, branch.longitude));
        bounds.extend(new window.google.maps.LatLng(currentPosition.latitude, currentPosition.longitude));
        
        // Fit the map to include both points
        map.fitBounds(bounds);
        
        // Don't zoom in too far
        const listener = window.google.maps.event.addListener(map, 'idle', function() {
          if (map.getZoom() > 16) map.setZoom(16);
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [branch, currentPosition]);
  
  if (!branch || !branch.latitude || !branch.longitude) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500" style={{ width, height }}>
        <MapPin className="mx-auto w-6 h-6 mb-2" />
        Branch location information is missing.
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700" style={{ width, height }}>
        <AlertCircle className="mx-auto w-6 h-6 mb-2" />
        {error}
      </div>
    );
  }
  
  return (
    <div className="relative rounded-md overflow-hidden" style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default GeofenceMap;
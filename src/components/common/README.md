# Common Components

## LocationPermissionRequest

A reusable component for requesting and handling geolocation permissions in the browser.

### Features

- Automatically or manually request geolocation permission
- Displays different UI states:
  - Pending permission request
  - Permission granted with coordinates
  - Permission denied with reason
  - Error state with error message
- Callback functions for different permission states
- Configurable styles via className prop

### Usage

This component requires the GeoLocationProvider to be available in the component tree. In this application, GeoLocationProvider is already included in the AppProviders wrapper, so you don't need to add it manually.

```jsx
import LocationPermissionRequest from '../components/common/LocationPermissionRequest';

// Basic usage with automatic permission request
<LocationPermissionRequest 
  onLocationGranted={(location) => console.log('Location granted:', location)}
  onLocationDenied={(reason) => console.error('Location denied:', reason)}
  onLocationError={(error) => console.error('Location error:', error)}
  autoRequest={true}
/>

// Manual request (user must click button)
<LocationPermissionRequest 
  onLocationGranted={handleLocationGranted}
  onLocationDenied={handleLocationDenied}
  onLocationError={handleLocationError}
  autoRequest={false}
/>

// Custom styling
<LocationPermissionRequest 
  className="bg-white p-4 rounded-lg shadow-md"
  autoRequest={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLocationGranted` | Function | `() => {}` | Callback when location permission is granted. Receives location data object. |
| `onLocationDenied` | Function | `() => {}` | Callback when location permission is denied. Receives reason string. |
| `onLocationError` | Function | `() => {}` | Callback when an error occurs. Receives error object. |
| `autoRequest` | Boolean | `true` | Whether to automatically request permission when the component mounts. |
| `className` | String | `''` | Additional CSS classes to apply to the component. |

### Location Data Structure

The location data object provided to `onLocationGranted` has the following structure:

```js
{
  latitude: Number,       // Latitude in decimal degrees
  longitude: Number,      // Longitude in decimal degrees
  accuracy: Number,       // Accuracy in meters
  timestamp: Number,      // Timestamp when location was captured
  // Some devices may also provide:
  altitude: Number,       // Altitude in meters above the WGS84 ellipsoid
  altitudeAccuracy: Number, // Accuracy of altitude in meters
  heading: Number,        // Direction of travel in degrees (0-360)
  speed: Number           // Velocity in meters per second
}
```

### Demo

Check out the `/location-demo` page in the app for a live example of how to use this component.

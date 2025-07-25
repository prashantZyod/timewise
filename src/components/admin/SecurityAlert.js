import React, { useState, useEffect } from 'react';
import { Device } from '@/entities/Device';
import { Attendance } from '@/entities/Attendance';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, MapPin, Smartphone } from 'lucide-react';
import { format, isAfter, subDays } from 'date-fns';

export default function SecurityAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateSecurityAlerts();
  }, []);

  const generateSecurityAlerts = async () => {
    setIsLoading(true);
    try {
      const [devices, attendance, users] = await Promise.all([
        Device.list(),
        Attendance.list('-created_date', 100),
        User.list()
      ]);

      const alertsList = [];

      // Check for unapproved devices
      const unapprovedDevices = devices.filter(d => !d.is_approved);
      if (unapprovedDevices.length > 0) {
        alertsList.push({
          type: 'device_approval',
          severity: 'high',
          title: `${unapprovedDevices.length} Unapproved Device${unapprovedDevices.length > 1 ? 's' : ''}`,
          description: 'New devices require admin approval before staff can check in',
          count: unapprovedDevices.length,
          icon: Smartphone
        });
      }

      // Check for unverified attendance in last 3 days
      const recentDate = subDays(new Date(), 3);
      const unverifiedAttendance = attendance.filter(a => 
        !a.is_verified && 
        (a.check_in_photo_url || a.check_out_photo_url) &&
        isAfter(new Date(a.created_date), recentDate)
      );
      
      if (unverifiedAttendance.length > 0) {
        alertsList.push({
          type: 'photo_verification',
          severity: 'medium',
          title: `${unverifiedAttendance.length} Unverified Photo${unverifiedAttendance.length > 1 ? 's' : ''}`,
          description: 'Attendance photos pending admin verification',
          count: unverifiedAttendance.length,
          icon: AlertTriangle
        });
      }

      // Check for location anomalies (same user checking in from different locations)
      const locationAnomalies = detectLocationAnomalies(attendance, users);
      if (locationAnomalies.length > 0) {
        alertsList.push({
          type: 'location_anomaly',
          severity: 'medium',
          title: `${locationAnomalies.length} Location Anomal${locationAnomalies.length > 1 ? 'ies' : 'y'}`,
          description: 'Staff checking in from unusual locations',
          count: locationAnomalies.length,
          icon: MapPin
        });
      }

      setAlerts(alertsList);
    } catch (error) {
      console.error('Error generating security alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectLocationAnomalies = (attendance, users) => {
    // Simple location anomaly detection
    const userLocations = {};
    const anomalies = [];

    attendance.forEach(record => {
      if (!record.check_in_location) return;
      
      if (!userLocations[record.user_id]) {
        userLocations[record.user_id] = [];
      }
      
      userLocations[record.user_id].push({
        lat: record.check_in_location.latitude,
        lng: record.check_in_location.longitude,
        date: record.attendance_date
      });
    });

    // Find users with multiple distinct locations
    Object.entries(userLocations).forEach(([userId, locations]) => {
      if (locations.length <= 1) return;
      
      // Compare all locations to find significant differences
      for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          const distance = calculateDistance(
            locations[i].lat, locations[i].lng,
            locations[j].lat, locations[j].lng
          );
          
          // If distance is more than 5km, flag as anomaly
          if (distance > 5) {
            const user = users.find(u => u.id === userId);
            anomalies.push({
              user_id: userId,
              user_name: user?.full_name || 'Unknown User',
              distance: Math.round(distance),
              date1: locations[i].date,
              date2: locations[j].date
            });
            break; // Only add one anomaly per user
          }
        }
        if (anomalies.find(a => a.user_id === userId)) break;
      }
    });
    
    return anomalies;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-slate-500">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Loading security alerts...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No security alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <Alert key={index} className={`${getSeverityColor(alert.severity)} border`}>
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {alert.icon && <alert.icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <AlertDescription className="text-sm">
                      {alert.description}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

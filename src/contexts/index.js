import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { BranchProvider, useBranch } from './BranchContext';
import { StaffProvider, useStaff } from './StaffContext';
import { GeoLocationProvider, useGeoLocation } from './GeoLocationContext';
import { AttendanceProvider, useAttendance } from './AttendanceContext';
import { DeviceProvider, useDevice } from './DeviceContext';

/**
 * Combined provider component that wraps all context providers
 * Order matters: Base providers first, then dependent ones
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <BranchProvider>
        <StaffProvider>
          <GeoLocationProvider>
            <DeviceProvider>
              <AttendanceProvider>
                {children}
              </AttendanceProvider>
            </DeviceProvider>
          </GeoLocationProvider>
        </StaffProvider>
      </BranchProvider>
    </AuthProvider>
  );
};

// Export custom hooks for easy access
export { 
  useAuth, 
  useBranch, 
  useStaff, 
  useGeoLocation, 
  useAttendance, 
  useDevice 
};

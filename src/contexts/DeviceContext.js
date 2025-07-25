import React, { createContext, useContext, useState, useEffect } from 'react';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add your device-related functions here
  
  return (
    <DeviceContext.Provider value={{ devices, loading, error /* and other values */ }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

export default DeviceContext;

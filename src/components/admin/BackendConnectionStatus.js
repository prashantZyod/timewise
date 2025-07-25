import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Loader2, CheckCircle2, XCircle, ServerOff, Server } from 'lucide-react';
import api from '../../services/api';

/**
 * Component to display backend connection status
 */
const BackendConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, connected, error
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // Check backend connection
  const checkConnection = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      // Try to connect to the health check endpoint
      const apiInstance = api.auth ? api : api.create({});
      const response = await apiInstance.get('/health');
      setServerInfo(response.data);
      setStatus('connected');
      setLastChecked(new Date());
    } catch (err) {
      console.error('Backend connection error:', err);
      setStatus('error');
      setError(err.message || 'Could not connect to backend server');
      setLastChecked(new Date());
    }
  };

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
    
    // Set up interval to check connection every minute
    const interval = setInterval(checkConnection, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center">
          <Server className="h-4 w-4 mr-2" />
          Backend Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {status === 'checking' ? (
          <Alert className="bg-blue-50 border-blue-200">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 text-blue-500 animate-spin" />
              <AlertTitle>Checking connection...</AlertTitle>
            </div>
          </Alert>
        ) : status === 'connected' ? (
          <>
            <Alert className="bg-green-50 border-green-200">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                <AlertTitle>Connected to backend</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                Server is responding and ready to process requests.
              </AlertDescription>
            </Alert>
            
            {serverInfo && (
              <div className="mt-3 text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Version:</span>
                  <Badge variant="outline" className="font-mono">
                    {serverInfo.version || 'N/A'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Environment:</span>
                  <Badge 
                    className={`${
                      serverInfo.environment === 'production' 
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {serverInfo.environment || 'development'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Uptime:</span>
                  <span className="text-slate-800">
                    {serverInfo.uptime 
                      ? `${Math.floor(serverInfo.uptime / 3600)}h ${Math.floor((serverInfo.uptime % 3600) / 60)}m`
                      : 'N/A'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">API Route:</span>
                  <span className="text-slate-800 font-mono text-xs">
                    {api.defaults?.baseURL || 'Not configured'}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <Alert className="bg-red-50 border-red-200">
            <div className="flex items-center">
              <ServerOff className="h-5 w-5 mr-2 text-red-500" />
              <AlertTitle>Connection failed</AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {error || 'Could not connect to the backend server. Please check if the server is running.'}
            </AlertDescription>
          </Alert>
        )}
        
        {lastChecked && (
          <div className="mt-3 text-xs text-slate-500 text-right">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendConnectionStatus;

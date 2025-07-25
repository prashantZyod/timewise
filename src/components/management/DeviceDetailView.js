import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Alert } from "../../components/ui/alert";
import { 
  Smartphone, 
  X, 
  Map, 
  User, 
  Shield, 
  Clock, 
  Check, 
  XCircle,
  Loader2,
  Trash2,
  AlertTriangle
} from "lucide-react";

const DeviceDetailView = ({ device, onClose, onApprove, onReject, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleApprove = async () => {
    setLoading(true);
    setError('');
    try {
      await onApprove(device._id || device.id);
      onClose();
    } catch (err) {
      setError('Failed to approve device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReject = async () => {
    setLoading(true);
    setError('');
    try {
      await onReject(device._id || device.id);
      onClose();
    } catch (err) {
      setError('Failed to reject device');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await onDelete(device._id || device.id);
      onClose();
    } catch (err) {
      setError('Failed to delete device');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-2 sm:my-0">
        <CardHeader className="relative pb-2 pt-3 px-3 sm:pb-3 sm:pt-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 sm:right-2 sm:top-2 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pr-8">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Smartphone className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{device.name}</span>
            </CardTitle>
            <div>
              {device.isApproved ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded flex items-center w-fit">
                  <Check className="h-3 w-3 mr-1 flex-shrink-0" />
                  Approved
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded flex items-center w-fit">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  Pending Approval
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 px-3 sm:px-6">
          {error && (
            <Alert variant="destructive" className="mb-3 sm:mb-4 text-xs sm:text-sm">
              {error}
            </Alert>
          )}
          
          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800 text-sm sm:text-base">Confirm Deletion</h3>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    Are you sure you want to delete this device? This action cannot be undone.
                  </p>
                  <div className="mt-2 sm:mt-3 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 sm:h-8"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-xs h-7 sm:h-8"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>Delete Device</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                Device Information
              </h3>
              <div className="bg-gray-50 p-2 sm:p-4 rounded-md space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p className="truncate"><strong>Device ID:</strong> {device.deviceId}</p>
                <p><strong>Type:</strong> {device.type}</p>
                <p>
                  <strong>Registration:</strong>{" "}
                  {device.createdAt ? new Date(device.createdAt).toLocaleString() : "Unknown"}
                </p>
                <p>
                  <strong>Last Active:</strong>{" "}
                  {device.lastActive ? new Date(device.lastActive).toLocaleString() : "Never"}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                Owner Information
              </h3>
              <div className="bg-gray-50 p-2 sm:p-4 rounded-md space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p className="truncate">
                  <strong>Name:</strong>{" "}
                  {device.owner?.name || "Unknown"}
                </p>
                <p className="truncate">
                  <strong>Email:</strong>{" "}
                  {device.owner?.email || "Unknown"}
                </p>
                <p>
                  <strong>Position:</strong>{" "}
                  {device.owner?.position || "Unknown"}
                </p>
                <p>
                  <strong>Department:</strong>{" "}
                  {device.owner?.department || "Unknown"}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                Browser & OS Information
              </h3>
              <div className="bg-gray-50 p-2 sm:p-4 rounded-md space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <p>
                  <strong>Browser:</strong>{" "}
                  {device.browserInfo?.name || "Unknown"}
                  {device.browserInfo?.version ? ` (${device.browserInfo.version})` : ""}
                </p>
                <p>
                  <strong>OS:</strong>{" "}
                  {device.osInfo?.name || "Unknown"}
                  {device.osInfo?.version ? ` (${device.osInfo.version})` : ""}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2 break-words">
                  <strong>User Agent:</strong> {device.browserInfo?.userAgent || "Not available"}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                <Map className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                Last Known Location
              </h3>
              <div className="bg-gray-50 p-2 sm:p-4 rounded-md space-y-1 sm:space-y-2 text-xs sm:text-sm">
                {device.lastKnownLocation ? (
                  <>
                    <p>
                      <strong>Latitude:</strong> {device.lastKnownLocation.latitude}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {device.lastKnownLocation.longitude}
                    </p>
                    <p>
                      <strong>Accuracy:</strong>{" "}
                      {device.lastKnownLocation.accuracy
                        ? `${device.lastKnownLocation.accuracy} meters`
                        : "Unknown"}
                    </p>
                    <p>
                      <strong>Timestamp:</strong>{" "}
                      {device.lastKnownLocation.timestamp
                        ? new Date(device.lastKnownLocation.timestamp).toLocaleString()
                        : "Unknown"}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No location data available</p>
                )}
              </div>
            </div>
            
            {device.isApproved && device.approvedBy && (
              <div className="col-span-1 sm:col-span-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 flex items-center">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  Approval Information
                </h3>
                <div className="bg-gray-50 p-2 sm:p-4 rounded-md space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>Approved By:</strong>{" "}
                    {device.approvedBy.name || "Unknown Admin"}
                  </p>
                  <p>
                    <strong>Approved At:</strong>{" "}
                    {device.approvedAt
                      ? new Date(device.approvedAt).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
          <Button
            variant="destructive"
            size="sm"
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Delete
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
              onClick={onClose}
            >
              Close
            </Button>
            
            {!device.isApproved && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                  ) : (
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  )}
                  Reject
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
                  onClick={handleApprove}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  )}
                  Approve
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeviceDetailView;

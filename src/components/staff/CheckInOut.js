import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Clock, CheckCircle, XCircle, Camera } from "lucide-react";

/**
 * CheckInOut component for staff attendance.
 * This component handles staff check-in and check-out functionality.
 */
const CheckInOut = ({ onCheckIn, onCheckOut, currentStatus }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [withPhoto, setWithPhoto] = useState(true);
  
  const handleAction = async (actionType) => {
    setIsChecking(true);
    try {
      if (actionType === 'in') {
        await onCheckIn(withPhoto);
      } else {
        await onCheckOut(withPhoto);
      }
    } catch (error) {
      console.error(`Error during check-${actionType}:`, error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-slate-600" />
          Attendance Check-In/Out
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Current Status:</h3>
            <div className="flex items-center">
              {currentStatus === 'in' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                  <span className="text-emerald-600 font-medium">Checked In</span>
                </>
              ) : currentStatus === 'out' ? (
                <>
                  <XCircle className="h-5 w-5 text-slate-500 mr-2" />
                  <span className="text-slate-600 font-medium">Checked Out</span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-amber-600 font-medium">Status Unknown</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="withPhoto"
              checked={withPhoto}
              onChange={(e) => setWithPhoto(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="withPhoto" className="text-sm text-slate-700">
              Include photo verification
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button 
          onClick={() => handleAction('in')}
          disabled={isChecking || currentStatus === 'in'}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          {isChecking ? 'Processing...' : 'Check In'}
        </Button>
        <Button 
          onClick={() => handleAction('out')}
          disabled={isChecking || currentStatus === 'out'}
          className="flex-1 bg-slate-600 hover:bg-slate-700"
        >
          {isChecking ? 'Processing...' : 'Check Out'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CheckInOut;

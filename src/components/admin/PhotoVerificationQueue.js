import React, { useState, useEffect } from 'react';
import { Attendance } from '../../entities/Attendance';
import { User } from '../../entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Check, X, Eye, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function PhotoVerificationQueue() {
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const [verifiedAttendance, setVerifiedAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [admin, allAttendance] = await Promise.all([
        User.me(),
        Attendance.list('-created_date', 50)
      ]);
      
      setCurrentAdmin(admin);
      
      // Get attendance records with photos
      const attendanceWithPhotos = allAttendance.filter(a => 
        a.check_in_photo_url || a.check_out_photo_url
      );
      
      // Add user info to attendance records
      const enrichedAttendance = await Promise.all(
        attendanceWithPhotos.map(async (record) => {
          try {
            const user = await User.get(record.user_id);
            return { ...record, user };
          } catch (error) {
            return { ...record, user: null };
          }
        })
      );
      
      setPendingAttendance(enrichedAttendance.filter(a => !a.is_verified));
      setVerifiedAttendance(enrichedAttendance.filter(a => a.is_verified));
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (attendanceId, isApproved) => {
    try {
      await Attendance.update(attendanceId, {
        is_verified: true,
        is_approved: isApproved,
        verified_by: currentAdmin.id,
        verified_date: new Date().toISOString()
      });

      // Refresh data
      loadData();
    } catch (error) {
      console.error('Error verifying attendance:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Photo Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending ({pendingAttendance.length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified ({verifiedAttendance.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {pendingAttendance.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Check className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No pending verifications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAttendance.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {record.user?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {format(new Date(record.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerify(record.id, false)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleVerify(record.id, true)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {record.check_in_photo_url && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Check-in photo</p>
                          <div className="aspect-w-4 aspect-h-3 bg-slate-100 rounded-md overflow-hidden">
                            <img 
                              src={record.check_in_photo_url} 
                              alt="Check-in" 
                              className="object-cover"
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {record.check_in_time && format(new Date(record.check_in_time), 'hh:mm a')}
                          </p>
                        </div>
                      )}
                      
                      {record.check_out_photo_url && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Check-out photo</p>
                          <div className="aspect-w-4 aspect-h-3 bg-slate-100 rounded-md overflow-hidden">
                            <img 
                              src={record.check_out_photo_url} 
                              alt="Check-out" 
                              className="object-cover"
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {record.check_out_time && format(new Date(record.check_out_time), 'hh:mm a')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="verified">
            {verifiedAttendance.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No verified records yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifiedAttendance.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {record.user?.full_name || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {format(new Date(record.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <Badge variant={record.is_approved ? "default" : "destructive"}>
                        {record.is_approved ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {record.check_in_photo_url && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Check-in photo</p>
                          <div className="aspect-w-4 aspect-h-3 bg-slate-100 rounded-md overflow-hidden">
                            <img 
                              src={record.check_in_photo_url} 
                              alt="Check-in" 
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {record.check_out_photo_url && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Check-out photo</p>
                          <div className="aspect-w-4 aspect-h-3 bg-slate-100 rounded-md overflow-hidden">
                            <img 
                              src={record.check_out_photo_url} 
                              alt="Check-out" 
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

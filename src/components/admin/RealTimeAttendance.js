import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, CheckCircle, XCircle, Clock, Coffee, Check, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { Attendance } from "@/entities/Attendance";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function RealTimeAttendance({ attendance, onRefresh }) {
  const [verifyingRecord, setVerifyingRecord] = useState(null);

  const getStatusIcon = (record) => {
    if (record.break_start && !record.break_end) {
      return <Coffee className="w-4 h-4 text-orange-500" />;
    }
    switch (record.status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (record) => {
    if (record.break_start && !record.break_end) {
      return 'bg-orange-100 text-orange-800';
    }
    switch (record.status) {
      case 'present': return 'bg-emerald-100 text-emerald-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'early_leave': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (record) => {
    if (record.break_start && !record.break_end) {
      return 'On Break';
    }
    return record.status?.replace('_', ' ') || 'Unknown';
  };

  const handleVerify = async () => {
    if (!verifyingRecord) return;
    try {
      await Attendance.update(verifyingRecord.id, { is_verified: true });
      setVerifyingRecord(null);
      onRefresh();
    } catch (error) {
      alert("Failed to verify attendance.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Real-time Attendance
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record)}
                        <div>
                          <div className="font-medium">
                            {record.user?.full_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {record.user?.employee_id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.check_in_time ? (
                        <div>
                          <div className="font-medium">
                            {format(new Date(record.check_in_time), 'h:mm a')}
                          </div>
                          <div className="text-xs text-slate-500">
                            {format(new Date(record.check_in_time), 'MMM d, yyyy')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Not checked in</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record)}>
                        {getStatusText(record)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.check_in_photo_url && !record.is_verified ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setVerifyingRecord(record)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      ) : record.is_verified ? (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
                
                {attendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No attendance records yet</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Verification dialog */}
      <Dialog open={!!verifyingRecord} onOpenChange={() => setVerifyingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Attendance</DialogTitle>
          </DialogHeader>
          
          {verifyingRecord && (
            <div className="py-4">
              <div className="mb-4">
                <p className="font-medium mb-1">
                  {verifyingRecord.user?.full_name || 'Unknown User'}
                </p>
                <p className="text-sm text-slate-500">
                  Checked in at {verifyingRecord.check_in_time && 
                    format(new Date(verifyingRecord.check_in_time), 'h:mm a on MMM d, yyyy')}
                </p>
              </div>
              
              {verifyingRecord.check_in_photo_url && (
                <div className="rounded-md overflow-hidden border mb-4">
                  <img 
                    src={verifyingRecord.check_in_photo_url} 
                    alt="Check-in selfie"
                    className="w-full" 
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setVerifyingRecord(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleVerify}>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Identity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

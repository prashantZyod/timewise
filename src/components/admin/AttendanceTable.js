import React from 'react';
import { User, Clock, MapPin, Check, X, AlertTriangle } from 'lucide-react';

export default function AttendanceTable({ records = [] }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th className="px-4 py-3">Staff</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Branch</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Verification</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                    {record.user.profileImage ? (
                      <img 
                        src={record.user.profileImage} 
                        alt={record.user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{record.user.name}</div>
                    <div className="text-xs text-slate-500">{record.user.position}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{new Date(record.timestamp).toLocaleTimeString()}</div>
                <div className="text-xs text-slate-500">{new Date(record.timestamp).toLocaleDateString()}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.type === 'check-in' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {record.type === 'check-in' ? 'Check In' : 'Check Out'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                  <span>{record.branch.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {record.status === 'on-time' && (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" /> On time
                  </span>
                )}
                {record.status === 'late' && (
                  <span className="flex items-center text-amber-600">
                    <Clock className="w-4 h-4 mr-1" /> Late
                  </span>
                )}
                {record.status === 'invalid' && (
                  <span className="flex items-center text-red-600">
                    <X className="w-4 h-4 mr-1" /> Invalid
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {record.verification.status === 'verified' && (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" /> Verified
                  </span>
                )}
                {record.verification.status === 'failed' && (
                  <span className="flex items-center text-red-600">
                    <X className="w-4 h-4 mr-1" /> Failed
                  </span>
                )}
                {record.verification.status === 'warning' && (
                  <span className="flex items-center text-amber-600">
                    <AlertTriangle className="w-4 h-4 mr-1" /> Warning
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <button className="text-slate-600 hover:text-slate-900">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

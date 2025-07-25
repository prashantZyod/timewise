import React, { useState } from 'react';
import { Clock, Calendar, Filter, ChevronDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function StaffAttendanceHistory({ attendance }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Filter the attendance records
  const filteredAttendance = filter === 'all' 
    ? attendance 
    : attendance.filter(record => {
        if (filter === 'present') return record.status === 'present';
        if (filter === 'absent') return record.status === 'absent';
        if (filter === 'late') return record.isLate;
        return true;
      });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="overflow-hidden">
      {/* Filters */}
      <div className="p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center text-sm font-medium text-slate-700 hover:text-emerald-500 transition-colors"
            >
              <Filter size={16} className="mr-1" />
              Filter: {filter === 'all' ? 'All Records' : filter === 'present' ? 'Present' : filter === 'absent' ? 'Absent' : 'Late'}
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {filterOpen && (
              <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-md shadow-md border border-slate-100 w-48">
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setFilter('all');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filter === 'all' ? 'text-emerald-500 bg-slate-50' : 'text-slate-700'}`}
                  >
                    All Records
                  </button>
                  <button 
                    onClick={() => {
                      setFilter('present');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filter === 'present' ? 'text-emerald-500 bg-slate-50' : 'text-slate-700'}`}
                  >
                    Present
                  </button>
                  <button 
                    onClick={() => {
                      setFilter('absent');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filter === 'absent' ? 'text-emerald-500 bg-slate-50' : 'text-slate-700'}`}
                  >
                    Absent
                  </button>
                  <button 
                    onClick={() => {
                      setFilter('late');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filter === 'late' ? 'text-emerald-500 bg-slate-50' : 'text-slate-700'}`}
                  >
                    Late
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Attendance table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-4 text-xs font-medium text-slate-500">Date</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500">Status</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500">Check In</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500">Check Out</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500">Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((record, index) => (
                <tr 
                  key={record.id} 
                  className={`border-t border-slate-100 ${index % 2 === 1 ? 'bg-slate-50' : ''}`}
                >
                  <td className="p-4 text-sm text-slate-700">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-slate-400 mr-2" />
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="p-4">
                    {record.status === 'present' ? (
                      <div className="flex items-center">
                        {record.isLate ? (
                          <AlertCircle size={16} className="text-amber-500 mr-1" />
                        ) : (
                          <CheckCircle size={16} className="text-emerald-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          record.isLate ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {record.isLate ? 'Late' : 'Present'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle size={16} className="text-red-500 mr-1" />
                        <span className="text-sm font-medium text-red-500">Absent</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-700">
                    {record.checkInTime ? (
                      <div className="flex items-center">
                        <Clock size={16} className="text-slate-400 mr-2" />
                        {record.checkInTime}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-700">
                    {record.checkOutTime ? (
                      <div className="flex items-center">
                        <Clock size={16} className="text-slate-400 mr-2" />
                        {record.checkOutTime}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-700">
                    {record.totalHours > 0 ? (
                      <span>{record.totalHours}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-sm text-slate-500">
                  No attendance records found with the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

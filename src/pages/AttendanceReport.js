import React, { useState } from 'react';
import { Calendar, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const AttendanceReport = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  
  // Mock data
  const branches = [
    { id: '1', name: 'Main Office' },
    { id: '2', name: 'Downtown Branch' },
    { id: '3', name: 'West Side Location' },
  ];
  
  const departments = [
    { id: '1', name: 'Administration' },
    { id: '2', name: 'Sales' },
    { id: '3', name: 'Operations' },
    { id: '4', name: 'IT' },
  ];
  
  const attendanceData = [
    { 
      id: '1', 
      name: 'John Smith', 
      position: 'Manager',
      department: 'Administration',
      attendance: { present: 22, late: 3, absent: 0 },
      percentage: 88
    },
    { 
      id: '2', 
      name: 'Jane Doe', 
      position: 'Sales Rep',
      department: 'Sales',
      attendance: { present: 18, late: 5, absent: 2 },
      percentage: 72
    },
    { 
      id: '3', 
      name: 'Michael Brown', 
      position: 'IT Specialist',
      department: 'IT',
      attendance: { present: 25, late: 0, absent: 0 },
      percentage: 100
    },
    { 
      id: '4', 
      name: 'Sarah Wilson', 
      position: 'Receptionist',
      department: 'Administration',
      attendance: { present: 20, late: 2, absent: 3 },
      percentage: 80
    },
    { 
      id: '5', 
      name: 'Robert Johnson', 
      position: 'Operations Supervisor',
      department: 'Operations',
      attendance: { present: 21, late: 4, absent: 0 },
      percentage: 84
    },
  ];
  
  // Month navigation
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  
  // Format month and year
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const formattedDate = `${monthNames[month]} ${year}`;
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Attendance Reports</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center">
            <button
              onClick={prevMonth}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center mx-2">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1"></div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {staff.attendance.present}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                    {staff.attendance.late}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {staff.attendance.absent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            staff.percentage >= 90 ? 'bg-green-600' :
                            staff.percentage >= 70 ? 'bg-amber-500' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${staff.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{staff.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
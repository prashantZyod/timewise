import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, Users, Clock, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function AnalyticsView({ attendanceStats, branches }) {
  const [dateRange, setDateRange] = useState('week'); // 'day', 'week', 'month', 'quarter', 'year'
  const [selectedMetric, setSelectedMetric] = useState('attendance'); // 'attendance', 'lateness', 'overtime'
  
  // Mock data for charts
  const mockWeeklyData = [
    { day: 'Mon', attendance: 95, lateness: 3, overtime: 12 },
    { day: 'Tue', attendance: 92, lateness: 5, overtime: 8 },
    { day: 'Wed', attendance: 88, lateness: 7, overtime: 15 },
    { day: 'Thu', attendance: 96, lateness: 2, overtime: 10 },
    { day: 'Fri', attendance: 90, lateness: 4, overtime: 18 },
    { day: 'Sat', attendance: 50, lateness: 1, overtime: 4 },
    { day: 'Sun', attendance: 0, lateness: 0, overtime: 0 },
  ];
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <select 
            className="bg-white border border-slate-200 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="attendance">Attendance Rate</option>
            <option value="lateness">Lateness</option>
            <option value="overtime">Overtime</option>
          </select>
          
          <div className="bg-slate-100 rounded-lg p-1 flex">
            <button
              onClick={() => setDateRange('day')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === 'day' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === 'week' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === 'month' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === 'quarter' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === 'year' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-1" /> Filter
          </button>
          <button className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4 mr-1" /> Select Date
          </button>
          <button className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Export Report
          </button>
        </div>
      </div>
      
      {/* Main Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            {selectedMetric === 'attendance' ? 'Attendance Rate' : 
             selectedMetric === 'lateness' ? 'Lateness Trends' : 'Overtime Hours'} - {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}ly View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {/* Mock chart visualization */}
            <div className="h-full w-full bg-white rounded-lg border border-slate-100 flex">
              <div className="w-14 h-full py-6 flex flex-col justify-between items-center text-xs text-slate-500">
                <div>100%</div>
                <div>75%</div>
                <div>50%</div>
                <div>25%</div>
                <div>0%</div>
              </div>
              
              <div className="flex-1 h-full flex items-end px-6 pb-10 pt-6 relative">
                {/* Y-axis grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between items-stretch pointer-events-none">
                  <div className="border-b border-slate-100"></div>
                  <div className="border-b border-slate-100"></div>
                  <div className="border-b border-slate-100"></div>
                  <div className="border-b border-slate-100"></div>
                </div>
                
                {/* Mock bars */}
                <div className="flex-1 h-full flex items-end gap-8">
                  {mockWeeklyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full rounded-t ${
                          selectedMetric === 'attendance' ? 'bg-blue-500' : 
                          selectedMetric === 'lateness' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ 
                          height: `${selectedMetric === 'attendance' ? data.attendance : 
                                     selectedMetric === 'lateness' ? data.lateness * 10 : 
                                     data.overtime * 5}%` 
                        }}
                      ></div>
                      <div className="text-xs font-medium text-slate-500">{data.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Attendance Rate</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {(attendanceStats.presentToday / attendanceStats.totalEmployees * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-500">
              <span className="text-green-500 font-medium">+2.5%</span> from previous {dateRange}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Target</span>
                <span className="font-medium">95%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Avg. Working Hours</h3>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-2">
              7.8h
            </div>
            <div className="text-sm text-slate-500">
              <span className="text-green-500 font-medium">+0.3h</span> from previous {dateRange}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Target</span>
                <span className="font-medium">8h</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lateness Rate</h3>
              <BarChart3 className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold mb-2">
              {(attendanceStats.lateToday / attendanceStats.totalEmployees * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-500">
              <span className="text-red-500 font-medium">+1.2%</span> from previous {dateRange}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Target</span>
                <span className="font-medium">&lt;5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Branch Performance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Branch Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {branches
              .filter(branch => branch.status === 'active')
              .map((branch, index) => {
                // Generate random metrics for demo
                const attendanceRate = 85 + Math.floor(Math.random() * 15);
                const latenessRate = Math.floor(Math.random() * 10);
                const trend = Math.random() > 0.7 ? 'down' : 'up';
                
                return (
                  <div key={branch.id} className="py-4 flex items-center">
                    <div className="w-8 mr-4 text-center font-medium text-slate-500">{index + 1}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{branch.name}</h4>
                      <div className="text-sm text-slate-500">{branch.staffCount} staff members</div>
                    </div>
                    <div className="w-32 px-4">
                      <div className="text-sm font-medium">Attendance</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{attendanceRate}%</span>
                      </div>
                    </div>
                    <div className="w-32 px-4">
                      <div className="text-sm font-medium">Lateness</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full mr-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${latenessRate * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{latenessRate}%</span>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        trend === 'up' 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}% 
                        <TrendingUp className={`w-3 h-3 ml-1 ${trend === 'up' ? '' : 'transform rotate-180'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

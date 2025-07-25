import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  BarChart, 
  PieChart,
  LineChart,
  Users,
  Building2,
  Filter,
  Clock,
  FileText
} from "lucide-react";

/**
 * Reports component for the analytics section.
 * This component handles attendance reports, staff performance, and branch statistics.
 */
const Reports = ({ 
  reportData = {}, 
  onFilterChange, 
  onExport, 
  onGenerateReport 
}) => {
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState('attendance');
  const [branchFilter, setBranchFilter] = useState('all');

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (onFilterChange) {
      onFilterChange({ dateRange: range, reportType, branchFilter });
    }
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    if (onFilterChange) {
      onFilterChange({ dateRange, reportType: type, branchFilter });
    }
  };

  const handleBranchFilterChange = (branch) => {
    setBranchFilter(branch);
    if (onFilterChange) {
      onFilterChange({ dateRange, reportType, branchFilter: branch });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-500">Analyze attendance and staff performance</p>
        </div>
        <Button 
          onClick={() => onExport(reportType, dateRange, branchFilter)} 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${reportType === 'attendance' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
          <CardContent className="p-4">
            <button 
              onClick={() => handleReportTypeChange('attendance')} 
              className="w-full flex items-center"
            >
              <div className={`h-10 w-10 rounded-full ${reportType === 'attendance' ? 'bg-emerald-100' : 'bg-slate-100'} flex items-center justify-center mr-3`}>
                <Clock className={`h-5 w-5 ${reportType === 'attendance' ? 'text-emerald-600' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-medium ${reportType === 'attendance' ? 'text-emerald-800' : 'text-slate-800'}`}>Attendance</h3>
                <p className="text-xs text-slate-500">Check-in/out records</p>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className={`${reportType === 'staff' ? 'bg-blue-50 border-blue-200' : ''}`}>
          <CardContent className="p-4">
            <button 
              onClick={() => handleReportTypeChange('staff')} 
              className="w-full flex items-center"
            >
              <div className={`h-10 w-10 rounded-full ${reportType === 'staff' ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center mr-3`}>
                <Users className={`h-5 w-5 ${reportType === 'staff' ? 'text-blue-600' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-medium ${reportType === 'staff' ? 'text-blue-800' : 'text-slate-800'}`}>Staff Performance</h3>
                <p className="text-xs text-slate-500">Hours and productivity</p>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className={`${reportType === 'branch' ? 'bg-purple-50 border-purple-200' : ''}`}>
          <CardContent className="p-4">
            <button 
              onClick={() => handleReportTypeChange('branch')} 
              className="w-full flex items-center"
            >
              <div className={`h-10 w-10 rounded-full ${reportType === 'branch' ? 'bg-purple-100' : 'bg-slate-100'} flex items-center justify-center mr-3`}>
                <Building2 className={`h-5 w-5 ${reportType === 'branch' ? 'text-purple-600' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-medium ${reportType === 'branch' ? 'text-purple-800' : 'text-slate-800'}`}>Branch Statistics</h3>
                <p className="text-xs text-slate-500">Performance by location</p>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card className={`${reportType === 'custom' ? 'bg-amber-50 border-amber-200' : ''}`}>
          <CardContent className="p-4">
            <button 
              onClick={() => handleReportTypeChange('custom')} 
              className="w-full flex items-center"
            >
              <div className={`h-10 w-10 rounded-full ${reportType === 'custom' ? 'bg-amber-100' : 'bg-slate-100'} flex items-center justify-center mr-3`}>
                <FileText className={`h-5 w-5 ${reportType === 'custom' ? 'text-amber-600' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-medium ${reportType === 'custom' ? 'text-amber-800' : 'text-slate-800'}`}>Custom Reports</h3>
                <p className="text-xs text-slate-500">Build your own</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">Date Range</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={dateRange === 'day' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleDateRangeChange('day')}
            >
              Today
            </Button>
            <Button 
              variant={dateRange === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleDateRangeChange('week')}
            >
              This Week
            </Button>
            <Button 
              variant={dateRange === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleDateRangeChange('month')}
            >
              This Month
            </Button>
            <Button 
              variant={dateRange === 'quarter' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleDateRangeChange('quarter')}
            >
              This Quarter
            </Button>
            <Button 
              variant={dateRange === 'year' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleDateRangeChange('year')}
            >
              This Year
            </Button>
            <Button 
              variant={dateRange === 'custom' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleDateRangeChange('custom')}
              className="flex items-center"
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Custom
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">Branch</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={branchFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleBranchFilterChange('all')}
            >
              All Branches
            </Button>
            <Button 
              variant={branchFilter === 'branch1' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleBranchFilterChange('branch1')}
            >
              Branch One
            </Button>
            <Button 
              variant={branchFilter === 'branch2' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleBranchFilterChange('branch2')}
            >
              Branch Two
            </Button>
            <Button 
              variant={branchFilter === 'branch3' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleBranchFilterChange('branch3')}
            >
              Branch Three
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {reportType === 'attendance' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {reportData.totalAttendance || '0'}
                  </h3>
                  <p className="text-slate-500">Total Check-ins</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {reportData.avgHours || '0h'}
                  </h3>
                  <p className="text-slate-500">Avg. Hours Per Day</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {reportData.lateArrivals || '0'}
                  </h3>
                  <p className="text-slate-500">Late Arrivals</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-slate-600" />
                  Daily Attendance Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex items-center justify-center">
                <div className="h-64 w-full">
                  {/* Placeholder for chart - in a real app, we'd use a charting library */}
                  <div className="h-full w-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 rounded-md">
                    <BarChart3 className="h-12 w-12 text-slate-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-slate-600" />
                  Attendance by Branch
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex items-center justify-center">
                <div className="h-64 w-full">
                  {/* Placeholder for chart */}
                  <div className="h-full w-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 rounded-md">
                    <PieChart className="h-12 w-12 text-slate-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {reportType === 'staff' && (
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-slate-600" />
              Staff Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex items-center justify-center">
            <div className="h-96 w-full">
              {/* Placeholder for staff performance data */}
              <div className="h-full w-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 rounded-md">
                <BarChart className="h-12 w-12 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'branch' && (
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-slate-600" />
              Branch Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex items-center justify-center">
            <div className="h-96 w-full">
              {/* Placeholder for branch data */}
              <div className="h-full w-full bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 rounded-md">
                <LineChart className="h-12 w-12 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'custom' && (
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5 text-slate-600" />
              Custom Report Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-700">Report Type</h3>
                  <select className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option>Attendance Summary</option>
                    <option>Staff Hours</option>
                    <option>Branch Performance</option>
                    <option>Late Arrivals</option>
                    <option>Early Departures</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-700">Format</h3>
                  <select className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option>PDF Document</option>
                    <option>Excel Spreadsheet</option>
                    <option>CSV File</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-700">Data Grouping</h3>
                  <select className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option>By Day</option>
                    <option>By Week</option>
                    <option>By Month</option>
                    <option>By Branch</option>
                    <option>By Staff</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-700">Start Date</h3>
                  <input type="date" className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-700">End Date</h3>
                  <input type="date" className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => onGenerateReport()} 
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default Reports;

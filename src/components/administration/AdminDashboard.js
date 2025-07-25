import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Users, Clock, UserX, AlertTriangle, RefreshCw } from "lucide-react";

/**
 * AdminDashboard component for the administration section.
 * This component displays attendance statistics and security alerts.
 */
const AdminDashboard = ({ 
  stats, 
  securityAlerts, 
  branches,
  onRefresh,
  isLoading 
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Real-time attendance monitoring and security management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800">
            Export
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Staff" 
          value={stats?.totalStaff || 0} 
          icon={Users} 
          iconColor="bg-blue-500" 
          textColor="text-blue-500" 
        />
        <StatCard 
          title="Present Today" 
          value={stats?.presentToday || 0} 
          icon={Clock} 
          iconColor="bg-emerald-500" 
          textColor="text-emerald-500" 
        />
        <StatCard 
          title="Absent Today" 
          value={stats?.absentToday || 0} 
          icon={UserX} 
          iconColor="bg-red-500" 
          textColor="text-red-500" 
        />
        <StatCard 
          title="Late Today" 
          value={stats?.lateToday || 0} 
          icon={Clock} 
          iconColor="bg-amber-500" 
          textColor="text-amber-500" 
        />
      </div>

      {/* Security Alerts Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Security Alerts
            </CardTitle>
            <Button variant="ghost" size="sm">
              Show All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {securityAlerts && securityAlerts.length > 0 ? (
            <div className="space-y-3">
              {securityAlerts.map((alert, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-slate-50 rounded-md border border-slate-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-800">{alert.title}</p>
                    <p className="text-sm text-slate-500">{alert.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No security alerts at this time</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for stats cards
const StatCard = ({ title, value, icon: Icon, iconColor, textColor }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor} bg-opacity-15`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminDashboard;

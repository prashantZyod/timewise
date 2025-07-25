import React from "react";
import { useLocation, Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Database, Server, ArrowRight } from "lucide-react";

export default function Debug() {
  const location = useLocation();

  // Test navigation items and URLs
  const testItems = [
    { name: "Attendance", expectedPath: "/attendance" },
    { name: "AdminDashboard", expectedPath: "/admin-dashboard" },
    { name: "PhotoVerification", expectedPath: "/photo-verification" },
    { name: "StaffManagement", expectedPath: "/staff-management" },
    { name: "BranchManagement", expectedPath: "/branch-management" },
    { name: "DeviceManagement", expectedPath: "/device-management" },
    { name: "Reports", expectedPath: "/reports" },
    { name: "Settings", expectedPath: "/settings" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Debug Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Route Information</h2>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-500">Current Path:</p>
          <p className="font-mono bg-slate-100 p-2 rounded">{location.pathname}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-500">Current Search:</p>
          <p className="font-mono bg-slate-100 p-2 rounded">{location.search || "(none)"}</p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg shadow-sm mb-6 border border-blue-200">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Server className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Backend Integration Demo</h2>
            <p className="text-blue-700 mb-4">
              Test the connection between the frontend and backend API. The demo allows you to check geofencing, 
              register devices, and use backend-based location tracking.
            </p>
            <Link to="/backend-demo">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Open Backend Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">URL Mapping Test</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-4 text-slate-600">Page Name</th>
              <th className="text-left py-2 px-4 text-slate-600">Generated URL</th>
              <th className="text-left py-2 px-4 text-slate-600">Expected URL</th>
              <th className="text-left py-2 px-4 text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {testItems.map((item) => {
              const generatedUrl = createPageUrl(item.name);
              const isMatch = generatedUrl === item.expectedPath;
              
              return (
                <tr key={item.name} className="border-b border-slate-200">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4 font-mono">{generatedUrl}</td>
                  <td className="py-2 px-4 font-mono">{item.expectedPath}</td>
                  <td className={`py-2 px-4 ${isMatch ? "text-green-600" : "text-red-600"}`}>
                    {isMatch ? "✓ Match" : "✗ Mismatch"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

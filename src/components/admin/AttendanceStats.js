import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { TrendingUp } from "lucide-react";

export default function AttendanceStats({ title, value, icon: Icon, color }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6 ${color} rounded-full opacity-10`} />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <CardTitle className="text-2xl font-bold mt-1">
              {value}
            </CardTitle>
          </div>
          <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

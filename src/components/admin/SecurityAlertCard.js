import React from 'react';
import { Shield, AlertTriangle, User, MapPin, Clock, X } from 'lucide-react';

export default function SecurityAlertCard({ alert, onDismiss, onViewDetails }) {
  // Alert severity level styling
  const severityStyles = {
    critical: {
      container: 'bg-red-50 border-red-200',
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: 'text-red-700',
      text: 'text-red-600',
      time: 'text-red-500',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      title: 'text-amber-700',
      text: 'text-amber-600',
      time: 'text-amber-500',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: 'text-blue-700',
      text: 'text-blue-600',
      time: 'text-blue-500',
    }
  };

  // Default to critical if severity is not provided
  const style = severityStyles[alert.severity] || severityStyles.critical;

  return (
    <div className={`p-4 border rounded-lg ${style.container} relative`}>
      {/* Dismiss button */}
      {onDismiss && (
        <button 
          onClick={() => onDismiss(alert.id)}
          className="absolute top-2 right-2 p-1 hover:bg-white rounded-full"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      )}

      <div className="flex">
        <div className="mr-3 mt-1">
          {style.icon}
        </div>
        <div>
          <h4 className={`font-medium ${style.title}`}>{alert.title}</h4>
          <p className={`text-sm ${style.text} mt-1`}>{alert.description}</p>
          
          {/* Alert metadata */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {alert.user && (
              <div className="flex items-center text-xs text-slate-600">
                <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {alert.user.name}
              </div>
            )}
            {alert.location && (
              <div className="flex items-center text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {alert.location}
              </div>
            )}
            <div className="flex items-center text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>
          
          {/* Action buttons */}
          {onViewDetails && (
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => onViewDetails(alert.id)} 
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

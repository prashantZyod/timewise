import React from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export default function RecentActivities() {
  // Mock recent activities
  const activities = [
    {
      id: 'act-1',
      type: 'check-in',
      timestamp: new Date(new Date().setHours(8, 45)).toISOString(),
      details: {
        time: '08:45 AM'
      }
    },
    {
      id: 'act-2',
      type: 'schedule-changed',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      details: {
        date: new Date().toISOString().split('T')[0],
        oldTime: '09:00 - 17:00',
        newTime: '10:00 - 18:00'
      }
    },
    {
      id: 'act-3',
      type: 'timeoff-requested',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      details: {
        startDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 16)).toISOString().split('T')[0],
        status: 'pending'
      }
    },
    {
      id: 'act-4',
      type: 'profile-updated',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      details: {
        fields: ['phone number', 'address']
      }
    },
    {
      id: 'act-5',
      type: 'check-out',
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      details: {
        time: '17:30 PM'
      }
    }
  ];
  
  // Format date as relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format activity title
  const getActivityTitle = (activity) => {
    switch (activity.type) {
      case 'check-in':
        return 'You checked in';
      case 'check-out':
        return 'You checked out';
      case 'schedule-changed':
        return 'Your schedule was changed';
      case 'timeoff-requested':
        return 'You requested time off';
      case 'profile-updated':
        return 'You updated your profile';
      default:
        return 'Activity recorded';
    }
  };
  
  // Get activity icon
  const getActivityIcon = (activity) => {
    switch (activity.type) {
      case 'check-in':
      case 'check-out':
        return <Clock size={16} className="text-emerald-500" />;
      case 'schedule-changed':
      case 'timeoff-requested':
        return <Calendar size={16} className="text-blue-500" />;
      default:
        return <Clock size={16} className="text-slate-500" />;
    }
  };
  
  // Format activity description
  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'check-in':
        return `You checked in at ${activity.details.time}`;
      case 'check-out':
        return `You checked out at ${activity.details.time}`;
      case 'schedule-changed':
        return `Your shift on ${new Date(activity.details.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })} was changed from ${activity.details.oldTime} to ${activity.details.newTime}`;
      case 'timeoff-requested':
        return `You requested time off from ${new Date(activity.details.startDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })} to ${new Date(activity.details.endDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}`;
      case 'profile-updated':
        return `You updated your ${activity.details.fields.join(' and ')}`;
      default:
        return '';
    }
  };
  
  return (
    <div className="p-4">
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start">
            <div className="mt-1 mr-3">
              {getActivityIcon(activity)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-slate-800">
                  {getActivityTitle(activity)}
                </h4>
                <span className="text-xs text-slate-500 ml-2">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {getActivityDescription(activity)}
              </p>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <a 
            href="/staff-profile?tab=activity" 
            className="text-xs text-emerald-500 hover:text-emerald-600 font-medium flex items-center"
          >
            View All Activities
            <ArrowRight size={12} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

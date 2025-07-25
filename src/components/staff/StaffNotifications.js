import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Calendar, Megaphone, AlertTriangle, Clock, Check } from 'lucide-react';
import { useStaff } from '../../contexts';

export default function StaffNotifications({ notifications, maxHeight }) {
  const { markNotificationAsRead, markAllNotificationsAsRead } = useStaff();
  const [filter, setFilter] = useState('all');
  
  // Filter notifications
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notification => notification.type === filter);
  
  // Format date as relative time (e.g., "2 hours ago")
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
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'schedule':
        return <Calendar size={16} className="text-blue-500" />;
      case 'announcement':
        return <Megaphone size={16} className="text-amber-500" />;
      case 'attendance':
        return <Clock size={16} className="text-purple-500" />;
      case 'timeoff':
        return <Calendar size={16} className="text-green-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-slate-500" />;
    }
  };
  
  return (
    <div>
      {/* Filters */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'all' 
                ? 'bg-slate-200 text-slate-800' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('announcement')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'announcement' 
                ? 'bg-amber-200 text-amber-800' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Announcements
          </button>
          <button 
            onClick={() => setFilter('schedule')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === 'schedule' 
                ? 'bg-blue-200 text-blue-800' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Schedule
          </button>
        </div>
        
        <button 
          onClick={markAllNotificationsAsRead}
          className="text-xs text-slate-500 hover:text-emerald-500 transition-colors"
        >
          Mark all as read
        </button>
      </div>
      
      {/* Notifications list */}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight: maxHeight || '400px' }}
      >
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 border-b border-slate-100 ${notification.read ? '' : 'bg-blue-50'}`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-slate-800">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-500 ml-2">
                      {getRelativeTime(notification.date)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {notification.type === 'timeoff' && (
                        <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                          View Request
                        </button>
                      )}
                      
                      {notification.type === 'schedule' && (
                        <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                          View Schedule
                        </button>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <button 
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="text-xs text-slate-500 hover:text-emerald-500 transition-colors flex items-center"
                      >
                        <Check size={12} className="mr-1" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}

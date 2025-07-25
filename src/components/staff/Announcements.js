import React, { useState } from 'react';
import { Bell, Megaphone, X, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';

export default function Announcements() {
  // Mock announcements data
  const announcementsData = [
    {
      id: 'ann-1',
      title: 'New Attendance Policy',
      content: 'Starting next month, all staff members must check in using facial recognition. Please make sure your profile photo is up to date.',
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      priority: 'high',
      read: true,
      saved: false
    },
    {
      id: 'ann-2',
      title: 'Holiday Schedule Updates',
      content: 'The holiday schedule for December has been updated. Please check your dashboard for changes to your assigned shifts.',
      date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      priority: 'medium',
      read: false,
      saved: true
    },
    {
      id: 'ann-3',
      title: 'Staff Meeting - Thursday',
      content: 'Reminder: All staff meeting this Thursday at 10:00 AM. Remote participation link will be sent via email.',
      date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      priority: 'medium',
      read: false,
      saved: false
    }
  ];
  
  const [announcements, setAnnouncements] = useState(announcementsData);
  
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
  
  // Toggle read status
  const toggleRead = (id) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, read: !ann.read } : ann
      )
    );
  };
  
  // Toggle saved status
  const toggleSaved = (id, e) => {
    e.stopPropagation();
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, saved: !ann.saved } : ann
      )
    );
  };
  
  // Dismiss announcement
  const dismissAnnouncement = (id, e) => {
    e.stopPropagation();
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };
  
  // Get priority color class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };
  
  return (
    <div className="p-4">
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-6">
            <Megaphone className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No announcements</h3>
            <p className="mt-1 text-sm text-slate-500">You're all caught up!</p>
          </div>
        ) : (
          announcements.map(announcement => (
            <div 
              key={announcement.id}
              className={`p-3 rounded-lg border ${announcement.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-100'} cursor-pointer transition-all duration-200 hover:shadow-sm`}
              onClick={() => toggleRead(announcement.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Megaphone size={16} className={announcement.priority === 'high' ? "text-red-500" : "text-blue-500"} />
                  <h4 className="font-medium text-sm text-slate-800">
                    {announcement.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  {!announcement.read && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                  <button 
                    onClick={(e) => toggleSaved(announcement.id, e)}
                    className="text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    {announcement.saved ? (
                      <BookmarkCheck size={16} className="text-amber-500" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                  </button>
                  <button 
                    onClick={(e) => dismissAnnouncement(announcement.id, e)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-xs text-slate-600 line-clamp-2">
                  {announcement.content}
                </p>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {getRelativeTime(announcement.date)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityClass(announcement.priority)}`}>
                  {announcement.priority}
                </span>
              </div>
            </div>
          ))
        )}
        
        <div className="pt-2">
          <a 
            href="/announcements" 
            className="text-xs text-emerald-500 hover:text-emerald-600 font-medium flex items-center"
          >
            View All Announcements
            <ArrowRight size={12} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}

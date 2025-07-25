import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

export default function StaffScheduleOverview({ schedule }) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  // Function to get the current week's dates
  const getCurrentWeekDates = (offset = 0) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the date of the nearest Monday (start of the week)
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + (offset * 7));
    
    // Generate an array of dates for the week
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };
  
  // Get the current week's dates
  const weekDates = getCurrentWeekDates(currentWeekOffset);
  
  // Format date as YYYY-MM-DD for comparison with schedule data
  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };
  
  // Get today's date as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Format date for display
  const formatDateDisplay = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Format day for display
  const formatDayDisplay = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short'
    }).format(date);
  };

  return (
    <div className="p-4">
      {/* Week navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousWeek}
          className="p-2 text-slate-600 hover:text-emerald-500 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-sm font-medium text-slate-700">
          {formatDateDisplay(weekDates[0])} - {formatDateDisplay(weekDates[6])}
        </h3>
        
        <button 
          onClick={goToNextWeek}
          className="p-2 text-slate-600 hover:text-emerald-500 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Schedule grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {weekDates.map((date, index) => (
          <div 
            key={`header-${index}`}
            className={`text-center py-2 ${
              formatDateForComparison(date) === today 
                ? 'bg-emerald-50 text-emerald-700 rounded-t-md font-medium' 
                : 'text-slate-600'
            }`}
          >
            <div className="text-xs uppercase">{formatDayDisplay(date)}</div>
            <div className="text-sm mt-1">{date.getDate()}</div>
          </div>
        ))}
        
        {/* Schedule cells */}
        {weekDates.map((date, index) => {
          const dateStr = formatDateForComparison(date);
          const daySchedule = schedule.find(s => s.date === dateStr);
          
          return (
            <div 
              key={`cell-${index}`}
              className={`p-2 min-h-[100px] border border-slate-100 rounded-b-md ${
                dateStr === today ? 'bg-emerald-50' : ''
              }`}
            >
              {daySchedule ? (
                <div className="h-full flex flex-col">
                  <div className={`text-xs font-medium mb-1 p-1 rounded ${
                    daySchedule.role === 'Sales Associate' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {daySchedule.role}
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-600 mb-1">
                    <Clock size={12} className="mr-1" />
                    <span>{daySchedule.startTime} - {daySchedule.endTime}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-600">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{daySchedule.branch}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No Shift
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

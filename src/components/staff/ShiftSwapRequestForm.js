import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, CheckSquare, AlertCircle, Check } from 'lucide-react';

export default function ShiftSwapRequestForm() {
  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    swapWith: '',
    reason: '',
    acknowledgePolicy: false
  });
  
  const [availableColleagues, setAvailableColleagues] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  // Mock upcoming shifts
  const upcomingShifts = [
    {
      id: 'shift-1',
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
      time: '09:00 - 17:00',
      role: 'Customer Service',
      location: 'Main Branch'
    },
    {
      id: 'shift-2',
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      time: '10:00 - 18:00',
      role: 'Customer Service',
      location: 'Main Branch'
    },
    {
      id: 'shift-3',
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
      time: '08:00 - 16:00',
      role: 'Customer Service',
      location: 'Downtown Branch'
    }
  ];
  
  // Mock colleagues data
  const allColleagues = [
    { id: 'user-1', name: 'Jane Smith', role: 'Customer Service', branch: 'Main Branch' },
    { id: 'user-2', name: 'Michael Johnson', role: 'Customer Service', branch: 'Main Branch' },
    { id: 'user-3', name: 'Emily Davis', role: 'Customer Service', branch: 'Downtown Branch' },
    { id: 'user-4', name: 'Robert Wilson', role: 'Customer Service', branch: 'Main Branch' },
    { id: 'user-5', name: 'Sarah Brown', role: 'Customer Service', branch: 'Downtown Branch' }
  ];
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If shift selection changes, update available colleagues
    if (name === 'shift') {
      const selectedShift = upcomingShifts.find(s => s.id === value);
      if (selectedShift) {
        // Filter colleagues based on same role and branch as the selected shift
        const filteredColleagues = allColleagues.filter(
          c => c.role === selectedShift.role && c.branch === selectedShift.location
        );
        setAvailableColleagues(filteredColleagues);
      } else {
        setAvailableColleagues([]);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!formData.shift) {
      setError('Please select a shift to swap');
      return;
    }
    
    if (!formData.swapWith) {
      setError('Please select a colleague to swap with');
      return;
    }
    
    if (!formData.acknowledgePolicy) {
      setError('Please acknowledge the shift swap policy');
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          date: '',
          shift: '',
          swapWith: '',
          reason: '',
          acknowledgePolicy: false
        });
      }, 3000);
    }, 1500);
  };
  
  // Get shift details by id
  const getShiftDetails = (shiftId) => {
    return upcomingShifts.find(s => s.id === shiftId);
  };
  
  // Get colleague details by id
  const getColleagueDetails = (colleagueId) => {
    return allColleagues.find(c => c.id === colleagueId);
  };
  
  if (submitted) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Request Submitted</h3>
        <p className="text-sm text-slate-600 text-center mt-2">
          Your shift swap request has been sent to {getColleagueDetails(formData.swapWith)?.name}.
          You'll be notified once they respond.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="shift" className="block text-xs font-medium text-slate-700 mb-1">
            Select Shift to Swap
          </label>
          <select
            id="shift"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            required
          >
            <option value="">Select a shift...</option>
            {upcomingShifts.map(shift => (
              <option key={shift.id} value={shift.id}>
                {formatDate(shift.date)} • {shift.time} • {shift.location}
              </option>
            ))}
          </select>
        </div>
        
        {formData.shift && (
          <div className="bg-slate-50 p-3 rounded-md flex items-center space-x-2">
            <Calendar size={16} className="text-slate-600" />
            <div className="text-sm">
              <span className="font-medium">Selected Shift:</span>{' '}
              <span className="text-slate-700">
                {formatDate(getShiftDetails(formData.shift)?.date)} • {getShiftDetails(formData.shift)?.time} • {getShiftDetails(formData.shift)?.location}
              </span>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="swapWith" className="block text-xs font-medium text-slate-700 mb-1">
            Request Swap With
          </label>
          <select
            id="swapWith"
            name="swapWith"
            value={formData.swapWith}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            required
            disabled={!formData.shift}
          >
            <option value="">Select a colleague...</option>
            {availableColleagues.map(colleague => (
              <option key={colleague.id} value={colleague.id}>
                {colleague.name} • {colleague.branch}
              </option>
            ))}
          </select>
          {formData.shift && availableColleagues.length === 0 && (
            <p className="mt-1 text-xs text-amber-600">
              No eligible colleagues found for this shift. Please select a different shift.
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-xs font-medium text-slate-700 mb-1">
            Reason for Swap (Optional)
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Briefly explain why you need to swap this shift..."
          />
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acknowledgePolicy"
              name="acknowledgePolicy"
              type="checkbox"
              checked={formData.acknowledgePolicy}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acknowledgePolicy" className="text-slate-600">
              I understand that this swap request must be approved by both the colleague and manager before it takes effect.
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className={`${
            submitting
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          } w-full text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center`}
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit Swap Request'
          )}
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <Clock size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            <span className="font-medium">Tip:</span> Shift swap requests are more likely to be approved if 
            made at least 48 hours in advance. Frequent last-minute swap requests may be reviewed by management.
          </p>
        </div>
      </div>
    </div>
  );
}

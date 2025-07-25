import React, { useState } from 'react';
import { Calendar, Info, Check, Clock } from 'lucide-react';

export default function TimeOffRequest() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: 'vacation',
    reason: '',
    attachments: null
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  // Calculate total days
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate dates
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start > end) {
      setError('End date cannot be before start date');
      return;
    }
    
    // In a real app, you would validate available leave balance here
    
    setSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          startDate: '',
          endDate: '',
          type: 'vacation',
          reason: '',
          attachments: null
        });
      }, 3000);
    }, 1500);
  };
  
  // Mock leave balance data
  const leaveBalance = {
    vacation: 14,
    sick: 5,
    personal: 3
  };
  
  // Get available days based on selected type
  const getAvailableDays = (type) => {
    return leaveBalance[type] || 0;
  };
  
  if (submitted) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Request Submitted</h3>
        <p className="text-sm text-slate-600 text-center mt-2">
          Your time off request has been submitted and is awaiting approval.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex items-center">
            <Info size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-xs font-medium text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-xs font-medium text-slate-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-xs font-medium text-slate-700 mb-1">
            Time Off Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            required
          >
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
          
          <div className="mt-1 flex items-center text-xs text-slate-600">
            <Clock size={14} className="mr-1" />
            <span>Available: {getAvailableDays(formData.type)} days</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-xs font-medium text-slate-700 mb-1">
            Reason (Optional)
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Briefly describe the reason for your time off..."
          />
        </div>
        
        <div>
          <label htmlFor="attachments" className="block text-xs font-medium text-slate-700 mb-1">
            Attachments (Optional)
          </label>
          <input
            type="file"
            id="attachments"
            name="attachments"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            multiple
          />
          <p className="mt-1 text-xs text-slate-500">
            For sick leave, please attach any relevant documentation.
          </p>
        </div>
        
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-slate-600 mr-2" />
            <span className="font-medium">Total Days:</span>
            <span className="ml-1 text-slate-700">{calculateDays()}</span>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`${
              submitting
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            } text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center`}
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
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';

/**
 * Progress Component
 * Displays a progress bar
 * 
 * @param {Object} props - The component props
 * @param {number} props.value - The progress value (0-100)
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.indicatorClassName - Additional CSS classes for the progress indicator
 */
export const Progress = ({ 
  value = 0, 
  className = '', 
  indicatorClassName = '' 
}) => {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  return (
    <div 
      className={`relative overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar" 
      aria-valuemin={0} 
      aria-valuemax={100} 
      aria-valuenow={safeValue}
    >
      <div
        className={`h-full bg-emerald-500 transition-all ${indicatorClassName}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

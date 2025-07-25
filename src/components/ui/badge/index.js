import React from 'react';

export const Badge = ({ variant = 'default', children, className, ...props }) => {
  const variantStyles = {
    default: 'bg-emerald-100 text-emerald-800',
    secondary: 'bg-slate-100 text-slate-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-slate-200 text-slate-800',
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
};

import React from 'react';

export const Button = ({ variant = 'default', size = 'default', children, className, ...props }) => {
  const variantStyles = {
    default: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-slate-200 hover:bg-slate-100 text-slate-800',
    ghost: 'hover:bg-slate-100 text-slate-800',
    link: 'text-emerald-600 hover:underline underline-offset-4',
  };
  
  const sizeStyles = {
    default: 'py-2 px-4 text-sm',
    sm: 'py-1 px-3 text-xs',
    lg: 'py-3 px-6 text-base',
    icon: 'p-2',
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

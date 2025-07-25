import React from 'react';

/**
 * Input Component
 * A styled input element for forms
 */
export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;

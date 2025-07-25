import React from 'react';

export const Alert = ({ className, variant = 'default', children, ...props }) => {
  const variantClasses = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    success: 'border-emerald-500/50 text-emerald-600 dark:border-emerald-500 [&>svg]:text-emerald-600',
    warning: 'border-amber-500/50 text-amber-600 dark:border-amber-500 [&>svg]:text-amber-600',
    info: 'border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600'
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ className, children, ...props }) => {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`}
      {...props}
    >
      {children}
    </h5>
  );
};

export const AlertDescription = ({ className, children, ...props }) => {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

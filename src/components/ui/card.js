import React from 'react';

export const Card = ({ className, children, ...props }) => {
  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 pb-2 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ className, children, ...props }) => {
  return (
    <p className={`text-sm text-muted-foreground mt-1 ${className || ''}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={`p-6 pt-0 flex items-center ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

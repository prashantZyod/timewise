import React from 'react';

export const Card = ({ className, children, variant = "default", hoverable = false, ...props }) => {
  const variantStyles = {
    default: "bg-white",
    primary: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-amber-50 border-amber-200",
    danger: "bg-red-50 border-red-200",
    info: "bg-sky-50 border-sky-200"
  };
  
  return (
    <div 
      className={`rounded-lg shadow-sm ${variantStyles[variant]} ${hoverable ? 'transition-all duration-200 hover:shadow-md' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 ${className || ''}`} {...props}>
      {children}
    </h3>
  );
};

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 border-t border-slate-100 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

// New components to enhance Card functionality

export const CardImage = ({ src, alt, className, ...props }) => {
  return (
    <div className={`overflow-hidden rounded-t-lg ${className || ''}`} {...props}>
      <img 
        src={src} 
        alt={alt || "Card image"} 
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export const CardActions = ({ className, children, align = "right", ...props }) => {
  const alignmentStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
    around: "justify-around"
  };
  
  return (
    <div className={`flex items-center gap-2 mt-2 ${alignmentStyles[align]} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const CardStat = ({ label, value, icon: Icon, className, ...props }) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`} {...props}>
      {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

export const CardDivider = ({ className, ...props }) => {
  return <hr className={`border-t border-slate-100 my-3 ${className || ''}`} {...props} />;
};

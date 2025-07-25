import React from "react";

const Select = React.forwardRef(({ value, onValueChange, children, ...props }, ref) => {
  return (
    <div className="relative" ref={ref} {...props}>
      {children}
    </div>
  );
});

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

const SelectValue = React.forwardRef(({ className, placeholder, children, ...props }, ref) => {
  return (
    <span className="flex-grow text-sm truncate" ref={ref} {...props}>
      {children || placeholder}
    </span>
  );
});

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className || ""}`}
      ref={ref}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">
        {children}
      </div>
    </div>
  );
});

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ""}`}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-current opacity-0"></span>
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
});

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

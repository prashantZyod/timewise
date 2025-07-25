import React, { createContext, useContext, useState } from 'react';

// Create context for the select
const SelectContext = createContext(null);

export const Select = ({ children, value, onValueChange, disabled = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider 
      value={{ 
        value, 
        onValueChange, 
        open, 
        setOpen,
        disabled
      }}
    >
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ className, children, ...props }) => {
  const { open, setOpen, disabled } = useContext(SelectContext);

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      onClick={() => !disabled && setOpen(!open)}
      disabled={disabled}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

export const SelectValue = ({ className, placeholder, children, ...props }) => {
  const { value } = useContext(SelectContext);
  
  return (
    <span className={className} {...props}>
      {value ? children : placeholder}
    </span>
  );
};

export const SelectContent = ({ className, children, ...props }) => {
  const { open, setOpen } = useContext(SelectContext);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50" 
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1 w-full ${className || ''}`}
        {...props}
      >
        <div className="w-full p-1">{children}</div>
      </div>
    </>
  );
};

export const SelectItem = ({ className, value, children, ...props }) => {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${isSelected ? 'bg-accent text-accent-foreground' : ''} ${className || ''}`}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      {children}
    </div>
  );
};

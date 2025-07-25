import React from "react";

const Dialog = React.forwardRef(({ open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" ref={ref} {...props}>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        {children}
      </div>
    </div>
  );
});

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
});

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`}
    {...props}
  />
));

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`}
    {...props}
  />
));

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
    {...props}
  />
));

Dialog.displayName = "Dialog";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogFooter.displayName = "DialogFooter";
DialogTitle.displayName = "DialogTitle";

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle };

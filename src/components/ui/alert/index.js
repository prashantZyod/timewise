import React from "react";

const Alert = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${
        variant === "destructive"
          ? "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
          : "text-foreground"
      } ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
});

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className || ""}`}
    {...props}
  />
));

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className || ""}`}
    {...props}
  />
));

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

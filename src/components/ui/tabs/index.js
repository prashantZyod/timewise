import React, { createContext, useState, useContext } from 'react';

// Create a context for the tabs
const TabsContext = createContext();

export const Tabs = ({ defaultValue, children, className, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`${className || ''}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className, ...props }) => {
  return (
    <div className={`inline-flex items-center bg-slate-100 p-1 rounded-md ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button 
      className={`px-3 py-1 text-sm font-medium rounded transition-colors ${isActive ? 'bg-white text-slate-900' : 'text-slate-600 hover:text-slate-900'} ${className || ''}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={`mt-2 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

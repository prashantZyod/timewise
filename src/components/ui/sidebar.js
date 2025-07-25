import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the sidebar
const SidebarContext = createContext();
export { SidebarContext };

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, className = '', ...props }) => {
  const { isOpen, closeSidebar } = useContext(SidebarContext);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && window.innerWidth < 768) {
        closeSidebar();
      }
    };
    
    // Add click event listener to the document
    if (isOpen && window.innerWidth < 768) {
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      }, 100);
    }
    
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, closeSidebar]);
  
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:w-64`}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      {...props}
    >
      {children}
    </aside>
  );
};

export const SidebarHeader = ({ children, className = '', ...props }) => {
  return <div className={`${className}`} {...props}>{children}</div>;
};

export const SidebarContent = ({ children, className = '', ...props }) => {
  return <div className={`overflow-y-auto ${className}`} {...props}>{children}</div>;
};

export const SidebarFooter = ({ children, className = '', ...props }) => {
  return <div className={`mt-auto ${className}`} {...props}>{children}</div>;
};

export const SidebarGroup = ({ children, className = '', ...props }) => {
  return <div className={`mb-6 ${className}`} {...props}>{children}</div>;
};

export const SidebarGroupLabel = ({ children, className = '', ...props }) => {
  return <h3 className={`${className}`} {...props}>{children}</h3>;
};

export const SidebarGroupContent = ({ children, className = '', ...props }) => {
  return <div className={`${className}`} {...props}>{children}</div>;
};

export const SidebarMenu = ({ children, className = '', ...props }) => {
  return <ul className={`list-none p-0 m-0 ${className}`} {...props}>{children}</ul>;
};

export const SidebarMenuItem = ({ children, className = '', ...props }) => {
  return <li className={`${className}`} {...props}>{children}</li>;
};

export const SidebarMenuButton = React.forwardRef(({ children, asChild, className = '', ...props }, ref) => {
  const Comp = asChild ? React.Children.only(children).type : 'button';
  const childProps = asChild ? React.Children.only(children).props : {};
  
  return (
    <Comp 
      ref={ref}
      className={`w-full text-left focus:outline-none ${className}`}
      {...childProps}
      {...props}
    >
      {asChild ? React.Children.only(children).props.children : children}
    </Comp>
  );
});

export const SidebarTrigger = ({ className = '', ...props }) => {
  const { toggleSidebar, isOpen } = useContext(SidebarContext);
  
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        toggleSidebar();
      }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className={`${className} p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
      {...props}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      )}
    </button>
  );
};

const Table = ({ data, columns }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow">
      <table className="w-full divide-y divide-gray-200">
        {/* Table content */}
      </table>
    </div>
  );
};

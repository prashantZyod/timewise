import React from 'react';
import { Bell, User, Search, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative mx-4 lg:mx-0 hidden md:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input 
                className="form-input w-64 sm:w-72 rounded-md pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                placeholder="Search..." 
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="flex mx-4 text-gray-600 focus:outline-none">
              <Bell className="h-6 w-6" />
              <span className="absolute h-2 w-2 top-0 right-0 mt-2 mr-4 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button className="flex items-center focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                  A
                </div>
                <span className="ml-2 text-gray-700 text-sm font-medium hidden md:block">
                  Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
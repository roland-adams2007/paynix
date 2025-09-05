import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky-header bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">

                        <button className="relative p-2 text-gray-600 hover:text-[#20C997] transition-colors">
                            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        </button>


                        <div className="relative">
                            <button className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#20C997] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs sm:text-sm font-semibold">JD</span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-900">John Doe</p>
                                    <p className="text-xs text-gray-600">Account: 3124567890</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
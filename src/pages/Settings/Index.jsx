import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, BellIcon, Sliders, HelpCircle } from 'lucide-react';
import Header from '../../layouts/Header';
import Sidebar from '../../layouts/Sidebar';
import Mobile from '../../layouts/Mobile';

function Settings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigation = (path) => navigate(path);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Mobile toggleSidebar={toggleSidebar} />
            <div className="lg:ml-64 min-h-screen main-content">
                <Header />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Settings Menu</h3>
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => handleNavigation('/settings/profile')}
                                        className={`setting-item w-full flex cursor-pointer items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${isActive('/settings/profile') ? 'bg-[#20C997] text-white' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <User className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <span>Profile Settings</span>
                                    </button>

                                    <button
                                        onClick={() => handleNavigation('/settings/security')}
                                        className={`setting-item w-full flex cursor-pointer items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${isActive('/settings/security') ? 'bg-[#20C997] text-white' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <span>Security & Privacy</span>
                                    </button>

                                    <button
                                        className="setting-item w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <BellIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <span>Notifications</span>
                                    </button>

                                    <button
                                        className="setting-item w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Sliders className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <span>Preferences</span>
                                    </button>

                                    <button
                                        className="setting-item w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <HelpCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                        <span>Help & Support</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                        <div className="lg:col-span-3 min-h-[400px] flex items-center justify-center">
                            {location.pathname === '/settings' ? (
                                <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-10 flex flex-col items-center justify-center animate-fade-up">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-16 w-16 text-blue-400 mb-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                                        No Setting Selected
                                    </h2>
                                    <p className="text-gray-500 text-center">
                                        Please choose an option from the menu to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <Outlet />
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default Settings;

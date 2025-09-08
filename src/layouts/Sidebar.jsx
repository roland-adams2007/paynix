import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Send, PlusCircle, CreditCard, Receipt, Target, Clock, Download, Headphones, Settings } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Transfer Money', icon: Send, path: '/transfer' },
        { name: 'Add Money', icon: PlusCircle, path: '/add-money' },
        { name: 'Virtual Cards', icon: CreditCard, path: '/virtual-cards' },
        { name: 'Payments', icon: Receipt, path: '/payments' },
        { name: 'Savings & Goals', icon: Target, path: '/savings-goals' },
        { name: 'Transaction History', icon: Clock, path: '/transactions' },
        { name: 'Statements', icon: Download, path: '/statements' },
    ];

    const supportItems = [
        { name: 'Help & Support', icon: Headphones, path: '/support' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
            id="sidebar"
        >
            <div className="flex items-center justify-center h-20 border-b border-gray-200">
                <img src="/images/logowithname.png" alt="Paynix Logo" className="h-10 w-auto" />
            </div>

            <nav className="mt-8 px-4 overflow-y-auto h-full pb-24">
                <div className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg ${isActive ? 'bg-[#20C997] text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                            onClick={() => toggleSidebar()}
                        >
                            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="space-y-2">
                        {supportItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg ${isActive ? 'bg-[#20C997] text-white' : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => toggleSidebar()}
                            >
                                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

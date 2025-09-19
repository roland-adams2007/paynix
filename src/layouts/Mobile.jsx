import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Send, CreditCard, PlusCircle, User, Menu } from 'lucide-react';

const Mobile = ({ toggleSidebar }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Transfer', icon: Send, path: '/transfer' },
        { name: 'Add Money', icon: PlusCircle, path: '/add-money' },
        { name: 'Cards', icon: CreditCard, path: '/cards' },
        { name: 'Profile', icon: User, path: '/settings/profile' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Menu className="w-6 h-6 text-gray-900" />
                </button>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white bottom-nav z-40">
                <div className="grid grid-cols-5">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center py-2 sm:py-3 transition-colors ${isActive ? 'text-[#20C997]' : 'text-gray-600 hover:text-navy'
                                }`
                            }
                        >
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs mt-1">{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Mobile Overlay */}
            <div id="mobile-overlay" className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden"></div>
        </>
    );
};

export default Mobile;

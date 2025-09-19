import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ArrowDownRight, ArrowUpRight, PiggyBank, CreditCard, Send, Plus, Smartphone, Zap, ArrowDownLeft, ShoppingCart, Laptop, Shield, Plane, MoreHorizontal, Wifi } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '../styles/dashboard.css';
import Header from '../layouts/Header';
import Mobile from '../layouts/Mobile';
import Sidebar from '../layouts/Sidebar';
import axiosInstance from '../api/axiosInstance';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/UseAuth';
import formatMoney from '../utils/formatMoney';


const Dashboard = () => {
    const { showAlert } = useAlert();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showBalance, setShowBalance] = useState(true);
    const [greeting, setGreeting] = useState('Good morning');
    const [bankDetails, setBankDetails] = useState([]);
    const [isBankFetching, setIsBankFetching] = useState(true);
    const fetchRef = useRef(false);
    const { user } = useAuth();


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        const overlay = document.getElementById('mobile-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
        }
    };

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };



    useEffect(() => {
        if (fetchRef.current == true) return;
        fetchRef.current = true;

        setIsBankFetching(true);
        axiosInstance.post("/account/me", { type: "me" })
            .then(response => {
                const res = response.data;
                setBankDetails(res.data);
            })
            .catch((error) => {
                const errRes = error.response?.data || {};
                let message =
                    errRes.message || "Something went wrong. Please try again.";
                showAlert(message, "error");
            })
            .finally(() => {
                setIsBankFetching(false);
            });

    }, [])




    useEffect(() => {
        const updateWelcomeMessage = () => {
            const hour = new Date().getHours();
            let newGreeting = 'Good morning';
            if (hour >= 12 && hour < 17) {
                newGreeting = 'Good afternoon';
            } else if (hour >= 17) {
                newGreeting = 'Good evening';
            }
            setGreeting(newGreeting);
        };
        updateWelcomeMessage();
    }, []);


    const spendingData = [
        { name: 'Food & Dining', value: 45200 },
        { name: 'Transportation', value: 32800 },
        { name: 'Bills & Utilities', value: 28500 },
        { name: 'Entertainment', value: 19000 },
        { name: 'Others', value: 15500 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1A2B4D] text-white p-2 rounded border border-[#20C997]">
                    <p>{`${payload[0].name}: ₦${payload[0].value.toLocaleString()}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Mobile toggleSidebar={toggleSidebar} />
            <div className="lg:ml-64 min-h-screen main-content">
                <Header />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

                    <div className="mb-6 sm:mb-8">
                        <div className="animate-slide-up">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{`${greeting}, ${user?.first_name || user?.fname || 'N/A'}! 👋`}</h2>
                            <p className="text-gray-600 text-sm sm:text-base">Here's an overview of your financial activity today.</p>
                        </div>
                    </div>


                    <div className="mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="balance-card rounded-2xl p-6 sm:p-8 text-white relative card-hover">
                            <div className="relative z-10">
                                {isBankFetching ? (
                                    <div className="flex justify-center items-center h-32">
                                        <div className="loader border-t-4 border-b-4 border-white w-12 h-12 rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                                            <div>
                                                <p className="text-white text-opacity-80 text-sm mb-1">Total Balance</p>
                                                <div className="flex items-center space-x-4">
                                                    <h3 className="text-2xl sm:text-4xl font-bold" id="balance">
                                                        {showBalance ? (formatMoney(bankDetails?.balance) || 'N/A') : '₦***'}
                                                    </h3>
                                                    <button
                                                        onClick={toggleBalance}
                                                        className="text-white text-opacity-60 hover:text-opacity-100 transition-opacity"
                                                    >
                                                        {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right flex justify-between sm:flex-row sm:items-center sm:space-x-6">
                                                <div className="mb-2 sm:mb-0">
                                                    <p className="text-white text-opacity-80 text-sm">Account Number</p>
                                                    <p className="text-base text-sm sm:text-lg font-semibold">{bankDetails?.account_number || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white text-opacity-80 text-sm">Account Name</p>
                                                    <p className="text-base text-sm sm:text-lg font-semibold">{bankDetails?.account_name || 'N/A'}</p>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                            <div className="flex space-x-6">
                                                <div>
                                                    <p className="text-white text-opacity-80 text-xs mb-1">This Month</p>
                                                    <p className="text-[#20C997] font-semibold text-sm sm:text-base">+₦124,500</p>
                                                </div>
                                                <div>
                                                    <p className="text-white text-opacity-80 text-xs mb-1">Last Transaction</p>
                                                    <p className="text-white font-semibold text-sm sm:text-base">₦25,000</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-white bg-opacity-10 rounded-full px-4 py-2 w-fit">
                                                <ArrowUpRight className="w-4 h-4 text-[#20C997]" />
                                                <span className="text-sm font-medium text-[#20C997]">+12.5%</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="stats-card rounded-xl p-4 sm:p-6 card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-green rounded-xl flex items-center justify-center">
                                    <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+8.2%</span>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">₦250,000</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Monthly Income</p>
                        </div>
                        <div className="stats-card rounded-xl p-4 sm:p-6 card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-red rounded-xl flex items-center justify-center">
                                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">-3.1%</span>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">₦125,500</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Monthly Spending</p>
                        </div>
                        <div className="stats-card rounded-xl p-4 sm:p-6 card-hover animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-blue rounded-xl flex items-center justify-center">
                                    <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Goal</span>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">₦95,750</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Total Savings</p>
                        </div>
                        <div className="stats-card rounded-xl p-4 sm:p-6 card-hover animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-orange rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Active</span>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">2</h3>
                            <p className="text-gray-600 text-xs sm:text-sm">Virtual Cards</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
                        <div className="quick-actions-grid grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                            {[
                                { icon: Send, label: 'Transfer', gradient: 'gradient-primary', border: '[#1A2B4D]' },
                                { icon: Plus, label: 'Add Money', gradient: 'gradient-green', border: 'green-300' },
                                { icon: Smartphone, label: 'Airtime', gradient: 'gradient-blue', border: 'blue-300' },
                                { icon: Zap, label: 'Bills', gradient: 'gradient-orange', border: 'orange-300' },
                                { icon: CreditCard, label: 'Cards', gradient: 'bg-gradient-to-br from-purple-500 to-pink-500', border: 'purple-300' },
                                { icon: MoreHorizontal, label: 'More', gradient: 'bg-gradient-to-br from-gray-600 to-gray-800', border: 'gray-300' },
                            ].map((action) => (
                                <button
                                    key={action.label}
                                    className={`quick-action-btn flex flex-col items-center p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-${action.border} hover:shadow-lg group`}

                                >
                                    <div
                                        className={`w-12 h-12 sm:w-14 sm:h-14 ${action.gradient} rounded-xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}
                                    >
                                        <action.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Recent Transactions */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Transactions</h3>
                                <div className="flex items-center space-x-3">
                                    <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#1A2B4D]">
                                        <option>All</option>
                                        <option>Income</option>
                                        <option>Expenses</option>
                                    </select>
                                    <a href="#" className="text-[#1A2B4D] text-sm font-medium hover:text-opacity-80">View All</a>
                                </div>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    {
                                        icon: ArrowDownLeft,
                                        bg: 'bg-green-100',
                                        iconColor: 'text-green-600',
                                        title: 'Salary Payment',
                                        time: 'Today, 09:30 AM',
                                        status: 'Completed',
                                        statusColor: 'text-green-600',
                                        amount: '+₦150,000.00',
                                        amountColor: 'text-green-600',
                                        type: 'Credit',
                                    },
                                    {
                                        icon: ArrowUpRight,
                                        bg: 'bg-red-100',
                                        iconColor: 'text-red-600',
                                        title: 'Transfer to Jane Smith',
                                        time: 'Yesterday, 02:15 PM',
                                        status: 'Completed',
                                        statusColor: 'text-green-600',
                                        amount: '-₦25,000.00',
                                        amountColor: 'text-red-600',
                                        type: 'Transfer',
                                    },
                                    {
                                        icon: Smartphone,
                                        bg: 'bg-blue-100',
                                        iconColor: 'text-blue-600',
                                        title: 'MTN Airtime',
                                        time: 'Jan 28, 10:45 AM',
                                        status: 'Completed',
                                        statusColor: 'text-green-600',
                                        amount: '-₦2,500.00',
                                        amountColor: 'text-red-600',
                                        type: 'Bill Payment',
                                    },
                                    {
                                        icon: Zap,
                                        bg: 'bg-orange-100',
                                        iconColor: 'text-orange-600',
                                        title: 'Electricity Bill - IKEDC',
                                        time: 'Jan 27, 08:20 AM',
                                        status: 'Pending',
                                        statusColor: 'text-yellow-600',
                                        amount: '-₦15,750.00',
                                        amountColor: 'text-red-600',
                                        type: 'Utility',
                                    },
                                    {
                                        icon: ShoppingCart,
                                        bg: 'bg-purple-100',
                                        iconColor: 'text-purple-600',
                                        title: 'Netflix Subscription',
                                        time: 'Jan 26, 12:00 PM',
                                        status: 'Completed',
                                        statusColor: 'text-green-600',
                                        amount: '-₦4,900.00',
                                        amountColor: 'text-red-600',
                                        type: 'Subscription',
                                    },
                                ].map((txn, index) => (
                                    <div
                                        key={index}
                                        className="transaction-item flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-100"

                                    >
                                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${txn.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                <txn.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${txn.iconColor}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{txn.title}</p>
                                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                                                    <span>{txn.time}</span>
                                                    <span>•</span>
                                                    <span className={txn.statusColor}>{txn.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className={`font-bold text-sm sm:text-lg ${txn.amountColor}`}>{txn.amount}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{txn.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 sm:mt-6 text-center">
                                <button className="bg-[#1A2B4D] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors text-sm sm:text-base">
                                    View All Transactions
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6 sm:space-y-8">
                            {/* Virtual Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Virtual Card</h3>
                                <div className="gradient-primary rounded-xl p-4 sm:p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                                            <div>
                                                <p className="text-xs opacity-80 mb-1">DEBIT CARD</p>
                                                <p className="text-sm sm:text-lg font-bold">Paynix Bank</p>
                                            </div>
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </div>
                                        </div>
                                        <div className="mb-4 sm:mb-6">
                                            <p className="text-base sm:text-xl font-mono tracking-widest">4521 **** **** 8932</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs opacity-80">VALID THRU</p>
                                                <p className="text-xs sm:text-sm font-semibold">12/28</p>
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-80">CVV</p>
                                                <p className="text-xs sm:text-sm font-semibold">***</p>
                                            </div>
                                            <p className="text-xs sm:text-sm font-semibold">JOHN DOE</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                                    <button
                                        className="bg-[#1A2B4D] text-white py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-opacity-90 transition-colors"

                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="bg-gray-100 text-gray-700 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors"

                                    >
                                        Freeze Card
                                    </button>
                                </div>
                            </div>

                            {/* Savings Goals */}
                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.9s' }}>
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Savings Goals</h3>
                                    <button className="text-[#1A2B4D] text-sm font-medium hover:text-opacity-80">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        {
                                            icon: Laptop,
                                            bg: 'bg-blue-100',
                                            iconColor: 'text-blue-600',
                                            title: 'New Laptop',
                                            progress: '75%',
                                            saved: '₦375,000',
                                            goal: '₦500,000',
                                            progressColor: 'bg-gradient-to-r from-[#1A2B4D] to-[#20C997]',
                                            progressText: 'text-[#1A2B4D]',
                                        },
                                        {
                                            icon: Shield,
                                            bg: 'bg-yellow-100',
                                            iconColor: 'text-yellow-600',
                                            title: 'Emergency Fund',
                                            progress: '45%',
                                            saved: '₦225,000',
                                            goal: '₦500,000',
                                            progressColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
                                            progressText: 'text-yellow-600',
                                        },
                                        {
                                            icon: Plane,
                                            bg: 'bg-green-100',
                                            iconColor: 'text-green-600',
                                            title: 'Vacation',
                                            progress: '30%',
                                            saved: '₦150,000',
                                            goal: '₦500,000',
                                            progressColor: 'bg-gradient-to-r from-green-400 to-emerald-600',
                                            progressText: 'text-green-600',
                                        },
                                    ].map((goal, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-[#1A2B4D] hover:border-opacity-30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <div className={`w-6 h-6 sm:w-8 sm:h-8 ${goal.bg} rounded-full flex items-center justify-center`}>
                                                        <goal.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${goal.iconColor}`} />
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{goal.title}</h4>
                                                </div>
                                                <span className={`text-xs sm:text-sm font-bold ${goal.progressText}`}>{goal.progress}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-2 sm:mb-3">
                                                <div className={`${goal.progressColor} h-1.5 sm:h-2 rounded-full transition-all duration-1000`} style={{ width: goal.progress }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className="text-gray-600">{goal.saved} saved</span>
                                                <span className="font-medium text-gray-900">{goal.goal} goal</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 sm:mt-4 border-2 border-dashed border-gray-300 text-gray-600 py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium hover:border-[#1A2B4D] hover:text-[#1A2B4D] transition-colors flex items-center justify-center space-x-2">
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Create New Savings Goal</span>
                                </button>
                            </div>

                            {/* Spending Analytics */}
                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '1s' }}>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Spending This Month</h3>
                                <div className="relative h-48 sm:h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={spendingData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="70%"
                                                outerRadius="90%"
                                                dataKey="value"
                                                paddingAngle={5}
                                            >
                                                {spendingData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                    {spendingData.slice(0, 4).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <div className={`w-2 h-2 sm:w-3 sm:h-3 ${COLORS[index]} rounded-full`}></div>
                                                <span className="text-xs sm:text-sm text-gray-700">{item.name}</span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-gray-900">₦{item.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Notifications */}
                            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '1.1s' }}>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recent Notifications</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        {
                                            bg: 'bg-blue-50',
                                            border: 'border-blue-500',
                                            dot: 'bg-blue-500',
                                            title: 'Payment Received',
                                            desc: '₦25,000 from Jane Smith',
                                            time: '2 hours ago',
                                        },
                                        {
                                            bg: 'bg-green-50',
                                            border: 'border-green-500',
                                            dot: 'bg-green-500',
                                            title: 'Goal Achievement',
                                            desc: '75% progress on Laptop fund!',
                                            time: 'Yesterday',
                                        },
                                        {
                                            bg: 'bg-yellow-50',
                                            border: 'border-yellow-500',
                                            dot: 'bg-yellow-500',
                                            title: 'Bill Reminder',
                                            desc: 'Internet bill due in 3 days',
                                            time: '2 days ago',
                                        },
                                    ].map((notif, index) => (
                                        <div key={index} className={`flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 ${notif.bg} rounded-xl border-l-4 ${notif.border}`}>
                                            <div className={`w-2 h-2 ${notif.dot} rounded-full mt-2 animate-pulse flex-shrink-0`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-gray-900">{notif.title}</p>
                                                <p className="text-xs text-gray-600">{notif.desc}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 sm:mt-4 text-[#1A2B4D] text-xs sm:text-sm font-medium hover:text-opacity-80 transition-colors">
                                    View All Notifications
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
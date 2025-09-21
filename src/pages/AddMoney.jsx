import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Send,
    PlusCircle,
    CreditCard,
    Receipt,
    Target,
    Clock,
    Download,
    Headphones,
    Settings,
    Menu,
    Search,
    Bell,
    ChevronDown,
    Building,
    Smartphone,
    QrCode,
    Plus,
    ShieldCheck,
    Check,
    ArrowRight,
} from 'lucide-react';
import Header from '../layouts/Header';
import Mobile from '../layouts/Mobile';
import Sidebar from '../layouts/Sidebar';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/UseAuth';
import formatMoney from '../utils/formatMoney';
import axiosInstance from '../api/axiosInstance';
import generateRef from '../utils/generateRef';
import formatDate from '../utils/formatDate';


// Debounce utility to delay API calls
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const AddMoney = () => {
    const { showAlert } = useAlert();
    const [selectedMethod, setSelectedMethod] = useState('bank_transfer');
    const [amount, setAmount] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [summary, setSummary] = useState({
        amount: '₦0.00',
        fee: '₦0.00',
        processingTime: 'Instant',
        total: '₦0.00',
    });
    const [isPaymentDetailsFetched, setIsPaymentDetailsFetched] = useState(false);
    const hasFetchedMethods = useRef(false);
    const inputRef = useRef(null);
    const amountSectionRef = useRef(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isTransLoading, setIsTransLoading] = useState(false);

    useEffect(() => {
        if (hasFetchedMethods.current) return;
        hasFetchedMethods.current = true;
        getPaymentMethod();
        getRecentTransaction();



    }, []);

    function getPaymentMethod() {
        setIsLoading(true);
        axiosInstance
            .post('/getpaymentmethod', { type: 'get' })
            .then((response) => {
                if (response.data.code === 200) {
                    setPaymentMethods(response.data.data);
                } else {
                    showAlert('Failed to fetch payment methods', 'error');
                }
            })
            .catch((error) => {
                const errRes = error.response?.data || {};
                const message = errRes.message || 'Something went wrong. Please try again.';
                showAlert(message, 'error');
            })
            .finally(() => {
                setIsLoading(false);
            });

    }

    function getRecentTransaction() {
        setIsTransLoading(true);
        axiosInstance.post("/add-money/transactions", { type: "get" })
            .then(response => {
                const res = response.data;
                const { code, message, data } = res;

                if (code == 200) {
                    setRecentTransactions(data);
                } else {
                    showAlert(message || 'Failed to fetch transactions');

                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || 'Something went wrong. Please try again.';
                showAlert(message, 'error');
            })
            .finally(() => {
                setIsTransLoading(false);
            });
    }

    // Debounced function to fetch payment details
    const fetchPaymentDetails = useRef(
        debounce((amount, method) => {
            const parsedAmount = parseInt(amount, 10) || 0;
            if (parsedAmount < 100) {
                setIsPaymentDetailsFetched(false);
                setSummary({
                    amount: formatMoney(parsedAmount / 100),
                    fee: '₦0.00',
                    processingTime: 'Instant',
                    total: formatMoney(parsedAmount / 100),
                });
                return;
            }

            setIsLoading(true);
            axiosInstance
                .post('/getpaymentdetails', { amount: parsedAmount, methodType: method })
                .then((response) => {
                    if (response.data.code === 200) {
                        const result = response.data.data;
                        setSummary({
                            amount: result.formatted.amount,
                            fee: result.formatted.fee,
                            processingTime: result.processingTime,
                            total: result.formatted.total,
                        });
                        setIsPaymentDetailsFetched(true);
                    } else {
                        showAlert('Failed to fetch payment details', 'error');
                        setIsPaymentDetailsFetched(false);
                    }
                })
                .catch((error) => {
                    const errRes = error.response?.data || {};
                    const message = errRes.message || 'Something went wrong. Please try again.';
                    showAlert(message, 'error');
                    setIsPaymentDetailsFetched(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 500)
    ).current;

    // Trigger debounced fetch when amount or selectedMethod changes
    useEffect(() => {
        fetchPaymentDetails(amount, selectedMethod);
    }, [amount, selectedMethod]);

    const handleAmountInput = (e) => {
        setSelectedAmount(null);
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value === '') {
            setAmount('');
            return;
        }

        const numericValue = parseInt(value, 10) || 0;
        const formattedValue = (numericValue / 100).toFixed(2);
        setAmount(formattedValue);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.selectionStart = inputRef.current.selectionEnd = formattedValue.length;
            }
        }, 0);
    };

    const handleAddMoney = () => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount <= 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }
        if (parsedAmount < 100) {
            showAlert('Minimum amount is ₦100', 'error');
            return;
        }
        if (parsedAmount > 1000000) {
            showAlert('Maximum amount is ₦1,000,000', 'error');
            return;
        }
        setShowModal('confirm');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeModal = () => {
        setShowModal(null);
    };

    const processAddMoney = (amount, methodType) => {
        setShowModal('processing');
        const transactionRef = generateRef();
        axiosInstance.post('/add-money/create-transaction', {
            amount: parseFloat(amount),
            methodType,
            transactionRef,
        })
            .then(pendingResponse => {
                if (pendingResponse.data.code !== 200) {
                    showAlert('Failed to initiate transaction', 'error');
                    setShowModal(null);
                    return;
                }


                axiosInstance.post("/add-money/update-transaction", {
                    ref: pendingResponse.data.data.ref
                })
                    .then(updateResponse => {
                        if (updateResponse.data.code == 200) {
                            setShowModal('success');
                            getRecentTransaction();
                            showAlert(updateResponse.data.message || 'Payment Successful', 'success');
                        } else {
                            showAlert('Payment Failed', 'error');
                            setShowModal(null);
                        }
                    })
                    .catch(error => {
                        const errRes = error.response?.data || {};
                        const message = errRes.message || 'Something went wrong. Please try again.';
                        showAlert(message, 'error');
                        setShowModal(null);
                    })

            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || 'Something went wrong. Please try again.';
                showAlert(message, 'error');
                setShowModal(null);
            })
    };

    const methodNames = {
        bank_transfer: 'Bank Transfer',
        debit_card: 'Debit Card',
        ussd: 'USSD',
        qr_code: 'QR Code Payment',
    };

    const methodIcons = {
        bank_transfer: Building,
        debit_card: CreditCard,
        ussd: Smartphone,
        qr_code: QrCode,
    };

    const methodGradients = {
        bank_transfer: 'gradient-blue',
        debit_card: 'gradient-green',
        ussd: 'gradient-orange',
        qr_code: 'from-purple-500 to-pink-500',
    };

    // Handle payment method selection with scroll
    const handleMethodSelect = (methodType) => {
        setSelectedMethod(methodType);
        if (amountSectionRef.current) {
            amountSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const methodIcons2 = {
        bank_transfer: { icon: Plus, bg: "bg-green-50", border: "border-green-100", color: "text-green-600" },
        debit_card: { icon: CreditCard, bg: "bg-blue-50", border: "border-blue-100", color: "text-blue-600" },
        ussd: { icon: Smartphone, bg: "bg-yellow-50", border: "border-yellow-100", color: "text-yellow-600" },
    };



    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Mobile toggleSidebar={toggleSidebar} />
            <div className="lg:ml-64 min-h-screen main-content">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            {/* Payment Methods */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-slide-up">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                                    Select Payment Method
                                </h3>

                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-12 h-12 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {paymentMethods.map((method) => {
                                            const Icon = methodIcons[method.type] || Building;
                                            return (
                                                <div
                                                    key={method.type}
                                                    onClick={() => handleMethodSelect(method.type)}
                                                    className={`payment-method p-4 sm:p-5 rounded-xl cursor-pointer ${selectedMethod === method.type ? 'selected' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div
                                                            className={`w-12 h-12 bg-gradient-to-br ${methodGradients[method.type]} rounded-xl flex items-center justify-center`}
                                                        >
                                                            <Icon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900 text-base">
                                                                {method.name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">{method.desc}</p>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <span
                                                                    className={`text-xs ${method.fee.includes('Free')
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : method.fee.includes('1.5%')
                                                                            ? 'bg-blue-100 text-blue-700'
                                                                            : 'bg-yellow-100 text-yellow-700'
                                                                        } px-2 py-1 rounded-full`}
                                                                >
                                                                    {method.fee}
                                                                </span>
                                                                <span className="text-xs text-gray-500">• {method.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`payment-radio mt-2 ${selectedMethod === method.type ? 'selected' : ''
                                                            }`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Amount Selection */}
                            <div ref={amountSectionRef} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-slide-up">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Enter Amount</h3>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Add (in Naira)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl font-semibold">₦</span>
                                        <input
                                            type="text"
                                            value={amount}
                                            onChange={handleAmountInput}
                                            ref={inputRef}
                                            className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#20C997] focus:border-[#20C997] text-2xl font-bold placeholder-gray-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <p className="text-sm font-medium text-gray-700 mb-4">Quick Select</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[1000, 5000, 10000, 20000, 50000, 100000].map((amt) => (
                                            <button
                                                key={amt}
                                                className={`amount-option py-3 px-4 rounded-xl text-sm font-semibold transition-all ${selectedAmount === amt ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setSelectedAmount(amt);
                                                    setAmount((amt).toFixed(2));
                                                }}
                                            >
                                                {formatMoney(amt)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddMoney}
                                    disabled={!isPaymentDetailsFetched}
                                    className={`w-full gradient-primary cursor-pointer text-white py-4 px-6 rounded-xl font-semibold text-lg transition-opacity flex items-center justify-center space-x-2 ${!isPaymentDetailsFetched ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                        }`}
                                >
                                    <span>Add Money Now</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6 sm:space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm p-6 animate-slide-up">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Summary</h3>
                                {isLoading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-12 h-12 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-semibold text-lg">{summary.amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Processing Fee:</span>
                                            <span className="font-semibold">{summary.fee}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Processing Time:</span>
                                            <span className="font-semibold text-green-600">{summary.processingTime}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                                                <span className="text-xl font-bold text-[#20C997]">{summary.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6 animate-slide-up">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Add Money</h3>
                                <div className="space-y-4">
                                    {isTransLoading ? (
                                        <div className="flex justify-center items-center">
                                            <div className="w-12 h-12 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        recentTransactions.map((transaction, index) => {
                                            const { icon: Icon, bg, border, color } =
                                                methodIcons2[transaction.payment_method] || methodIcons2.bank_transfer;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`flex items-center justify-between p-3 ${bg} rounded-xl ${border}`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                                                            <Icon className={`w-4 h-4 ${color}`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                {transaction.payment_method.replace("_", " ")}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {formatDate(transaction.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-sm font-bold ${color}`}>
                                                        +{formatMoney(transaction.amount)}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <a href="#" className="block text-center mt-4 text-[#20C997] text-sm font-medium hover:text-opacity-80 transition-colors">
                                    View All Transactions
                                </a>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 animate-slide-up">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Safe & Secure</h3>
                                </div>
                                <div className="space-y-3 text-sm text-gray-700">
                                    {['256-bit SSL encryption', 'PCI DSS compliant', '24/7 fraud monitoring'].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 bg-white text-[#20C997] py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                                    <Headphones className="w-4 h-4" />
                                    <span>Contact Support</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            {showModal === 'confirm' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Add Money</h3>
                            <p className="text-gray-600">Review your transaction details</p>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <span className="text-gray-600">Amount</span>
                                <span className="font-bold text-lg text-gray-900">{summary.amount}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-semibold text-gray-900">{methodNames[selectedMethod]}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <span className="text-gray-600">Processing Fee</span>
                                <span className="font-semibold text-gray-900">{summary.fee}</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center p-4 gradient-primary text-white rounded-xl">
                                    <span className="font-semibold">Total Amount</span>
                                    <span className="font-bold text-xl">{summary.total}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => processAddMoney(parseFloat(amount), selectedMethod)}
                                className="flex-1 gradient-primary text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal === 'processing' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 border-4 border-[#20C997] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Payment</h3>
                        <p className="text-gray-600">Please wait while we process your request...</p>
                    </div>
                </div>
            )}

            {showModal === 'success' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Money Added Successfully!</h3>
                        <p className="text-gray-600 mb-6">{summary.amount} has been added to your wallet</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    closeModal();
                                    setAmount('');
                                    setSelectedAmount(null);
                                    setIsPaymentDetailsFetched(false);
                                }}
                                className="w-full gradient-primary text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                            >
                                Add More Money
                            </button>
                            <button
                                onClick={() => (window.location.href = 'dashboard.html')}
                                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMoney;
import React, { useState, useEffect } from 'react';
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
    Bell,
    ChevronDown,
    ArrowLeft,
    Users,
    Building2,
    Zap,
    ShieldCheck,
    CheckCircle,
    XCircle,
    Info,
    MoreHorizontal,
    Share2,
    Menu
} from 'lucide-react';
import '../styles/transfer.css';


import Header from '../layouts/Header';
import Mobile from '../layouts/Mobile';
import Sidebar from '../layouts/Sidebar';
import { decryptData } from '../utils/crypto';
import { Cookies } from 'react-cookie';
import axiosInstance from '../api/axiosInstance';
import { useAlert } from '../context/AlertContext';

const Transfer = () => {
    const { showAlert } = useAlert();
    const [selectedTransferType, setSelectedTransferType] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [paynixAmount, setPaynixAmount] = useState('');
    const [externalAmount, setExternalAmount] = useState('');
    const [externalAccount, setExternalAccount] = useState('');
    const [externalName, setExternalName] = useState('');
    const [confirmationDetails, setConfirmationDetails] = useState(null);



    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const selectTransferType = (type) => {
        setSelectedTransferType(type);
        setCurrentStep(2);
        setTimeout(() => {
            document.getElementById('transfer-form')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    };

    const selectContact = (name, accountNumber) => {
        document.getElementById('paynix-recipient').value = accountNumber;
        showAlert(`Selected contact: ${name}`, 'success');
    };

    const selectBank = (bankName, bankCode) => {
        setSelectedBank(bankCode);
        showAlert(`Selected bank: ${bankName}`, 'success');
    };

    const handlePaynixAmountChange = (e) => {
        const amount = parseFloat(e.target.value) || 0;
        setPaynixAmount(amount);
    };

    const handleExternalAmountChange = (e) => {
        const amount = parseFloat(e.target.value) || 0;
        setExternalAmount(amount);
    };

    const handleExternalAccountBlur = () => {
        if (externalAccount.length === 10 && selectedBank) {
            setTimeout(() => {
                const mockNames = ['ADEBAYO JOHN SMITH', 'WILLIAMS SARAH JONES', 'OKAFOR MICHAEL BROWN', 'HASSAN FATIMA ALI'];
                const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
                setExternalName(randomName);
                showAlert('Account name verified', 'success');
            }, 1000);
        }
    };

    const proceedPaynixTransfer = () => {
        const recipient = document.getElementById('paynix-recipient').value;
        const description = document.getElementById('paynix-description').value;

        if (!recipient || !paynixAmount) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        if (paynixAmount <= 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }

        if (paynixAmount > 847250) {
            showAlert('Insufficient balance', 'error');
            return;
        }

        setConfirmationDetails({
            type: 'paynix',
            recipient,
            amount: paynixAmount,
            description,
            fee: 0
        });
        setCurrentStep(3);
    };

    const proceedExternalTransfer = () => {
        const narration = document.getElementById('external-narration').value;

        if (!externalAccount || !externalAmount || !selectedBank || !externalName) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        if (externalAmount <= 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }

        if (externalAmount + 25 > 847250) {
            showAlert('Insufficient balance (including fees)', 'error');
            return;
        }

        setConfirmationDetails({
            type: 'external',
            accountNumber: externalAccount,
            amount: externalAmount,
            accountName: externalName,
            narration,
            bank: selectedBank,
            fee: 25
        });
        setCurrentStep(3);
    };

    const closeConfirmationModal = () => {
        setConfirmationDetails(null);
        setCurrentStep(2);
    };

    const executeTransfer = () => {
        setConfirmationDetails(null);
        showAlert('Processing transfer...', 'info');
        setTimeout(() => {
            showSuccessModal();
        }, 2000);
    };

    const showSuccessModal = () => {
        showAlert('Transfer completed successfully!', 'success');
        document.getElementById('success-modal').classList.remove('hidden');
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(1);
            setSelectedTransferType('');
            setSelectedBank('');
            setPaynixAmount('');
            setExternalAmount('');
            setExternalName('');
        } else {
            showAlert('Going back to dashboard...', 'info');
        }
    };

    const downloadReceipt = () => {
        showAlert('Receipt downloaded successfully', 'success');
    };

    const shareReceipt = () => {
        showAlert('Share options opened', 'info');
    };

    const goToTransactions = () => {
        document.getElementById('success-modal').classList.add('hidden');
        showAlert('Navigating to transactions...', 'info');
    };


    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Mobile toggleSidebar={toggleSidebar} />
            <div className="lg:ml-64 min-h-screen main-content">
                <Header />

                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    {/* Progress Steps */}
                    <div className="mb-8 animate-slide-up">
                        <div className="flex items-center justify-center space-x-4">
                            {[1, 2, 3].map((step) => (
                                <React.Fragment key={step}>
                                    <div
                                        className={`step-indicator flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${step < currentStep ? 'completed bg-[#20C997]' : step === currentStep ? 'active bg-[#1A2B4D] text-white' : 'bg-gray-200'
                                            }`}
                                    >
                                        {step}
                                    </div>
                                    {step < 3 && <div className="w-16 h-1 bg-gray-200 rounded"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                            <span>Choose Type</span>
                            <span>Enter Details</span>
                            <span>Confirm</span>
                        </div>
                    </div>

                    {/* Transfer Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {/* Paynix Transfer */}
                        <div
                            className={`transfer-option bg-white rounded-2xl p-6 border-2 border-gray-200 ${selectedTransferType === 'paynix' ? 'active' : ''}`}
                            onClick={() => selectTransferType('paynix')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                    <div className={`w-3 h-3 bg-[#1A2B4D] rounded-full ${selectedTransferType === 'paynix' ? '' : 'hidden'}`} id="paynix-check"></div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer to Paynix Account</h3>
                            <p className="text-gray-600 text-sm mb-4">Send money instantly to other Paynix users using their account number or phone number</p>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1 text-green-600">
                                    <Zap className="w-4 h-4" />
                                    <span>Instant</span>
                                </div>
                                <div className="flex items-center space-x-1 text-blue-600">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Free</span>
                                </div>
                            </div>
                        </div>

                        {/* External Bank Transfer */}
                        <div
                            className={`transfer-option bg-white rounded-2xl p-6 border-2 border-gray-200 ${selectedTransferType === 'external' ? 'active' : ''}`}
                            onClick={() => selectTransferType('external')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                    <div className={`w-3 h-3 bg-[#1A2B4D] rounded-full ${selectedTransferType === 'external' ? '' : 'hidden'}`} id="external-check"></div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer to Other Banks</h3>
                            <p className="text-gray-600 text-sm mb-4">Send money to accounts in other Nigerian banks using account number</p>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1 text-orange-600">
                                    <Clock className="w-4 h-4" />
                                    <span>5-10 mins</span>
                                </div>
                                <div className="flex items-center space-x-1 text-purple-600">
                                    <CreditCard className="w-4 h-4" />
                                    <span>₦25 fee</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transfer Form */}
                    <div id="transfer-form" className={`${selectedTransferType ? '' : 'hidden'}`}>
                        {/* Paynix Transfer Form */}
                        <div id="paynix-form" className={`${selectedTransferType === 'paynix' ? '' : 'hidden'}`}>
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Transfer to Paynix Account</h3>
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Contacts</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { name: 'Jane Smith', account: '2345678901', color: 'pink', initials: 'JS' },
                                            { name: 'Mike Johnson', account: '3456789012', color: 'blue', initials: 'MJ' }
                                        ].map((contact) => (
                                            <div
                                                key={contact.account}
                                                className="recent-contact flex items-center space-x-3 p-3 border border-gray-200 rounded-xl"
                                                onClick={() => selectContact(contact.name, contact.account)}
                                            >
                                                <div className={`w-10 h-10 bg-${contact.color}-100 rounded-full flex items-center justify-center`}>
                                                    <span className={`text-${contact.color}-600 font-semibold text-sm`}>{contact.initials}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
                                                    <p className="text-gray-600 text-xs">{contact.account}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number / Phone</label>
                                        <input
                                            type="text"
                                            id="paynix-recipient"
                                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                                            placeholder="Enter account number or phone"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
                                        <input
                                            type="number"
                                            id="paynix-amount"
                                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                                            placeholder="0.00"
                                            onChange={handlePaynixAmountChange}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                                    <textarea
                                        id="paynix-description"
                                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none h-24 resize-none"
                                        placeholder="What's this transfer for?"
                                    ></textarea>
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Transfer Amount:</span>
                                        <span className="font-semibold" id="paynix-transfer-amount">
                                            ₦{(paynixAmount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Transfer Fee:</span>
                                        <span className="font-semibold text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                                        <span className="font-semibold text-gray-900">Total:</span>
                                        <span className="font-bold text-[#1A2B4D]" id="paynix-total">
                                            ₦{(paynixAmount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8 flex space-x-4">
                                    <button
                                        onClick={goBack}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={proceedPaynixTransfer}
                                        className="flex-1 gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* External Bank Transfer Form */}
                        <div id="external-form" className={`${selectedTransferType === 'external' ? '' : 'hidden'}`}>
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Transfer to External Bank</h3>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Bank</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {[
                                            { name: 'GTBank', code: 'gtb', color: 'orange', initials: 'GTB' },
                                            { name: 'Access Bank', code: 'access', color: 'green', initials: 'ACC' },
                                            { name: 'First Bank', code: 'firstbank', color: 'blue', initials: 'FBN' },
                                            { name: 'Zenith Bank', code: 'zenith', color: 'red', initials: 'ZEN' },
                                            { name: 'UBA', code: 'uba', color: 'purple', initials: 'UBA' },
                                            { name: 'Others', code: 'others', color: 'gray', icon: <MoreHorizontal className="w-4 h-4 text-gray-600" /> }
                                        ].map((bank) => (
                                            <div
                                                key={bank.code}
                                                className={`bank-option border border-gray-200 rounded-xl p-3 flex items-center space-x-3 ${selectedBank === bank.code ? 'selected' : ''}`}
                                                onClick={() => selectBank(bank.name, bank.code)}
                                            >
                                                <div className={`w-8 h-8 bg-${bank.color}-100 rounded-full flex items-center justify-center`}>
                                                    {bank.initials ? (
                                                        <span className={`text-${bank.color}-600 font-bold text-xs`}>{bank.initials}</span>
                                                    ) : (
                                                        bank.icon
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{bank.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                                        <input
                                            type="text"
                                            id="external-account"
                                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                                            placeholder="0123456789"
                                            value={externalAccount}
                                            onChange={(e) => setExternalAccount(e.target.value)}
                                            onBlur={handleExternalAccountBlur}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
                                        <input
                                            type="number"
                                            id="external-amount"
                                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                                            placeholder="0.00"
                                            onChange={handleExternalAmountChange}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                                    <input
                                        type="text"
                                        id="external-name"
                                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none bg-gray-50"
                                        placeholder="Account name will appear here"
                                        value={externalName}
                                        readOnly
                                    />
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Narration</label>
                                    <input
                                        type="text"
                                        id="external-narration"
                                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                                        placeholder="Purpose of transfer"
                                    />
                                </div>
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Transfer Amount:</span>
                                        <span className="font-semibold" id="external-transfer-amount">
                                            ₦{(externalAmount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Transfer Fee:</span>
                                        <span className="font-semibold text-orange-600">₦25.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                                        <span className="font-semibold text-gray-900">Total:</span>
                                        <span className="font-bold text-[#1A2B4D]" id="external-total">
                                            ₦{(externalAmount + 25 || 25).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8 flex space-x-4">
                                    <button
                                        onClick={goBack}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={proceedExternalTransfer}
                                        className="flex-1 gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Modal */}
                    <div id="confirmation-modal" className={`${confirmationDetails ? '' : 'hidden'} fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4`}>
                        <div className="bg-white rounded-2xl max-w-md w-full p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Transfer</h3>
                                <p className="text-gray-600">Please review your transfer details</p>
                            </div>
                            <div id="confirmation-details" className="space-y-4 mb-6">
                                {confirmationDetails?.type === 'paynix' ? (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">To:</span>
                                            <span className="font-semibold">{confirmationDetails.recipient}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-semibold">₦{confirmationDetails.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Fee:</span>
                                            <span className="font-semibold text-green-600">Free</span>
                                        </div>
                                        {confirmationDetails.description && (
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Description:</span>
                                                <span className="font-semibold">{confirmationDetails.description}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                                            <span className="font-bold text-gray-900">Total:</span>
                                            <span className="font-bold text-[#1A2B4D]">
                                                ₦{confirmationDetails.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Bank:</span>
                                            <span className="font-semibold">{confirmationDetails?.bank?.toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Account:</span>
                                            <span className="font-semibold">{confirmationDetails?.accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-semibold">{confirmationDetails?.accountName}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-semibold">₦{confirmationDetails?.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Fee:</span>
                                            <span className="font-semibold text-orange-600">₦{confirmationDetails?.fee.toFixed(2)}</span>
                                        </div>
                                        {confirmationDetails?.narration && (
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">Narration:</span>
                                                <span className="font-semibold">{confirmationDetails.narration}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                                            <span className="font-bold text-gray-900">Total:</span>
                                            <span className="font-bold text-[#1A2B4D]">
                                                ₦{(confirmationDetails?.amount + confirmationDetails?.fee).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={closeConfirmationModal}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeTransfer}
                                    className="flex-1 gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Send Money
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Success Modal */}
                    <div id="success-modal" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
                            <p className="text-gray-600 mb-6" id="success-message">
                                {selectedTransferType === 'paynix'
                                    ? 'Your money has been sent to the Paynix account instantly!'
                                    : 'Your transfer has been sent and will be processed within 5-10 minutes.'}
                            </p>
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={downloadReceipt}
                                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download Receipt</span>
                                </button>
                                <button
                                    onClick={shareReceipt}
                                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span>Share Receipt</span>
                                </button>
                            </div>
                            <button
                                onClick={goToTransactions}
                                className="w-full gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                            >
                                View Transactions
                            </button>
                        </div>
                    </div>
                </main>
            </div>


        </div>
    );
};

export default Transfer;
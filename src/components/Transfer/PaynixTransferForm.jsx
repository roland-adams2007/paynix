// PaynixTransferForm.jsx
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import axiosInstance from '../../api/axiosInstance';
import { Loader2 } from 'lucide-react';
import formatMoney from '../../utils/formatMoney';
import { useGlobal } from '../../context/UseGlobal';

const PaynixTransferForm = ({ onProceed, onCancel }) => {
    const { showAlert } = useAlert();
    const { bankDetails } = useGlobal();
    const [recipient, setRecipient] = useState('');
    const [accountName, setAccountName] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const balance = bankDetails?.balance || 0;
    const maxAmount = 1000000;

    const selectContact = (name, accountNumber) => {
        setRecipient(accountNumber);
        setAccountName(name);
        setIsVerified(true);
        setErrorMessage('');
        showAlert(`Selected contact: ${name}`, 'success');
    };

    const handleRecipientChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setRecipient(value);
            setIsVerified(false);
            setAccountName('');
            setErrorMessage('');
        }
        if (value.length === 10) {
            verifyAccount(value);
        }
    };

    const verifyAccount = (accountno) => {
        if (accountno.length !== 10) {
            showAlert('Please enter a valid 10-digit account number or phone', 'error');
            setErrorMessage('Invalid account number or phone');
            return;
        }

        setIsVerifying(true);
        axiosInstance
            .post('/account/paynixuser', { accountno: accountno })
            .then((response) => {
                const res = response.data;
                const { code, message, data } = res;
                if (code === 200) {
                    setAccountName(data.name);
                    setIsVerified(true);
                    showAlert('Account verified successfully', 'success');
                    setErrorMessage('');
                } else {
                    showAlert('Account verification failed', 'error');
                    setIsVerified(false);
                    setErrorMessage('Account verification failed');
                }
            })
            .catch((error) => {
                const errRes = error.response?.data || {};
                const message = errRes.message || 'Something went wrong. Please try again.';
                showAlert(message, 'error');
                setIsVerified(false);
                setErrorMessage('Something went wrong. Please try again.');
            })
            .finally(() => {
                setIsVerifying(false);
            });
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        const parsedAmount = parseFloat(value) || 0;

        setAmount(value);

        if (parsedAmount > balance) {
            setErrorMessage('Insufficient balance');
        } else if (parsedAmount > maxAmount) {
            setErrorMessage('Amount exceeds maximum transfer limit of ₦1,000,000');
        } else {
            setErrorMessage('');
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const proceed = () => {
        const parsedAmount = parseFloat(amount) || 0;

        if (!recipient || parsedAmount <= 0 || !isVerified) {
            showAlert('Please verify the account and fill in all required fields', 'error');
            setErrorMessage('Please verify the account and fill in all required fields');
            return;
        }

        if (parsedAmount > balance) {
            setErrorMessage('Insufficient balance');
            return;
        }

        if (parsedAmount > maxAmount) {
            setErrorMessage('Amount exceeds maximum transfer limit of ₦1,000,000');
            return;
        }

        onProceed({
            type: 'paynix',
            recipient,
            amount: parsedAmount,
            description,
            accountName
        });
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Transfer to Paynix Account</h3>
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Balance</h4>
                    <p className="text-lg font-bold text-gray-900">
                        {formatMoney(balance)}
                    </p>
                </div>
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Contacts</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { name: 'Jane Smith', account: '2345678901', color: 'pink', initials: 'JS' },
                            { name: 'Mike Johnson', account: '3456789012', color: 'blue', initials: 'MJ' }
                        ].map((contact) => (
                            <div
                                key={contact.account}
                                className="recent-contact flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50"
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
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                id="paynix-recipient"
                                className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                                placeholder="Enter 10-digit account number or phone"
                                value={recipient}
                                onChange={handleRecipientChange}
                                maxLength={10}
                                disabled={isVerifying}
                            />
                        </div>
                        {accountName && (
                            <p className="mt-2 text-sm text-green-600">Verified: {accountName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
                        <input
                            type="number"
                            id="paynix-amount"
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                            placeholder="0.00"
                            value={amount}
                            onChange={handleAmountChange}
                            min="0"
                            step="0.01"
                        />
                        {errorMessage && (
                            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                    <textarea
                        id="paynix-description"
                        className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none h-24 resize-none"
                        placeholder="What's this transfer for?"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Transfer Amount:</span>
                        <span className="font-semibold" id="paynix-transfer-amount">
                            {formatMoney(parseFloat(amount) || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Transfer Fee:</span>
                        <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-[#1A2B4D]" id="paynix-total">
                            {formatMoney(parseFloat(amount) || 0)}
                        </span>
                    </div>
                </div>
                <div className="mt-8 flex space-x-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={proceed}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white ${isVerified && amount && parseFloat(amount) > 0 && parseFloat(amount) <= balance && parseFloat(amount) <= maxAmount && !isVerifying ? 'gradient-primary hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!isVerified || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || parseFloat(amount) > maxAmount || isVerifying}
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* Account verification loader */}
            {isVerifying && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            )}
        </>
    );
};

export default PaynixTransferForm;
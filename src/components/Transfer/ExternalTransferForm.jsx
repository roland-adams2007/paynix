import React, { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import formatMoney from '../../utils/formatMoney';

const ExternalTransferForm = ({ onProceed, onCancel }) => {
    const { showAlert } = useAlert();
    const [bank, setBank] = useState('');
    const [account, setAccount] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [narration, setNarration] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const selectBank = (bankName, bankCode) => {
        setBank(bankCode);
        showAlert(`Selected bank: ${bankName}`, 'success');
    };

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
        setName(''); // Reset name if account changes
    };

    const handleAmountChange = (e) => {
        setAmount(parseFloat(e.target.value) || 0);
    };

    const handleNarrationChange = (e) => {
        setNarration(e.target.value);
    };

    const handleAccountBlur = () => {
        if (account.length === 10 && bank) {
            setIsVerifying(true);
            setTimeout(() => {
                const mockNames = ['ADEBAYO JOHN SMITH', 'WILLIAMS SARAH JONES', 'OKAFOR MICHAEL BROWN', 'HASSAN FATIMA ALI'];
                const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
                setName(randomName);
                showAlert('Account name verified', 'success');
                setIsVerifying(false);
            }, 1000);
        }
    };

    const proceed = () => {
        if (!account || !amount || !bank || !name) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        if (amount <= 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }

        if (amount + 25 > 847250) {
            showAlert('Insufficient balance (including fees)', 'error');
            return;
        }

        onProceed({
            type: 'external',
            accountNumber: account,
            amount,
            accountName: name,
            narration,
            bank,
            fee: 25
        });
    };

    return (
        <>
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
                        ].map((bankOption) => (
                            <div
                                key={bankOption.code}
                                className={`bank-option border border-gray-200 rounded-xl p-3 flex items-center space-x-3 ${bank === bankOption.code ? 'selected' : ''}`}
                                onClick={() => selectBank(bankOption.name, bankOption.code)}
                            >
                                <div className={`w-8 h-8 bg-${bankOption.color}-100 rounded-full flex items-center justify-center`}>
                                    {bankOption.initials ? (
                                        <span className={`text-${bankOption.color}-600 font-bold text-xs`}>{bankOption.initials}</span>
                                    ) : (
                                        bankOption.icon
                                    )}
                                </div>
                                <span className="text-sm font-medium">{bankOption.name}</span>
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
                            value={account}
                            onChange={handleAccountChange}
                            onBlur={handleAccountBlur}
                            disabled={isVerifying}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₦)</label>
                        <input
                            type="number"
                            id="external-amount"
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none"
                            placeholder="0.00"
                            onChange={handleAmountChange}
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
                        value={name}
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
                        value={narration}
                        onChange={handleNarrationChange}
                    />
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Transfer Amount:</span>
                        <span className="font-semibold" id="external-transfer-amount">
                            ₦{(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Transfer Fee:</span>
                        <span className="font-semibold text-orange-600">₦25.00</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="font-bold text-[#1A2B4D]" id="external-total">
                            {formatMoney(((amount || 0) + 25))}
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
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white ${name && bank && amount > 0 && !isVerifying ? 'gradient-primary hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!name || !bank || amount <= 0 || isVerifying}
                    >
                        Continue
                    </button>
                </div>
            </div>
            {isVerifying && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            )}
        </>
    );
};

export default ExternalTransferForm;
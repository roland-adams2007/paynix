// PinModal.jsx (new component)
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import formatMoney from '../utils/formatMoney'; 

const PinModal = ({ onConfirm, onCancel, amount, recipientName }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const firstInput = document.getElementById('pin-0');
        if (firstInput) firstInput.focus();
    }, []);

    const handlePinChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value && index < 3) {
                const nextInput = document.getElementById(`pin-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handlePinKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                const newPin = [...pin];
                newPin[index - 1] = '';
                setPin(newPin);
            }
        }
    };

    const clearPin = () => {
        setPin(['', '', '', '']);
        const firstInput = document.getElementById('pin-0');
        if (firstInput) firstInput.focus();
    };

    const handleSubmit = async () => {
        const isPinComplete = pin.every(digit => digit !== '');
        if (!isPinComplete) {
            return;  // Parent can handle alert if needed
        }

        setIsProcessing(true);
        const pinValue = pin.join('');
        const success = await onConfirm(pinValue);
        if (!success) {
            clearPin();
        }
        setIsProcessing(false);
    };

    const isPinComplete = pin.every(digit => digit !== '');

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-3xl p-6 animate-slide-up-mobile sm:animate-slide-up transform transition-transform duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Enter PIN</h3>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isProcessing}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">Enter your 4-digit transaction PIN</p>
                    <p className="text-sm text-gray-500">
                        Transfer {formatMoney(amount)} to {recipientName}
                    </p>
                </div>

                {/* PIN Input */}
                <div className="flex justify-center space-x-4 mb-6">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handlePinChange(index, e.target.value)}
                            onKeyDown={(e) => handlePinKeyDown(index, e)}
                            className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                            disabled={isProcessing}
                        />
                    ))}
                </div>

                {/* Keypad for mobile */}
                <div className="grid grid-cols-3 gap-3 mb-6 sm:hidden">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, ''].map((num, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (num === '') return;
                                const emptyIndex = pin.findIndex(digit => digit === '');
                                if (emptyIndex !== -1) {
                                    handlePinChange(emptyIndex, num.toString());
                                }
                            }}
                            className={`h-12 rounded-xl font-semibold text-lg ${num === ''
                                ? 'invisible'
                                : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900'
                                } transition-colors`}
                            disabled={isProcessing || num === ''}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={clearPin}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        disabled={isProcessing}
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`flex-2 px-6 py-3 rounded-xl font-semibold text-white transition-colors ${isPinComplete && !isProcessing
                            ? 'gradient-primary hover:opacity-90'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!isPinComplete || isProcessing}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            'Confirm Transfer'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinModal;
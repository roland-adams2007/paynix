import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Monitor, X } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

function SettingSecurity() {
    const { showAlert } = useAlert();
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [currentPinStep, setCurrentPinStep] = useState(1);
    const [newPin, setNewPin] = useState('');
    const [pinInputs, setPinInputs] = useState(['', '', '', '']);

    const openPinModal = () => {
        setIsPinModalOpen(true);
        setCurrentPinStep(1);
        setPinInputs(['', '', '', '']);
    };

    const closePinModal = () => {
        setIsPinModalOpen(false);
        setCurrentPinStep(1);
        setPinInputs(['', '', '', '']);
        setNewPin('');
    };

    const nextPinStep = () => {
        const currentPin = pinInputs.join('');
        if (currentPin.length !== 4) {
            showAlert('Please enter a complete 4-digit PIN', 'error');
            return;
        }

        if (currentPinStep === 1) {
            setCurrentPinStep(2);
            setPinInputs(['', '', '', '']);
        } else if (currentPinStep === 2) {
            setNewPin(currentPin);
            setCurrentPinStep(3);
            setPinInputs(['', '', '', '']);
        }
    };

    const previousPinStep = () => {
        setCurrentPinStep(currentPinStep - 1);
        setPinInputs(['', '', '', '']);
    };

    const changePIN = () => {
        const currentPin = pinInputs.join('');
        if (currentPin.length !== 4) {
            showAlert('Please enter a complete 4-digit PIN', 'error');
            return;
        }

        if (newPin !== currentPin) {
            showAlert('PINs do not match. Please try again.', 'error');
            setCurrentPinStep(2);
            setPinInputs(['', '', '', '']);
            return;
        }

        showAlert('Transaction PIN changed successfully!', 'success');
        closePinModal();
    };

    const handlePinInput = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newInputs = [...pinInputs];
        newInputs[index] = value.slice(0, 1);
        setPinInputs(newInputs);

        if (value && index < 3) {
            document.querySelector(`#pin-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pinInputs[index] && index > 0) {
            document.querySelector(`#pin-input-${index - 1}`).focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        const newInputs = ['', '', '', ''];
        paste.split('').forEach((char, i) => {
            newInputs[i] = char;
        });
        setPinInputs(newInputs);
    };

    const handleSignOut = (device) => {
        showAlert(device === 'all' ? 'Signed out of all devices' : 'Device session ended', 'success');
    };

    useEffect(() => {
        if (isPinModalOpen) {
            document.querySelector('#pin-input-0')?.focus();
        }
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isPinModalOpen) {
                closePinModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isPinModalOpen]);

    return (
        <div className="settings-section">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security & Privacy</h3>

                {/* Transaction PIN Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900">Transaction PIN</h4>
                            <p className="text-sm text-gray-600">Secure your transactions with a 4-digit PIN</p>
                        </div>
                        <button
                            onClick={openPinModal}
                            className="bg-[#20C997] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Change PIN
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">PIN is active and secure</span>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900">Active Sessions</h4>
                            <p className="text-sm text-gray-600">Manage your logged-in devices</p>
                        </div>
                        <button
                            onClick={() => handleSignOut('all')}
                            className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                        >
                            Sign Out All Devices
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Smartphone className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">iPhone 14 Pro</p>
                                    <p className="text-xs text-gray-600">Lagos, Nigeria • Current session</p>
                                </div>
                            </div>
                            <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Monitor className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                                    <p className="text-xs text-gray-600">Lagos, Nigeria • 2 hours ago</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSignOut('single')}
                                className="text-red-600 text-xs font-medium hover:text-red-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PIN Change Modal */}
            {isPinModalOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-black/50 transition-opacity"></div>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Change Transaction PIN</h3>
                                <button onClick={closePinModal} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className={currentPinStep === 1 ? '' : 'hidden'}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Enter Current PIN</label>
                                    <div className="flex justify-center space-x-3 mb-4">
                                        {[0, 1, 2, 3].map((index) => (
                                            <input
                                                key={index}
                                                id={`pin-input-${index}`}
                                                type="password"
                                                maxLength="1"
                                                className={`pin-input ${pinInputs[index] ? 'filled' : ''}`}
                                                value={pinInputs[index]}
                                                onChange={(e) => handlePinInput(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">Enter your current 4-digit transaction PIN</p>
                                </div>
                                <button
                                    onClick={nextPinStep}
                                    className="w-full bg-[#1A2B4D] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>

                            <div className={currentPinStep === 2 ? '' : 'hidden'}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Enter New PIN</label>
                                    <div className="flex justify-center space-x-3 mb-4">
                                        {[0, 1, 2, 3].map((index) => (
                                            <input
                                                key={index}
                                                id={`pin-input-${index}`}
                                                type="password"
                                                maxLength="1"
                                                className={`pin-input ${pinInputs[index] ? 'filled' : ''}`}
                                                value={pinInputs[index]}
                                                onChange={(e) => handlePinInput(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">Choose a new 4-digit transaction PIN</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={previousPinStep}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={nextPinStep}
                                        className="flex-1 bg-[#1A2B4D] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>

                            <div className={currentPinStep === 3 ? '' : 'hidden'}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Confirm New PIN</label>
                                    <div className="flex justify-center space-x-3 mb-4">
                                        {[0, 1, 2, 3].map((index) => (
                                            <input
                                                key={index}
                                                id={`pin-input-${index}`}
                                                type="password"
                                                maxLength="1"
                                                className={`pin-input ${pinInputs[index] ? 'filled' : ''}`}
                                                value={pinInputs[index]}
                                                onChange={(e) => handlePinInput(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">Re-enter your new PIN to confirm</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={previousPinStep}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={changePIN}
                                        className="flex-1 bg-[#20C997] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                                    >
                                        Change PIN
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingSecurity;
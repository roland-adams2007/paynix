import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Smartphone, Monitor, X } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import axiosInstance from '../../api/axiosInstance';

function SettingSecurity() {
    const { showAlert } = useAlert();
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [currentPinStep, setCurrentPinStep] = useState(1);
    const [newPin, setNewPin] = useState('');
    const [pinInputs, setPinInputs] = useState(['', '', '', '']);
    const fetchRef = useRef(false);
    const [isChecking, setIsChecking] = useState(false);
    const [pinExist, setPinExist] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (fetchRef.current) return;
        fetchRef.current = true;
        checkIfPinExist();
    }, []);

    function checkIfPinExist() {
        setIsChecking(true);
        axiosInstance
            .post('/account/checkpin', { type: 'me' })
            .then(response => {
                const res = response.data;
                setPinExist(res.data || false);
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                showAlert(errRes.message || 'Failed to check PIN status.', 'error');
            })
            .finally(() => {
                setIsChecking(false);
            });
    }

    const openPinModal = () => {
        setIsPinModalOpen(true);
        setCurrentPinStep(pinExist ? 1 : 2);
        setPinInputs(['', '', '', '']);
    };

    const closePinModal = () => {
        setIsPinModalOpen(false);
        setCurrentPinStep(pinExist ? 1 : 2);
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
            setIsChecking(true);
            axiosInstance
                .post('/account/checkoldpin', { oldPin: currentPin })
                .then(response => {
                    const res = response.data;
                    if (res?.code === 200) {
                        setCurrentPinStep(2);
                        setPinInputs(['', '', '', '']);
                    } else {
                        showAlert(res?.message || 'Invalid PIN. Please try again.', 'error');
                    }
                })
                .catch(error => {
                    const errRes = error.response?.data || {};
                    showAlert(errRes.message || 'Failed to verify PIN.', 'error');
                })
                .finally(() => {
                    setIsChecking(false);
                });
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

        setIsSubmitting(true);
        const endpoint = '/account/transactionpin';
        const payload = pinExist ? { oldPin: newPin, newPin: currentPin } : { newPin: currentPin };

        axiosInstance
            .post(endpoint, payload)
            .then(response => {
                const res = response.data;
                if (res?.code === 200) {
                    showAlert(res.message || 'Transaction PIN changed successfully!', 'success');
                    setPinExist(true);
                    closePinModal();
                } else {
                    showAlert(res?.message || 'Failed to change PIN.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                showAlert(errRes.message || 'Failed to change PIN.', 'error');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handlePinInput = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newInputs = [...pinInputs];
        newInputs[index] = value.slice(0, 1);
        setPinInputs(newInputs);

        // Move focus to next input if current is filled
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Use useEffect to trigger nextPinStep when all inputs are filled
    useEffect(() => {
        if (pinInputs.every(input => input !== '')) {
            nextPinStep();
        }
    }, [pinInputs]);

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            const newInputs = [...pinInputs];
            if (pinInputs[index]) {
                newInputs[index] = '';
                setPinInputs(newInputs);
            } else if (index > 0) {
                newInputs[index - 1] = '';
                setPinInputs(newInputs);
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'Enter' && pinInputs.every(input => input !== '')) {
            nextPinStep();
        }
    };

    const handlePaste = e => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        const newInputs = ['', '', '', ''];
        paste.split('').forEach((char, i) => {
            if (i < 4) {
                newInputs[i] = char;
            }
        });
        setPinInputs(newInputs);
    };

    const handleSignOut = device => {
        showAlert(device === 'all' ? 'Signed out of all devices' : 'Device session ended', 'success');
    };

    useEffect(() => {
        if (isPinModalOpen) {
            inputRefs.current[0]?.focus();
        }
        const handleEscape = e => {
            if (e.key === 'Escape' && isPinModalOpen) {
                closePinModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isPinModalOpen]);

    const renderPinInputs = step => (
        <div className={currentPinStep === step ? '' : 'hidden'}>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    {step === 1 ? 'Enter Current PIN' : step === 2 ? 'Enter New PIN' : 'Confirm New PIN'}
                </label>
                <div className="flex justify-center space-x-3 mb-4">
                    {[0, 1, 2, 3].map(index => (
                        <input
                            key={`${step}-${index}`}
                            id={`pin-input-${step}-${index}`}
                            type="password"
                            maxLength="1"
                            className={`pin-input ${pinInputs[index] ? 'filled' : ''}`}
                            value={pinInputs[index]}
                            onChange={e => handlePinInput(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            ref={el => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500 text-center">
                    {step === 1
                        ? 'Enter your current 4-digit transaction PIN'
                        : step === 2
                            ? 'Choose a new 4-digit transaction PIN'
                            : 'Re-enter your new PIN to confirm'}
                </p>
            </div>
            {step === 1 ? (
                <button
                    disabled={isChecking}
                    onClick={nextPinStep}
                    className={`w-full bg-[#1A2B4D] text-white py-3 px-4 rounded-lg font-medium transition-colors ${isChecking ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
                        }`}
                >
                    {isChecking ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Checking...
                        </div>
                    ) : (
                        'Continue'
                    )}
                </button>
            ) : (
                <div className="flex space-x-3">
                    <button
                        onClick={previousPinStep}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={step === 2 ? nextPinStep : changePIN}
                        disabled={step === 3 && isSubmitting}
                        className={`flex-1 bg-${step === 2 ? '[#1A2B4D]' : '[#20C997]'} text-white py-3 px-4 rounded-lg font-medium transition-colors ${step === 3 && isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
                            }`}
                    >
                        {step === 3 && isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Processing...
                            </div>
                        ) : step === 2 ? (
                            'Continue'
                        ) : (
                            'Change PIN'
                        )}
                    </button>
                </div>
            )}
        </div>
    );

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
                            disabled={isChecking}
                            className={`flex items-center justify-center bg-[#20C997] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isChecking ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
                                }`}
                        >
                            {isChecking ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Checking...
                                </div>
                            ) : pinExist ? (
                                'Change Pin'
                            ) : (
                                'Set Pin'
                            )}
                        </button>
                    </div>

                    {pinExist ? (
                        <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">PIN is active and secure</span>
                        </div>
                    ) : (
                        !isChecking && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">No PIN set yet</span>
                            </div>
                        )
                    )}
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
                                <h3 className="text-xl font-bold text-gray-900">{pinExist ? 'Change' : 'Set'} Transaction PIN</h3>
                                <button onClick={closePinModal} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {renderPinInputs(currentPinStep)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SettingSecurity;
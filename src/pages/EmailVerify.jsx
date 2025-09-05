import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { decryptData, encryptData } from '../utils/crypto';
import { useCookies } from "react-cookie";

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const inputVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2, transition: { duration: 0.2 } },
    focus: { scale: 1.02, y: -2, transition: { duration: 0.2 } },
};

const buttonVariants = {
    rest: { scale: 1, boxShadow: '0 0 0 rgba(16,185,129,0.3)' },
    hover: {
        scale: 1.05,
        boxShadow: '0 10px 25px rgba(16,185,129,0.3)',
        transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
};

const shapeVariants = {
    animate: {
        y: [-20, 0, -20],
        rotate: [0, 180, 0],
        transition: {
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut'
        }
    }
};

const getDeviceId = () => {
    const existing = localStorage.getItem("device_id");
    if (existing) return existing;

    const newId = crypto.randomUUID();
    localStorage.setItem("device_id", newId);
    return newId;
};


const EmailVerify = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResendLoading, setIsResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [, setCookie] = useCookies(["userData", "tokenData"]);

    // Load email, token, and countdown from sessionStorage
    useEffect(() => {
        const encryptedData = sessionStorage.getItem('emailVerificationData');
        if (!encryptedData) {
            showAlert('No verification data found. Redirecting to registration.', 'error');
            sessionStorage.removeItem('emailVerificationData');
            sessionStorage.removeItem('resendCountdown');
            sessionStorage.removeItem('countdownStart');
            navigate('/register');
            return;
        }

        const decryptedData = decryptData(encryptedData);
        if (!decryptedData || !decryptedData.email || !decryptedData.token) {
            showAlert('Invalid verification data. Redirecting to registration.', 'error');
            sessionStorage.removeItem('emailVerificationData');
            sessionStorage.removeItem('resendCountdown');
            sessionStorage.removeItem('countdownStart');
            navigate('/register');
            return;
        }

        setEmail(decryptedData.email);
        setToken(decryptedData.token);

        // Restore countdown
        const savedCountdown = sessionStorage.getItem('resendCountdown');
        const countdownStart = sessionStorage.getItem('countdownStart');
        if (savedCountdown && countdownStart) {
            const elapsed = Math.floor((Date.now() - parseInt(countdownStart)) / 1000);
            const remaining = Math.max(0, parseInt(savedCountdown) - elapsed);
            setResendCooldown(remaining);
        }
    }, [navigate, showAlert]);

    // Handle resend cooldown timer
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => {
                    const newValue = prev - 1;
                    sessionStorage.setItem('resendCountdown', newValue);
                    if (newValue <= 0) {
                        sessionStorage.removeItem('resendCountdown');
                        sessionStorage.removeItem('countdownStart');
                    }
                    return newValue;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Handle input change for code digits
    const handleInputChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`code-${index + 1}`).focus();
            }
        }
    };

    // Handle paste event
    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        if (pastedData.length <= 6) {
            const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
            setCode(newCode);
            document.getElementById(`code-${Math.min(pastedData.length - 1, 5)}`).focus();
        }
    };

    // Handle code submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
            showAlert('Please enter a valid 6-digit code', 'error');
            return;
        }

        setIsLoading(true);
        axiosInstance.post('/auth/verifycode', { code: verificationCode, token, email })
            .then(response => {
                const res = response.data;
                const { user: userData, tokenData } = res.data;
                const secret = VITE_SECURE_LS_SECRET;

                const expiresAt = tokenData?.expires_at;
                let secondsLeft = 86400;

                if (expiresAt) {
                    const now = new Date();
                    const expiryDate = new Date(expiresAt.replace(" ", "T") + "Z");
                    secondsLeft = Math.floor((expiryDate - now) / 1000);
                    if (isNaN(secondsLeft) || secondsLeft <= 0) secondsLeft = 86400;
                }

                setCookie("userData", encryptData(userData, secret), {
                    path: "/",
                    maxAge: secondsLeft,
                });

                setCookie("tokenData", encryptData(tokenData?.token, secret), {
                    path: "/",
                    maxAge: secondsLeft,
                });

                if (tokenData?.device_id) {
                    localStorage.setItem("device_id", tokenData.device_id);
                }


                sessionStorage.removeItem('emailVerificationData');
                sessionStorage.removeItem('resendCountdown');
                sessionStorage.removeItem('countdownStart');

                showAlert(
                    res.message || "Email verified successfully!",
                    "success"
                );
                navigate('/dashboard');
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const status = errRes.code;
                let message = errRes.message || 'Something went wrong. Please try again.';
                if (status === 401 && errRes.data?.verification_token) {
                    sessionStorage.setItem('verificationData', encryptData(errRes.data?.verification_token))
                    message = errRes.message || 'Failed to verify email';
                    showAlert(message, 'error');
                    navigate('/onboarding');
                    return;
                }
                showAlert(message, 'error');
                navigate('/login');

            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleResend = () => {
        if (resendCooldown > 0 || isResendLoading) return;

        setIsResendLoading(true);
        axiosInstance.post('/auth/sendcode', { email })
            .then(response => {
                const { code, message, data } = response.data;
                if (code === 200) {
                    showAlert(message, 'success');
                    saveNewToken(data.token);
                } else if (code === 400 && data.seconds_remaining) {
                    showAlert(message, 'error');
                    setResendCooldown(data.seconds_remaining);
                    sessionStorage.setItem('resendCountdown', data.seconds_remaining);
                    sessionStorage.setItem('countdownStart', Date.now());
                } else {
                    showAlert(message, 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const status = errRes.code;
                let message = errRes.message || 'Something went wrong. Please try again.';
                if (status === 400 && errRes.data?.seconds_remaining) {
                    setResendCooldown(errRes.data.seconds_remaining);
                    sessionStorage.setItem('resendCountdown', errRes.data.seconds_remaining);
                    sessionStorage.setItem('countdownStart', Date.now());
                    message = errRes.message || 'Failed to resend code';
                }
                showAlert(message, 'error');
            })
            .finally(() => {
                setIsResendLoading(false);
            });
    };

    const saveNewToken = (newToken) => {
        setToken(newToken);
        setResendCooldown(60);
        setCode(['', '', '', '', '', '']);
        const encrypted = encryptData({ token: newToken, email });
        sessionStorage.setItem('emailVerificationData', encrypted);
        sessionStorage.setItem('resendCountdown', '60');
        sessionStorage.setItem('countdownStart', Date.now());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#60a5fa] relative overflow-hidden">
            {/* Floating Background Shapes */}
            <div className="absolute w-full h-full overflow-hidden">
                <motion.div
                    className="absolute w-20 h-20 bg-white/10 rounded-full top-[20%] left-[10%]"
                    variants={shapeVariants}
                    animate="animate"
                />
                <motion.div
                    className="absolute w-16 h-16 bg-white/10 rounded-full top-[60%] left-[80%]"
                    variants={shapeVariants}
                    animate="animate"
                    initial={{ animationDelay: '2s' }}
                />
                <motion.div
                    className="absolute w-24 h-24 bg-white/10 rounded-full top-[10%] right-[10%]"
                    variants={shapeVariants}
                    animate="animate"
                    initial={{ animationDelay: '4s' }}
                />
                <motion.div
                    className="absolute w-10 h-10 bg-white/10 rounded-full top-[80%] left-[20%]"
                    variants={shapeVariants}
                    animate="animate"
                    initial={{ animationDelay: '3s' }}
                />
            </div>

            <motion.div
                className="min-h-screen flex items-center justify-center p-4 relative z-10"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="w-full max-w-lg">
                    {/* Main Verification Card */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-8 mb-6"
                        variants={cardVariants}
                    >
                        {/* Logo and Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="flex justify-center mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
                            >
                                <img src="images/logo.png" alt="Paynix Logo" className="w-10 h-10 object-contain" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                            <p className="text-gray-600 text-sm">
                                Enter the 6-digit code sent to {email || 'your email'}
                            </p>
                        </div>

                        {/* Verification Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code</label>
                                <div className="flex space-x-2 justify-center">
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                            required
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Resend Code */}
                            <div className="text-center">
                                <motion.button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || isResendLoading}
                                    className={`text-sm font-semibold flex items-center justify-center mx-auto ${resendCooldown > 0 || isResendLoading ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-800'}`}
                                    whileHover={resendCooldown > 0 || isResendLoading ? {} : { scale: 1.05 }}
                                    whileTap={resendCooldown > 0 || isResendLoading ? {} : { scale: 0.95 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {isResendLoading ? (
                                            <motion.div
                                                key="resend-loading"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center"
                                            >
                                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                <span>Resending...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="resend"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="w-full px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-[#10b981] to-[#059669]"
                                variants={buttonVariants}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                disabled={isLoading}
                            >
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center"
                                        >
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            <span>Verifying...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="submit"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center"
                                        >
                                            <span>Verify Email</span>
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Back to Sign In Link */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-white text-sm">
                            Return to{' '}
                            <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-100 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailVerify;
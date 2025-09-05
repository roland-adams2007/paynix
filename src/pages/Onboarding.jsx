import React, { useState, useEffect } from 'react';
import { User, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import axiosInstance from "../api/axiosInstance";
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

const Onboarding = () => {
    const [bvn, setBvn] = useState('');
    const [nin, setNin] = useState('');
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [, setCookie] = useCookies(["userData", "tokenData"]);


    useEffect(() => {
        const encryptedData = sessionStorage.getItem('verificationData');
        if (!encryptedData) {
            showAlert('No verification data found. Redirecting to login.', 'error');
            sessionStorage.removeItem('verificationData')
            navigate('/login');
            return;
        }

        const decryptedData = decryptData(encryptedData);
        if (!decryptedData || !decryptedData.token) {
            showAlert('Invalid verification data. Redirecting to login.', 'error');
            sessionStorage.removeItem('verificationData')
            navigate('/login');
            return;
        }

        setToken(decryptedData.token);

    }, []);



    useEffect(() => {
        const generateRandomNumber = () => {
            return Math.floor(10000000000 + Math.random() * 90000000000).toString();
        };
        setBvn(generateRandomNumber());
        setNin(generateRandomNumber());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();


        if (!/^\d{11}$/.test(bvn)) {
            showAlert('BVN must be exactly 11 digits', 'error');
            return;
        }
        if (!/^\d{11}$/.test(nin)) {
            showAlert('NIN must be exactly 11 digits', 'error');
            return;
        }

        setIsLoading(true);


        axiosInstance.post('/auth/onboarding', { bvn, nin, token })
            .then(response => {
                const res = response.data;
                const { user: userData, tokenData } = res.data;

                const expiresAt = tokenData?.expires_at;
                let secondsLeft = 86400;

                if (expiresAt) {
                    const now = new Date();
                    const expiryDate = new Date(expiresAt.replace(" ", "T") + "Z");
                    secondsLeft = Math.floor((expiryDate - now) / 1000);
                    if (isNaN(secondsLeft) || secondsLeft <= 0) secondsLeft = 86400;
                }

                setCookie("userData", encryptData(userData), {
                    path: "/",
                    maxAge: secondsLeft,
                });

                setCookie("tokenData", encryptData(tokenData?.token), {
                    path: "/",
                    maxAge: secondsLeft,
                });

                if (tokenData?.device_id) {
                    localStorage.setItem("device_id", tokenData.device_id);
                }
                showAlert(res.message || 'Successfully submitted', "success");
                navigate('/dashboard');
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                let message =
                    errRes.message || "Something went wrong. Please try again.";
                showAlert(message, "error");
            })
            .finally(() => {
                setIsLoading(false);
            })


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
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-8 mb-6"
                        variants={cardVariants}
                    >

                        <div className="text-center mb-8">
                            <motion.div
                                className="flex justify-center mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
                            >
                                <img src="images/logo.png" alt="Paynix Logo" className="w-10 h-10 object-contain" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your KYC</h1>
                            <p className="text-gray-600 text-sm">Provide your identification details to complete onboarding</p>
                        </div>



                        <form onSubmit={handleSubmit} className="space-y-6">

                            <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus">
                                <label htmlFor="bvn" className="block text-sm font-semibold text-gray-700">Bank Verification Number (BVN)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="bvn"
                                        name="bvn"
                                        value={bvn}
                                        onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
                                        maxLength="11"
                                        placeholder="Enter your 11-digit BVN"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                        required
                                    />
                                </div>
                            </motion.div>


                            <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus">
                                <label htmlFor="nin" className="block text-sm font-semibold text-gray-700">National Identification Number (NIN)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="nin"
                                        name="nin"
                                        value={nin}
                                        onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                                        maxLength="11"
                                        placeholder="Enter your 11-digit NIN"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                        required
                                    />
                                </div>
                            </motion.div>


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
                                            <span>Submitting...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="submit"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center"
                                        >
                                            <span>Complete Onboarding</span>
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </form>
                    </motion.div>


                    <motion.div
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-white text-sm">
                            Already have an account?{' '}
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

export default Onboarding;
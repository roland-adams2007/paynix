import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { encryptData } from '../utils/crypto';
import { useAlert } from '../context/AlertContext';
import axiosInstance from "../api/axiosInstance";


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



const getDeviceName = () => navigator.userAgent;
const getLocation = () =>
    new Promise((resolve) => {
        if (!navigator.geolocation)
            return resolve({ latitude: "-", longitude: "-" });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                resolve({ latitude, longitude });
            },
            (err) => {
                console.error("Geolocation error:", err);
                resolve({ latitude: "-", longitude: "-" });
            }
        );
    });


const Login = () => {
    const { showAlert } = useAlert();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [, setCookie] = useCookies(["userData", "tokenData"]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;
        const device_name = getDeviceName();
        const location = await getLocation();


        axiosInstance.post('/auth/login', { email: email, password: password, location: location, device_name: device_name })
            .then(response => {
                const res = response.data;
                const { user: userData, tokenData } = res.data;
                showAlert(res.message || 'Successful', 'success')
                if (res && res.data && res.data.token) {
                    sessionStorage.setItem('emailVerificationData', encryptData({ token: res.data.token, email: email }));
                    navigate('/email_verify');
                    return;
                }

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
                navigate('/dashboard');



            }).catch(error => {
                const errRes = error.response?.data || {};
                const status = error.response?.data?.code;


                let message =
                    errRes.message || "Something went wrong. Please try again.";

                if (status === 400) {
                    if (errRes?.data?.verification_token) {
                        sessionStorage.setItem(
                            "verificationData",
                            encryptData(errRes?.data?.verification_token)
                        );
                        navigate("/onboarding");
                        return;
                    }
                    message = errRes.message || "Invalid credentials";
                }

                if (status == 403) {
                    const dataToEncrypt = [
                        ...(Array.isArray(errRes?.data) ? errRes.data : [errRes?.data]),
                        email,
                    ];
                    const encrypted = encryptData(dataToEncrypt);

                    sessionStorage.setItem("emailVerificationData", encrypted);

                    navigate("/verify");
                    message = errRes.message || "Please verify your account.";
                }

                showAlert(message, "error");

            }).finally(() => {
                setIsLoading(false);
            })



    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#60a5fa] relative overflow-hidden">

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
            </div>

            <motion.div
                className="min-h-screen flex items-center justify-center p-4 relative z-10"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="w-full max-w-md">
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl p-8 mb-6"
                        variants={cardVariants}
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                className="flex justify-center mb-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
                            >
                                <img src="images/logo.png" alt="Paynix Logo" className="w-10 h-10 object-contain" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Log In to Paynix</h1>
                            <p className="text-gray-600 text-sm">Access your digital banking experience</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <motion.div
                                    className="relative"
                                    variants={inputVariants}
                                    initial="rest"
                                    whileHover="hover"
                                    whileFocus="focus"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all duration-200"
                                        required
                                    />
                                </motion.div>
                            </div>


                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <motion.div
                                    className="relative"
                                    variants={inputVariants}
                                    initial="rest"
                                    whileHover="hover"
                                    whileFocus="focus"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white transition-all duration-200"
                                        required
                                    />
                                    <motion.button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePassword}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {showPassword ? (
                                                <motion.div
                                                    key="eye-off"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="eye"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                </motion.div>
                            </div>


                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-[#10b981] to-[#059669]"
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
                                            className="flex items-center"
                                        >
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            <span>Signing in...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="sign-in"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center"
                                        >
                                            <span>Sign In</span>
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
                            New to Paynix?
                            <Link to="/register" className="font-semibold text-emerald-300 hover:text-emerald-100 transition-colors ml-1">
                                Create Account
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { encryptData } from '../utils/crypto';



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

const Register = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        dob: '',
        address: '',
        gender: ''
    });

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            let formattedValue = value.replace(/\D/g, '');
            if (formattedValue.startsWith('234')) {
                formattedValue = '+' + formattedValue;
            } else if (formattedValue.startsWith('0')) {
                formattedValue = '+234' + formattedValue.substring(1);
            } else if (!formattedValue.startsWith('+')) {
                formattedValue = '+234' + formattedValue;
            }
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateStep = () => {
        if (step === 1) {
            return (
                formData.firstName.trim() &&
                formData.lastName.trim() &&
                formData.email.trim() &&
                formData.phone.trim() &&
                formData.gender.trim()
            );
        } else {
            return (
                formData.password.trim() &&
                formData.dob.trim() &&
                formData.address.trim()
            );
        }
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(2);
        } else {
            showAlert('All fields are required', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) {
            showAlert('All fields are required', 'error');
            return;
        }

        setIsLoading(true);
        axiosInstance.post("/auth/register", formData)
            .then(response => {
                const res = response.data;
                showAlert(res.message || 'Successful', 'success')
                if (res && res.data && res.data.token) {
                    sessionStorage.setItem('emailVerificationData', encryptData({ token: res.data.token, email: formData.email }));
                    navigate('/email_verify');
                    return;
                }
                navigate('/login');
            }).catch(error => {
                const errRes = error.response?.data || {};
                let message =
                    errRes.message || "Something went wrong. Please try again.";
                showAlert(message, "error");
            }).finally(() => {
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
                    {/* Main Registration Card */}
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
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Paynix Account</h1>
                            <p className="text-gray-600 text-sm">Join thousands who trust us with their finances</p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex justify-center mb-8">
                            <div className="flex space-x-2">
                                <motion.div
                                    className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-green-500 scale-110' : 'bg-gray-300'}`}
                                    animate={step === 1 ? { scale: 1.1 } : { scale: 1 }}
                                />
                                <motion.div
                                    className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-green-500 scale-110' : 'bg-gray-300'}`}
                                    animate={step === 2 ? { scale: 1.1 } : { scale: 1 }}
                                />
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5, ease: 'easeIn' }}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                                        {/* First Name and Last Name */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus">
                                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                                                    First Name
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        name="firstName"
                                                        placeholder="John"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                                        required
                                                    />
                                                </div>
                                            </motion.div>
                                            <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus">
                                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Doe"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                                    required
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Email */}
                                        <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus" className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="john.doe@example.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Phone Number */}
                                        <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus" className="space-y-2">
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="+234 800 000 0000"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Gender */}
                                        <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus" className="space-y-2">
                                            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                                                Gender
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="gender"
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                                    required
                                                >
                                                    <option value="" disabled>Select gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5, ease: 'easeIn' }}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>

                                        {/* Password */}
                                        <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus" className="space-y-2">
                                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    placeholder="Create a strong password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
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
                                            </div>
                                        </motion.div>

                                        {/* Date of Birth */}
                                        <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus" className="space-y-2">
                                            <label htmlFor="dob" className="block text-sm font-semibold text-gray-700">
                                                Date of Birth
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="date"
                                                    id="dob"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200"
                                                    required
                                                />
                                            </div>
                                        </motion.div>

                                        {/* Address */}
                                        <motion.div variants={inputVariants} initial="rest" whileHover="hover" whileFocus="focus" className="space-y-2">
                                            <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                                                Residential Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    rows="3"
                                                    placeholder="Enter your full residential address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all duration-200 resize-none"
                                                    required
                                                />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-4">
                                {step > 1 && (
                                    <motion.button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center"
                                        variants={buttonVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                                        Previous
                                    </motion.button>
                                )}
                                {step === 1 ? (
                                    <motion.button
                                        type="button"
                                        onClick={handleNext}
                                        className="ml-auto px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-[#10b981] to-[#059669]"
                                        variants={buttonVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Next
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        type="submit"
                                        className="ml-auto px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-[#10b981] to-[#059669]"
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
                                                    <span>Creating Account...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="submit"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center"
                                                >
                                                    <span>Create Account</span>
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                )}
                            </div>
                        </form>
                    </motion.div>

                    {/* Sign In Link */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <p className="text-white text-sm">
                            Already have an account?
                            <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-100 transition-colors ml-1">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
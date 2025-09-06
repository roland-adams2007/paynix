import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Send, ArrowRight, ArrowDownLeft, ArrowUpRight, Check, ChevronDown, CreditCard, Target, Smartphone, BarChart3, ShieldCheck, Star, Twitter, Plus, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Landing = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {


        // Navbar scroll effect
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('bg-white', 'shadow-lg');
            } else {
                navbar.classList.remove('bg-white', 'shadow-lg');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="overflow-x-hidden">
            {/* Navigation */}
            <nav id="navbar" className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-gray-200/20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <img src="/images/logowithname.png" alt="Paynix" className="h-8 w-auto" />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="#features" className="text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium">Features</Link>
                            <Link to="#how-it-works" className="text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium">How it Works</Link>
                            <Link to="#testimonials" className="text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium">Testimonials</Link>
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium">Log In</Link>
                                <Link to="/register" className="btn-primary px-6 py-2 rounded-full text-white font-semibold relative overflow-hidden">
                                    Get Started
                                </Link>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-[#1A2B4D] p-2">
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-white/95 backdrop-blur-md"
                        >
                            <div className="px-4 pt-4 pb-6 space-y-4">
                                <Link to="#features" className="block text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium py-2">Features</Link>
                                <Link to="#how-it-works" className="block text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium py-2">How it Works</Link>
                                <Link to="#testimonials" className="block text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium py-2">Testimonials</Link>
                                <div className="pt-4 border-t border-gray-200 space-y-3">
                                    <Link to="/login" className="block text-gray-700 hover:text-[#1A2B4D] transition-colors font-medium py-2">Log In</Link>
                                    <Link to="/register" className="btn-primary block text-center px-6 py-3 rounded-full text-white font-semibold">
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full"
                        animate={{ y: [-20, 0, -20] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute top-40 right-20 w-24 h-24 bg-[#20C997]/20 rounded-full"
                        animate={{ y: [-20, 0, -20] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    />
                    <motion.div
                        className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#1A2B4D]/10 rounded-full"
                        animate={{ y: [-20, 0, -20] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div
                        className="text-center lg:text-left"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
                            <span className="w-2 h-2 bg-[#20C997] rounded-full animate-pulse mr-2"></span>
                            <span className="text-white text-sm font-medium">Nigeria's #1 Digital Bank</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Banking Made
                            <span className="block gradient-text">Simple & Secure</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0">
                            Experience the future of banking with instant transfers, virtual cards, savings goals, and bill payments all in one app.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                            <Link to="/register" className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center justify-center relative overflow-hidden">
                                <span>Open Free Account</span>
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
                            <div>
                                <div className="stats-counter text-2xl md:text-3xl font-bold text-white">50K+</div>
                                <div className="text-gray-300 text-sm">Active Users</div>
                            </div>
                            <div>
                                <div className="stats-counter text-2xl md:text-3xl font-bold text-white">₦2.5B+</div>
                                <div className="text-gray-300 text-sm">Transacted</div>
                            </div>
                            <div>
                                <div className="stats-counter text-2xl md:text-3xl font-bold text-white">99.9%</div>
                                <div className="text-gray-300 text-sm">Uptime</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    >
                        <div className="phone-mockup max-w-sm mx-auto relative glowing-border">
                            <div className="bg-white rounded-2xl overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1A2B4D] to-[#20C997] p-4 text-white">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-sm opacity-80">Total Balance</div>
                                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
                                    </div>
                                    <div className="text-2xl font-bold">₦847,250.00</div>
                                    <div className="text-sm opacity-80">Account: 3124567890</div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-[#20C997] rounded-xl flex items-center justify-center mb-2 mx-auto">
                                                <Send className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-xs">Transfer</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-xs">Add Money</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                                <Smartphone className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-xs">Bills</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-2 mx-auto">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-xs">Cards</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-sm font-semibold">Recent Transactions</div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">Salary Payment</div>
                                                    <div className="text-xs text-gray-500">Today</div>
                                                </div>
                                            </div>
                                            <div className="text-green-600 text-sm font-semibold">+₦150,000</div>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">Transfer to Jane</div>
                                                    <div className="text-xs text-gray-500">Yesterday</div>
                                                </div>
                                            </div>
                                            <div className="text-red-600 text-sm font-semibold">-₦25,000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="scroll-indicator">
                    <ChevronDown className="w-6 h-6 text-white animate-bounce" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need in One App</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Manage your finances effortlessly with our comprehensive suite of banking features designed for the modern Nigerian.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Send, title: 'Instant Transfers', description: 'Send money to any bank in Nigeria instantly. No delays, no hassles - just seamless transfers 24/7.', features: ['Zero transfer fees', 'All Nigerian banks supported', 'Real-time notifications'], gradient: 'from-[#20C997] to-emerald-500', delay: 0.1 },
                            { icon: CreditCard, title: 'Virtual Cards', description: 'Create multiple virtual debit cards for online shopping and subscriptions with spending controls.', features: ['Instant card creation', 'Spending limits & controls', 'Freeze/unfreeze anytime'], gradient: 'from-blue-500 to-indigo-600', delay: 0.2 },
                            { icon: Target, title: 'Savings Goals', description: 'Set and track savings goals with automated transfers and progress visualization.', features: ['Automated savings', 'Progress tracking', 'Goal achievements rewards'], gradient: 'from-purple-500 to-pink-600', delay: 0.3 },
                            { icon: Smartphone, title: 'Bill Payments', description: 'Pay for airtime, data, electricity, cable TV, and other bills directly from your account.', features: ['All major billers supported', 'Scheduled payments', 'Payment history & receipts'], gradient: 'from-orange-500 to-red-500', delay: 0.4 },
                            { icon: BarChart3, title: 'Spending Analytics', description: 'Track your spending patterns with detailed analytics and budgeting tools.', features: ['Category-wise breakdown', 'Monthly/yearly reports', 'Budget alerts'], gradient: 'from-yellow-500 to-orange-500', delay: 0.5 },
                            { icon: ShieldCheck, title: 'Bank-Level Security', description: 'Your money and data are protected with military-grade encryption and biometric authentication.', features: ['256-bit encryption', 'Biometric login', 'Real-time fraud detection'], gradient: 'from-emerald-500 to-[#20C997]-600', delay: 0.6 },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card rounded-2xl p-8"
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: feature.delay }}
                                whileHover={{ y: -12, boxShadow: '0 32px 64px -12px rgba(26, 43, 77, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6">{feature.description}</p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <Check className="w-4 h-4 text-[#20C997] mr-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Opening your Paynix account takes less than 5 minutes. No paperwork, no branch visits.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            { step: 1, title: 'Download & Sign Up', description: 'Download the Paynix app and create your account with just your phone number and email. No lengthy forms or documentation required.', gradient: 'from-[#20C997] to-emerald-500', delay: 0.1 },
                            { step: 2, title: 'Verify Your Identity', description: 'Take a quick selfie and upload your valid ID. Our AI-powered verification system will approve your account in under 2 minutes.', gradient: 'from-blue-500 to-indigo-600', delay: 0.2 },
                            { step: 3, title: 'Start Banking', description: 'Fund your account, get your account number, and start enjoying seamless digital banking with all the features you need.', gradient: 'from-purple-500 to-pink-600', delay: 0.3 },
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: step.delay }}
                            >
                                <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 relative`}>
                                    <span className="text-2xl font-bold text-white">{step.step}</span>
                                    <div className="absolute -z-10 w-24 h-24 bg-opacity-20 rounded-full animate-pulse-slow" style={{ backgroundColor: step.gradient.split(' ')[1] }}></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/register" className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center relative overflow-hidden">
                            <span>Start Your Journey</span>
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="section-bg py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands of Nigerians</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            See what our customers are saying about their Paynix banking experience.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: 'Adebayo Olumide', location: 'Lagos, Nigeria', initials: 'AO', color: 'bg-[#20C997]', testimonial: 'Paynix has revolutionized how I handle my finances. The instant transfers and virtual cards make online shopping so much easier. Best banking app I\'ve used!', delay: 0.1 },
                            { name: 'Fatima Ibrahim', location: 'Abuja, Nigeria', initials: 'FI', color: 'bg-purple-500', testimonial: 'The savings goals feature helped me save for my dream vacation! The automated transfers made it so easy. Customer support is also top-notch.', delay: 0.2 },
                            { name: 'Chinedu Ezekiel', location: 'Port Harcourt, Nigeria', initials: 'CE', color: 'bg-blue-500', testimonial: 'As a freelancer, Paynix\'s spending analytics help me track my business expenses effortlessly. The bill payment feature is a lifesaver too!', delay: 0.3 },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="testimonial-card rounded-2xl p-8 shadow-lg"
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: testimonial.delay }}
                                whileHover={{ y: -8, boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.15)' }}
                            >
                                <div className="flex items-center mb-4">
                                    <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center mr-4`}>
                                        <span className="text-white font-bold">{testimonial.initials}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                                    </div>
                                </div>
                                <p className="text-gray-700">{testimonial.testimonial}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 hero-gradient">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Transform Your Banking Experience?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                            Join thousands of Nigerians who have already switched to smarter, faster, and more secure banking with Paynix.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center justify-center relative overflow-hidden">
                                <span>Open Your Free Account</span>
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/login" className="btn-secondary px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center justify-center bg-white text-[#1A2B4D] hover:bg-gray-100">
                                <span>Sign In</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <img src="/images/logowithname.png" alt="Paynix" className="h-8 w-auto mb-4 filter brightness-0 invert" />
                            <p className="text-gray-400 mb-4">
                                The future of banking in Nigeria. Simple, secure, and designed for you.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Products</h3>
                            <ul className="space-y-2">
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Personal Banking</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Business Banking</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Virtual Cards</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Savings Goals</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Bill Payments</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" />hello@paynix.ng</li>
                                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" />+234 800 PAYNIX</li>
                                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" />Lagos, Nigeria</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="border-gray-800 my-8" />
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 Paynix. All rights reserved. Licensed by CBN.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
                            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
                            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
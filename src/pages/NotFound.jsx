import React, { useEffect } from 'react';
import { Home, ArrowLeft, CreditCard, Send, PiggyBank, Smartphone, CheckCircle, Info, XCircle } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const controls = useAnimation();

    // Notification system
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-[#1A2B4D]';
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform translate-x-full transition-all duration-300 max-w-sm`;
        notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <${type === 'success' ? 'CheckCircle' : type === 'error' ? 'XCircle' : 'Info'} className="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">${message}</span>
      </div>
    `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    };

    // Navigation functions
    const goHome = () => {
        showNotification('Redirecting to dashboard...', 'success');
        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    const goBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            goHome();
        }
    };

    // Floating animation variants
    const floatVariants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    // Slide-in-up animation variants
    const slideInUpVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    // Pulse glow animation variants
    const pulseGlowVariants = {
        animate: {
            boxShadow: [
                '0 0 20px rgba(32, 201, 151, 0.3)',
                '0 0 40px rgba(32, 201, 151, 0.6)',
                '0 0 20px rgba(32, 201, 151, 0.3)',
            ],
            transition: { duration: 2, repeat: Infinity },
        },
    };

    // Handle floating element click animation
    const handleFloatClick = (index) => {
        controls.start({
            scale: 1.2,
            transition: { duration: 0.2 },
        }).then(() => {
            controls.start({ scale: 1, transition: { duration: 0.2 } });
        });
    };

    // Keydown event handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                goBack();
            }
            if (e.key === 'Enter' && document.activeElement.classList.contains('btn-primary')) {
                goHome();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Parallax effect on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.error-illustration');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen font-inter">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center justify-center min-h-full text-center">
                    
                    <div className="relative w-full max-w-2xl mb-8">
                        <div
                            className="error-illustration h-64 relative"
                            style={{
                                background: `url('/images/404.png') center/50% no-repeat`,
                            }}
                        >
                            <motion.div
                                className="absolute top-8 left-8"
                                variants={floatVariants}
                                animate="animate"
                                initial={{ y: 0 }}
                                transition={{ delay: 0 }}
                                onClick={() => handleFloatClick(0)}
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                    <CreditCard className="w-8 h-8 text-[#1A2B4D]" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute top-4 right-12"
                                variants={floatVariants}
                                animate="animate"
                                initial={{ y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => handleFloatClick(1)}
                            >
                                <div className="w-12 h-12 bg-[#20C997] rounded-xl shadow-lg flex items-center justify-center">
                                    <Send className="w-6 h-6 text-white" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute bottom-8 right-8"
                                variants={floatVariants}
                                animate="animate"
                                initial={{ y: 0 }}
                                transition={{ delay: 1 }}
                                onClick={() => handleFloatClick(2)}
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                                    <PiggyBank className="w-7 h-7 text-[#20C997]" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute bottom-4 left-12"
                                variants={floatVariants}
                                animate="animate"
                                initial={{ y: 0 }}
                                transition={{ delay: 1.5 }}
                                onClick={() => handleFloatClick(3)}
                            >
                                <div className="w-10 h-10 bg-[#1A2B4D] rounded-lg shadow-lg flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-white" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Error Code */}
                    <motion.div variants={slideInUpVariants} initial="initial" animate="animate">
                        <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#1A2B4D] to-[#20C997] bg-clip-text text-transparent mb-4 font-urbanist">
                            404
                        </h1>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div variants={slideInUpVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-urbanist">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-gray-600 text-lg max-w-md mx-auto mb-2">
                            The page you're looking for seems to have wandered off into the digital void.
                        </p>
                        <p className="text-gray-500 text-base max-w-lg mx-auto mb-3">
                            Don't worry, your money is still safe! Let's get you back to managing your finances.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mb-12"
                        variants={slideInUpVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                    >
                        <motion.button
                            className="btn-primary hover-scale px-8 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-[#1A2B4D] to-[#20C997]"
                            onClick={goHome}
                            whileHover={{ scale: 1.05, y: -2 }}
                            variants={pulseGlowVariants}
                            animate="animate"
                        >
                            <Home className="w-5 h-5 inline mr-2" />
                            Go to Dashboard
                        </motion.button>
                        <motion.button
                            className="btn-secondary hover-scale px-8 py-4 font-semibold rounded-xl border-2 border-[#20C997] text-[#1A2B4D] hover:bg-[#20C997] hover:text-white"
                            onClick={goBack}
                            whileHover={{ scale: 1.05, y: -2 }}
                        >
                            <ArrowLeft className="w-5 h-5 inline mr-2" />
                            Go Back
                        </motion.button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;
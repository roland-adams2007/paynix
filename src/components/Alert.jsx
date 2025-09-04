// src/components/Alert.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-600" />,
    error: <AlertCircle className="w-6 h-6 text-red-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />
};

const Alert = ({
    message,
    type = "info",
    onClose,
    duration = 5000,
    title,
    action
}) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const alertStyles = {
        success: {
            borderColor: "border-l-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-800",
            icon: icons.success
        },
        error: {
            borderColor: "border-l-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-800",
            icon: icons.error
        },
        info: {
            borderColor: "border-l-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
            icon: icons.info
        },
        warning: {
            borderColor: "border-l-amber-500",
            bgColor: "bg-amber-50",
            textColor: "text-amber-800",
            icon: icons.warning
        }
    };

    const { borderColor, bgColor, textColor, icon } = alertStyles[type];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className={`fixed top-5 right-5 w-96 max-w-[90vw] p-4 rounded-lg shadow-lg z-50 ${bgColor} border-l-4 ${borderColor} backdrop-blur-sm bg-opacity-95`}
                role="alert"
                aria-live="assertive"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <div className="mt-0.5 flex-shrink-0">
                            {icon}
                        </div>
                        <div className="flex-1">
                            {title && (
                                <h3 className={`font-semibold ${textColor} mb-1`}>
                                    {title}
                                </h3>
                            )}
                            <p className={textColor}>{message}</p>
                            {action && (
                                <div className="mt-3">
                                    {action}
                                </div>
                            )}
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                            aria-label="Close alert"
                        >
                            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        </button>
                    )}
                </div>

                {duration && onClose && (
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: 0 }}
                        transition={{ duration: duration / 1000, ease: "linear" }}
                        className="h-1 bg-current opacity-20 mt-3 rounded-full"
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default Alert;

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import Alert from "../components/Alert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ message: "", type: "", isVisible: false });

    const showAlert = (message, type = "info") => {
        setAlert({ message, type, isVisible: true });


        setTimeout(() => {
            setAlert((prev) => ({ ...prev, isVisible: false }));
        }, 3000);
    };

    const hideAlert = () => setAlert((prev) => ({ ...prev, isVisible: false }));

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <AnimatePresence>
                {alert.isVisible && <Alert message={alert.message} type={alert.type} onClose={hideAlert} />}
            </AnimatePresence>
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);

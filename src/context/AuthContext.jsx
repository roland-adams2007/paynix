import { createContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAlert } from "./AlertContext";
import { decryptData, encryptData } from "../utils/crypto";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const cookies = new Cookies();

    useEffect(() => {
        const storedUser = cookies.get("paynix_userData");
        if (storedUser) {
            try {
                setUser(decryptData(storedUser));
            } catch (err) {
                showAlert("We encountered an issue retrieving your session information. Please try again.", 'error');
            }
        }
    }, []);



    const login = (userData) => {
        setUser(userData);
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                setUser,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    );



}


export { AuthContext };
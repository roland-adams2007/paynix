
import axios from "axios";
import { Cookies } from "react-cookie";
import { decryptData } from '../utils/crypto';

const cookies = new Cookies();
const { VITE_API_URL } = import.meta.env;

const getDeviceId = () => {
    const existing = localStorage.getItem("device_id");
    if (existing) return existing;

    const newId = crypto.randomUUID();
    localStorage.setItem("device_id", newId);
    return newId;
};


const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        const tokenData = decryptData(cookies.get("tokenData"));
        const deviceId = getDeviceId();

        if (tokenData) {
            config.headers.Authorization = `Bearer ${tokenData}`;
        }

        if (deviceId) {
            config.headers["X-Device-ID"] = deviceId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance; 

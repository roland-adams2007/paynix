
import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const { VITE_API_URL } = import.meta.env;


const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach token and device ID
axiosInstance.interceptors.request.use(
    (config) => {
        const tokenData = cookies.get("tokenData");
        const deviceId = localStorage.getItem("deviceId");

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

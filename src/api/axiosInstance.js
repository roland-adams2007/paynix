import axios from "axios";
import { Cookies } from "react-cookie";
import { decryptData } from '../utils/crypto';

const cookies = new Cookies();
const { VITE_API_URL } = import.meta.env;

const getDeviceId = () => {
    let deviceId = cookies.get("paynix_device_id");
    if (deviceId) return deviceId;

    deviceId = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 15);

    cookies.set("paynix_device_id", deviceId, { path: "/", expires });
    return deviceId;
};

const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const tokenData = decryptData(cookies.get("paynix_tokenData"));
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

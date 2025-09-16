// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decryptData } from "../utils/crypto";


export default function PrivateRoute({ children }) {
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies(["paynix_tokenData", "paynix_userData", 'paynix_device_id']);
  const isAuthenticated = !!cookies.paynix_tokenData;

  const userData = cookies.paynix_userData
    ? decryptData(cookies.paynix_userData)
    : null;

  const clearAuthCookies = () => {
    removeCookie("paynix_tokenData", { path: "/" });
    removeCookie("paynix_userData", { path: "/" });
  };

  const deviceId = cookies.paynix_device_id ?? null;



  if (!deviceId) {
    clearAuthCookies();
    return (
      <Navigate to="/login" replace />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace />
    );
  }

  if (!userData) {
    clearAuthCookies();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
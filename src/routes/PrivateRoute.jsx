// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decryptData } from "../utils/crypto";


export default function PrivateRoute({ children }) {
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies(["tokenData", "userData"]);
  const isAuthenticated = !!cookies.tokenData;

  const userData = cookies.userData
    ? decryptData(cookies.userData)
    : null;

  const clearAuthCookies = () => {
    removeCookie("tokenData", { path: "/" });
    removeCookie("userData", { path: "/" });
  };

  const deviceId = localStorage.getItem("device_id");

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
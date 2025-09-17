import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decryptData } from "../utils/crypto";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies([
    "paynix_tokenData",
    "paynix_userData",
    "paynix_device_id",
  ]);

  const isAuthenticated = !!cookies.paynix_tokenData;

  const userData = cookies.paynix_userData
    ? decryptData(cookies.paynix_userData)
    : null;

  const deviceId = cookies.paynix_device_id ?? null;

  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (!deviceId || !isAuthenticated || !userData) {
      removeCookie("paynix_tokenData", { path: "/" });
      removeCookie("paynix_userData", { path: "/" });
      setRedirect("/login");
    }
  }, [deviceId, isAuthenticated, userData, removeCookie]);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}

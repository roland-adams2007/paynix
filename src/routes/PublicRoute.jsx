import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decryptData } from "../utils/crypto";

export default function PublicRoute({ children, restricted = false }) {
    const location = useLocation();
    const [cookies, , removeCookie] = useCookies(["paynix_tokenData", "paynix_userData"]);
    const [redirect, setRedirect] = useState(null);

    const isAuthenticated = !!cookies.paynix_tokenData;

    const userData = cookies.paynix_userData
        ? decryptData(cookies.paynix_userData)
        : null;

    const path = location.pathname.toLowerCase();

    useEffect(() => {
        if (isAuthenticated && !userData) {
            removeCookie("paynix_tokenData", { path: "/" });
            removeCookie("paynix_userData", { path: "/" });
            setRedirect("/login");
        }
    }, [isAuthenticated, userData, removeCookie]);

    if (redirect) {
        return <Navigate to={redirect} replace />;
    }

    if (isAuthenticated && userData && (path === "/login" || path === "/register")) {
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get("redirect");
        return redirectPath?.startsWith("/")
            ? <Navigate to={decodeURIComponent(redirectPath)} replace />
            : <Navigate to="/dashboard" replace />;
    }

    if (restricted) {
        if (path === "/email_verify" && !sessionStorage.getItem("emailVerificationData")) {
            return <Navigate to="/login" replace />;
        }
        if (path === "/onboarding" && !sessionStorage.getItem("verificationData")) {
            return <Navigate to="/login" replace />;
        }
    }

    return <>{children}</>;
}

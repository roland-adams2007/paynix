// src/routes/PublicRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decryptData } from "../utils/crypto";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import EmailVerify from "../pages/EmailVerify.jsx";
import Onboarding from "../pages/Onboarding.jsx";



export default function PublicRoute({ children, restricted = false }) {
    const location = useLocation();
    const [cookies, , removeCookie] = useCookies(["userData", "tokenData"]);
    const isAuthenticated = !!cookies.tokenData;

    const userData = cookies.userData
        ? decryptData(cookies.userData)
        : null;

    const clearAuthCookies = () => {
        removeCookie("tokenData", { path: "/" });
        removeCookie("userData", { path: "/" });
    };

    if (
        isAuthenticated &&
        userData &&
        (children.type === Login || children.type === Register)
    ) {
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get("redirect");

        if (redirectPath && redirectPath.startsWith("/")) {
            return <Navigate to={decodeURIComponent(redirectPath)} replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    if (isAuthenticated && !userData) {
        clearAuthCookies();
        return <Navigate to="/login" replace />;
    }

    if (restricted) {
        const emailVerificationData = sessionStorage.getItem("emailVerificationData");
        const verificationData = sessionStorage.getItem("verificationData");

        if (children.type === EmailVerify && !emailVerificationData) {
            return <Navigate to="/login" replace />;
        }
        if (children.type === Onboarding && !verificationData) {
            return <Navigate to="/login" replace />;
        }
    }

    return <>{children}</>;
}
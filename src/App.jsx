
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import NotFound from "./pages/NotFound.jsx";
import logo from "/src/images/logo.png";
import Landing from "./pages/Landing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";





const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Transfer = lazy(() => import("./pages/Transfer.jsx"));
const Settings = lazy(() => import("./pages/Settings/Index.jsx"));
const SettingProfile = lazy(() => import("./pages/Settings/profile.jsx"));
const SettingSecurity = lazy(() => import("./pages/Settings/security.jsx"));

export default function App() {
  return (
    <Router>
      <AuthProvider>

        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-[#20C997] border-gray-200 rounded-full animate-spin"></div>
                <img src={logo} alt="Paynix Logo" className="absolute w-8 h-8 object-contain" />
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<PublicRoute restricted={false}><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute restricted={true}><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute restricted={true}><Register /></PublicRoute>} />
            <Route path="/email_verify" element={<PublicRoute restricted={true}><EmailVerify /></PublicRoute>} />
            <Route path="/onboarding" element={<PublicRoute restricted={true}><Onboarding /></PublicRoute>} />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>}>
              <Route path="profile" element={<PrivateRoute><SettingProfile /></PrivateRoute>} />
              <Route path="security" element={<PrivateRoute><SettingSecurity /></PrivateRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

      </AuthProvider>
    </Router>
  );
}

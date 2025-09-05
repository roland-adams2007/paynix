// src/App.jsx
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import NotFound from "./pages/NotFound.jsx";
import logo from "/public/images/logo.png";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
// Example: const Transfer = lazy(() => import("./pages/Transfer.jsx"));

const Landing = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#60a5fa]">
    <div className="text-center text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Paynix</h1>
      <p className="mb-6">Your trusted digital banking platform</p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">
          Login
        </Link>
        <Link to="/register" className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600">
          Register
        </Link>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      {/* One global Suspense for all lazy pages */}
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
          {/* Add other lazy routes here, e.g.: <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

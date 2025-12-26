import { Navigate, Route, Routes } from "react-router-dom";

// Pages
import AdminLogin from "./pages/AdminLogin";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import VerifyBill from "./pages/VerifyBill";

function App() {
  return (
    <Routes>
      {/* Default → User Login */}
      <Route path="/" element={<Login />} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Billing Page */}
      <Route path="/billing" element={<Billing />} />

      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* QR / Bill Verification */}
      <Route path="/verify/:billId" element={<VerifyBill />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

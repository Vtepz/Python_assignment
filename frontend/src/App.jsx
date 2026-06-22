import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployeeProfile from "./pages/EmployeeProfile.jsx";
import Employees from "./pages/Employees.jsx";
import Login from "./pages/Login.jsx";
import Payroll from "./pages/Payroll.jsx";
import Settings from "./pages/Settings.jsx";
import Terminal from "./pages/Terminal.jsx";

function ProtectedRoutes() {
  const user = localStorage.getItem("hrm_user");
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:employeeId" element={<EmployeeProfile />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="terminal" element={<Terminal />} />
            <Route path="settings" element={<Settings />} />
            <Route path="about" element={<About />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

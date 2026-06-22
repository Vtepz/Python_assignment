import { LogOut, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/employees": "Employee Management",
  "/payroll": "Payroll Budget",
  "/terminal": "Console Terminal",
  "/settings": "Settings",
  "/about": "About Project",
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || "HRM System";

  const handleLogout = () => {
    localStorage.removeItem("hrm_user");
    localStorage.removeItem("hrm_token");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div>
        <p className="page-kicker">Human Resource Management</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <div className="top-search">
          <Search size={16} />
          <input aria-label="Global search" placeholder="Search HR records" />
        </div>
        <button className="icon-text-btn" onClick={handleLogout} type="button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;

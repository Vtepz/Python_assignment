import {
  BarChart3,
  BriefcaseBusiness,
  CircleHelp,
  LayoutDashboard,
  Settings,
  TerminalSquare,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: UsersRound },
  { to: "/payroll", label: "Payroll", icon: BarChart3 },
  { to: "/terminal", label: "Terminal", icon: TerminalSquare },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About", icon: CircleHelp },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">
          <BriefcaseBusiness size={24} />
        </div>
        <div>
          <h1>HRM</h1>
          <span>Admin System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className="sidebar-link">
              <Icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

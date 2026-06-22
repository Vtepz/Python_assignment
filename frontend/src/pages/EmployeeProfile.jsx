import { ArrowLeft, Banknote, BriefcaseBusiness, Building2, CalendarDays, Download, Printer, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import StatCard from "../components/StatCard.jsx";
import { employeeService } from "../services/api.js";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function EmployeeProfile() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    employeeService
      .getById(employeeId)
      .then((response) => setEmployee(response.data.employee))
      .catch(() => setError("Employee profile could not be loaded."));
  }, [employeeId]);

  const exportProfile = () => {
    if (!employee) return;
    const rows = [
      ["Field", "Value"],
      ["Employee ID", employee.employee_id],
      ["Full Name", employee.full_name],
      ["Position", employee.position],
      ["Department", employee.department],
      ["Salary", employee.salary],
      ["Date Hired", employee.date_hired],
      ["Created At", employee.created_at],
      ["Updated At", employee.updated_at],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${employee.employee_id}-profile.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (error) return <div className="alert alert-warning">{error}</div>;
  if (!employee) return <div className="loading-state">Loading employee profile...</div>;

  return (
    <div className="page-stack employee-profile-page">
      <section className="page-actions">
        <div>
          <p className="section-kicker">Employee Profile</p>
          <h3>{employee.full_name}</h3>
        </div>
        <div className="action-row">
          <button className="secondary-btn" type="button" onClick={() => navigate("/employees")}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <button className="secondary-btn" type="button" onClick={exportProfile}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="primary-btn" type="button" onClick={() => window.print()}>
            <Printer size={18} />
            <span>Print Profile</span>
          </button>
        </div>
      </section>

      <section className="profile-hero panel">
        <div className="profile-avatar">
          <UserRound size={38} />
        </div>
        <div>
          <p>{employee.employee_id}</p>
          <h2>{employee.full_name}</h2>
          <span>{employee.position} - {employee.department}</span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Position" value={employee.position} note="Current role" icon={BriefcaseBusiness} tone="blue" />
        <StatCard title="Department" value={employee.department} note="Assigned team" icon={Building2} tone="purple" />
        <StatCard title="Salary" value={money.format(employee.salary)} note="Monthly payroll value" icon={Banknote} tone="green" />
        <StatCard title="Date Hired" value={employee.date_hired} note="Employment start date" icon={CalendarDays} tone="orange" />
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="section-kicker">Record Details</p>
          <h3>Complete Employee Information</h3>
        </div>
        <dl className="profile-details">
          <div><dt>Employee ID</dt><dd>{employee.employee_id}</dd></div>
          <div><dt>Full Name</dt><dd>{employee.full_name}</dd></div>
          <div><dt>Position</dt><dd>{employee.position}</dd></div>
          <div><dt>Department</dt><dd>{employee.department}</dd></div>
          <div><dt>Salary</dt><dd>{money.format(employee.salary)}</dd></div>
          <div><dt>Date Hired</dt><dd>{employee.date_hired}</dd></div>
          <div><dt>Created At</dt><dd>{employee.created_at ? new Date(employee.created_at).toLocaleString() : "N/A"}</dd></div>
          <div><dt>Updated At</dt><dd>{employee.updated_at ? new Date(employee.updated_at).toLocaleString() : "N/A"}</dd></div>
        </dl>
      </section>
    </div>
  );
}

export default EmployeeProfile;

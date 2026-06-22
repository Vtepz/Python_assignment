import { Banknote, CircleDollarSign, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import StatCard from "../components/StatCard.jsx";
import { dashboardService } from "../services/api.js";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then((response) => setDashboard(response.data))
      .catch(() => setError("Unable to load dashboard data. Start the Flask backend first."));
  }, []);

  if (error) return <div className="alert alert-warning">{error}</div>;
  if (!dashboard) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <StatCard title="Total Employees" value={dashboard.total_employees} note="Active records" icon={UsersRound} tone="blue" />
        <StatCard title="Payroll Budget" value={money.format(dashboard.total_payroll_budget)} note="All employee salaries" icon={CircleDollarSign} tone="green" />
        <StatCard title="Average Salary" value={money.format(dashboard.average_salary)} note="Company average" icon={Banknote} tone="orange" />
        <StatCard
          title="Highest Paid"
          value={dashboard.highest_paid_employee?.full_name || "None"}
          note={dashboard.highest_paid_employee ? money.format(dashboard.highest_paid_employee.salary) : "No employee data"}
          icon={TrendingUp}
          tone="purple"
        />
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="section-kicker">Recent Activity</p>
          <h3>Recently Added Employees</h3>
        </div>
        <div className="activity-list">
          {dashboard.recent_activity.map((employee) => (
            <article key={employee.employee_id} className="activity-item">
              <div>
                <strong>{employee.full_name}</strong>
                <span>{employee.position} - {employee.department}</span>
              </div>
              <small>{employee.employee_id}</small>
            </article>
          ))}
          {dashboard.recent_activity.length === 0 && <p className="muted-text">No recent activity yet.</p>}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

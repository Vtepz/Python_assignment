import { Banknote, BadgeDollarSign, Download, LineChart, Printer, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";

import StatCard from "../components/StatCard.jsx";
import { payrollService } from "../services/api.js";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Payroll() {
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    payrollService
      .getPayroll()
      .then((response) => setPayroll(response.data))
      .catch(() => setError("Unable to load payroll data. Check the Flask backend."));
  }, []);

  if (error) return <div className="alert alert-warning">{error}</div>;
  if (!payroll) return <div className="loading-state">Loading payroll...</div>;

  const exportPayrollCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Payroll Budget", payroll.total_payroll_budget],
      ["Average Salary", payroll.average_salary],
      ["Highest Salary", payroll.highest_salary],
      ["Highest Paid Employee", payroll.highest_paid_employee?.full_name || ""],
      ["Lowest Salary", payroll.lowest_salary],
      ["Lowest Paid Employee", payroll.lowest_paid_employee?.full_name || ""],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payroll-summary.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="page-stack payroll-page">
      <section className="page-actions no-print">
        <div>
          <p className="section-kicker">Exports</p>
          <h3>Payroll Reports</h3>
        </div>
        <div className="action-row">
          <button className="secondary-btn" type="button" onClick={exportPayrollCsv}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="primary-btn" type="button" onClick={() => window.print()}>
            <Printer size={18} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Total Payroll" value={money.format(payroll.total_payroll_budget)} note="Current budget" icon={WalletCards} tone="green" />
        <StatCard title="Average Salary" value={money.format(payroll.average_salary)} note="Mean salary" icon={LineChart} tone="blue" />
        <StatCard title="Highest Salary" value={money.format(payroll.highest_salary)} note={payroll.highest_paid_employee?.full_name || "No employee"} icon={BadgeDollarSign} tone="purple" />
        <StatCard title="Lowest Salary" value={money.format(payroll.lowest_salary)} note={payroll.lowest_paid_employee?.full_name || "No employee"} icon={Banknote} tone="orange" />
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="section-kicker">Payroll Insight</p>
          <h3>Salary Range Summary</h3>
        </div>
        <div className="payroll-summary">
          <p>
            The payroll module calculates the total payroll budget, average salary, highest salary, and lowest salary directly from the employee table.
          </p>
          <dl className="payroll-report-list">
            <div><dt>Total Payroll Budget</dt><dd>{money.format(payroll.total_payroll_budget)}</dd></div>
            <div><dt>Average Salary</dt><dd>{money.format(payroll.average_salary)}</dd></div>
            <div><dt>Highest Paid Employee</dt><dd>{payroll.highest_paid_employee?.full_name || "No employee"}</dd></div>
            <div><dt>Lowest Paid Employee</dt><dd>{payroll.lowest_paid_employee?.full_name || "No employee"}</dd></div>
          </dl>
        </div>
      </section>
    </div>
  );
}

export default Payroll;

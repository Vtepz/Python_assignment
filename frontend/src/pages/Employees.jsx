import { Download, Plus, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import { employeeService } from "../services/api.js";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadEmployees = () => {
    employeeService
      .getAll()
      .then((response) => {
        setEmployees(response.data.employees);
        setError("");
      })
      .catch(() => setError("Unable to load employees. Check the backend server."));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openCreateForm = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleSubmit = async (employeeData) => {
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.employee_id, employeeData);
        setMessage("Employee updated successfully.");
      } else {
        await employeeService.create(employeeData);
        setMessage("Employee created successfully.");
      }
      setShowForm(false);
      loadEmployees();
    } catch (apiError) {
      const details = apiError.response?.data?.errors?.join(", ");
      setError(details || apiError.response?.data?.message || "Employee save failed.");
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm(`Delete employee ${employeeId}?`)) return;

    try {
      await employeeService.remove(employeeId);
      setMessage("Employee deleted successfully.");
      loadEmployees();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Employee delete failed.");
    }
  };

  const exportEmployeesCsv = () => {
    const rows = [
      ["Employee ID", "Full Name", "Position", "Department", "Salary", "Date Hired"],
      ...employees.map((employee) => [
        employee.employee_id,
        employee.full_name,
        employee.position,
        employee.department,
        employee.salary,
        employee.date_hired,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="page-stack">
      <section className="page-actions">
        <div>
          <p className="section-kicker">Employees</p>
          <h3>Manage Employee Records</h3>
        </div>
        <div className="action-row">
          <button className="secondary-btn" type="button" onClick={loadEmployees}>
            <RefreshCcw size={18} />
            <span>Refresh</span>
          </button>
          <button className="secondary-btn" type="button" onClick={exportEmployeesCsv} disabled={employees.length === 0}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="primary-btn" type="button" onClick={openCreateForm}>
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </section>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <EmployeeTable
        employees={employees}
        onEdit={(employee) => {
          setEditingEmployee(employee);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && <EmployeeForm employee={editingEmployee} onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
    </div>
  );
}

export default Employees;

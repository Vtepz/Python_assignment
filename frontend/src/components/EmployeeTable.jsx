import { ArrowDownUp, Edit3, Eye, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function EmployeeTable({ employees, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "employee_id", direction: "asc" });
  const navigate = useNavigate();

  const sortedEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = employees.filter((employee) =>
      [employee.employee_id, employee.full_name, employee.department, employee.position, employee.date_hired, employee.salary]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    return [...filtered].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      const result = sort.field === "salary" ? Number(aValue) - Number(bValue) : String(aValue).localeCompare(String(bValue));
      return sort.direction === "asc" ? result : -result;
    });
  }, [employees, search, sort]);

  const changeSort = (field) => {
    setSort((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <section className="panel">
      <div className="table-toolbar">
        <div className="employee-search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by ID, name, department, position, salary"
            aria-label="Search employees"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear employee search">
              <X size={16} />
            </button>
          )}
        </div>
        <span>
          {sortedEmployees.length} of {employees.length} records
        </span>
      </div>

      <div className="table-responsive">
        <table className="table align-middle employee-table">
          <thead>
            <tr>
              {[
                ["employee_id", "Employee ID"],
                ["full_name", "Name"],
                ["department", "Department"],
                ["salary", "Salary"],
              ].map(([field, label]) => (
                <th key={field}>
                  <button className="table-sort-btn" onClick={() => changeSort(field)} type="button">
                    <span>{label}</span>
                    <ArrowDownUp size={14} />
                  </button>
                </th>
              ))}
              <th>Position</th>
              <th>Date Hired</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee) => (
              <tr key={employee.employee_id} className="employee-row">
                <td className="employee-id-cell">{employee.employee_id}</td>
                <td>{employee.full_name}</td>
                <td>{employee.department}</td>
                <td>{money.format(employee.salary)}</td>
                <td>{employee.position}</td>
                <td>{employee.date_hired}</td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn" onClick={() => navigate(`/employees/${employee.employee_id}`)} type="button" aria-label={`View ${employee.full_name}`}>
                      <Eye size={17} />
                    </button>
                    <button className="icon-btn" onClick={() => onEdit(employee)} type="button" aria-label={`Edit ${employee.full_name}`}>
                      <Edit3 size={17} />
                    </button>
                    <button className="icon-btn danger" onClick={() => onDelete(employee.employee_id)} type="button" aria-label={`Delete ${employee.full_name}`}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedEmployees.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-table">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EmployeeTable;

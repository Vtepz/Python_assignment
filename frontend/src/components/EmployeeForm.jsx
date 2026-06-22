import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyForm = {
  employee_id: "",
  full_name: "",
  position: "",
  department: "",
  salary: "",
  date_hired: "",
};

function EmployeeForm({ employee, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    setFormData(employee ? { ...employee } : emptyForm);
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      salary: Number(formData.salary),
    });
  };

  return (
    <div className="modal-backdrop-custom">
      <section className="employee-modal">
        <div className="modal-header-row">
          <div>
            <p className="section-kicker">Employee Record</p>
            <h3>{employee ? "Update Employee" : "Add New Employee"}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} type="button" aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <label>
            Employee ID
            <input
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              disabled={Boolean(employee)}
              required
              maxLength="20"
              placeholder="EMP006"
            />
          </label>
          <label>
            Full Name
            <input name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="Jane Doe" />
          </label>
          <label>
            Position
            <input name="position" value={formData.position} onChange={handleChange} required placeholder="HR Officer" />
          </label>
          <label>
            Department
            <input name="department" value={formData.department} onChange={handleChange} required placeholder="Human Resources" />
          </label>
          <label>
            Salary
            <input name="salary" type="number" min="1" step="0.01" value={formData.salary} onChange={handleChange} required placeholder="50000" />
          </label>
          <label>
            Date Hired
            <input name="date_hired" type="date" value={formData.date_hired} onChange={handleChange} required />
          </label>

          <div className="form-actions">
            <button className="secondary-btn" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-btn" type="submit">
              <Save size={18} />
              <span>{employee ? "Save Changes" : "Add Employee"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EmployeeForm;

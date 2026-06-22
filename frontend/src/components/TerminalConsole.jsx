import { Send, TerminalSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { employeeService, payrollService } from "../services/api.js";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const menuLines = [
  "--- HRM System Menu ---",
  "1. Add a New Employee",
  "2. View All Employees",
  "3. Search for an Employee",
  "4. Remove an Employee",
  "5. View Total Payroll Budget",
  "6. Exit the Program",
  "",
];

const addFields = [
  { key: "employee_id", prompt: "Enter Employee ID" },
  { key: "full_name", prompt: "Enter Employee Name" },
  { key: "position", prompt: "Enter Position" },
  { key: "department", prompt: "Enter Department" },
  { key: "salary", prompt: "Enter Salary ($)" },
  { key: "date_hired", prompt: "Enter Date Hired (YYYY-MM-DD)" },
];

function TerminalConsole() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState(menuLines);
  const [prompt, setPrompt] = useState("Select an option (1-6)");
  const [flow, setFlow] = useState(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const writeLines = (newLines = []) => {
    setLines((current) => [...current, ...newLines]);
  };

  const writeAnswer = (label, answer) => {
    writeLines([`${label}: [[${answer}]]`]);
  };

  const resetToMenuPrompt = () => {
    setFlow(null);
    setPrompt("Select an option (1-6)");
  };

  const formatDirectory = (employees) => {
    if (employees.length === 0) {
      return ["--- Employee Directory ---", "No employees found.", ""];
    }

    return [
      "--- Employee Directory ---",
      "",
      "ID".padEnd(14) + "Name".padEnd(28) + "Position".padEnd(24) + "Salary",
      "-".repeat(78),
      ...employees.map(
        (employee) =>
          employee.employee_id.padEnd(14) +
          employee.full_name.padEnd(28) +
          employee.position.padEnd(24) +
          money.format(employee.salary)
      ),
      "",
    ];
  };

  const formatEmployeeDetails = (employee) => [
    "--- Employee Found ---",
    "",
    `ID: ${employee.employee_id}`,
    `Name: ${employee.full_name}`,
    `Position: ${employee.position}`,
    `Department: ${employee.department}`,
    `Salary: ${money.format(employee.salary)}`,
    `Date Hired: ${employee.date_hired}`,
    `Created At: ${employee.created_at ? new Date(employee.created_at).toLocaleString() : "N/A"}`,
    `Updated At: ${employee.updated_at ? new Date(employee.updated_at).toLocaleString() : "N/A"}`,
    "",
  ];

  const handleAddFlow = async (answer) => {
    const currentField = addFields[flow.step];
    const data = { ...flow.data, [currentField.key]: answer };
    const nextStep = flow.step + 1;

    if (nextStep < addFields.length) {
      setFlow({ type: "add", step: nextStep, data });
      setPrompt(addFields[nextStep].prompt);
      return;
    }

    try {
      const response = await employeeService.create({
        ...data,
        salary: Number(data.salary),
      });
      writeLines([`Success: ${response.data.employee.full_name} has been added successfully!`, ""]);
    } catch (error) {
      const details = error.response?.data?.errors || [error.response?.data?.message || "Unable to add employee."];
      writeLines(["Error:", ...details, ""]);
    }

    resetToMenuPrompt();
  };

  const handleSearchFlow = async (employeeId) => {
    try {
      const response = await employeeService.getById(employeeId);
      writeLines(formatEmployeeDetails(response.data.employee));
    } catch (error) {
      writeLines([error.response?.data?.message || "Employee not found.", ""]);
    }

    resetToMenuPrompt();
  };

  const handleRemoveFlow = async (employeeId) => {
    try {
      await employeeService.remove(employeeId);
      writeLines([`Success: Employee ${employeeId} has been removed.`, ""]);
    } catch (error) {
      writeLines([error.response?.data?.message || "Unable to remove employee.", ""]);
    }

    resetToMenuPrompt();
  };

  const handleMenuOption = async (option) => {
    if (option === "1") {
      writeLines(["--- Add New Employee ---"]);
      setFlow({ type: "add", step: 0, data: {} });
      setPrompt(addFields[0].prompt);
      return;
    }

    if (option === "2") {
      try {
        const response = await employeeService.getAll();
        writeLines(formatDirectory(response.data.employees));
      } catch (error) {
        writeLines(["Unable to load employees. Check the backend server.", ""]);
      }
      resetToMenuPrompt();
      return;
    }

    if (option === "3") {
      writeLines(["--- Search Employee ---"]);
      setFlow({ type: "search" });
      setPrompt("Enter Employee ID to search");
      return;
    }

    if (option === "4") {
      writeLines(["--- Remove Employee ---"]);
      setFlow({ type: "remove" });
      setPrompt("Enter Employee ID to remove");
      return;
    }

    if (option === "5") {
      try {
        const employeesResponse = await employeeService.getAll();
        const payrollResponse = await payrollService.getPayroll();
        writeLines([
          "--- Total Payroll Budget ---",
          `Total Active Employees: ${employeesResponse.data.employees.length}`,
          `Total Monthly Payroll Budget: ${money.format(payrollResponse.data.total_payroll_budget)}`,
          `Average Salary: ${money.format(payrollResponse.data.average_salary)}`,
          `Highest Salary: ${money.format(payrollResponse.data.highest_salary)}`,
          `Lowest Salary: ${money.format(payrollResponse.data.lowest_salary)}`,
          "",
        ]);
      } catch (error) {
        writeLines(["Unable to load payroll data. Check the backend server.", ""]);
      }
      resetToMenuPrompt();
      return;
    }

    if (option === "6") {
      writeLines(["Thank you for using the HRM System. Goodbye!", "", "Process finished with exit code 0"]);
      setFlow(null);
      setPrompt("Program exited");
      return;
    }

    writeLines(["Invalid option. Please select a number from 1 to 6.", ""]);
    resetToMenuPrompt();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const answer = input.trim();
    if (!answer) return;

    writeAnswer(prompt, answer);
    setInput("");

    if (flow?.type === "add") {
      await handleAddFlow(answer);
      return;
    }

    if (flow?.type === "search") {
      await handleSearchFlow(answer);
      return;
    }

    if (flow?.type === "remove") {
      await handleRemoveFlow(answer);
      return;
    }

    await handleMenuOption(answer);
  };

  const handleClear = () => {
    setLines(menuLines);
    resetToMenuPrompt();
  };

  const renderTerminalLine = (line, index) => {
    const parts = line.split(/(\[\[.*?\]\])/g);

    return (
      <div key={`${line}-${index}`} className="terminal-program-line">
        {parts.map((part, partIndex) => {
          if (part.startsWith("[[") && part.endsWith("]]")) {
            return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
          }
          return <span key={partIndex}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <section className="terminal-panel lecturer-terminal">
      <div className="terminal-titlebar">
        <div>
          <TerminalSquare size={18} />
          <span>HRM Console Program</span>
        </div>
        <span>Menu mode</span>
      </div>

      <div className="terminal-command-strip">
        <button type="button" onClick={() => handleMenuOption("1")}>1 Add</button>
        <button type="button" onClick={() => handleMenuOption("2")}>2 View</button>
        <button type="button" onClick={() => handleMenuOption("3")}>3 Search</button>
        <button type="button" onClick={() => handleMenuOption("4")}>4 Remove</button>
        <button type="button" onClick={() => handleMenuOption("5")}>5 Payroll</button>
        <button type="button" onClick={() => handleMenuOption("6")}>6 Exit</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>

      <div className="terminal-output terminal-program-output" aria-live="polite">
        {lines.map(renderTerminalLine)}
        <div ref={terminalEndRef} />
      </div>

      <form className="terminal-input-row terminal-program-input" onSubmit={handleSubmit}>
        <span>{prompt}:</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          autoFocus
          disabled={prompt === "Program exited"}
          aria-label="Terminal answer input"
        />
        <button type="submit" disabled={prompt === "Program exited"} aria-label="Submit terminal answer">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}

export default TerminalConsole;

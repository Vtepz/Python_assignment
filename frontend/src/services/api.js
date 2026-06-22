import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  me: () => api.get("/auth/me"),
};

export const employeeService = {
  getAll: (params = {}) => api.get("/employees", { params }),
  getById: (employeeId) => api.get(`/employees/${employeeId}`),
  create: (employee) => api.post("/employees", employee),
  update: (employeeId, employee) => api.put(`/employees/${employeeId}`, employee),
  remove: (employeeId) => api.delete(`/employees/${employeeId}`),
};

export const payrollService = {
  getPayroll: () => api.get("/payroll"),
};

export const dashboardService = {
  getDashboard: () => api.get("/dashboard"),
};

export default api;

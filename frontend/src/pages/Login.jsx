import { BriefcaseBusiness, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "../services/api.js";

function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ username, password });
      localStorage.setItem("hrm_user", JSON.stringify(response.data.user));
      localStorage.setItem("hrm_token", response.data.token);
      navigate("/dashboard");
    } catch (apiError) {
      const message = apiError.response?.data?.message;
      setError(
        message === "Route not found"
          ? "Login route is not loaded yet. Restart the Flask backend, then try again."
          : message || "Login failed. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <section className="login-card">
          <div className="brand-block login-brand">
            <div className="brand-mark">
              <BriefcaseBusiness size={24} />
            </div>
            <div>
              <h1>HRM System</h1>
              <span>Admin Portal</span>
            </div>
          </div>

          <div className="login-form-heading">
            <div className="login-status-pill">
              <ShieldCheck size={16} />
              <span>Secure Login</span>
            </div>
            <h2>Welcome Back</h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} required />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button type="submit" className="primary-btn" disabled={loading}>
              <LogIn size={18} />
              <span>{loading ? "Signing in..." : "Login"}</span>
            </button>
          </form>

          <div className="demo-login-note">
            <strong>Demo account</strong>
            <span>admin / admin123</span>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Login;

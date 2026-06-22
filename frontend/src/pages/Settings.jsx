import { Save } from "lucide-react";
import { useState } from "react";

function Settings() {
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("Professional");

  return (
    <div className="page-stack">
      <section className="panel settings-panel">
        <div className="section-heading">
          <p className="section-kicker">Preferences</p>
          <h3>System Settings</h3>
        </div>
        <div className="settings-grid">
          <label>
            Currency Display
            <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
              <option>USD</option>
              <option>KHR</option>
              <option>THB</option>
            </select>
          </label>
          <label>
            Interface Style
            <select value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option>Professional</option>
              <option>Compact</option>
              <option>Presentation</option>
            </select>
          </label>
        </div>
        <button className="primary-btn settings-save" type="button">
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </section>
    </div>
  );
}

export default Settings;

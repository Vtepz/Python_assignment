import TerminalConsole from "../components/TerminalConsole.jsx";

function Terminal() {
  return (
    <div className="page-stack">
      <section className="page-actions">
        <div>
          <p className="section-kicker">Console</p>
          <h3>Terminal Employee Manager</h3>
        </div>
      </section>
      <TerminalConsole />
    </div>
  );
}

export default Terminal;

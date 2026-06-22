function About() {
  return (
    <div className="page-stack">
      <section className="panel about-panel">
        <div className="section-heading">
          <p className="section-kicker">Project</p>
          <h3>Human Resource Management System</h3>
        </div>
        <p>
          This HRM System is a beginner to intermediate full-stack university project. It uses React, Vite, Bootstrap, Axios, Flask, SQLAlchemy, Flask CORS, and PostgreSQL.
        </p>
        <div className="about-grid">
          <article>
            <strong>Frontend</strong>
            <span>Dashboard, employee forms, payroll page, settings, and terminal console.</span>
          </article>
          <article>
            <strong>Backend</strong>
            <span>REST API endpoints for employees, payroll calculations, and dashboard statistics.</span>
          </article>
          <article>
            <strong>Database</strong>
            <span>PostgreSQL table with unique employee IDs and salary validation.</span>
          </article>
        </div>
      </section>
    </div>
  );
}

export default About;

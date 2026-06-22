function StatCard({ title, value, note, icon: Icon, tone = "blue" }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-card-top">
        <div>
          <p>{title}</p>
          <h3>{value}</h3>
        </div>
        {Icon && (
          <div className="stat-icon">
            <Icon size={22} />
          </div>
        )}
      </div>
      {note && <span>{note}</span>}
    </article>
  );
}

export default StatCard;

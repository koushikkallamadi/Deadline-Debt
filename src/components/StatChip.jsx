export default function StatChip({ label, value, color }) {
  return (
    <div className="stat-chip">
      <span className="stat-chip-value" style={color ? { color } : {}}>
        {value}
      </span>
      <span className="stat-chip-label">{label}</span>
    </div>
  );
}

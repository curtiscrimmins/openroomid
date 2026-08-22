/**
 * Renders an identifier in monospace with the three segments visually
 * distinguishable: property code in regular ink, designator emphasized,
 * unit suffix in the accent. Accepts a bare property code too.
 */
export function RoomId({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const parts = id.split("-");
  if (parts.length !== 3) {
    return <span className={`font-mono ${className}`}>{id}</span>;
  }
  return (
    <span className={`font-mono ${className}`}>
      <span>{parts[0]}</span>
      <span className="text-muted">-</span>
      <span className="font-semibold">{parts[1]}</span>
      <span className="text-muted">-</span>
      <span className="font-semibold text-accent">{parts[2]}</span>
    </span>
  );
}

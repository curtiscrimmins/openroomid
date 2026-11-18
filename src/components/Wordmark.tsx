/**
 * The mark: three bars in the proportion of a roomID's three segments,
 * eight characters, four characters, one character. The last bar is the
 * accent, as the unit suffix is in every rendered identifier.
 */
export function Mark({
  height = 14,
  className = "",
  title,
}: {
  height?: number;
  className?: string;
  title?: string;
}) {
  const width = (height * 30) / 8;
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 30 8"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect x="0" y="0" width="16" height="8" fill="currentColor" />
      <rect x="18" y="0" width="8" height="8" fill="currentColor" />
      <rect x="28" y="0" width="2" height="8" style={{ fill: "var(--color-accent)" }} />
    </svg>
  );
}

/** Renders a roomID with its three segments distinguished. */
export function Rid({ id, className = "" }: { id: string; className?: string }) {
  const parts = id.split("-");
  if (parts.length !== 3) return <span className={`rid ${className}`}>{id}</span>;
  return (
    <span className={`rid ${className}`}>
      <span>{parts[0]}</span>
      <span className="sep">-</span>
      <span className="room">{parts[1]}</span>
      <span className="sep">-</span>
      <span className="unit">{parts[2]}</span>
    </span>
  );
}

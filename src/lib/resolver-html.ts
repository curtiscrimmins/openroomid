/**
 * Server-rendered HTML documents for the resolver route. The resolver is
 * a route handler, not a page, so it controls status codes and headers
 * exactly; these templates keep its HTML visually consistent with the
 * rest of the site. Design tokens mirror src/app/globals.css.
 */

import type { PropertyRecord, UnitRecord } from "@/lib/registry";

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function segmentedId(id: string): string {
  const parts = id.split("-");
  if (parts.length !== 3) return `<span class="rid">${esc(id)}</span>`;
  return (
    `<span class="rid">` +
    `<span>${esc(parts[0])}</span>` +
    `<span class="rid-sep">-</span>` +
    `<span class="rid-room">${esc(parts[1])}</span>` +
    `<span class="rid-sep">-</span>` +
    `<span class="rid-unit">${esc(parts[2])}</span>` +
    `</span>`
  );
}

function shell(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: oklch(99% 0.002 250);
    --panel: oklch(96.6% 0.004 250);
    --ink: oklch(21% 0.012 255);
    --muted: oklch(47% 0.012 255);
    --rule: oklch(88.5% 0.006 250);
    --accent: oklch(42% 0.13 262);
    --accent-dark: oklch(33% 0.12 262);
    --sans: "Public Sans", "Helvetica Neue", Arial, sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
    --radius: 3px;
  }
  * { box-sizing: border-box; }
  html, body { overflow-x: clip; }
  body { margin: 0; background: var(--paper); color: var(--ink);
         font-family: var(--sans); font-size: 16px; line-height: 1.6;
         -webkit-font-smoothing: antialiased; }
  main { max-width: 66rem; margin: 0 auto; padding: 0 1.25rem 4rem; }
  main > * { max-width: 44rem; }
  a { color: var(--accent); text-underline-offset: 3px;
      text-decoration-thickness: 1px; }
  a:hover { color: var(--accent-dark); }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  ::selection { background: color-mix(in oklch, var(--accent) 16%, var(--paper)); }
  header.site { border-bottom: 1px solid var(--ink); }
  .rule-thin { display: none; }
  header.site .inner { max-width: 66rem; margin: 0 auto;
                       padding: 1.5rem 1.25rem 1rem;
                       display: flex; justify-content: space-between;
                       align-items: flex-end; gap: 1rem; flex-wrap: wrap; }
  header.site a.home { color: inherit; text-decoration: none;
                       display: flex; align-items: center; gap: 0.75rem; }
  header.site .name { display: block; font-weight: 700; font-size: 1.1875rem;
                      letter-spacing: -0.015em; line-height: 1.15; }
  header.site .line { display: block; font-size: 0.8125rem; color: var(--muted); }
  .caps { font-size: 0.875rem; font-weight: 500; color: var(--muted); }
  h1 { font-size: 1.75rem; font-weight: 600; letter-spacing: -0.02em;
       line-height: 1.15; margin: 2.5rem 0 0.5rem; }
  .rid, code { font-family: var(--mono); }
  .rid { font-size: 1.5rem; font-weight: 500; }
  .rid-sep { color: var(--muted); }
  .rid-room { font-weight: 600; }
  .rid-unit { font-weight: 600; color: var(--accent); }
  code { font-size: 0.88em; background: var(--panel); padding: 0.08em 0.35em;
         border-radius: var(--radius); }
  .status { display: inline-block; font-size: 0.8125rem; font-weight: 500;
            border: 1px solid var(--rule); border-radius: var(--radius);
            padding: 0 0.5rem; color: var(--muted); }
  .status-active { color: var(--ink); border-color: var(--ink); }
  table { border-collapse: collapse; width: 100%; margin: 1.5rem 0;
          font-size: 0.875rem; border-top: 1px solid var(--ink); }
  th, td { text-align: left; padding: 0.5rem 1rem 0.5rem 0;
           border-bottom: 1px solid var(--rule); vertical-align: baseline; }
  th { font-weight: 600; color: var(--ink); width: 11rem; }
  td { font-variant-numeric: tabular-nums; }
  .note { border-left: 2px solid var(--accent);
          padding: 0.2rem 0 0.2rem 1rem; font-size: 0.875rem; margin: 1.25rem 0;
          max-width: 62ch; }
  footer { border-top: 1px solid var(--ink); margin-top: 4rem;
           padding-top: 1rem; font-size: 0.875rem; color: var(--muted); }
  .unitlist { columns: 3; column-gap: 2rem;
              font-family: var(--mono); font-size: 0.875rem;
              list-style: none; padding: 0; }
  .unitlist li { margin: 0.2rem 0; }
  .unitlist a { text-decoration: none; }
  .unitlist a:hover { text-decoration: underline; }
  @media (max-width: 600px) { .unitlist { columns: 2; } th { width: 8rem; } }
</style>
</head>
<body>
<header class="site"><div class="inner">
  <a class="home" href="/" aria-label="OpenRoomID, home"><svg width="56" height="15" viewBox="0 0 30 8" aria-hidden="true"><rect x="0" y="0" width="16" height="8" fill="currentColor"/><rect x="18" y="0" width="8" height="8" fill="currentColor"/><rect x="28" y="0" width="2" height="8" fill="var(--accent)"/></svg><span><span class="name">OpenRoomID</span><span class="line">An open identifier for accommodation units</span></span></a>
  <span class="caps">Registry record</span>
</div></header>
<div class="rule-thin" aria-hidden="true"></div>
<main>
${body}
<footer>
  The registry stores identity only: no attributes, no rates, no scores.
  <a href="/spec/1.0">Specification 1.0</a>.
  <a href="/registry">Registry policy</a>.
  Registrar: the OpenRoomID Project. Records are CC0.
</footer>
</main>
</body>
</html>`;
}

function statusBadge(status: string): string {
  const cls = status === "active" ? "status status-active" : "status";
  return `<span class="${cls}">${esc(status)}</span>`;
}

function demoNote(): string {
  return `<p class="note">Demonstration record. This entry was seeded by the
  registrar to illustrate the resolver and does not represent a
  registration requested by the property.</p>`;
}

export function unitHtml(
  unit: UnitRecord,
  property: PropertyRecord | null,
): string {
  const rows: string[] = [];
  if (property) {
    rows.push(
      `<tr><th>Property</th><td><a href="/${esc(property.propertyCode)}">${esc(
        property.name,
      )}</a> <code>${esc(property.propertyCode)}</code></td></tr>`,
    );
  }
  rows.push(
    `<tr><th>Room designator</th><td><code>${esc(unit.roomDesignator)}</code> ${
      unit.designatorSource === "assigned"
        ? "assigned by the registrar, not the number on the door"
        : "the label on the door"
    }</td></tr>`,
    `<tr><th>Unit suffix</th><td><code>${esc(unit.unitSuffix)}</code></td></tr>`,
  );
  if (unit.displayName) {
    rows.push(`<tr><th>Name</th><td>${esc(unit.displayName)}</td></tr>`);
  }
  if (unit.floorLevel) {
    rows.push(`<tr><th>Floor</th><td>${esc(unit.floorLevel)}</td></tr>`);
  }
  rows.push(
    `<tr><th>Status</th><td>${statusBadge(unit.status)}</td></tr>`,
    `<tr><th>Assigned</th><td>${esc(unit.assignedAt)}</td></tr>`,
  );
  if (unit.supersededBy) {
    rows.push(
      `<tr><th>Superseded by</th><td><a href="/${esc(unit.supersededBy)}"><code>${esc(
        unit.supersededBy,
      )}</code></a></td></tr>`,
    );
  }

  const retiredNote =
    unit.status === "retired"
      ? `<p class="note">This unit is retired. The identifier remains
         resolvable permanently; the registry does not delete records.</p>`
      : "";

  return shell(
    `${unit.roomId} | OpenRoomID`,
    `<h1>${segmentedId(unit.roomId)}</h1>
     <table>${rows.join("\n")}</table>
     ${retiredNote}
     ${unit.isDemo ? demoNote() : ""}
     <p><a href="/${esc(unit.roomId)}.json">JSON-LD record</a></p>`,
  );
}

export function propertyHtml(
  property: PropertyRecord,
  units: UnitRecord[],
): string {
  const address = [
    property.isResidence ? null : property.address,
    property.city,
    property.region,
    property.country,
  ]
    .filter(Boolean)
    .join(", ");
  const unitItems = units
    .map(
      (u) =>
        `<li><a href="/${esc(u.roomId)}">${esc(u.roomId)}</a>${
          u.status !== "active" ? ` ${statusBadge(u.status)}` : ""
        }</li>`,
    )
    .join("\n");

  return shell(
    `${property.propertyCode} ${property.name} | OpenRoomID`,
    `<h1>${esc(property.name)}</h1>
     <p><span class="rid">${esc(property.propertyCode)}</span></p>
     <table>
       ${address ? `<tr><th>Address</th><td>${esc(address)}</td></tr>` : ""}
       ${property.isResidence ? `<tr><th>Residence</th><td>Private home. The street address is held by the registrar and not published.</td></tr>` : ""}
       <tr><th>Status</th><td>${statusBadge(property.status)}</td></tr>
       <tr><th>Claim</th><td>${
         property.claimStatus === "claimed"
           ? `Claimed by the operator${property.lastConfirmed ? `, last confirmed ${esc(property.lastConfirmed)}` : ""}`
           : "Unclaimed. The operator has not confirmed these records."
       }</td></tr>
       <tr><th>Assigned</th><td>${esc(property.assignedAt)}</td></tr>
       <tr><th>Registered units</th><td>${units.length}</td></tr>
     </table>
     ${property.isDemo ? demoNote() : ""}
     <ul class="unitlist">${unitItems}</ul>
     <p><a href="/${esc(property.propertyCode)}.json">JSON-LD record</a></p>`,
  );
}

export function malformedHtml(identifier: string, message: string): string {
  return shell(
    "Malformed identifier | OpenRoomID",
    `<h1>Malformed identifier</h1>
     <p><code>${esc(identifier)}</code> is not a valid roomID.</p>
     <p>${esc(message)}</p>
     <p>Valid forms: <code>PPPPPPPP-ROOM-U</code> for a unit, or
     <code>PPPPPPPP</code> for a property. Example:
     <a href="/7QM4KX92-1412-B"><code>7QM4KX92-1412-B</code></a>.
     See <a href="/spec/1.0#section-3">section 3 of the specification</a>.</p>`,
  );
}

export function unassignedHtml(canonical: string): string {
  return shell(
    `${canonical} unassigned | OpenRoomID`,
    `<h1>${segmentedId(canonical)}</h1>
     <p>This identifier is syntactically valid but has not been assigned.
     The registry has no record for it.</p>
     <p>If you operate this property, see the
     <a href="/registry">registry policy</a> for how to request
     identifiers. Assignment is free.</p>`,
  );
}

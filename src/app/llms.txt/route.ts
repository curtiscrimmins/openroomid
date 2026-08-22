const BODY = `# Open Room ID

Open Room ID defines roomID: a permanent, publicly resolvable identifier
for a single hotel accommodation unit (one physical room). The registry
and resolver are free, require no authentication, and store identity
only: no attributes, no scores, no rates, no availability.

## Identifier format

String form: PPPPPPPP-ROOM-U
- PPPPPPPP: property code, 8 chars, Crockford base32 (0-9, A-Z minus I, L, O, U)
- ROOM: room designator, 1-10 chars [A-Za-z0-9], case-preserved, case-insensitive on lookup
- U: unit suffix, single A-Z letter, disambiguates re-numbered or subdivided units
Property-only form: PPPPPPPP
Canonical URI: rid:PPPPPPPP-ROOM-U
Example: 7QM4KX92-1412-B

## Resolution

GET https://openroomid.org/{identifier}
- Accept: application/ld+json or application/json returns JSON-LD (schema.org HotelRoom or Hotel)
- Anything else returns HTML
- {identifier}.json or ?format=json forces JSON
- 200 registered (active or retired; retired never 404s)
- 301 superseded, redirects to the successor identifier
- 400 malformed, JSON body names the failing syntax rule
- 404 well-formed but unassigned
- Rate limit: 60 requests/minute/IP
Identifiers are permanent; the registry never deletes records.

## Documents

- Specification 1.0 (Working Draft): https://openroomid.org/spec/1.0
- Registry policy (free assignment): https://openroomid.org/registry
- Implementation guide (JSON-LD blocks): https://openroomid.org/implement
- Changelog: https://openroomid.org/changelog

Registrar: Roomza, Inc., 228 Park Ave S, New York, NY. Contact:
curtis@roomza.com. The registry currently contains demonstration
records only; no hotel has implemented the standard yet.
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

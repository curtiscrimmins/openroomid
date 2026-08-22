import Link from "next/link";

import { ResolverBox } from "@/components/ResolverBox";

const SEGMENTS = [
  {
    chars: "7QM4KX92",
    tag: "Property code",
    note: "8 chars, Crockford base32, assigned by the registrar, carries no meaning",
    tone: "text-ink",
  },
  {
    chars: "1412",
    tag: "Room designator",
    note: "1 to 10 chars, the number on the door, chosen by the hotel",
    tone: "text-ink font-semibold",
  },
  {
    chars: "B",
    tag: "Unit suffix",
    note: "one letter, disambiguates re-numbered or subdivided units",
    tone: "text-accent font-semibold",
  },
];

export default function Home() {
  return (
    <div className="doc">
      <p className="max-w-[24ch] text-[clamp(1.55rem,4vw,2.1rem)] font-semibold leading-[1.25] tracking-[-0.015em]">
        Hotels sell room categories. Guests sleep in rooms.
      </p>
      <p className="mt-3 max-w-2xl text-[1.15rem] text-muted">
        Software cannot transact on a thing that has no name.
      </p>

      <p className="mt-6 max-w-2xl">
        Open Room ID defines <strong>roomID</strong>: a permanent, publicly
        resolvable identifier for a single hotel accommodation unit. One
        physical room, one identifier, addressable by any system, forever.
        Assignment is free. The registry stores identity and nothing else.
      </p>

      <h2>The identifier</h2>
      <div className="anatomy" aria-label="Anatomy of a roomID">
        {SEGMENTS.map((seg, i) => (
          <span key={seg.tag} className="contents">
            {i > 0 && (
              <span aria-hidden className="anatomy-hyphen">
                -
              </span>
            )}
            <span className="anatomy-seg">
              <span className={`anatomy-chars ${seg.tone}`}>{seg.chars}</span>
              <span className="anatomy-tag">
                {seg.tag}
                <small>{seg.note}</small>
              </span>
            </span>
          </span>
        ))}
      </div>
      <p>
        The property-only form <code>7QM4KX92</code> names the property
        itself. The canonical URI form is <code>rid:7QM4KX92-1412-B</code>.
      </p>

      <h2>Resolve an identifier</h2>
      <p>
        Every identifier resolves at{" "}
        <code>openroomid.org/&#123;roomID&#125;</code>, as HTML for people
        and JSON-LD for software.
      </p>
      <ResolverBox />
      <p className="text-[0.85rem] text-muted">
        The registry currently contains demonstration records only.
      </p>

      <h2>What the resolver returns</h2>
      <p>
        Identity, status, containment, and supersession. Nothing else. No
        rates, no availability, no scores, no attributes. Identifying a room
        is free infrastructure; describing one is somebody&apos;s product,
        and the two must never mix.
      </p>

      <h2>Documents</h2>
      <ul>
        <li>
          <Link href="/spec/1.0">Specification 1.0</Link>, the normative
          definition of syntax, assignment, lifecycle, and resolution
        </li>
        <li>
          <Link href="/registry">Registry policy</Link>, who can request
          identifiers and what it costs (nothing)
        </li>
        <li>
          <Link href="/implement">Implementation guide</Link>, copy-paste
          JSON-LD for hotel and room pages
        </li>
        <li>
          <a href="https://github.com/curtiscrimmins/openroomid">Source repository</a>
        </li>
      </ul>
    </div>
  );
}

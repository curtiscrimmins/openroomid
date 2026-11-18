import type { Metadata } from "next";

import { Mark, Rid } from "@/components/Wordmark";

export const metadata: Metadata = {
  title: "Identity",
  description: "The OpenRoomID identity: name, mark, color, type, and the rules for using them.",
};

const COLORS = [
  ["paper", "Paper", "oklch(99% 0.002 250)", "Background"],
  ["panel", "Panel", "oklch(96.6% 0.004 250)", "Front matter, code"],
  ["rule", "Rule", "oklch(88.5% 0.006 250)", "Row separators"],
  ["muted", "Muted", "oklch(47% 0.012 255)", "Secondary text"],
  ["ink", "Ink", "oklch(21% 0.012 255)", "Text, section rules, the mark"],
  ["accent", "Registry blue", "oklch(42% 0.13 262)", "Unit suffix, links, focus"],
];

export default function IdentityPage() {
  return (
    <div className="doc">
      <h1>Identity</h1>
      <p className="lede">
        OpenRoomID is public infrastructure. The identity is plain on
        purpose and borrows its only shape from the identifier itself.
      </p>

      <h2>Name</h2>
      <p>
        The standard and the project are written OpenRoomID, one word. The
        identifier it defines is written roomID. The organization is the
        OpenRoomID Project.
      </p>
      <p className="specimen specimen-brand">
        <span className="flex items-center gap-4">
          <Mark height={30} />
          <span>OpenRoomID</span>
        </span>
      </p>

      <h2>Mark</h2>
      <p>
        Three bars in the proportion of a roomID&rsquo;s three segments:
        eight characters, four, and one. The last bar is registry blue, as
        the unit suffix is wherever an identifier is shown. It is the only
        symbol.
      </p>
      <p className="specimen text-ink">
        <Mark height={48} title="OpenRoomID mark" />
      </p>

      <h2>Color</h2>
      <p>
        Six values. Registry blue appears once in any identifier, on the
        unit suffix, and otherwise only on links and focus. It is never a
        background.
      </p>
      <div className="swatches">
        {COLORS.map(([token, name, value, use]) => (
          <div key={token} className="swatch">
            <div className="swatch-chip" data-token={token} />
            <p>
              <span className="font-semibold">{name}</span>
              <br />
              <code>{value}</code>
              <br />
              <span className="text-muted">{use}</span>
            </p>
          </div>
        ))}
      </div>

      <h2>Type</h2>
      <p>
        Public Sans, a typeface made for public services, carries every
        word. IBM Plex Mono carries identifiers and code and nothing else.
      </p>
      <p className="specimen specimen-sans">
        A permanent public identifier for every accommodation unit
      </p>
      <p className="specimen specimen-mono">
        <Rid id="7QM4KX92-1412-B" />
      </p>

      <h2>Rules</h2>
      <ul>
        <li>Sentence case everywhere. No uppercase labels and no tracked-out type.</li>
        <li>An identifier is always set in Plex Mono with the suffix in registry blue.</li>
        <li>Section openings take an ink rule. Rows take a light rule.</li>
        <li>No gradients, shadows, illustrations, or icons other than the mark.</li>
        <li>Copy states facts. The registry says what it knows and never sells.</li>
      </ul>
    </div>
  );
}

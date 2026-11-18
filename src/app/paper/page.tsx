import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper",
  description:
    "OpenRoomID working draft v0.2: why lodging needs a public identifier for the accommodation unit, and how one is run neutrally.",
};

const CONTENTS = [
  "The problem: two cases from one month, why now, and prior art",
  "Design principles",
  "The identifier, and why a suffix letter and not a check character",
  "Lifecycle",
  "Resolution: four answers and nothing else",
  "The rule this makes enforceable: one roomID, one live listing",
  "Where the records come from: three provenance tiers",
  "Governance: the sponsor, and what holds the line",
  "Adoption",
  "What OpenRoomID is not",
  "Open questions",
];

export default function PaperPage() {
  return (
    <div className="doc">
      <h1>A public way to check that a room exists</h1>
      <div className="front-matter">
        <p>
          Working draft v0.2, September 29, 2026. Editor: Curtis Crimmins,
          for the OpenRoomID Project. Licensed CC BY 4.0. Where this paper
          and the <a href="/spec/1.0">specification</a> disagree, the
          specification governs.
        </p>
        <p>
          <a href="/paper/open-room-id-v0.2.pdf" className="btn">
            Download PDF
          </a>
          <span className="ml-3 text-sm text-muted">13 pages</span>
        </p>
      </div>

      <h2>Abstract</h2>
      <p>
        In August 2026 a Las Vegas hotel sold its rooms under two hotel names
        that do not exist, on six booking sites, with altered photos. In the
        same month, seventeen generated videos on TikTok sold a suite at an
        Arizona resort that the resort does not have. In neither case could
        a booking site, a guest, or a software agent check the one fact that
        mattered: does this room exist, and is it the same room as that one?
      </p>
      <p>
        Lodging has no public identifier for the thing it sells. OpenRoomID
        defines roomID, a permanent, publicly resolvable identifier for a
        single accommodation unit and for the property that contains it.
        Assignment and resolution are free. The resolver answers one
        question, whether an identifier is active, superseded, retired, or
        unknown, and refuses to answer any other.
      </p>

      <h2>Contents</h2>
      <ol>
        {CONTENTS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ol>

      <h2>Comments</h2>
      <p>
        This draft will change. Comments go to the{" "}
        <a href="https://github.com/curtiscrimmins/openroomid/issues">
          public issue tracker
        </a>
        , where the Markdown source also lives.
      </p>
    </div>
  );
}

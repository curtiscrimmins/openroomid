import { cookies } from "next/headers";
import Link from "next/link";

import { Hint } from "@/components/Hint";
import { OpenQuestions } from "@/components/OpenQuestions";
import { ResolverBox } from "@/components/ResolverBox";
import { OPEN_QUESTIONS } from "@/data/open-questions";
import { VOTER_COOKIE, getVoteStore } from "@/lib/votes";

const SEGMENTS = [
  {
    chars: "7QM4KX92",
    tag: "Property code",
    note: "Eight characters. Names the building and never changes.",
    cls: "",
    align: "start" as const,
    hint: (
      <>
        <strong>Why random characters?</strong> A hotel&rsquo;s name, brand,
        and owner can all change. The code does not, so a building&rsquo;s
        history stays attached to it through a sale, a rebrand, or a
        renovation. It leaves out I, L, O, and U so it is hard to misread.
      </>
    ),
  },
  {
    chars: "1412",
    tag: "Room designator",
    note: "The number on the door. Named or unnumbered rooms get a code instead.",
    cls: "font-semibold",
    align: "start" as const,
    hint: (
      <>
        <strong>Why the door number?</strong> So anyone standing in the room
        can check the identifier against the door. It is written exactly as
        the hotel writes it, such as 1412, PH2, or A14.
        <span className="hint-list">
          <span>
            <strong>Named rooms.</strong> A room called &ldquo;The Hemingway
            Suite&rdquo; gets a four-character code from the registrar, such
            as 2H2S. The name is stored in the record and can change without
            changing the identifier.
          </span>
          <span>
            <strong>Rooms with no number,</strong> such as cabins or tents,
            get a code the same way. The property is asked to post it in the
            room.
          </span>
        </span>
      </>
    ),
  },
  {
    chars: "B",
    tag: "Unit suffix",
    note: "Usually A. It changes only if the hotel later puts this door number on a different room.",
    cls: "font-semibold text-accent",
    align: "end" as const,
    hint: (
      <>
        <strong>Why would a hotel move a door number?</strong> It happens
        more than you would think:
        <span className="hint-list">
          <span>Two rooms are combined into a suite, or a suite is split.</span>
          <span>Floors are renumbered after a renovation or a new wing.</span>
          <span>A floor number such as 13 is skipped or restored.</span>
          <span>A new brand brings its own numbering scheme.</span>
          <span>A room number is retired because of what it has come to be associated with.</span>
        </span>
        Each time, the room now behind that door gets the next letter. The
        old identifier keeps resolving and keeps its own history.
      </>
    ),
  },
];

const ANSWERS = [
  ["Active", "The unit exists and this is its current identifier."],
  ["Superseded", "The unit exists under a newer identifier, which is given."],
  ["Retired", "The identifier named a real unit that no longer exists as one."],
  ["Not found", "No such identifier has been assigned."],
];

async function loadVotes() {
  const voterId = (await cookies()).get(VOTER_COOKIE)?.value;
  try {
    const store = getVoteStore();
    const [tallies, mine] = await Promise.all([
      store.tallies(),
      voterId ? store.votesFor(voterId) : Promise.resolve({}),
    ]);
    return { tallies, mine };
  } catch {
    return { tallies: {}, mine: {} };
  }
}

export default async function Home() {
  const { tallies, mine } = await loadVotes();
  return (
    <div className="home">
      <section className="home-lead">
        <h1>A permanent public identifier for every accommodation unit</h1>
        <p className="lede">
          OpenRoomID gives each room one name that never changes. Any person
          or system can resolve it to check that the room exists.
          Assignment and resolution are free.
        </p>
      </section>

      <aside className="home-rail" aria-labelledby="status-heading">
        <div className="status-panel">
          <h2 id="status-heading">Document status</h2>
          <dl>
            <div>
              <dt>Specification</dt>
              <dd>
                <Link href="/spec/1.0">Version 1.0</Link>, Working Draft
              </dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>August 9, 2026</dd>
            </div>
            <div>
              <dt>Paper</dt>
              <dd>
                <Link href="/paper">Draft v0.2</Link>, September 29, 2026
              </dd>
            </div>
            <div>
              <dt>Registry</dt>
              <dd>Demonstration records only</dd>
            </div>
            <div>
              <dt>Registrar</dt>
              <dd>The OpenRoomID Project</dd>
            </div>
            <div>
              <dt>Licenses</dt>
              <dd>Specification CC BY 4.0. Records CC0.</dd>
            </div>
            <div>
              <dt>Feedback</dt>
              <dd>
                <a href="https://github.com/curtiscrimmins/openroomid/issues">
                  Public issue tracker
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </aside>

      <div className="doc">
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
                <span className={`anatomy-chars ${seg.cls}`}>{seg.chars}</span>
                <span className="anatomy-tag">
                  {seg.tag}
                  <small>{seg.note}</small>
                  <Hint align={seg.align}>{seg.hint}</Hint>
                </span>
              </span>
            </span>
          ))}
        </div>
        <p>
          The property code alone, <code>7QM4KX92</code>, names the building.
          The URI form is <code>rid:7QM4KX92-1412-B</code>. The full grammar
          is in <Link href="/spec/1.0#section-3">section 3</Link> of the
          specification.
        </p>

        <h2>Look up an identifier</h2>
        <ResolverBox />

        <h2>What a lookup returns</h2>
        <table>
          <thead>
            <tr>
              <th scope="col" className="col-status">Status</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {ANSWERS.map(([status, meaning]) => (
              <tr key={status}>
                <td className="font-semibold">{status}</td>
                <td>{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          A record also names the property and the supersession chain. It
          never carries rates, availability, scores, reviews, or condition.
          Naming a room is shared infrastructure. Describing one is a
          product, and the two are kept apart.
        </p>

        <h2>Purpose</h2>
        <p>
          Booking sites, software agents, and guests cannot check today that
          a listed room exists, or that two listings describe the same room.
          OpenRoomID makes one rule enforceable: a roomID may be live under
          one listing at a time. The <Link href="/paper">paper</Link> sets
          out the reasoning.
        </p>

        <h2>Governance</h2>
        <p>
          The OpenRoomID Project is the registrar. It sells nothing. Its
          founding sponsor, Roomza, Inc., funds operation and sells room
          data outside the registry, which the specification forbids the
          registry to favor. The full registry is published under CC0, so
          anyone can verify it or run a second resolver. See{" "}
          <Link href="/spec/1.0#section-7">section 7</Link>. The Project is
          run by volunteers, and several{" "}
          <Link href="/volunteer">roles are open</Link>.
        </p>

        <h2 id="open-questions">Open questions</h2>
        <p>
          The working group has not decided these yet. Pick the answer you
          would choose. Votes are not binding, and the working group reviews
          them before it rules. To make a longer case, open an issue on the{" "}
          <a href="https://github.com/curtiscrimmins/openroomid/issues">
            public tracker
          </a>
          .
        </p>
        <OpenQuestions questions={OPEN_QUESTIONS} tallies={tallies} mine={mine} />
        <p className="text-sm text-muted">
          One vote per question per browser. Your browser keeps an anonymous
          random ID so you can change your vote. Nothing else about you is
          stored.
        </p>

        <h2>Documents</h2>
        <ul>
          <li>
            <Link href="/spec/1.0">Specification 1.0</Link>, the normative
            syntax, assignment, lifecycle, and resolution rules
          </li>
          <li>
            <Link href="/paper">Paper</Link>, the reasoning behind the
            standard
          </li>
          <li>
            <Link href="/registry">Registry policy</Link>, how a property
            requests identifiers
          </li>
          <li>
            <Link href="/implement">Implementation guide</Link>, markup for
            property and room pages
          </li>
        </ul>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Dated changes to the OpenRoomID standard and this site.",
};

interface Entry {
  date: string;
  items: React.ReactNode[];
}

const ENTRIES: Entry[] = [
  {
    date: "2026-09-30",
    items: [
      <span key="volunteer">
        <Link href="/volunteer">Volunteer roles</Link> published, with an
        application form.
      </span>,
      <span key="votes">
        Open questions are on the <Link href="/#open-questions">home page</Link>{" "}
        with a public, nonbinding vote. The working group reviews the
        results before it rules.
      </span>,
    ],
  },
  {
    date: "2026-09-29",
    items: [
      <span key="resolutions">
        Working group resolutions adopted in{" "}
        <Link href="/spec/1.0">Specification 1.0</Link>. Named, unlabeled,
        and unstable rooms get a four-character code from the registrar,
        and names become display data (section 4.2). Records carry a claim
        status, a sale ends the claim, and no one can delete a record
        (section 4.4). Private homes publish their town, not their street
        (section 4.5). The question of whether the door number belongs in
        the identifier is resolved (section 5.6).
      </span>,
      <span key="registrar">
        The registrar is now the OpenRoomID Project. Roomza, Inc. is
        disclosed as founding sponsor. Registry records are licensed CC0.
      </span>,
      <span key="paper">
        <Link href="/paper">Paper</Link> published as working draft v0.2.
      </span>,
      <span key="identity">
        New site identity. The standard is written OpenRoomID.
      </span>,
    ],
  },
  {
    date: "2026-08-09",
    items: [
      <span key="spec">
        <Link href="/spec/1.0">Specification 1.0</Link> published as a
        Working Draft. The identifier syntax in section 3 is stable; open
        questions, including unit identity across renumbering, are marked
        inline.
      </span>,
      <span key="site">
        openroomid.org launches: public resolver with HTML and JSON-LD
        responses, <Link href="/registry">registry policy</Link> with free
        intake, and the{" "}
        <Link href="/implement">implementation guide</Link>.
      </span>,
      <span key="seed">
        Registry seeded with demonstration records for one property (El
        Cortez Hotel &amp; Casino, Las Vegas), marked as demo data. No
        production registrations exist yet.
      </span>,
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="doc">
      <h1>Changelog</h1>
      {ENTRIES.map((entry) => (
        <section key={entry.date}>
          <h2>{entry.date}</h2>
          <ul>
            {entry.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Dated changes to the Open Room ID standard and this site.",
};

interface Entry {
  date: string;
  items: React.ReactNode[];
}

const ENTRIES: Entry[] = [
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
          <h2 className="font-mono text-[1.05rem]">{entry.date}</h2>
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

import type { Metadata } from "next";

import { ROLES } from "@/data/roles";

import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Volunteer roles",
  description:
    "Open volunteer roles at the OpenRoomID Project: working group seats, specification editor, legal counsel, reference libraries, integration, data stewardship, security review, standards liaison, and pilot properties.",
};

export default function VolunteerPage() {
  return (
    <div className="doc">
      <h1>Volunteer roles</h1>
      <p className="lede">
        OpenRoomID is run by volunteers. These are the roles the Project
        needs filled now, in rough order of need.
      </p>

      <div className="front-matter">
        <p>
          <strong>Terms.</strong> Every role is unpaid unless the role says
          otherwise. Travel and other legitimate expenses are reimbursed when
          approved in advance.
        </p>
        <p>
          <strong>Independence.</strong> You serve as an individual, not for
          your employer. You disclose your affiliations when you apply and
          whenever they change. Work you contribute to the specification is
          licensed CC BY 4.0, and work on registry data is CC0.
        </p>
      </div>

      <h2>Open now</h2>
      <nav aria-label="Roles" className="role-index">
        <ul>
          {ROLES.map((r) => (
            <li key={r.id}>
              <a href={`#${r.id}`}>{r.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      {ROLES.map((r) => (
        <section key={r.id} id={r.id} className="role" aria-labelledby={`${r.id}-title`}>
          <h3 id={`${r.id}-title`}>{r.title}</h3>
          <p>{r.summary}</p>
          {r.seats && (
            <>
              <p className="role-label">Open seats</p>
              <ul>
                {r.seats.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          <p className="role-label">You would</p>
          <ul>
            {r.duties.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <dl className="role-meta">
            <div>
              <dt>Helpful background</dt>
              <dd>{r.background}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{r.time}</dd>
            </div>
            <div>
              <dt>Compensation</dt>
              <dd>{r.compensation ?? "Volunteer. Approved expenses reimbursed."}</dd>
            </div>
          </dl>
        </section>
      ))}

      <h2 id="apply">Apply</h2>
      <p>
        Tell us which role and what you would bring. A member of the working
        group replies to every application. Your details are seen only by
        the working group and are never published.
      </p>
      <ApplyForm />
    </div>
  );
}

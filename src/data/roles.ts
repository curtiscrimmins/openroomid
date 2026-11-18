/**
 * Open volunteer roles for the OpenRoomID Project. All roles are unpaid
 * unless a role says otherwise. Edit this list as roles are filled; keep
 * each id stable, because applications reference it.
 */

export interface Role {
  id: string;
  title: string;
  summary: string;
  duties: string[];
  background: string;
  time: string;
  /** Set only when a role is not a volunteer role. */
  compensation?: string;
  seats?: string[];
}

export const ROLES: Role[] = [
  {
    id: "working-group",
    title: "Working group member",
    summary:
      "Decide the open questions and approve every change to the specification. The working group is small today, and it needs people who see the problem from other sides of the industry.",
    seats: [
      "Hotel operations: front office, rooms, or revenue",
      "Distribution and technology: a booking site, channel manager, property system, or agent platform",
      "Guests: a consumer advocate, accessibility advocate, or travel writer",
    ],
    duties: [
      "Read proposals and the public votes before each decision",
      "Join a working group call and vote on resolutions",
      "Explain the reasoning behind each decision in writing",
    ],
    background:
      "Direct experience of one of the three seats. You serve as an individual, not for your employer.",
    time: "About one call and three hours of reading a month",
  },
  {
    id: "spec-editor",
    title: "Specification editor",
    summary:
      "Take the specification from Working Draft to Published. Once published, a version can never change, so the text has to be right.",
    duties: [
      "Tighten normative language, the grammar, and the examples",
      "Keep the specification, the paper, and the reference resolver in step",
      "Prepare a provisional registration of the rid: URI scheme under RFC 7595",
    ],
    background:
      "You have edited an RFC, a W3C or OpenTravel document, or a comparable technical standard.",
    time: "About four hours a week for two to three months",
  },
  {
    id: "legal-counsel",
    title: "Legal counsel",
    summary:
      "Give the Project a legal form that matches its promises. Today the name and domain are held by the founding sponsor. That has to change before large platforms rely on the registry.",
    duties: [
      "Advise on forming an entity of the Project's own, likely a nonprofit",
      "Plan the transfer of the name and domain from the founding sponsor",
      "Review the permanence commitments, which are meant to be irrevocable",
      "Review licensing (CC BY 4.0 and CC0) and the privacy rule for residences",
    ],
    background:
      "A licensed attorney with nonprofit, open-standards, or intellectual property experience. Offered pro bono.",
    time: "A few hours a month, more during entity formation",
  },
  {
    id: "reference-libraries",
    title: "Reference library maintainer",
    summary:
      "Write and maintain small, dependable libraries so implementers never hand-roll the grammar.",
    duties: [
      "Build parse, validate, normalize, and resolve functions in TypeScript, Python, or Go",
      "Share one set of test cases across every language",
      "Review contributions and publish releases",
    ],
    background:
      "You have maintained an open-source package that other people depend on.",
    time: "About two hours a week",
  },
  {
    id: "pms-integration",
    title: "Property system integration engineer",
    summary:
      "Connect the registry to the systems hotels already run, so a room list comes from the source of truth rather than a spreadsheet.",
    duties: [
      "Map roomID to the room record in Mews, apaleo, Oracle OPERA Cloud, and Cloudbeds",
      "Build a reference sync that reads a property's rooms with the hotel's permission",
      "Document the binding so any property system can adopt it",
    ],
    background:
      "Hands-on work with a hotel property management system API.",
    time: "About four hours a week for a first integration",
  },
  {
    id: "data-steward",
    title: "Registry data steward",
    summary:
      "Keep the registry accurate. Every record the registry publishes is permanent, so each one is checked before it is issued.",
    duties: [
      "Check property requests against street address and parcel records",
      "Catch duplicate properties before a second code is issued",
      "Handle corrections and disputes, and record each outcome",
    ],
    background:
      "Careful with records. Experience with property data, hotel content, or public records helps.",
    time: "About two hours a week, varying with intake",
  },
  {
    id: "security-privacy",
    title: "Security and privacy reviewer",
    summary:
      "Review the resolver and registry before real properties depend on them.",
    duties: [
      "Review rate limiting, abuse cases, and how votes are counted",
      "Review how residence addresses are kept out of public records",
      "Write the Project's vulnerability disclosure policy",
    ],
    background: "Application security or privacy engineering experience.",
    time: "A focused review of about ten hours, then as needed",
  },
  {
    id: "standards-liaison",
    title: "Standards liaison",
    summary:
      "Build the path to long-term stewardship. The plan is for OpenRoomID to move to an established standards venue once it is in wide use.",
    duties: [
      "Open conversations with hospitality and web standards groups",
      "Represent OpenRoomID where schema.org and industry vocabularies meet",
      "Help name the successor that would take over if the Project stopped",
    ],
    background:
      "You have participated in HTNG, OpenTravel, W3C, schema.org, or a similar body.",
    time: "About two hours a month",
  },
  {
    id: "pilot-property",
    title: "Pilot property",
    summary:
      "Be among the first properties with real identifiers. This role is for a property, represented by its operator or general manager.",
    duties: [
      "Provide your room list, or connect your property system",
      "Post identifiers where guests can see them",
      "Tell the working group what was hard",
    ],
    background:
      "You operate a hotel, hostel, or other lodging property and can speak for it.",
    time: "About two hours to register, then minutes a month",
  },
];

export function findRole(id: string) {
  return ROLES.find((r) => r.id === id) ?? null;
}

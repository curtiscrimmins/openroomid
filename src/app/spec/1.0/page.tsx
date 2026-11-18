import type { Metadata } from "next";
import Link from "next/link";

import { RoomId } from "@/components/RoomId";

export const metadata: Metadata = {
  title: "OpenRoomID Specification 1.0",
  description:
    "The normative definition of the roomID identifier: syntax, assignment, lifecycle, resolution, and governance.",
};

function Anchor({ id }: { id: string }) {
  return (
    <a className="anchor" href={`#${id}`} aria-label="Link to this section">
      &sect;
    </a>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id}>
      {children}
      <Anchor id={id} />
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id}>
      {children}
      <Anchor id={id} />
    </h3>
  );
}

function OpenIssue({
  children,
  vote,
}: {
  children: React.ReactNode;
  vote?: string;
}) {
  return (
    <div className="open-issue">
      <strong>[OPEN ISSUE]</strong> {children}
      {vote ? (
        <>
          {" "}
          <Link href={`/#q-${vote}`}>Vote on this question</Link>.
        </>
      ) : null}
    </div>
  );
}

function Resolved({ date, children }: { date: string; children: React.ReactNode }) {
  return (
    <div className="resolved">
      <strong>Resolved {date}.</strong> {children}
    </div>
  );
}

const TOC = [
  ["abstract", "Abstract"],
  ["section-1", "1. Problem"],
  ["section-2", "2. Terminology"],
  ["section-3", "3. Identifier syntax"],
  ["section-4", "4. Assignment rules"],
  ["section-5", "5. Lifecycle"],
  ["section-6", "6. Resolution and content negotiation"],
  ["section-7", "7. Governance and permanence commitments"],
  ["section-8", "8. Security and privacy considerations"],
  ["section-9", "9. Adoption path"],
  ["section-10", "10. Registry considerations"],
];

export default function Spec10() {
  return (
    <div className="doc">
      <h1>OpenRoomID Specification</h1>
      <p className="text-muted">Version 1.0</p>

      <div className="front-matter">
        <p className="label-caps mb-1">Status of this document</p>
        <p>
          Working Draft, published 9 August 2026, revised 29 September
          2026 with the working group&rsquo;s resolutions on unit labels,
          claims, and residences. This document is under
          review by the OpenRoomID working group and is not yet final.
          Open questions are marked <strong>[OPEN ISSUE]</strong> inline.
          When the status changes to Published, this document becomes
          immutable at this URL and any further change will appear as a new
          version at its own URL. The identifier syntax in section 3 is
          stable and implementations may rely on it.
        </p>
        <p>
          The registrar is the OpenRoomID Project. Comments go to the{" "}
          <a href="https://github.com/curtiscrimmins/openroomid/issues">public issue tracker</a>{" "}
          or <a href="mailto:registry@openroomid.org">registry@openroomid.org</a>.
        </p>
      </div>

      <p>
        The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD,
        SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to
        be interpreted as described in RFC 2119.
      </p>

      <h2 id="toc">Contents</h2>
      <ul>
        {TOC.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ul>

      <H2 id="abstract">Abstract</H2>
      <p>
        This specification defines <strong>roomID</strong>, a permanent,
        publicly resolvable identifier for a single hotel accommodation
        unit: one physical room. It specifies the identifier syntax, the
        rules under which identifiers are assigned, the lifecycle of an
        identifier through renumbering, subdivision, property sale, and
        demolition, and the behavior of the public resolver at
        openroomid.org. The registry stores identity only. Attributes,
        pricing, availability, and evidence about rooms are out of scope by
        design.
      </p>

      <H2 id="section-1">1. Problem</H2>
      <H3 id="section-1-1">1.1 Categories are sold, units are slept in</H3>
      <p>
        The hotel booking stack transacts on room categories: Deluxe King,
        Standard Queen, City View. The guest experiences a specific
        physical unit: room 1412, with its particular window, wall, and
        neighbor. The mapping from category to unit happens late, inside
        the property management system, and is invisible to every external
        system. As a result, no external system can refer to the thing the
        guest actually receives.
      </p>
      <p>
        Software that acts on behalf of guests needs referential
        integrity. A system that selects a particular unit must be able to
        refer to that unit through discovery, comparison, booking,
        pre-arrival, the stay, and review, and must be able to refer to the
        same unit again next year. Today there is no shared identifier for
        the accommodation unit. Each PMS has internal unit records; none of
        them are public, portable, or permanent.
      </p>
      <H3 id="section-1-2">1.2 Goal</H3>
      <p>
        OpenRoomID gives every accommodation unit a public, permanent
        name. The identifier does one job: it lets independent systems
        agree that they are talking about the same physical room. It
        carries no judgment about the room and no data beyond identity.
      </p>
      <H3 id="section-1-3">1.3 Out of scope</H3>
      <p>
        The following are deliberately excluded from this specification and
        from the registry, and MUST NOT be added to either: room
        attributes (view, bed, layout, noise, condition), quality scores,
        review counts, rates, availability, transaction state, and
        evidence or provenance about any of these. Systems that need such
        data obtain it from commercial providers and join it to the unit
        by roomID. Keeping the identity layer free of descriptive data is
        what allows it to remain neutral, free, and permanent.
      </p>

      <H2 id="section-2">2. Terminology</H2>
      <table>
        <tbody>
          <tr>
            <th>Property</th>
            <td>
              A lodging establishment at a physical location: a hotel,
              motel, hostel, or comparable operation.
            </td>
          </tr>
          <tr>
            <th>Accommodation unit</th>
            <td>
              A single physically bounded space that a guest can occupy
              under one booking: typically one room, identified by one
              door.
            </td>
          </tr>
          <tr>
            <th>Property code</th>
            <td>
              The 8-character registrar-assigned code naming a property.
            </td>
          </tr>
          <tr>
            <th>Room designator</th>
            <td>
              The label the property itself uses for the unit, usually the
              number on the door.
            </td>
          </tr>
          <tr>
            <th>Unit suffix</th>
            <td>
              A single letter distinguishing successive physical units
              that have carried the same designator.
            </td>
          </tr>
          <tr>
            <th>Registrar</th>
            <td>
              The organization operating the registry and the resolver.
              Currently the OpenRoomID Project.
            </td>
          </tr>
          <tr>
            <th>Registrant</th>
            <td>
              The party that requested identifiers for a property,
              normally the property operator.
            </td>
          </tr>
          <tr>
            <th>Resolver</th>
            <td>
              The public service that returns the registry record for an
              identifier.
            </td>
          </tr>
          <tr>
            <th>Supersession chain</th>
            <td>
              The linked sequence of identifiers that have named the same
              physical unit over time, connected by supersededBy links.
            </td>
          </tr>
        </tbody>
      </table>

      <H2 id="section-3">3. Identifier syntax</H2>
      <H3 id="section-3-1">3.1 String form</H3>
      <p>
        A unit identifier is three segments joined by hyphens:
      </p>
      <p className="text-lede">
        <RoomId id="7QM4KX92-1412-B" />
      </p>
      <ul>
        <li>
          <strong>Property code</strong>: exactly 8 characters from the
          Crockford base32 alphabet, the digits 0 to 9 and the uppercase
          letters A to Z excluding I, L, O, and U.
        </li>
        <li>
          <strong>Room designator</strong>: 1 to 10 characters from
          A to Z, a to z, and 0 to 9. Case is preserved as registered and
          MUST be ignored on lookup. A designator is either the label on
          the door or a code assigned by the registrar (section 4.2).
        </li>
        <li>
          <strong>Unit suffix</strong>: exactly one uppercase letter A to
          Z.
        </li>
      </ul>
      <p>
        The property-only form is the bare property code:{" "}
        <code>7QM4KX92</code>. The canonical URI form prefixes the scheme{" "}
        <code>rid:</code>, as in <code>rid:7QM4KX92-1412-B</code>.
      </p>
      <H3 id="section-3-2">3.2 ABNF</H3>
      <pre>
        <code>{`rid-uri         = "rid:" ( roomid / property-code )
roomid          = property-code "-" room-designator "-" unit-suffix
property-code   = 8crockford
room-designator = 1*10( ALPHA / DIGIT )
unit-suffix     = %x41-5A                ; A-Z
crockford       = DIGIT / %x41-48        ; A-H
                / %x4A-4B                ; J-K
                / %x4D-4E                ; M-N
                / %x50-54                ; P-T
                / %x56-5A                ; V-Z`}</code>
      </pre>
      <H3 id="section-3-3">3.3 Case and confusable handling</H3>
      <p>
        The canonical form of the property code and the unit suffix is
        uppercase. Resolvers MUST accept lowercase input and fold it to
        uppercase. In the property code, resolvers MUST additionally fold
        the letters I and L to the digit 1 and the letter O to the digit
        0, following Crockford base32 decoding practice. The letter U has
        no fold and is invalid. These folds apply to the property code
        only; the room designator is a hotel-assigned label, not base32
        data, and MUST NOT be remapped.
      </p>
      <p>
        Room designator lookups are case-insensitive. Registries MUST
        store the designator in the casing the registrant supplied and
        MUST reject two registrations within one property whose
        designator and suffix differ only by case.
      </p>

      <H2 id="section-4">4. Assignment rules</H2>
      <H3 id="section-4-1">4.1 Property codes</H3>
      <p>
        Property codes are generated by the registrar. They MUST be drawn
        uniformly at random from the code space and MUST NOT encode
        meaning of any kind: no sequence, no geography, no brand, no
        registration date. A property code names the physical property at
        its location. One property SHALL have at most one active property
        code.
      </p>
      <H3 id="section-4-2">4.2 Unit identifiers</H3>
      <p>
        Unit identifiers are formed by the registrant from the property
        code and the property&apos;s own room designators. The designator
        SHOULD be the label a guest would see on the door. The unit
        suffix for a newly registered unit MUST be A. Subsequent letters
        are assigned only through the lifecycle events in section 5.
      </p>
      <p>
        The pair of designator and suffix MUST be unique within a
        property, compared case-insensitively.
      </p>
      <p>
        Every unit record states the source of its designator:{" "}
        <code>door</code> or <code>assigned</code>.
      </p>
      <p>
        <strong>Door designators.</strong> A unit with a short, stable
        label on its door SHOULD use that label as its designator, so that
        anyone in the room can check the identifier against the door.
      </p>
      <p>
        <strong>Assigned designators.</strong> A unit whose label is a
        name, is longer than 10 characters, is absent, or is expected to
        change SHOULD receive a designator assigned by the registrar. An
        assigned designator is exactly 4 characters from the Crockford
        base32 alphabet. The registrar MUST check it against every
        designator ever used at the property, door or assigned, and MUST
        NOT reuse it. The property SHOULD display it inside the unit.
        The operator chooses the source unit by unit.
      </p>
      <p>
        <strong>Names.</strong> A unit&rsquo;s name, such as &ldquo;The
        Hemingway Suite,&rdquo; is display data carried in the record. A
        change of name MUST NOT change the identifier. Moving a unit from a
        door designator to an assigned one is a supersession under
        section 5.2.
      </p>
      <H3 id="section-4-3">4.3 Who may register</H3>
      <p>
        The property operator, or an agent it authorizes, may request
        identifiers for a property. Assignment is free of charge in all
        cases (section 7).
      </p>
      <OpenIssue vote="pre-registration">
        Whether a third party MAY register identifiers for a property
        whose operator has not claimed them, for example a booking
        platform pre-registering units it has mapped, is unresolved. Pre-
        registration accelerates coverage but risks designator errors the
        operator must later correct, and it raises the question of who
        holds authority over the record until the operator claims it.
      </OpenIssue>
      <OpenIssue vote="composed-units">
        Composed and related units are unresolved. A suite that is
        physically two units behind one door, and pairs of connecting
        rooms, both matter to real bookings. Composition (this unit
        consists of those units) is arguably identity and may belong in
        the registry; adjacency (this unit connects to that one) is
        descriptive data and likely does not. The working group has not
        yet fixed this line, and v1.0 registers only simple units.
      </OpenIssue>

      <H3 id="section-4-4">4.4 Claims and withdrawal</H3>
      <p>
        A property record is <code>claimed</code> when its current
        operator has confirmed it, and <code>unclaimed</code> otherwise.
        A claimed record carries the date the operator last confirmed its
        unit list. Claims belong to the operator; records belong to the
        property.
      </p>
      <ul>
        <li>
          An operator MAY withdraw its claim at any time. Withdrawal
          returns the record to <code>unclaimed</code>. It MUST NOT
          delete, retire, or alter any identifier.
        </li>
        <li>
          A change of operator, by sale or otherwise, ends the claim. The
          identifiers are unaffected. The new operator MAY claim the
          record by the same process as any operator.
        </li>
        <li>
          No party MAY delete a record, including the registrar.
        </li>
      </ul>
      <p>
        Consumers SHOULD weigh the claim status and the last confirmation
        date when deciding how far to rely on a record.
      </p>

      <H3 id="section-4-5">4.5 Residences</H3>
      <p>
        When a property is an owner-occupied residence, its public record
        and the public registry dump MUST NOT include its street address.
        They carry the locality, region, and country only, and the record
        is marked <code>residence</code>. The registrar holds the full
        address privately and uses it only to prevent a second code for
        the same building. This is the only exception to full publication
        under section 7.
      </p>

      <H2 id="section-5">5. Lifecycle</H2>
      <H3 id="section-5-1">5.1 Statuses</H3>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Meaning</th>
            <th>Resolver behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>active</code>
            </td>
            <td>The unit exists and the identifier names it.</td>
            <td>200 with the record</td>
          </tr>
          <tr>
            <td>
              <code>retired</code>
            </td>
            <td>
              The unit no longer exists as an accommodation unit, through
              demolition or conversion.
            </td>
            <td>200 with the record, never 404</td>
          </tr>
          <tr>
            <td>
              <code>superseded</code>
            </td>
            <td>
              A successor identifier now names the physical unit.
            </td>
            <td>301 to the successor, with supersededBy</td>
          </tr>
        </tbody>
      </table>
      <p>
        Identifiers are permanent. The registry MUST NOT delete a record,
        reassign an identifier to a different physical unit, or allow an
        identifier that has ever resolved to stop resolving.
      </p>
      <H3 id="section-5-2">5.2 Renumbering</H3>
      <p>
        When a property renumbers a room, the physical unit gains a new
        identifier carrying the new designator, with the next unused
        suffix for that designator. The old identifier becomes superseded
        and MUST link to the successor. A system holding the old
        identifier resolves, follows one 301, and reaches the same
        physical unit. The supersession chain, not the string, is the
        durable identity of the physical unit.
      </p>
      <H3 id="section-5-3">5.3 Subdivision and combination</H3>
      <p>
        When one unit is split into two, or two are combined into one,
        the resulting units are new physical spaces and MUST receive new
        identifiers. The prior identifiers become retired or superseded.
      </p>
      <OpenIssue>
        supersededBy is single-valued in v1.0, which cannot represent a
        split (one predecessor, two successors) without losing
        information. Candidates: allow supersededBy to hold a list, or
        retire the predecessor and record successors in a separate
        relation. Until resolved, a subdivided unit SHOULD be marked
        retired rather than superseded.
      </OpenIssue>
      <H3 id="section-5-4">5.4 Property sale and rebranding</H3>
      <p>
        The property code names the physical property, not its owner,
        operator, or brand. Sale, franchise change, or renaming MUST NOT
        change the property code or any unit identifier. The registry
        updates the display name. A change of operator ends any claim on
        the record (section 4.4).
      </p>
      <H3 id="section-5-5">5.5 Demolition</H3>
      <p>
        When a property is demolished, its property code and all unit
        identifiers become retired. They continue to resolve permanently
        with status retired.
      </p>
      <H3 id="section-5-6">5.6 Identity of the identifier</H3>
      <Resolved date="29 September 2026">
        The working group considered whether the permanent identifier
        should contain the door number at all, or be fully opaque with the
        door number as mutable metadata. It adopted a mixed design.
        Units with a stable door label keep it in the identifier, because
        a person can check it against the door without a lookup. Units
        that are named, unlabeled, or likely to change receive an opaque
        assigned designator under section 4.2, so a rename never mints a
        new identifier. The record states which kind each unit carries.
        Both kinds survive renumbering through the supersession chain.
      </Resolved>

      <H2 id="section-6">6. Resolution and content negotiation</H2>
      <H3 id="section-6-1">6.1 Resolver URLs</H3>
      <p>
        Every identifier resolves at{" "}
        <code>https://openroomid.org/&#123;identifier&#125;</code>. The
        resolver MUST accept the unit form, the property-only form, and
        the rid: URI form, applying the folds in section 3.3.
      </p>
      <H3 id="section-6-2">6.2 Content negotiation</H3>
      <p>
        A request whose Accept header includes application/ld+json or
        application/json receives JSON-LD. Any other request receives
        HTML. Appending <code>.json</code> to the path or the query
        parameter <code>?format=json</code> forces JSON regardless of
        Accept.
      </p>
      <H3 id="section-6-3">6.3 Response semantics</H3>
      <table>
        <thead>
          <tr>
            <th>Case</th>
            <th>Status</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Registered, active or retired</td>
            <td>200</td>
            <td>The record</td>
          </tr>
          <tr>
            <td>Registered, superseded</td>
            <td>301</td>
            <td>Location of the successor, plus supersededBy</td>
          </tr>
          <tr>
            <td>Well-formed, not registered</td>
            <td>404</td>
            <td>
              An error stating the syntax is valid and the identifier is
              unassigned
            </td>
          </tr>
          <tr>
            <td>Malformed</td>
            <td>400</td>
            <td>An error naming the failing syntax rule</td>
          </tr>
          <tr>
            <td>Rate limited</td>
            <td>429</td>
            <td>Retry-After header</td>
          </tr>
        </tbody>
      </table>
      <p>
        Every resolver response carries{" "}
        <code>Access-Control-Allow-Origin: *</code>,{" "}
        <code>Cache-Control: public, max-age=3600</code>, and a Link
        header referencing this specification. The rate limit is 60
        requests per minute per IP.
      </p>
      <H3 id="section-6-4">6.4 JSON-LD record</H3>
      <p>A registered unit returns a schema.org HotelRoom:</p>
      <pre>
        <code>{`{
  "@context": "https://schema.org",
  "@type": "HotelRoom",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "roomID",
    "value": "7QM4KX92-1412-B"
  },
  "name": "Room 1412",
  "designatorSource": "door",
  "floorLevel": "14",
  "containedInPlace": {
    "@type": "Hotel",
    "name": "El Cortez Hotel & Casino",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "roomID:property",
      "value": "7QM4KX92"
    }
  },
  "status": "active",
  "assigned": "2026-08-14",
  "spec": "https://openroomid.org/spec/1.0"
}`}</code>
      </pre>
      <p>
        <code>designatorSource</code> is <code>door</code> or{" "}
        <code>assigned</code> (section 4.2). A property code returns a
        schema.org Hotel whose containsPlace is an array of unit resolver
        URLs. It also carries <code>claim</code>, either{" "}
        <code>claimed</code> or <code>unclaimed</code>, and, when claimed,{" "}
        <code>lastConfirmed</code> (section 4.4). A residence carries{" "}
        <code>&quot;residence&quot;: true</code> and no street address
        (section 4.5). Records seeded by the registrar
        for demonstration carry <code>&quot;demo&quot;: true</code>.
      </p>
      <H3 id="section-6-5">6.5 Current identifier lookup</H3>
      <p>
        Because supersession chains carry unit identity across
        renumbering, a resolver client obtains the current identifier for
        any historical one by following 301 redirects to the end of the
        chain. Clients SHOULD store the identifier they resolved to, and
        MAY treat any identifier in a chain as referring to the same
        physical unit.
      </p>

      <H2 id="section-7">7. Governance and permanence commitments</H2>
      <p>
        The registrar operates under the following commitments, which are
        conditions of the standard rather than promises of convenience:
      </p>
      <ol>
        <li>
          Identifier assignment and resolution are free of charge, for
          any party, at any volume consistent with the published rate
          limits. This will not change.
        </li>
        <li>
          The registry never deletes an identifier and never reassigns
          one to a different physical unit.
        </li>
        <li>
          A published specification version is immutable at its URL.
          Changes appear only as new versions at new URLs.
        </li>
        <li>
          The resolver requires no authentication, no account, and no
          key.
        </li>
        <li>
          The registry stores identity only, as defined in section 1.3.
          The registrar sells nothing. Its founding sponsor, Roomza, Inc.,
          sells products built around the identifier; those products live
          outside the registry, and the registry MUST NOT privilege any
          sponsor&rsquo;s products over anyone else&rsquo;s.
        </li>
        <li>
          The full registry is exportable: the registrar SHALL publish
          periodic public dumps of all identifier records, so that the
          registry can be reconstructed by others if the registrar
          ceases to operate. Residence street addresses are withheld under
          section 4.5 and nothing else is.
        </li>
      </ol>
      <OpenIssue vote="succession">
        The succession mechanism if the registrar ceases operation is not
        yet formalized: candidates include a standing data escrow with a
        neutral third party and a chartered successor process. Public
        dumps (commitment 6) are the interim answer.
      </OpenIssue>

      <H2 id="section-8">8. Security and privacy considerations</H2>
      <p>
        Registry records describe buildings, not people. A record MUST
        NOT contain personal data: no guest information, no staff
        information, no occupancy state. The assigned date describes the
        identifier, not any stay.
      </p>
      <p>
        Identifiers MUST NOT be used to encode occupancy or presence.
        Publishing that a room exists is harmless; publishing that a
        person is in it is not, and no field of this standard carries
        that.
      </p>
      <p>
        Property codes are random (section 4.1), so the code space
        reveals nothing about registration order or location. The
        registry itself is public by design; enumeration of registered
        identifiers is expected and rate limited rather than prevented.
      </p>
      <p>
        The resolver is the sole authority for what an identifier names.
        Systems MUST obtain records over TLS from openroomid.org and
        SHOULD treat identifier assertions found elsewhere, for example
        in a hotel&apos;s own markup, as claims to verify against the
        resolver rather than as facts.
      </p>

      <H2 id="section-9">9. Adoption path</H2>
      <p>
        The standard is useful before it is universal, and each step
        below has value on its own:
      </p>
      <ol>
        <li>
          A property registers its property code. Its pages and feeds
          can now carry one identifier that every system resolves the
          same way.
        </li>
        <li>
          The property registers its units and adds roomID markup to
          room-level pages (see the{" "}
          <Link href="/implement">implementation guide</Link>).
        </li>
        <li>
          A PMS or channel manager stores the roomID alongside its
          internal unit record, giving external systems a stable join
          key.
        </li>
        <li>
          Booking flows carry the identifier through, for example as a{" "}
          <code>rid</code> parameter on booking URLs, so that a
          selection made upstream survives to assignment.
        </li>
      </ol>
      <p>
        No hotel has implemented this standard yet. The registry opens
        with demonstration records only, and this page will not claim
        otherwise until it is otherwise.
      </p>

      <H2 id="section-10">10. Registry considerations</H2>
      <p>
        This section records the registries this standard itself
        requires, in the manner of an IANA considerations section.
      </p>
      <ul>
        <li>
          <strong>Status registry</strong>: the values active, retired,
          and superseded. Additions require a new specification version.
        </li>
        <li>
          <strong>Specification version registry</strong>: 1.0, this
          document. Every version remains available at its own URL
          permanently.
        </li>
        <li>
          <strong>Identifier registry</strong>: the property and unit
          records themselves, operated by the registrar under section 7.
        </li>
      </ul>
      <OpenIssue>
        The rid: URI scheme is not registered with IANA. A provisional
        registration under RFC 7595 SHOULD be requested before this
        document reaches Published status; until then, rid: is a
        conventional prefix rather than a registered scheme.
      </OpenIssue>
    </div>
  );
}

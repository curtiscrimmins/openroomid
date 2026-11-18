# OpenRoomID

### A public way to check that a room exists

**Working draft v0.2, September 29, 2026**

Editor: Curtis Crimmins, for the OpenRoomID Project (registrar)

Specification: https://openroomid.org/spec/1.0

Comments: https://github.com/curtiscrimmins/openroomid/issues, or registry@openroomid.org

License: this document is CC BY 4.0. The specification is CC BY 4.0. Registry records are CC0.

This paper explains the reasoning behind OpenRoomID. It is not the specification. Where the two disagree, the specification governs, and the disagreement is a bug in this paper.

---

## Abstract

In August 2026 a Las Vegas hotel sold its rooms under two hotel names that do not exist, on six booking sites, with altered photos. In the same month, seventeen generated videos on TikTok sold a suite at an Arizona resort that the resort does not have, with commission badges attached. In neither case could a booking site, a guest, or a software agent check the one fact that mattered: does this room exist, and is it the same room as that one?

Lodging has no public identifier for the thing it sells. Property codes exist, mostly inside commercial databases and mostly in Europe. Nothing exists for the unit. OpenRoomID defines roomID, a permanent, publicly resolvable identifier for a single accommodation unit and for the property that contains it. Assignment and resolution are free and stay free. The resolver answers one question, whether an identifier is live, retired, superseded, or unknown, and refuses to answer any other. This paper describes the problem, the identifier, the one rule it makes enforceable, the sources it draws on, and how it is governed so that no party, including its registrar, can bend it.

---

## 1. The problem

### 1.1 Two cases from one month

**OYO Las Vegas.** The 696-room OYO Hotel & Casino at 115 East Tropicana Avenue, formerly the Hooters hotel, listed its rooms under two additional hotel names, Palette Las Vegas and Collection O, on Booking.com, Expedia, Travelocity, Orbitz, Hotels.com, and Trip.com. The listings carried exterior photos altered to show the new names. Guests booked Palette, arrived, and were checked into the OYO. The operator later said the listings were a mistake made while "evaluating how different room categories could be positioned under different brands." Expedia disabled one listing. Six distribution platforms, each holding its own property identifier and each running its own duplicate check, did not see that three listings were one building.

**Ambiente Sedona.** Skift identified seventeen AI-generated videos on TikTok promoting Ambiente, an adults-only resort in Sedona, Arizona. The videos showed an atrium suite, a pond visible through floor-to-ceiling windows, and family amenities. None exist. One video passed 315,000 views. Each carried the badge through which a creator earns a commission on a booking made through TikTok Go, though the resort is not bookable through TikTok Go at all. One of the seventeen was labeled as generated. The owner's only remedy was to search for her own hotel and file reports.

These are not the same failure. The first is a property that lied about which building it was. The second is a stranger who invented a room inside a real building. What they share is the absence of anything to check against. There is no public name for the building that survives a rebrand, and no public name for the room that a claim can be held to.

### 1.2 Why now

Two things changed at once. Software began to transact on the guest's behalf, and software began to generate the content the guest decides from. Advice tolerates ambiguity. A recommendation can be wrong and the cost is disappointment. A booking cannot. When an agent commits a guest's money to a room, "the video showed a pond" is a liability the agent holds. Every surface that lets software book a room, and every surface that pays a commission on content that sells one, now needs a way to check that the room is real. None of them can supply that check neutrally, and none of them did.

### 1.3 Prior art, and where it stopped

The industry has solved this problem once, at the property level, in one region. TTIcodes, launched in 2012 by the Travel Technology Initiative and operated by GIATA, assign a random eight-digit number with a check digit to each hotel. About 200,000 properties carry one. Over a decade it became the standard European tour operators and bed banks use to deduplicate hotel feeds. It is commercial, it is property-level, and its adoption is thin in the United States, which is where OYO's listings went undetected.

Everything else stops at the property or the category. GDS chain and property codes name hotels for agents. OpenTravel and HTNG message standards carry room type codes, and their inventory messages have no field for a physical room. Every booking platform holds an internal property ID that it does not share. Every property management system holds room numbers that never leave the building. Hilton has let members choose an exact room from a floor plan since 2014, across more than 4,000 hotels, which proves that unit-level identity works commercially and exists internally. It does not leave Hilton.

The pattern is consistent. Where identity is shared, it stops at the property. Where identity reaches the unit, it is not shared.

---

## 2. Design principles

**P1. Identity is free.** The identifier, the specification, and resolution are free to read and free to implement, permanently and without contract. A registry that charges for naming caps itself at its own market share.

**P2. The identifier carries no vendor.** No registrar prefix, no brand string, no embedded ownership. An identifier that names its registrar invites a second registry.

**P3. Opaque at the property, legible at the unit where it can be.** The property code encodes nothing and never changes. Where a room has a stable number on its door, the unit designator matches it, so a guest can read their own roomID off the room. Where it does not, the designator is an opaque code, and section 3 explains why.

**P4. Permanence over convenience.** Codes are never reused. A retired identifier stays retired and keeps resolving. Records must survive a sale, a rebrand, a renovation, and a demolition.

**P5. One asset class, expressed as metadata.** The specification describes an accommodation unit. Hotel rooms, hostel beds, cruise cabins, serviced apartments, and rental units share one namespace, with class carried as metadata. The unresolved cases, shared and composed units, are listed in section 11.

**P6. Existence, not attribution.** The registry says whether a unit exists and which building it is in. It does not score, describe, price, or rank. Those are products. The registrar sells none of them, though its founding sponsor does. The line between the two is the neutrality the namespace depends on, and section 8 describes how it is held.

**P7. Every claim is checkable by anyone.** The whole registry is published, so any party can verify a claim, detect a duplicate, or fork the namespace without asking.

---

## 3. The identifier

The canonical form is a property code, a unit designator, and a unit suffix, joined by hyphens.

```
7QM4KX92-1412-B
```

The property code is eight characters of Crockford base32, which excludes I, L, O, and U to cut transcription error. It is registrar-assigned, opaque, and permanent. There are about 1.1 trillion of them. The unit designator is one to ten letters and digits, case preserved and matched without case. It is either the label on the door or a four-character code assigned by the registrar, and the record says which. The unit suffix is one letter, A for the first identifier issued to a designator and the next letter each time the same door number is reissued to a different physical unit. The property code resolves on its own and names the building.

The full grammar, canonical forms, the `rid:` URI prefix, and the lookup rules are in the specification, section 3. Two design choices deserve explanation here.

**Why a suffix letter and not a check character.** Version 0.1 of this paper proposed a check character in the third position. A check character is a deterministic function of the characters before it, so a reissued door number 1412 would compute the same check character and could not receive a new identifier. That collides with P4. The suffix letter makes the reissue case first-class: the old identifier becomes superseded, keeps resolving, and points forward. A check character remains a candidate for a future revision, in a fourth position, and is listed in section 11.

**Why the door number is in the identifier, and when it is not.** An opaque unit segment would be cleaner for the registrar and useless to the guest. A guest standing in room 1412 can confirm their roomID against the door. That legibility is what makes a printed sign, a receipt, or a review checkable by the person holding it.

Legibility only helps where there is a stable label to check against. Many rooms have names instead of numbers, and names change: a suite is renamed for a sponsor, or a new brand themes every floor. Cabins, tents, and rental units often have no label at all. For these units the registrar assigns a four-character code in the Crockford alphabet, such as `2H2S`, checked against every label ever used at the property and never reused. The room's name is kept in the record as display data, so a rename changes the name and not the identifier. The property is asked to post the code in the room.

The operator chooses, room by room, and the record states which kind each room carries. The working group adopted this mixed design on September 29, 2026, closing the question in section 5.6 of the specification that had blocked Published status.

---

## 4. Lifecycle

The specification states the assignment rules in section 4 and the lifecycle rules in section 5, normatively. In summary: a property code survives sale, rebrand, and renovation, and is retired on change of use or demolition. A building rebuilt on the same site is a new building and receives a new code. A unit identifier survives category changes and refurbishment, and is superseded on renumbering, splitting, and combining, with the chain recorded in both directions. Retired identifiers resolve forever and are never reissued.

One rule is added in this revision because the August cases made its absence visible. **Retiring or superseding an identifier without a physical change to the unit is a lifecycle violation.** A property cannot shed a unit's history by declaring a new room where the old one stands. The registrar records the supersession chain, the chain is public, and a chain with no physical event behind it is visible to anyone who reads the dump.

---

## 5. Resolution

```
GET https://openroomid.org/7QM4KX92-1412-B
```

The resolver returns HTML to a browser and JSON-LD to software, free, without authentication, rate limited against abuse. Every response is one of four answers.

| Answer | Meaning |
|---|---|
| Active | The unit exists and this is its current identifier. |
| Superseded | The unit exists under a newer identifier, which is given. |
| Retired | The identifier named a real unit that no longer exists as one. The date and reason are given. |
| Not found | No such identifier has ever been assigned. |

Beyond status, a record carries the identifier, the designator and where it came from, the property it belongs to, the asset class, the assignment date, the supersession pointers, and the property's claim status. It carries nothing else. Not condition, not scores, not reviews, not noise, not views, not rates, not availability. This boundary is load-bearing. Attributes are commercial products, sold by the registrar's founding sponsor and by anyone else who cares to. Publishing them through the free resolver would make the registry a competitor to its own implementers, which is the conflict that disqualifies incumbents from running a neutral namespace.

The binding to schema.org uses the `identifier` property with a `PropertyValue` whose `propertyID` is `roomID`. This is schema.org's designed mechanism for third-party identifiers and needs no coordination with search engines or schema.org. The JSON-LD shape is in the specification, section 6.4.

---

## 6. The rule this makes enforceable

An identifier on its own catches nothing. What it enables is one rule that a platform can apply without judgment:

**A roomID may be live under one listing at a time.**

Apply it to the two cases. Palette Las Vegas and OYO Hotel & Casino sold the same 696 units. The moment both listings carried roomIDs, the second failed. No one had to decide whether Palette was a brand, a category, or a fraud. The Ambiente atrium suite carried no roomID because it has none, and a platform that requires one on any unit-level claim marks the claim unverified before a commission is paid.

The rule is deliberately set at the unit and not the property. Two listings on one property code are common and legitimate. A dual-branded tower with a Courtyard on floors two through twelve and a Residence Inn above it is one building and two hotels, with disjoint units. Property-level duplicates should be disclosed and flagged. Unit-level duplicates are rejected.

Three checks stand between a false listing and a guest, and the resolver is only the last of them.

1. **At minting.** The registrar checks the street address and parcel before issuing a property code. A second application for 115 East Tropicana Avenue does not receive a second code.
2. **At listing.** A platform that holds a roomID on each unit it sells sees a duplicate when a second listing presents the same one.
3. **At resolution.** A listing with no identifier, or an identifier the registry has never issued, fails to resolve, and the platform treats it as an unverified claim.

**What this does not do.** A registry cannot stop a property from lying to it. Booking.com held its own identifier for OYO and missed Palette because it took the supplier's word. What a neutral, public code adds is that the property-level record is checked against public address and parcel records rather than the applicant's say-so, the unit-level record is drawn from the property's own system of record or a physical attestation, no identifier is ever reissued, and the whole registry is published, so a lie is detectable, permanent, and visible to everyone at once rather than to one platform's fraud team. That is the full claim. The paper makes no larger one.

---

## 7. Where the records come from

A registry is worth exactly as much as its records are accurate, and version 0.1 of this paper was silent on where they come from. This revision defines three tiers, and every record states which tier produced it.

**Tier 1, system of record.** The property authorizes the registrar to read its property management system, and the unit list is drawn from there. Modern property systems treat each room as an addressable resource with its own identifier over a public API. Mews exposes a Resource, apaleo a Unit, Oracle OPERA Cloud a Room, Cloudbeds an individual room within a type. The roomID is bound to that internal identifier and the binding is kept by the property. Lifecycle events flow from the same source. This is the highest-quality tier and the preferred one.

**Tier 2, property attestation.** The property supplies its unit list directly and attests to it. Suitable for properties whose systems have no API or who prefer not to connect one.

**Tier 3, registrar-recorded.** The registrar records a property from public sources, address and parcel records for the building and published floor plans or public inventory for the units, without the property's participation. Consent is not required to name a building, in the same way that a parcel number needs no consent, but a Tier 3 record says so, and it is the tier a platform should trust least.

Property codes at every tier are grounded in a street address and parcel identifier, which are public and checkable without the property's help. A property may claim its code at any time, which moves its records up a tier and gives it the standing to correct designators and report lifecycle events.

**Claims belong to the operator. Records belong to the property.** Every property record is marked claimed or unclaimed, with the date the operator last confirmed its unit list. An operator may withdraw its claim at any time, and a sale ends the claim automatically. Neither touches an identifier. A new owner who wants nothing to do with the registry does not have to act at all. The records stay, marked unclaimed, and a platform can see how long it has been since anyone confirmed them. Deletion is not available to anyone, including the registrar, because a property that could erase its identifiers could relist the same rooms under a new name.

**Private homes show their town, not their street.** When a property is an owner-occupied residence, its public record carries the locality, region, and country only. The registrar keeps the full address to stop a second code being issued for the same building. A family that rents out its home for a season should not find its street address permanently published as lodging.

Corrections and disputes follow one path. A correction that changes which physical unit an identifier names is a supersession, never an edit, so the history stays whole. A property that contests a retirement or supersession states its case to the registrar, the exchange is recorded on the identifier, and the outcome is public. The registrar's decision is final in Stage 1 governance and appealable in Stage 2, described below.

---

## 8. Governance

The OpenRoomID Project is the registrar. It assigns identifiers, runs the resolver, publishes the registry, and sells nothing. The Project was founded by Roomza, Inc., which funds its operation. Roomza also sells room-level attributes, scores, and verification, which is the commercial layer directly above this namespace. Section 1.2 of the previous draft argued that no incumbent could run a neutral registry because its economics would bias it. That argument applies to a registry's sponsor too, and the answer cannot be a promise. It has to be structure.

| Layer | Operator | Terms |
|---|---|---|
| Specification | Public repository, versioned | CC BY 4.0 |
| Registry records | Registrar, published in full | CC0 |
| Assignment | Registrar | Free, permanent, no application required |
| Resolution | Registrar | Free, unauthenticated, rate limited |
| Attributes, verification, transactions | Sponsors and any other party | Commercial, out of scope |

**What holds the line.**

1. **The dump.** The full registry, every identifier and its status and chain, is published periodically under CC0. The one thing withheld is the street address of a private residence. Anyone can verify any claim, run the duplicate rule themselves, or stand up a second resolver. A registrar that misbehaves can be forked in an afternoon. This is the actual guarantee. Everything else is furniture.
2. **The resolver's silence.** The free layer returns existence and nothing else. Any attribute that appears in a resolver response is a specification violation, and the specification is public.
3. **Disclosure.** Roomza, Inc. founded the Project, funds it, and today holds the openroomid.org domain. This paper says so, and the specification says so. Moving the domain and the name to an entity of the Project's own is a Stage 2 task.
4. **Succession.** If the registrar ceases operation or ceases to meet these commitments, the specification, the name, the domain, and the current dump transfer to a successor named in advance. Naming that successor is the first task of Stage 2 below.

**What this costs and who pays.** Running a resolver and publishing a dump is a small fixed cost. The founding sponsor pays it. No membership, no fee to properties, no fee to readers. Further sponsors are welcome on the same terms: they fund operation and receive no say over any record.

**Precedent, stated correctly.** Version 0.1 said GS1 gives the number away. It does not. GS1 charges companies for prefixes, ICANN takes a fee on every domain, and the regional internet registries charge for address blocks. The lesson of those registries is narrower than the earlier draft claimed: they charge the party being named and never the party doing the looking up, and they do not compete with the products of their members. ORCID and the DOI system are the closer models. ORCID identifiers are free to the researcher and resolution is free to everyone, funded by member institutions that buy services above the identifier. OpenRoomID takes one step further and makes assignment free as well, on the reasoning that a registry which charges the property to be named will never cover the properties that matter most in the August cases, the ones with no interest in being found.

**Stages.**

*Stage 1, publication.* Specification published, resolver live, registry seeded, dump published. Editorial control with the registrar. This is the current stage.

*Stage 2, advisory.* An advisory group from operators, property systems, distribution platforms, and agent platforms, serving as individuals. Names the successor. Hears appeals on lifecycle disputes. Non-binding on the specification.

*Stage 3, stewardship.* Once identifiers are in production use across several independent surfaces, the specification and the name move to a formal body with published procedures, preferably an existing standards venue with antitrust protocols rather than a new entity.

---

## 9. Adoption

Nothing here requires agreement. Each path can be taken by one party, alone, today.

**Platforms require it.** A booking platform, a channel with commissioned content, or an agent framework requires a resolvable roomID or property code on any unit-level claim and applies the one-listing rule. This is the fastest path and needs no hotel's consent. It needs one platform that does not want to be the next OYO story. Where a claim cannot carry an identifier, the platform labels it unverified, which is what the guest needed to see in Sedona.

**Property systems bind it.** A property management system stores the roomID against its internal room record and emits it in exports, confirmations, and integrations. The crosswalk is one field. Systems that already expose rooms over API, and most modern ones do, are a configuration away.

**Properties publish it.** A property places its roomIDs in schema.org markup on its own pages, on confirmations, and on the sign beneath the door number. The identifier on the sign is the VIN on the dashboard. A guest, a reviewer, or an agent can read it and check it.

**What this asks of a hotel.** Nothing. A property does not have to sell by unit, assign by unit, or change a single operating practice. OpenRoomID names the room so that any system which does those things refers to the same one. What a property gets is a name for its building that impostor listings cannot borrow, a name for each room that a fabricated video cannot borrow, a history that survives a renumbering, and standing to correct the record.

---

## 10. What OpenRoomID is not

- Not a booking system. It names units. Transacting on them is someone else's layer.
- Not a rating, review, or verification system. The registry has no opinion about quality.
- Not a data product. Resolution is free and returns identity only. Attributes are out of scope.
- Not a membership organization. Nothing is required of a property and nothing is sold to one.
- Not hotel-specific. See P5.
- Not a guarantee. It makes a claim checkable. Whether anyone checks is up to the platform holding the guest's money.

---

## 11. Open questions

Carried for the advisory stage. The specification marks each inline.

1. **Shared units.** In a hostel dormitory, is the addressable unit the room or the bed? The designator permits either, which may be too permissive.
2. **Composed units.** Connecting rooms sold as a suite, and lock-off units in condominium hotels: one identifier, or two with a relationship?
3. **Third-party registration.** Under what conditions may a party other than the property or the registrar submit a Tier 3 record?
4. **Check character.** A fourth-position check character would catch transcription error in voice and handwriting. Its value against the cost of a longer identifier is unmeasured.
5. **Succession.** Who is named, and under what instrument, so that the commitment in section 8 binds a future owner of the registrar.

---

## Appendix A. Terminology

| Term | Definition |
|---|---|
| roomID | The full identifier for one accommodation unit. |
| Property code | The eight-character segment naming the building. |
| Unit designator | The segment matching the door. |
| Unit suffix | The letter distinguishing successive identifiers for one designator. |
| Registrar | The party that assigns identifiers and operates resolution. Currently the OpenRoomID Project. |
| Retirement | Permanent withdrawal of an identifier. It keeps resolving and is never reissued. |
| Supersession | The link from a replaced identifier to its replacement. |
| Tier | The provenance of a record: system of record, property attestation, or registrar-recorded. |
| Claim | Whether the current operator has confirmed a property's records, and when. |
| Assigned designator | A four-character code the registrar gives a unit with no stable door label. |

## Appendix B. Changes from v0.1

- Thesis restated around existence and sameness, with the OYO Las Vegas and Ambiente Sedona cases as the problem statement.
- Check character replaced by the unit suffix, matching the specification and the reference resolver. Reason given in section 3.
- Normative tables removed. The specification governs; this paper explains.
- Prior art added: TTIcodes and GIATA, GDS codes, OpenTravel room type codes, Hilton room selection.
- The one-listing rule and the three checks added as section 6, with the limits stated.
- Provenance tiers, address and parcel grounding, and the correction path added as section 7.
- Working group resolutions of September 29, 2026: assigned designators for named and unlabeled units (section 3), claim status and withdrawal, and address privacy for residences (section 7). The non-numbered units question is closed.
- Registrar changed to the OpenRoomID Project, with Roomza, Inc. disclosed as founding sponsor. Registry data licensed CC0. Dump, disclosure, and succession stated as structural guards. Precedent section corrected.
- Adoption reordered: platform requirement first, property system binding second. "What this asks of a hotel" added.
- Status block, editors, comment channel, and licenses added.

## Appendix C. Sources

- Skift, "Your Hotel Is Hot on TikTok Go. But AI Got All The Facts Wrong," August 31, 2026. https://skift.com/2026/08/31/ai-generated-tiktok-go-hotel-videos/
- Hospitality.today, "Seventeen videos sold a suite your hotel doesn't have," September 2, 2026. https://www.hospitality.today/article/seventeen-videos-sold-a-suite-your-hotel-doesnt-have-nobody-needed-your-permission
- SFGate, via CDC Gaming, "OYO hotel off Vegas Strip admits to taking bookings for fake rooms," August 20, 2026. https://cdcgaming.com/brief/oyo-las-vegas-admits-to-taking-bookings-for-fake-rooms/
- Hoodline, "OYO Las Vegas Accused of Posing as Two Fake Hotels," August 2026. https://hoodline.com/2026/08/oyo-las-vegas-accused-of-posing-as-two-fake-hotels-to-dodge-1-7-star-rating/
- Travel Technology Initiative, TTIcodes. https://www.tti.org/tticodes
- PhocusWire, "Can the latest dip into the global hotel ID swamp work?" https://www.phocuswire.com/Can-the-latest-dip-into-the-global-hotel-ID-swamp-work
- Hospitality Technology, "Hilton Rolls Out Digital Check-in/out, Room Selection and Customization Across 4,000 Properties," 2014. https://hospitalitytech.com/hilton-rolls-out-digital-check-inout-room-selection-and-customization-across-4000-properties
- OpenRoomID Specification 1.0, Working Draft. https://openroomid.org/spec/1.0

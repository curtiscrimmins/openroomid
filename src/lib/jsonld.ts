/**
 * JSON-LD payloads served by the resolver.
 *
 * Deliberately minimal: identity, status, dates, containment, and the
 * supersession link. No attributes, no scores, no rates, no counts.
 * That boundary is the point of the standard; do not widen these shapes.
 */

import type { PropertyRecord, UnitRecord } from "@/lib/registry";

export const SPEC_URL = "https://openroomid.org/spec/1.0";

type JsonLd = Record<string, unknown>;

function identifier(propertyId: string, value: string): JsonLd {
  return { "@type": "PropertyValue", propertyID: propertyId, value };
}

export function unitJsonLd(
  unit: UnitRecord,
  property: PropertyRecord | null,
  origin: string,
): JsonLd {
  const doc: JsonLd = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${origin}/${unit.roomId}`,
    identifier: identifier("roomID", unit.roomId),
    name: unit.displayName ?? `Room ${unit.roomDesignator}`,
    designatorSource: unit.designatorSource,
  };
  if (unit.floorLevel !== null) {
    doc.floorLevel = unit.floorLevel;
  }
  if (property) {
    doc.containedInPlace = {
      "@type": "Hotel",
      name: property.name,
      identifier: identifier("roomID:property", property.propertyCode),
    };
  }
  doc.status = unit.status;
  doc.assigned = unit.assignedAt;
  if (unit.supersededBy !== null) {
    doc.supersededBy = `${origin}/${unit.supersededBy}`;
  }
  if (unit.isDemo) {
    doc.demo = true;
  }
  doc.spec = SPEC_URL;
  return doc;
}

export function propertyJsonLd(
  property: PropertyRecord,
  units: UnitRecord[],
  origin: string,
): JsonLd {
  const doc: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${origin}/${property.propertyCode}`,
    identifier: identifier("roomID:property", property.propertyCode),
    name: property.name,
  };
  const addressParts = {
    // Residences publish locality only (section 4.5).
    streetAddress: property.isResidence ? null : property.address,
    addressLocality: property.city,
    addressRegion: property.region,
    addressCountry: property.country,
  };
  if (Object.values(addressParts).some((v) => v !== null)) {
    doc.address = {
      "@type": "PostalAddress",
      ...Object.fromEntries(
        Object.entries(addressParts).filter(([, v]) => v !== null),
      ),
    };
  }
  doc.containsPlace = units.map((u) => `${origin}/${u.roomId}`);
  doc.claim = property.claimStatus;
  if (property.lastConfirmed !== null) {
    doc.lastConfirmed = property.lastConfirmed;
  }
  if (property.isResidence) {
    doc.residence = true;
  }
  doc.status = property.status;
  doc.assigned = property.assignedAt;
  if (property.supersededBy !== null) {
    doc.supersededBy = `${origin}/${property.supersededBy}`;
  }
  if (property.isDemo) {
    doc.demo = true;
  }
  doc.spec = SPEC_URL;
  return doc;
}

export function malformedErrorBody(rule: string, message: string): JsonLd {
  return {
    error: "malformed_identifier",
    rule,
    message,
    spec: SPEC_URL,
  };
}

export function unassignedErrorBody(canonical: string): JsonLd {
  return {
    error: "unassigned_identifier",
    identifier: canonical,
    message:
      "This identifier is syntactically valid but has not been assigned in the registry.",
    spec: SPEC_URL,
  };
}

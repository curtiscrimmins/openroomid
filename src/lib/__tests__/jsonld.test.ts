import { describe, expect, it } from "vitest";

import type { PropertyRecord, UnitRecord } from "../registry";
import {
  SPEC_URL,
  malformedErrorBody,
  propertyJsonLd,
  unassignedErrorBody,
  unitJsonLd,
} from "../jsonld";

const ORIGIN = "https://openroomid.org";

const property: PropertyRecord = {
  propertyCode: "7QM4KX92",
  name: "El Cortez Hotel & Casino",
  address: "600 E Fremont St",
  city: "Las Vegas",
  region: "NV",
  country: "US",
  isResidence: false,
  claimStatus: "claimed",
  lastConfirmed: "2026-09-01",
  status: "active",
  assignedAt: "2026-08-09",
  supersededBy: null,
  isDemo: false,
};

const unit: UnitRecord = {
  roomId: "7QM4KX92-1412-B",
  propertyCode: "7QM4KX92",
  roomDesignator: "1412",
  unitSuffix: "B",
  designatorSource: "door",
  displayName: "Room 1412",
  floorLevel: "14",
  status: "active",
  assignedAt: "2026-08-14",
  supersededBy: null,
  isDemo: false,
};

describe("unitJsonLd", () => {
  it("matches the specified response shape", () => {
    const doc = unitJsonLd(unit, property, ORIGIN);
    expect(doc).toMatchObject({
      "@context": "https://schema.org",
      "@type": "HotelRoom",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "roomID",
        value: "7QM4KX92-1412-B",
      },
      name: "Room 1412",
      floorLevel: "14",
      containedInPlace: {
        "@type": "Hotel",
        name: "El Cortez Hotel & Casino",
        identifier: {
          "@type": "PropertyValue",
          propertyID: "roomID:property",
          value: "7QM4KX92",
        },
      },
      status: "active",
      assigned: "2026-08-14",
      spec: SPEC_URL,
    });
  });

  it("omits supersededBy and demo when absent", () => {
    const doc = unitJsonLd(unit, property, ORIGIN);
    expect(doc).not.toHaveProperty("supersededBy");
    expect(doc).not.toHaveProperty("demo");
  });

  it("includes supersededBy as a resolver URL when set", () => {
    const doc = unitJsonLd(
      { ...unit, status: "superseded", supersededBy: "7QM4KX92-1412-C" },
      property,
      ORIGIN,
    );
    expect(doc.status).toBe("superseded");
    expect(doc.supersededBy).toBe(`${ORIGIN}/7QM4KX92-1412-C`);
  });

  it("states where the designator came from", () => {
    expect(unitJsonLd(unit, property, ORIGIN).designatorSource).toBe("door");
    const named = unitJsonLd(
      { ...unit, roomId: "7QM4KX92-2H2S-A", roomDesignator: "2H2S", unitSuffix: "A", designatorSource: "assigned", displayName: "The Hemingway Suite" },
      property,
      ORIGIN,
    );
    expect(named.designatorSource).toBe("assigned");
    expect(named.name).toBe("The Hemingway Suite");
  });

  it("flags demonstration records", () => {
    const doc = unitJsonLd({ ...unit, isDemo: true }, property, ORIGIN);
    expect(doc.demo).toBe(true);
  });

  it("carries no attribute, score, or rate fields", () => {
    const doc = unitJsonLd(unit, property, ORIGIN);
    const keys = Object.keys(doc).join(" ").toLowerCase();
    for (const banned of ["score", "rate", "price", "review", "noise", "condition"]) {
      expect(keys).not.toContain(banned);
    }
  });
});

describe("propertyJsonLd", () => {
  it("resolves to a Hotel with unit URLs", () => {
    const doc = propertyJsonLd(property, [unit], ORIGIN);
    expect(doc).toMatchObject({
      "@type": "Hotel",
      name: "El Cortez Hotel & Casino",
      identifier: {
        "@type": "PropertyValue",
        propertyID: "roomID:property",
        value: "7QM4KX92",
      },
      containsPlace: [`${ORIGIN}/7QM4KX92-1412-B`],
      status: "active",
    });
  });

  it("reports claim status and last confirmation", () => {
    const doc = propertyJsonLd(property, [], ORIGIN);
    expect(doc.claim).toBe("claimed");
    expect(doc.lastConfirmed).toBe("2026-09-01");
    const unclaimed = propertyJsonLd({ ...property, claimStatus: "unclaimed", lastConfirmed: null }, [], ORIGIN);
    expect(unclaimed.claim).toBe("unclaimed");
    expect(unclaimed).not.toHaveProperty("lastConfirmed");
  });

  it("never publishes a residence's street address", () => {
    const doc = propertyJsonLd({ ...property, isResidence: true }, [], ORIGIN);
    expect(doc.residence).toBe(true);
    expect(doc.address).not.toHaveProperty("streetAddress");
    expect(doc.address).toMatchObject({ addressLocality: "Las Vegas" });
  });

  it("builds a postal address from available parts", () => {
    const doc = propertyJsonLd(property, [], ORIGIN);
    expect(doc.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "600 E Fremont St",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      addressCountry: "US",
    });
  });

  it("omits the address when no parts are known", () => {
    const doc = propertyJsonLd(
      { ...property, address: null, city: null, region: null, country: null },
      [],
      ORIGIN,
    );
    expect(doc).not.toHaveProperty("address");
  });
});

describe("error bodies", () => {
  it("malformed errors name the failing rule", () => {
    const body = malformedErrorBody("property_code_length", "Too short.");
    expect(body).toMatchObject({
      error: "malformed_identifier",
      rule: "property_code_length",
      message: "Too short.",
      spec: SPEC_URL,
    });
  });

  it("unassigned errors state that the syntax is valid", () => {
    const body = unassignedErrorBody("7QM4KX92-9999-A");
    expect(body.error).toBe("unassigned_identifier");
    expect(body.identifier).toBe("7QM4KX92-9999-A");
    expect(String(body.message)).toContain("syntactically valid");
  });
});

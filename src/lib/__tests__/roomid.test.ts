import { describe, expect, it } from "vitest";

import {
  CROCKFORD_ALPHABET,
  assignDesignator,
  PROPERTY_CODE_PATTERN,
  ROOM_DESIGNATOR_PATTERN,
  ROOM_ID_PATTERN,
  UNIT_SUFFIX_PATTERN,
  isValidPropertyCode,
  isValidRoomId,
  normalizePropertyCode,
  normalizeRoomId,
  parseRoomId,
  toRidUri,
} from "../roomid";

describe("CROCKFORD_ALPHABET", () => {
  it("has 32 characters", () => {
    expect(CROCKFORD_ALPHABET).toHaveLength(32);
  });

  it("excludes I, L, O, U", () => {
    for (const ch of ["I", "L", "O", "U"]) {
      expect(CROCKFORD_ALPHABET).not.toContain(ch);
    }
  });
});

describe("parseRoomId, unit form", () => {
  it("parses the canonical example", () => {
    const result = parseRoomId("7QM4KX92-1412-B");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      kind: "unit",
      propertyCode: "7QM4KX92",
      roomDesignator: "1412",
      unitSuffix: "B",
      canonical: "7QM4KX92-1412-B",
      lookupKey: "7QM4KX92-1412-B",
    });
  });

  it("accepts the rid: URI prefix", () => {
    const result = parseRoomId("rid:7QM4KX92-1412-B");
    expect(result.ok && result.value.canonical).toBe("7QM4KX92-1412-B");
  });

  it("accepts an uppercase RID: prefix", () => {
    const result = parseRoomId("RID:7QM4KX92-1412-B");
    expect(result.ok && result.value.canonical).toBe("7QM4KX92-1412-B");
  });

  it("trims surrounding whitespace", () => {
    const result = parseRoomId("  7QM4KX92-1412-B\n");
    expect(result.ok && result.value.canonical).toBe("7QM4KX92-1412-B");
  });

  it("uppercases the property code", () => {
    const result = parseRoomId("7qm4kx92-1412-B");
    expect(result.ok && result.value.propertyCode).toBe("7QM4KX92");
  });

  it("folds Crockford confusables in the property code only", () => {
    const result = parseRoomId("7QMIKXOl-1412-B");
    expect(result.ok && result.value.propertyCode).toBe("7QM1KX01");
  });

  it("preserves room designator case in the canonical form", () => {
    const result = parseRoomId("7QM4KX92-Suite12a-B");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.kind).toBe("unit");
    if (result.value.kind !== "unit") return;
    expect(result.value.roomDesignator).toBe("Suite12a");
    expect(result.value.canonical).toBe("7QM4KX92-Suite12a-B");
    expect(result.value.lookupKey).toBe("7QM4KX92-SUITE12A-B");
  });

  it("gives mixed-case designators the same lookup key", () => {
    const a = parseRoomId("7QM4KX92-PH1-A");
    const b = parseRoomId("7QM4KX92-ph1-a");
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(a.value.lookupKey).toBe(b.value.lookupKey);
  });

  it("uppercases a lowercase unit suffix in lookup mode", () => {
    const result = parseRoomId("7QM4KX92-1412-b");
    expect(result.ok && result.value.canonical).toBe("7QM4KX92-1412-B");
  });

  it("accepts a single-character designator", () => {
    expect(isValidRoomId("7QM4KX92-1-A")).toBe(true);
  });

  it("accepts a ten-character designator", () => {
    expect(isValidRoomId("7QM4KX92-ABCDE12345-A")).toBe(true);
  });
});

describe("parseRoomId, property-only form", () => {
  it("parses a bare property code", () => {
    const result = parseRoomId("7QM4KX92");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      kind: "property",
      propertyCode: "7QM4KX92",
      canonical: "7QM4KX92",
      lookupKey: "7QM4KX92",
    });
  });

  it("normalizes a lowercase property code", () => {
    const result = parseRoomId("7qm4kx92");
    expect(result.ok && result.value.canonical).toBe("7QM4KX92");
  });
});

describe("parseRoomId, errors", () => {
  it("rejects empty input", () => {
    const result = parseRoomId("");
    expect(!result.ok && result.error.code).toBe("empty");
  });

  it("rejects whitespace-only input", () => {
    const result = parseRoomId("   ");
    expect(!result.ok && result.error.code).toBe("empty");
  });

  it("rejects two-segment input", () => {
    const result = parseRoomId("7QM4KX92-1412");
    expect(!result.ok && result.error.code).toBe("structure");
  });

  it("rejects four-segment input", () => {
    const result = parseRoomId("7QM4KX92-14-12-B");
    expect(!result.ok && result.error.code).toBe("structure");
  });

  it("rejects a short property code", () => {
    const result = parseRoomId("7QM4KX9-1412-B");
    expect(!result.ok && result.error.code).toBe("property_code_length");
  });

  it("rejects a long property code", () => {
    const result = parseRoomId("7QM4KX92X-1412-B");
    expect(!result.ok && result.error.code).toBe("property_code_length");
  });

  it("rejects U in the property code, which has no confusable fold", () => {
    const result = parseRoomId("7QM4KXU2-1412-B");
    expect(!result.ok && result.error.code).toBe("property_code_alphabet");
  });

  it("rejects punctuation in the property code", () => {
    const result = parseRoomId("7QM4KX9!-1412-B");
    expect(!result.ok && result.error.code).toBe("property_code_alphabet");
  });

  it("rejects an eleven-character designator", () => {
    const result = parseRoomId("7QM4KX92-ABCDE123456-B");
    expect(!result.ok && result.error.code).toBe("room_designator_length");
  });

  it("rejects punctuation in the designator", () => {
    const result = parseRoomId("7QM4KX92-14.12-B");
    expect(!result.ok && result.error.code).toBe("room_designator_charset");
  });

  it("rejects a multi-character unit suffix", () => {
    const result = parseRoomId("7QM4KX92-1412-BB");
    expect(!result.ok && result.error.code).toBe("unit_suffix_form");
  });

  it("rejects a digit unit suffix", () => {
    const result = parseRoomId("7QM4KX92-1412-9");
    expect(!result.ok && result.error.code).toBe("unit_suffix_form");
  });
});

describe("parseRoomId, strict mode", () => {
  it("accepts exact canonical form", () => {
    const result = parseRoomId("7QM4KX92-1412-B", { strict: true });
    expect(result.ok).toBe(true);
  });

  it("rejects a lowercase property code", () => {
    const result = parseRoomId("7qm4kx92-1412-B", { strict: true });
    expect(result.ok).toBe(false);
  });

  it("rejects a lowercase unit suffix", () => {
    const result = parseRoomId("7QM4KX92-1412-b", { strict: true });
    expect(result.ok).toBe(false);
  });

  it("rejects confusable letters instead of folding them", () => {
    const result = parseRoomId("7QMIKX92-1412-B", { strict: true });
    expect(result.ok).toBe(false);
  });

  it("rejects the rid: prefix", () => {
    const result = parseRoomId("rid:7QM4KX92-1412-B", { strict: true });
    expect(result.ok).toBe(false);
  });

  it("rejects surrounding whitespace", () => {
    const result = parseRoomId(" 7QM4KX92-1412-B", { strict: true });
    expect(result.ok).toBe(false);
  });

  it("still preserves designator case", () => {
    const result = parseRoomId("7QM4KX92-Suite12a-B", { strict: true });
    expect(result.ok && result.value.canonical).toBe("7QM4KX92-Suite12a-B");
  });
});

describe("validators", () => {
  it("isValidRoomId is true only for unit form", () => {
    expect(isValidRoomId("7QM4KX92-1412-B")).toBe(true);
    expect(isValidRoomId("7QM4KX92")).toBe(false);
    expect(isValidRoomId("garbage")).toBe(false);
  });

  it("isValidPropertyCode is true only for property form", () => {
    expect(isValidPropertyCode("7QM4KX92")).toBe(true);
    expect(isValidPropertyCode("7QM4KX92-1412-B")).toBe(false);
    expect(isValidPropertyCode("NOPE")).toBe(false);
  });
});

describe("normalizers", () => {
  it("normalizeRoomId canonicalizes accepted input", () => {
    expect(normalizeRoomId("rid:7qm4kx92-1412-b")).toBe("7QM4KX92-1412-B");
    expect(normalizeRoomId("7qm4kx92")).toBe("7QM4KX92");
  });

  it("normalizeRoomId returns null for invalid input", () => {
    expect(normalizeRoomId("not-an-id")).toBeNull();
  });

  it("normalizePropertyCode folds confusables without validating", () => {
    expect(normalizePropertyCode("oil")).toBe("011");
  });

  it("toRidUri prepends the scheme", () => {
    expect(toRidUri("7QM4KX92-1412-B")).toBe("rid:7QM4KX92-1412-B");
  });
});

describe("exported patterns", () => {
  it("ROOM_ID_PATTERN matches the canonical example", () => {
    expect(ROOM_ID_PATTERN.test("7QM4KX92-1412-B")).toBe(true);
  });

  it("PROPERTY_CODE_PATTERN rejects excluded letters", () => {
    expect(PROPERTY_CODE_PATTERN.test("7QM4KXI2")).toBe(false);
    expect(PROPERTY_CODE_PATTERN.test("7QM4KXU2")).toBe(false);
  });

  it("ROOM_DESIGNATOR_PATTERN bounds length", () => {
    expect(ROOM_DESIGNATOR_PATTERN.test("")).toBe(false);
    expect(ROOM_DESIGNATOR_PATTERN.test("A".repeat(10))).toBe(true);
    expect(ROOM_DESIGNATOR_PATTERN.test("A".repeat(11))).toBe(false);
  });

  it("UNIT_SUFFIX_PATTERN is one uppercase letter", () => {
    expect(UNIT_SUFFIX_PATTERN.test("B")).toBe(true);
    expect(UNIT_SUFFIX_PATTERN.test("b")).toBe(false);
    expect(UNIT_SUFFIX_PATTERN.test("BB")).toBe(false);
  });
});

describe("assignDesignator", () => {
  it("draws four Crockford characters", () => {
    const code = assignDesignator([]);
    expect(code).toMatch(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$/);
  });

  it("never returns a designator already used at the property", () => {
    // A random source that yields the same code twice, then another.
    const seq = [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5];
    let i = 0;
    const random = () => seq[i++ % seq.length];
    expect(assignDesignator(["0000"], random)).toBe("GGGG");
  });

  it("compares case-insensitively against door labels", () => {
    const seq = [0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0];
    let i = 0;
    const random = () => seq[i++ % seq.length];
    expect(assignDesignator(["gggg"], random)).toBe("0000");
  });

  it("parses as an ordinary roomID", () => {
    const code = assignDesignator([]);
    expect(parseRoomId(`7QM4KX92-${code}-A`).ok).toBe(true);
  });
});

/**
 * OpenRoomID identifier syntax, parsing, validation, and normalization.
 *
 * This module is the single source of truth for identifier syntax.
 * Every other module imports from here. Do not inline these regexes
 * anywhere else in the codebase.
 *
 * Canonical string form: PPPPPPPP-ROOM-U
 *   PPPPPPPP  property code, 8 chars, Crockford base32 (0-9, A-Z minus I, L, O, U)
 *   ROOM      room designator, 1-10 chars, [A-Za-z0-9], case-preserved,
 *             case-insensitive on lookup
 *   U         unit suffix, single [A-Z]
 * Property-only form: PPPPPPPP
 * Canonical URI prefix: rid:
 */

/** The 32 characters of Crockford base32: digits plus A-Z minus I, L, O, U. */
export const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** An 8-character property code in canonical (uppercase) form. */
export const PROPERTY_CODE_PATTERN = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{8}$/;

/** A room designator: 1 to 10 alphanumeric characters, any case. */
export const ROOM_DESIGNATOR_PATTERN = /^[A-Za-z0-9]{1,10}$/;

/** A unit suffix: exactly one uppercase letter in canonical form. */
export const UNIT_SUFFIX_PATTERN = /^[A-Z]$/;

/** A full unit identifier in canonical form. */
export const ROOM_ID_PATTERN =
  /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{8}-[A-Za-z0-9]{1,10}-[A-Z]$/;

/** Canonical URI scheme prefix. */
export const RID_URI_PREFIX = "rid:";

/**
 * Crockford base32 decoding folds visually confusable letters onto the
 * digits they resemble. Applied to property codes only; room designators
 * use the full alphanumeric charset and are never remapped.
 */
const CONFUSABLE_MAP: Record<string, string> = {
  I: "1",
  L: "1",
  O: "0",
};

export type ParseErrorCode =
  | "empty"
  | "structure"
  | "property_code_length"
  | "property_code_alphabet"
  | "room_designator_length"
  | "room_designator_charset"
  | "unit_suffix_form";

export interface ParseError {
  code: ParseErrorCode;
  message: string;
}

export interface ParsedProperty {
  kind: "property";
  propertyCode: string;
  /** Canonical string form: the normalized property code. */
  canonical: string;
  /** Uppercase key for case-insensitive registry lookup. */
  lookupKey: string;
}

export interface ParsedUnit {
  kind: "unit";
  propertyCode: string;
  /** Case-preserved as given; lookups are case-insensitive. */
  roomDesignator: string;
  unitSuffix: string;
  /** Canonical string form, designator case preserved. */
  canonical: string;
  /** Uppercase key for case-insensitive registry lookup. */
  lookupKey: string;
}

export type ParsedRoomId = ParsedProperty | ParsedUnit;

export type ParseResult =
  | { ok: true; value: ParsedRoomId }
  | { ok: false; error: ParseError };

export interface ParseOptions {
  /**
   * When true, the input must already be in exact canonical form: uppercase
   * property code with no confusable letters, uppercase unit suffix, no
   * rid: prefix, no surrounding whitespace. Use for registration intake.
   * Default false: lookup mode, which trims, strips an optional rid:
   * prefix, uppercases the property code and unit suffix, and folds
   * I, L, O in the property code per Crockford.
   */
  strict?: boolean;
}

function fail(code: ParseErrorCode, message: string): ParseResult {
  return { ok: false, error: { code, message } };
}

/**
 * Normalize a raw property code segment for lookup: uppercase, then fold
 * Crockford confusables (I and L to 1, O to 0). Returns the normalized
 * string without validating it; callers validate against
 * PROPERTY_CODE_PATTERN afterward.
 */
export function normalizePropertyCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[ILO]/g, (ch) => CONFUSABLE_MAP[ch] ?? ch);
}

/**
 * Parse an identifier string in either unit form (PPPPPPPP-ROOM-U) or
 * property-only form (PPPPPPPP). Returns a discriminated result; on
 * failure the error names the specific rule that failed, which the
 * resolver surfaces in 400 responses.
 */
export function parseRoomId(
  input: string,
  options: ParseOptions = {},
): ParseResult {
  const strict = options.strict === true;

  let s = strict ? input : input.trim();

  if (!strict && s.slice(0, RID_URI_PREFIX.length).toLowerCase() === RID_URI_PREFIX) {
    s = s.slice(RID_URI_PREFIX.length);
  }

  if (s.length === 0) {
    return fail("empty", "Identifier is empty.");
  }

  const segments = s.split("-");

  if (segments.length !== 1 && segments.length !== 3) {
    return fail(
      "structure",
      "Identifier must be a property code (PPPPPPPP) or a unit identifier (PPPPPPPP-ROOM-U). " +
        `Got ${segments.length} hyphen-separated segments.`,
    );
  }

  const rawProperty = segments[0];
  const propertyCode = strict ? rawProperty : normalizePropertyCode(rawProperty);

  if (propertyCode.length !== 8) {
    return fail(
      "property_code_length",
      `Property code must be exactly 8 characters; got ${propertyCode.length}.`,
    );
  }
  if (!PROPERTY_CODE_PATTERN.test(propertyCode)) {
    return fail(
      "property_code_alphabet",
      "Property code must use Crockford base32: digits 0-9 and uppercase letters excluding I, L, O, U.",
    );
  }

  if (segments.length === 1) {
    const value: ParsedProperty = {
      kind: "property",
      propertyCode,
      canonical: propertyCode,
      lookupKey: propertyCode,
    };
    return { ok: true, value };
  }

  const roomDesignator = segments[1];
  if (roomDesignator.length < 1 || roomDesignator.length > 10) {
    return fail(
      "room_designator_length",
      `Room designator must be 1 to 10 characters; got ${roomDesignator.length}.`,
    );
  }
  if (!ROOM_DESIGNATOR_PATTERN.test(roomDesignator)) {
    return fail(
      "room_designator_charset",
      "Room designator must contain only letters A-Z, a-z and digits 0-9.",
    );
  }

  const rawSuffix = segments[2];
  const unitSuffix = strict ? rawSuffix : rawSuffix.toUpperCase();
  if (!UNIT_SUFFIX_PATTERN.test(unitSuffix)) {
    return fail(
      "unit_suffix_form",
      "Unit suffix must be exactly one letter A-Z.",
    );
  }

  const canonical = `${propertyCode}-${roomDesignator}-${unitSuffix}`;
  const value: ParsedUnit = {
    kind: "unit",
    propertyCode,
    roomDesignator,
    unitSuffix,
    canonical,
    lookupKey: canonical.toUpperCase(),
  };
  return { ok: true, value };
}

/** True if the input parses as a unit identifier (lookup mode). */
export function isValidRoomId(input: string): boolean {
  const result = parseRoomId(input);
  return result.ok && result.value.kind === "unit";
}

/** True if the input parses as a property code (lookup mode). */
export function isValidPropertyCode(input: string): boolean {
  const result = parseRoomId(input);
  return result.ok && result.value.kind === "property";
}

/**
 * Normalize any accepted input form to its canonical string, or null if
 * the input does not parse. Designator case is preserved as given;
 * case-insensitive matching happens at lookup time via lookupKey.
 */
export function normalizeRoomId(input: string): string | null {
  const result = parseRoomId(input);
  return result.ok ? result.value.canonical : null;
}

/** The canonical rid: URI for a parsed identifier or canonical string. */
export function toRidUri(canonical: string): string {
  return `${RID_URI_PREFIX}${canonical}`;
}

/** Length of a registrar-assigned designator (section 4.2). */
export const ASSIGNED_DESIGNATOR_LENGTH = 4;

/**
 * Draws a registrar-assigned designator: four Crockford base32
 * characters that clash with no designator, door or assigned, already
 * used at the property (compared case-insensitively). Assigned
 * designators are never reused, so `taken` must include retired and
 * superseded ones.
 */
export function assignDesignator(
  taken: Iterable<string>,
  random: () => number = Math.random,
): string {
  const used = new Set(Array.from(taken, (d) => d.toUpperCase()));
  for (let attempt = 0; attempt < 10_000; attempt++) {
    let code = "";
    for (let i = 0; i < ASSIGNED_DESIGNATOR_LENGTH; i++) {
      code += CROCKFORD_ALPHABET[Math.floor(random() * CROCKFORD_ALPHABET.length)];
    }
    if (!used.has(code)) return code;
  }
  throw new Error("could not draw an unused designator for this property");
}

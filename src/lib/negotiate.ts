/**
 * Content negotiation for the resolver.
 *
 * The rule from the specification: a request whose Accept header includes
 * application/ld+json or application/json receives JSON-LD; anything
 * else receives HTML. A .json path extension or ?format=json forces
 * JSON regardless of Accept. Wildcards (* / *) do not select JSON, so
 * plain curl and browsers get the HTML page.
 */

export const JSON_MEDIA_TYPES = ["application/ld+json", "application/json"];

/** True when the Accept header explicitly asks for a JSON media type. */
export function acceptPrefersJson(accept: string | null): boolean {
  if (!accept) return false;
  const entries = accept.split(",");
  for (const entry of entries) {
    const [rawType, ...params] = entry.split(";");
    const mediaType = rawType.trim().toLowerCase();
    if (!JSON_MEDIA_TYPES.includes(mediaType)) continue;
    const q = params
      .map((p) => p.trim())
      .find((p) => p.startsWith("q="));
    if (q !== undefined && Number.parseFloat(q.slice(2)) === 0) continue;
    return true;
  }
  return false;
}

export interface NegotiationInput {
  accept: string | null;
  /** The raw path segment, possibly ending in .json. */
  pathSegment: string;
  /** The format query parameter, if present. */
  formatParam: string | null;
}

export interface NegotiationResult {
  /** The identifier with any .json extension removed. */
  identifier: string;
  json: boolean;
}

export function negotiate(input: NegotiationInput): NegotiationResult {
  let identifier = input.pathSegment;
  let forced = false;

  if (identifier.toLowerCase().endsWith(".json")) {
    identifier = identifier.slice(0, -".json".length);
    forced = true;
  }
  if (input.formatParam?.toLowerCase() === "json") {
    forced = true;
  }

  return {
    identifier,
    json: forced || acceptPrefersJson(input.accept),
  };
}

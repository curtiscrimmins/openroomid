import { describe, expect, it } from "vitest";

import { acceptPrefersJson, negotiate } from "../negotiate";

describe("acceptPrefersJson", () => {
  it("selects JSON for application/ld+json", () => {
    expect(acceptPrefersJson("application/ld+json")).toBe(true);
  });

  it("selects JSON for application/json", () => {
    expect(acceptPrefersJson("application/json")).toBe(true);
  });

  it("selects JSON when listed among other types", () => {
    expect(
      acceptPrefersJson("text/html, application/json;q=0.9, */*;q=0.8"),
    ).toBe(true);
  });

  it("does not select JSON for a browser Accept header", () => {
    expect(
      acceptPrefersJson(
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8",
      ),
    ).toBe(false);
  });

  it("does not select JSON for a bare wildcard", () => {
    expect(acceptPrefersJson("*/*")).toBe(false);
  });

  it("does not select JSON when the header is absent", () => {
    expect(acceptPrefersJson(null)).toBe(false);
  });

  it("ignores a JSON type with q=0", () => {
    expect(acceptPrefersJson("application/json;q=0")).toBe(false);
  });

  it("is case-insensitive on the media type", () => {
    expect(acceptPrefersJson("Application/JSON")).toBe(true);
  });
});

describe("negotiate", () => {
  it("returns HTML for a plain browser request", () => {
    const r = negotiate({
      accept: "text/html,*/*;q=0.8",
      pathSegment: "7QM4KX92-1412-B",
      formatParam: null,
    });
    expect(r).toEqual({ identifier: "7QM4KX92-1412-B", json: false });
  });

  it("strips a .json extension and forces JSON", () => {
    const r = negotiate({
      accept: "text/html",
      pathSegment: "7QM4KX92-1412-B.json",
      formatParam: null,
    });
    expect(r).toEqual({ identifier: "7QM4KX92-1412-B", json: true });
  });

  it("strips an uppercase .JSON extension", () => {
    const r = negotiate({
      accept: null,
      pathSegment: "7QM4KX92-1412-B.JSON",
      formatParam: null,
    });
    expect(r).toEqual({ identifier: "7QM4KX92-1412-B", json: true });
  });

  it("honors ?format=json", () => {
    const r = negotiate({
      accept: "text/html",
      pathSegment: "7QM4KX92",
      formatParam: "json",
    });
    expect(r).toEqual({ identifier: "7QM4KX92", json: true });
  });

  it("ignores an unknown format parameter", () => {
    const r = negotiate({
      accept: "text/html",
      pathSegment: "7QM4KX92",
      formatParam: "xml",
    });
    expect(r.json).toBe(false);
  });

  it("selects JSON from the Accept header alone", () => {
    const r = negotiate({
      accept: "application/ld+json",
      pathSegment: "7QM4KX92",
      formatParam: null,
    });
    expect(r.json).toBe(true);
  });
});

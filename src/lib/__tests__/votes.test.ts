import { describe, expect, it } from "vitest";

import { OPEN_QUESTIONS, findOption } from "@/data/open-questions";
import { tally } from "@/lib/votes";

describe("tally", () => {
  it("counts one vote per voter per question", () => {
    const t = tally({
      "check-character": { a: "no", b: "no", c: "optional" },
      succession: { a: "escrow" },
    });
    expect(t["check-character"]).toEqual({ no: 2, optional: 1 });
    expect(t.succession).toEqual({ escrow: 1 });
  });
});

describe("open questions", () => {
  it("rejects answers that are not on the list", () => {
    expect(findOption("check-character", "no")).not.toBeNull();
    expect(findOption("check-character", "maybe")).toBeNull();
    expect(findOption("nonexistent", "no")).toBeNull();
  });

  it("has unique question and option ids", () => {
    const qids = OPEN_QUESTIONS.map((q) => q.id);
    expect(new Set(qids).size).toBe(qids.length);
    for (const q of OPEN_QUESTIONS) {
      const oids = q.options.map((o) => o.id);
      expect(new Set(oids).size).toBe(oids.length);
    }
  });
});

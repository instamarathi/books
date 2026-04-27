import { describe, it, expect } from "vitest";
import { parseEssay } from "./books";

describe("parseEssay", () => {
  it("extracts frontmatter and body from raw markdown", () => {
    const raw = `---
title: Test Title
slug: 01-test
order: 1
summary: A short summary
read_time: 5
---

# Body heading

Body paragraph.
`;
    const essay = parseEssay(raw, "how-to-talk", "01-test");
    expect(essay.title).toBe("Test Title");
    expect(essay.slug).toBe("01-test");
    expect(essay.order).toBe(1);
    expect(essay.summary).toBe("A short summary");
    expect(essay.read_time).toBe(5);
    expect(essay.body).toContain("# Body heading");
    expect(essay.body).toContain("Body paragraph.");
    expect(essay.body).not.toContain("---");
    expect(essay.bookSlug).toBe("how-to-talk");
  });

  it("falls back to first paragraph when summary missing", () => {
    const raw = `---
title: T
slug: s
order: 1
read_time: 5
---

This is the first paragraph that should become the summary if no explicit summary is provided.

Second paragraph.
`;
    const essay = parseEssay(raw, "b", "s");
    expect(essay.summary.startsWith("This is the first paragraph")).toBe(true);
  });

  it("throws when frontmatter is missing required fields", () => {
    const raw = `---
title: only title
---

body
`;
    expect(() => parseEssay(raw, "b", "s")).toThrow(/missing required field/i);
  });
});

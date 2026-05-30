import { describe, it, expect } from "vitest";
import { parseChapter, loadBooks } from "./books";

describe("parseChapter", () => {
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
    const chapter = parseChapter(raw, "how-to-talk", "01-test");
    expect(chapter.title).toBe("Test Title");
    expect(chapter.slug).toBe("01-test");
    expect(chapter.order).toBe(1);
    expect(chapter.summary).toBe("A short summary");
    expect(chapter.read_time).toBe(5);
    expect(chapter.body).toContain("# Body heading");
    expect(chapter.body).toContain("Body paragraph.");
    expect(chapter.body).not.toContain("---");
    expect(chapter.bookSlug).toBe("how-to-talk");
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
    const chapter = parseChapter(raw, "b", "s");
    expect(chapter.summary.startsWith("This is the first paragraph")).toBe(true);
  });

  it("throws when frontmatter is missing required fields", () => {
    const raw = `---
title: only title
---

body
`;
    expect(() => parseChapter(raw, "b", "s")).toThrow(/missing required field/i);
  });
});

describe("book content", () => {
  it("keeps chapter frontmatter slugs aligned with chapter_order", () => {
    for (const book of loadBooks()) {
      const expected = new Set(book.chapter_order);
      for (const chapter of book.chapters) {
        expect(
          expected.has(chapter.slug),
          `${book.slug}/${chapter.slug} is not listed in chapter_order`,
        ).toBe(true);
      }
    }
  });
});

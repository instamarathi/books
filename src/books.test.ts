import { describe, it, expect } from "vitest";
import { parseChapter, loadBooks, bookLanguage, readTimeLabel } from "./books";

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
  it("orders books by creation order newest first when available", () => {
    const [first] = loadBooks();
    expect(first.slug).toBe("spiral-madhun-baher");
    expect(first.created_order).toBe(28);
  });

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

  it("marks the English edition book as english", () => {
    const book = loadBooks().find((b) => b.slug === "midlife-redesign-english");
    expect(book).toBeDefined();
    expect(bookLanguage(book!)).toBe("english");
  });

  it("uses mixed scripts for Hinglish book titles", () => {
    const hinglishBooks = loadBooks().filter((book) => bookLanguage(book) === "hinglish");

    expect(hinglishBooks.length).toBeGreaterThan(0);
    for (const book of hinglishBooks) {
      expect(book.title, book.slug).toMatch(/[\u0900-\u097F]/);
      expect(book.title, book.slug).toMatch(/[A-Za-z]/);
    }
  });

  it("keeps converted Hinglish books free of common Romanized Hindi", () => {
    const convertedSlugs = new Set([
      "calendar-khali-nahi-hoga-hinglish",
      "hasne-wala-boss-hinglish",
      "keemat-chuno-hinglish",
      "kam-bolne-wala-leader-hinglish",
      "potential-ka-wait-hinglish",
      "spiral-se-bahar-hinglish",
    ]);
    const romanizedHindi = /\b(?:nahi|aur|mein|ke|ki|ka|ko|se|par|bhi|tha|thi|hain|hota|woh|yeh|uski|apni|agar|lekin|saath|kabhi|pehle|baad|bina|waqt|zyada|farq|bolo|banate|din|hon|sake|dene|roka|pasand|subah|bahut|taraf|jawab)\b/i;

    for (const book of loadBooks().filter((item) => convertedSlugs.has(item.slug))) {
      const text = [
        book.title,
        book.subtitle,
        book.credit,
        book.sources,
        ...book.chapters.flatMap((chapter) => [
          chapter.title,
          chapter.summary,
          chapter.body,
        ]),
      ]
        .filter(Boolean)
        .join("\n");
      expect(text, book.slug).not.toMatch(romanizedHindi);
    }
  });

  it("formats read time by book language", () => {
    expect(readTimeLabel({ slug: "midlife-redesign-english", language: "english" }, 8)).toBe("8 min");
    expect(readTimeLabel({ slug: "midlife-redesign", language: "marathi" }, 8)).toBe("8 मिनिटे");
    expect(readTimeLabel({ slug: "test-hinglish", language: "hinglish" }, 8)).toBe("8 min");
  });
});

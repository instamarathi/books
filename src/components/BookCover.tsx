import type { CSSProperties } from "react";
import type { Book, CategoryKey } from "../books";
import { CATEGORIES } from "../books";
import { renderTitle } from "../renderTitle";

const COVER_THEMES: Record<
  CategoryKey,
  {
    a: string;
    b: string;
    c: string;
    line: string;
    tag: string;
  }
> = {
  career: {
    a: "#263F6B",
    b: "#D9AA45",
    c: "#6F2F2A",
    line: "rgba(255, 244, 210, 0.72)",
    tag: "rgba(0, 0, 0, 0.34)",
  },
  mindset: {
    a: "#2F5D50",
    b: "#E8BE55",
    c: "#24324F",
    line: "rgba(255, 255, 255, 0.68)",
    tag: "rgba(0, 0, 0, 0.28)",
  },
  parenting: {
    a: "#375E57",
    b: "#D8B657",
    c: "#442C59",
    line: "rgba(255, 255, 255, 0.72)",
    tag: "rgba(0, 0, 0, 0.3)",
  },
  home: {
    a: "#C84032",
    b: "#E4B84F",
    c: "#182336",
    line: "rgba(255, 255, 255, 0.74)",
    tag: "rgba(0, 0, 0, 0.32)",
  },
  society: {
    a: "#2C335F",
    b: "#E5D07D",
    c: "#2F7B73",
    line: "rgba(255, 244, 210, 0.74)",
    tag: "rgba(0, 0, 0, 0.32)",
  },
  fiction: {
    a: "#6B2E3F",
    b: "#E0A84D",
    c: "#1E3149",
    line: "rgba(255, 245, 225, 0.72)",
    tag: "rgba(0, 0, 0, 0.3)",
  },
  other: {
    a: "#88AEB6",
    b: "#22263F",
    c: "#D7A448",
    line: "rgba(255, 255, 255, 0.68)",
    tag: "rgba(0, 0, 0, 0.28)",
  },
};

function categoryOf(book: Book): CategoryKey {
  return book.category && CATEGORIES[book.category] ? book.category : "other";
}

type Variant = "card" | "hero";

export function BookCover({
  book,
  variant = "card",
}: {
  book: Book;
  variant?: Variant;
}) {
  const cat = categoryOf(book);
  const meta = CATEGORIES[cat];
  const cover = COVER_THEMES[cat];
  return (
    <div
      className={`book-cover book-object book-cover-${variant}`}
      data-category={cat}
      data-cover-theme="poster"
      style={{
        "--cover-a": cover.a,
        "--cover-b": cover.b,
        "--cover-c": cover.c,
        "--cover-line": cover.line,
        "--cover-tag": cover.tag,
      } as CSSProperties}
    >
      <span className="book-cover-eyebrow">
        <span aria-hidden="true">{meta.emoji}</span> {meta.label}
      </span>
      <span className="book-cover-title">{renderTitle(book.title)}</span>
    </div>
  );
}

import type { Book, CategoryKey } from "../books";
import { CATEGORIES } from "../books";

const GRADIENTS: Record<CategoryKey, string> = {
  career: "linear-gradient(135deg, #C76C2D 0%, #7C3A12 100%)",
  mindset: "linear-gradient(135deg, #5B8C5A 0%, #2F5530 100%)",
  parenting: "linear-gradient(135deg, #D49A2C 0%, #7C5612 100%)",
  home: "linear-gradient(135deg, #6B8FB5 0%, #3C5B80 100%)",
  society: "linear-gradient(135deg, #9B6BB5 0%, #5E3A76 100%)",
  other: "linear-gradient(135deg, #6B6359 0%, #3A342F 100%)",
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
  return (
    <div
      className={`book-cover book-cover-${variant}`}
      data-category={cat}
      style={{ background: GRADIENTS[cat] }}
    >
      <span className="book-cover-eyebrow">
        <span aria-hidden="true">{meta.emoji}</span> {meta.label}
      </span>
      <span className="book-cover-title">{book.title}</span>
    </div>
  );
}

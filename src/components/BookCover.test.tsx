import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Book, CategoryKey } from "../books";
import { BookCover } from "./BookCover";

function book(category: CategoryKey, title = "चाचणी पुस्तक"): Book {
  return {
    slug: `book-${category}`,
    title,
    category,
    chapter_order: [],
    chapters: [],
  };
}

describe("BookCover", () => {
  it("uses the F poster cover family for every category", () => {
    const categories: CategoryKey[] = [
      "career",
      "mindset",
      "parenting",
      "home",
      "society",
      "fiction",
      "other",
    ];

    for (const category of categories) {
      const { unmount } = render(<BookCover book={book(category)} />);
      expect(screen.getByText("चाचणी पुस्तक").closest(".book-cover")).toHaveAttribute(
        "data-cover-theme",
        "poster",
      );
      unmount();
    }
  });

  it("treats fiction as its own category with a unique cover treatment", () => {
    render(<BookCover book={book("fiction", "मला सांगायचंय")} />);

    const cover = screen.getByText("मला सांगायचंय").closest(".book-cover");
    expect(cover).toHaveAttribute("data-category", "fiction");
    expect(cover).toHaveAttribute("data-cover-theme", "poster");
    expect(screen.getByText(/कथा/)).toBeInTheDocument();
  });
});

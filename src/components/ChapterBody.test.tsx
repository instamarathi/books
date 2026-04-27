import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChapterBody } from "./ChapterBody";

describe("ChapterBody", () => {
  it("renders plain markdown body", () => {
    render(<ChapterBody body={"# Hello\n\nworld"} />);
    expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
  });

  it("splits at ## Quick reference and wraps the rest in a card", () => {
    const body = `Intro paragraph.

## Quick reference

- do this
- not that
`;
    render(<ChapterBody body={body} />);
    expect(screen.getByText(/Intro paragraph/)).toBeInTheDocument();
    const card = screen.getByTestId("quick-ref-card");
    expect(card.textContent).toContain("do this");
    expect(card.textContent).toContain("not that");
  });

  it("is case-insensitive on the marker heading", () => {
    const body = `Top.

## QUICK REFERENCE

after
`;
    render(<ChapterBody body={body} />);
    expect(screen.getByTestId("quick-ref-card").textContent).toContain("after");
  });
});

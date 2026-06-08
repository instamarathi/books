import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Kindle theme CSS", () => {
  const css = fs.readFileSync(path.resolve("src/styles.css"), "utf-8");

  it("defines the Kindle reading palette and page surfaces", () => {
    expect(css).toContain("--paper");
    expect(css).toContain("--paper-elevated");
    expect(css).toContain("--ink");
    expect(css).toContain(".reading-page-shell");
    expect(css).toContain(".book-object");
  });

  it("gives bookshelf covers a dedicated column wide enough to prevent text overlap", () => {
    expect(css).toContain("grid-template-columns: 144px minmax(0, 1fr)");
    expect(css).toContain(".book-card-body {\n  min-width: 0");
  });

  it("defines the F poster cover family with category color variables", () => {
    expect(css).toContain('[data-cover-theme="poster"]');
    expect(css).toContain("--cover-a");
    expect(css).toContain("--cover-b");
    expect(css).toContain("--cover-c");
  });
});

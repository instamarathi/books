# Kindle Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current warm-card visual treatment with a Kindle-style reading-first theme and serve it locally for review.

**Architecture:** Keep React structure intact and implement the theme primarily through CSS variables and existing class names. Use book covers as compact book-object placeholders now, while leaving the structure ready for real assets later.

**Tech Stack:** Vite, React 18, TypeScript, CSS, Vitest, local Vite dev server.

---

### Task 1: Add a CSS Regression Test

**Files:**
- Create: `src/styles.test.ts`

- [ ] **Step 1: Write failing test**

```ts
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/styles.test.ts`

Expected: FAIL because `--paper`, `.reading-page-shell`, and `.book-object` are not in `src/styles.css`.

### Task 2: Implement the Kindle Theme

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/BookCover.tsx`

- [ ] **Step 1: Update CSS variables and layout**

Replace the current warm card styling with a reading-first palette:
- Light: parchment page, dark ink, low-contrast borders.
- Dark: deep charcoal page, warm ink, soft border.
- Wider desktop `main` for bookshelf, narrower chapter reading surface.
- Header is quiet and sticky.
- Book cards become book-object rows rather than generic cards.

- [ ] **Step 2: Update `BookCover` classes**

Keep existing API, but add `book-object` class to the rendered cover so the CSS can treat it as a physical book placeholder until real assets are added.

- [ ] **Step 3: Run CSS regression test**

Run: `npm test -- src/styles.test.ts`

Expected: PASS.

### Task 3: Verify and Serve Locally

**Files:**
- No new files.

- [ ] **Step 1: Run project checks**

Run:
```bash
npm test
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Start local server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/books/` or `http://127.0.0.1:5173/`.

- [ ] **Step 3: Review in browser**

Open the local URL and check:
- Bookshelf reads as quiet Kindle/library UI, not old rounded-card site.
- Chapter page is the primary polished surface.
- Mobile width has no overlapping text or clipped controls.

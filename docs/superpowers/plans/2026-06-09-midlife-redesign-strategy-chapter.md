# Midlife Redesign Strategy Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a thirteenth chapter to both Midlife Redesign editions that converts the connected argument of chapters 1-12 into practical slowing-down strategies.

**Architecture:** Each edition gets an original essay chapter organized by the situations in which a reader needs to slow down. The Marathi and English chapters share the same conceptual map but use natural language and examples rather than sentence-level translation. Both metadata files append the new chapter slug to `chapter_order`.

**Tech Stack:** Markdown, JSON, Vite build-time book loader, Vitest, TypeScript

---

### Task 1: Add the Marathi chapter

**Files:**
- Create: `books/midlife-redesign/13-thambnyachya-paddhati.md`

- [ ] Write an essay chapter with valid frontmatter, approximately 1,200-1,600 words, and practical sections covering interruption, delayed answers, screen boundaries, commitment audits, clean refusal, inherited beliefs, written money facts, solitude, honest conversation, and weekly review.
- [ ] Keep the Marathi WhatsApp register and use Roman English only for common loanwords.
- [ ] Connect every strategy to the argument already developed in chapters 1-12.

### Task 2: Add the English chapter

**Files:**
- Create: `books/midlife-redesign-english/13-ways-to-slow-down.md`

- [ ] Write an original English counterpart with the same strategy map and Indian-life context.
- [ ] Keep the prose connected and book-like, avoiding a generic productivity checklist.
- [ ] Use compact headings but no `Quick reference` block.

### Task 3: Register both chapters

**Files:**
- Modify: `books/midlife-redesign/meta.json`
- Modify: `books/midlife-redesign-english/meta.json`

- [ ] Append `13-thambnyachya-paddhati` to the Marathi `chapter_order`.
- [ ] Append `13-ways-to-slow-down` to the English `chapter_order`.

### Task 4: Verify

**Files:**
- Verify all modified content and metadata.

- [ ] Run `npm test`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Confirm the build creates OG cards and static HTML for both new chapters.

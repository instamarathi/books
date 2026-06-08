# instamarathi/books — project guide

This repo powers https://instamarathi.github.io/books/ — a phone-first Marathi reading site with original Marathi-language books. Most books are 9-chapter how-to titles inspired by the principles of a popular non-fiction book, but the site also supports fiction and essay collections for Marathi-speaking families and professionals.

This file is the fast-start context for Codex. Read it first to understand the repo shape, content rules, and the files that matter most.

---

## At a glance

- `books/` — all book content, one folder per book.
- `src/` — React app, routing, auth, theme, progress, book rendering.
- `scripts/` — build-time generators for OG cards, static stubs, sitemap.
- `public/` — static assets and generated OG output.
- `docs/templates/` — chapter templates for `howto`, `fiction`, and `essay`.
- `books.txt` — queue for scheduled book generation.
- `book_suggestions.txt` — source pool for refilling the queue.
- `schedule.txt` — instructions for the nightly scheduled agent.
- `AGENTS.md` / `CLAUDE.md` — repo rules; treat them as source of truth.

If you need to understand the app quickly, start with `src/books.ts`, `src/pages/`, and one sample book under `books/`.

---

## Non-negotiable content rules

1. Original prose only. Never copy or lightly rewrite source text. Inspired-by books should capture ideas, not wording.
2. Marathi prose in Devanagari, English loanwords in Roman script. Common loanwords are fine; do not transliterate them into Devanagari.
3. Use everyday Marathi, not Sanskritic or wedding-speech register, when a natural word exists.
4. Tone must match the kind:
   - howto: practical, direct, useful.
   - fiction: scenes and dialogue, not preaching.
   - essay: reflective and argued, not academic.
5. Make the premise specific and uncomfortable in a relatable way. The strongest chapters name the thought the reader has but does not say aloud.
6. Use Marathi-context situations only: घर, school, बस, cousins, neighbours, festivals, dabba, exams, screen time, Marathi-medium vs English-medium school.
7. Credit the source book once per book in `books/<slug>/meta.json`, not inside chapters.

---

## Book layout

Each book lives at `books/<slug>/`:

```text
books/<slug>/
  meta.json
  01-<topic>.md
  02-<topic>.md
  ...
```

`meta.json` controls the book:

```json
{
  "slug": "<book-slug>",
  "title": "<Marathi title>",
  "subtitle": "<one-line description>",
  "kind": "howto",
  "credit": "..."
}
```

Kinds:

- `howto` — exactly 9 chapters; uses numbered techniques, pitfalls, and `## Quick reference`.
- `fiction` — free-form narrative; no technique lists or quick reference blocks.
- `essay` — reflective prose; no howto scaffolding.

Universal frontmatter for every chapter:

```markdown
---
title: <Marathi chapter title>
slug: <NN-topic>
order: <1..N>
summary: <one-line description>
read_time: <integer minutes>
---
```

Important: if `summary:` starts with a double quote, wrap the whole value in single quotes so gray-matter does not misparse it.

---

## Chapter shape

### howto

Use this structure:

1. Opening scenario in Marathi context.
2. Bolded principle.
3. Short explanation.
4. `## ही <N> techniques वापरा`
5. `## हे टाळा`
6. `## Quick reference`

Do not change the `## Quick reference` heading text. The renderer matches it literally.

### fiction

Write continuous prose with scenes, dialogue, and household detail. Use headings only if the story genuinely needs a break. Do not add howto sections.

### essay

Write flowing argument or reflection. Headings are optional. Do not add howto sections.

---

## Architecture decisions to preserve

| Area | Choice |
|---|---|
| Stack | Vite + React 18 + TypeScript |
| Routing | `react-router-dom` BrowserRouter |
| Markdown | `react-markdown` + `remark-gfm` via `import.meta.glob` |
| Auth | Firebase Auth with Google popup |
| Database | Firestore `users/{uid}` doc |
| Progress | Debounced write, flushed on `pagehide` |
| Theme | `useTheme` with light/dark/system |
| Font size | `useFontSize` with A-/A/A+ |
| Fonts | Mukta + Inter from Google Fonts |
| OG cards | Build-time satori + resvg PNGs |
| Static stubs | Build-time per-chapter HTML with OG tags |
| Sitemap | Build-time generator |
| Deploy | GitHub Actions to GitHub Pages |

---

## Important workflows

- New book: create `books/<slug>/`, write `meta.json`, add chapters, then run tests/build.
- Scheduled agent: reads `books.txt`, picks a title, generates the book, commits, pushes, and removes the title from the queue.
- Pre-commit checks:

```bash
npm test
npx tsc --noEmit
npm run build
```

`npm run build` is the real end-to-end check. It catches gray-matter/frontmatter issues that a plain Vite build can miss.

---

## Repo map

- `src/` — app shell, pages, components, hooks, auth, book rendering.
- `books/` — content only; one folder per book.
- `scripts/` — generators for OG images, static pages, sitemap.
- `docs/templates/` — canonical chapter templates.
- `public/` — static assets and generated OG output.

---

## Working rule for Codex

Before changing anything, read the relevant local file first. Preserve the repo’s existing patterns, keep edits narrow, and do not rewrite unrelated content.


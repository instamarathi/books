# instamarathi/books — project guide

This repo is the source of https://instamarathi.github.io/books/ — a phone-first Marathi reading site that hosts original Marathi-language essay-collections. Each "book" on the site is a 9-essay collection inspired by the principles of a popular non-fiction book, contextualized for Marathi-speaking families and professionals.

This file is loaded by Claude on every session. It is the source of truth for content rules, structure, and tooling.

---

## Authoring rules — non-negotiable

These rules apply to every essay generated for this site, whether written manually or by a scheduled agent.

1. **Original prose only.** Essays are inspired by a source book's *principles* (which are ideas, not copyrightable), but never reproduce, paraphrase, or do "minor changes / substitutions" of the source text. The book is the seed, not the script. If you find yourself remembering a specific sentence from the source, do not write it down — write a fresh sentence in your own words about the same idea.
2. **Marathi prose in Devanagari, English loanwords in Roman script.** Example: `मुलाने tantrum केला तर लगेच react करू नका`. This matches how educated Marathi speakers actually write in WhatsApp/messages. Don't transliterate English words to Devanagari (no `टॅन्ट्रम`).
3. **Tone: practical, direct, how-to.** Not literary, not academic, not preachy. Each essay reads like a friend who has tried the principles and is sharing what works.
4. **Length: 700–1000 words per essay.** ~5–8 minute mobile read.
5. **Marathi-context examples only.** Use Indian household scenarios — homework, school, बस, cousins (मामेभाऊ/मावसभाऊ), neighbours, festivals, joint families, dabba, exam pressure, screen time, Marathi-medium vs English-medium school. Do NOT use Western examples unchanged ("soccer practice", "the cabin in the woods", "Thanksgiving") — translate the spirit of the example into something the Marathi reader recognizes from daily life.
6. **Source book is credited once per book, on the book index page.** The credit line lives in `books/<slug>/meta.json` under the `credit` field. It does not appear in individual essays.

---

## Book structure

Every book lives at `books/<slug>/`:

```
books/<slug>/
  meta.json
  01-<topic>.md
  02-<topic>.md
  ...
  09-<topic>.md
```

`meta.json` shape:

```json
{
  "slug": "<book-slug>",
  "title": "<Marathi title>",
  "subtitle": "<one-line description in Marathi or English>",
  "credit": "हे निबंध <source-book-name> या पुस्तकातील विचारांवर आधारित आहेत, मराठी context साठी पुन्हा लिहिलेले.",
  "essay_order": ["01-...", "02-...", ..., "09-..."]
}
```

---

## Essay structure (every essay, every book)

Markdown file with YAML frontmatter:

```markdown
---
title: <Marathi essay title>
slug: <NN-topic>
order: <1-9>
summary: <one-line Marathi/Marathi+English description>
read_time: <integer minutes, usually 5-8>
---

<Opening scenario — one paragraph, Marathi-context, sets up the problem.>

**<Bolded principle in Marathi+Roman-English, 1–2 lines.>**

<One paragraph explaining why the principle matters.>

## ही <N> techniques वापरा

1. **<technique name>** — <example dialogue/scenario>
2. **<technique name>** — <example dialogue/scenario>
3. **<technique name>** — <example dialogue/scenario>
(3 to 5 numbered techniques)

## हे टाळा

- **<pitfall>** — <one-line explanation>
- **<pitfall>** — <one-line explanation>
(2 to 3 pitfalls)

## Quick reference

**बोला:**
- <phrase 1>
- <phrase 2>
- <phrase 3>

**टाळा:**
- <phrase 1>
- <phrase 2>
- <phrase 3>
```

The literal heading `## Quick reference` is detected by the renderer (case-insensitive) and styled as a `QuickRefCard` block. Do not change this heading text or the styling will break.

The canonical reference essay is `books/how-to-talk/01-feelings.md` — match its voice, structure, and density.

---

## Architecture decisions

| Area | Choice | Why |
|---|---|---|
| Stack | Vite + React 18 + TypeScript | Matches sibling project at `../carousels`; reuses auth/progress hooks |
| Routing | Path-based (`react-router-dom` BrowserRouter) | Per-essay Open Graph tags must resolve for crawlers |
| Markdown | `react-markdown` + `remark-gfm`, loaded via `import.meta.glob` | All books bundle at build time; no runtime fetch |
| Quick-ref styling | Marker-heading detection (`## Quick reference`) | Simpler than custom remark plugin or frontmatter block |
| Auth | Firebase Auth, Google provider, popup | Reuses existing `carousel-2a740` Firebase project |
| Database | Firestore, single `users/{uid}` doc | Same shape as carousels; book/essay progress added under `progress[bookSlug]` |
| Progress write | Debounced 1500 ms, flushed on `pagehide` | Matches carousels |
| Essay completion | Scroll position ≥ 0.95 | Tolerates "didn't quite reach the bottom" |
| Streak logic | Reused unchanged from carousels useProgress | Single user identity → unified streak across reading + carousels |
| Theme | `useTheme` hook with light/dark/system, CSS variables | Auto-detects `prefers-color-scheme`, manual override persists in localStorage |
| Font size | `useFontSize` hook with A-/A/A+ (16/18/20px) | Devanagari readers vary widely in eye comfort |
| Fonts | Tiro Devanagari Marathi (Devanagari) + Inter (Latin) from Google Fonts | Tiro is purpose-designed for Marathi |
| OG cards | Build-time satori + resvg, 1200×630 PNG per essay | Required for WhatsApp/Telegram unfurls |
| Static stubs | Build-time `dist/<book>/<essay>/index.html` with injected OG tags | Crawlers see correct meta on first hit |
| Sitemap | Build-time generator | One entry per essay + book + bookshelf |
| Deploy | GitHub Actions → GitHub Pages | Push to main, ~2 min to live |
| Analytics | None for v1 | Keep clean; can add GoatCounter later |

---

## Adding a new book — manual workflow

1. `mkdir books/<slug>`
2. Write `meta.json`.
3. Write 9 `.md` essays following the structure above.
4. `npm test && npx tsc --noEmit && npx vite build` — all must pass.
5. `git add -A && git commit -m "book: <slug> — <Marathi-title>" && git push`.
6. CI deploys to GitHub Pages.

---

## Adding a new book — scheduled agent

A scheduled agent (configured separately via `/schedule`) runs nightly at 02:00 IST and:

1. Reads `books.txt` (one book title per line).
2. Picks one line at random.
3. Generates the book per `schedule.txt` instructions.
4. Commits and pushes.
5. Removes the chosen line from `books.txt`.

`books.txt` is the user-curated queue. `book_suggestions.txt` is a 50-title pool the user picks from when refilling the queue.

The agent's full instructions are in `schedule.txt`.

---

## Pre-commit checks (run these before any commit)

```bash
npm test                # Vitest passes
npx tsc --noEmit        # TypeScript clean
npx vite build          # Vite build succeeds (does not require all build-time scripts to be present yet)
```

`npm run build` runs the full pipeline including the OG-card / static-stub / sitemap scripts. It only works once Task 12 of the implementation plan is complete.

---

## Repository layout

```
src/                    React app (auth, routing, hooks, components, pages)
books/                  Book content — one folder per book, Markdown + meta.json
scripts/                Build-time generators (OG cards, static stubs, sitemap)
public/                 Static assets (favicon, robots.txt, og/* generated)
docs/superpowers/
  specs/                Design specs (one per major change)
  plans/                Implementation plans (one per spec)
firestore.rules         Firestore security (copied from carousels)
.github/workflows/      GitHub Actions deploy
CLAUDE.md               This file
books.txt               User-curated queue for the scheduled agent (one title per line)
book_suggestions.txt    50-title pool to pick from when refilling books.txt
schedule.txt            Prompt the scheduled agent runs each night
```

---

## Paywall

Per book: the **first essay (order=1) is open to everyone**; essays 2–9 require Google sign-in. Implementation: `BookIndex.tsx` shows a 🔒 marker on locked rows; `Essay.tsx` renders a `SignInGate` component instead of the body when `!user && essay.order > 1`. The free-essay threshold is the constant `FREE_ESSAY_ORDER` in those two files — change in both if you ever raise/lower the wall.

OG card stubs are NOT gated (a shared link should still unfurl with title + image even when the recipient is logged out). The gate is client-side only.

## Things NOT to do

- Do not change the path-routing scheme to hash routing. OG card unfurls depend on real URLs.
- Do not transliterate English loanwords to Devanagari (`टॅन्ट्रम`). Keep them in Roman script.
- Do not write essays that require Western cultural context to land. Translate examples into Marathi life.
- Do not put a credit line in individual essays. It belongs only in `meta.json`.
- Do not skip any of the 9 essays for a book. The shape is fixed.
- Do not change the `## Quick reference` heading text — the renderer matches it literally.
- Do not enable analytics, comments, or social features without an explicit ask.
- Do not commit secrets. The Firebase config is intentionally public; that's fine. Anything else is not.

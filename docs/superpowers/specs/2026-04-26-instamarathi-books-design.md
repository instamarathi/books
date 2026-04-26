# instamarathi books — design spec

**Date:** 2026-04-26
**Status:** Approved (pending user review of this written spec)
**Site URL:** https://instamarathi.github.io/books/
**Repo:** `instamarathi/books` (to be created)

## Goal

Launch a phone-first reading site for original Marathi-language essay collections. The first collection is a 9-essay book of practical communication advice for parents of children aged 2–12, contextualized for Marathi families. The site is structured to host more books over time. Essays are shareable via WhatsApp/Telegram with proper unfurled link previews. Optional Google sign-in tracks reading progress and streaks per user.

## Non-goals

- Translation of any third-party book. All content is original prose written for this site, inspired by widely-discussed parenting communication principles. The first book lists its source of inspiration once on the book index page as a credit line.
- Comments, social features, or any community layer.
- Generic CMS / multi-author tooling. The author writes Markdown files directly; deploys are git pushes.
- Analytics beyond what Firebase Auth provides for free.

## Audience and writing style

- **Primary reader:** the author (anuphw@gmail.com), with secondary sharing to Marathi-speaking friends and family.
- **Language:** Marathi prose in Devanagari, with English loanwords kept in Roman script (e.g., `मुलाने tantrum केला तर लगेच react करू नका`). Script choice matches how educated Marathi speakers write in chat / WhatsApp.
- **Tone:** practical, direct, how-to. Each essay opens with a Marathi-context scenario, then a bolded principle, then 3–5 numbered techniques with example dialogues, then 2–3 common pitfalls, then a quick-reference card at the bottom.
- **Length:** ~700–1000 words per essay. ~5–8 minute mobile read.
- **Authorship:** the author does not write content; this codebase generates content. The author is the proofreader and reviewer. Quality bar: shareable, no petty errors.

## Book 1 plan — *मुलांशी कसं बोलावं* (working title)

Slug: `how-to-talk`. Nine essays, in this order:

| # | Essay slug | Title | Theme |
|---|---|---|---|
| 1 | `01-feelings` | भावना आधी, उपाय नंतर | Acknowledging what the child feels before fixing or lecturing |
| 2 | `02-cooperation` | Cooperation मिळवण्याचे ५ मार्ग | Practical alternatives to nagging and ordering |
| 3 | `03-no-punishment` | शिक्षा ऐवजी काय? | Natural consequences and joint problem-solving instead of punishment |
| 4 | `04-autonomy` | निवड द्या, control नको | Age-appropriate choices to build autonomy |
| 5 | `05-praise` | कौतुक कसं करायचं | Specific/descriptive praise vs empty "good boy / hushar" |
| 6 | `06-labels` | Labels टाळा | Freeing kids from "आळशी", "हट्टी", "shy" roles |
| 7 | `07-siblings` | भावंडांची भांडणं | Sibling-fight scripts for Marathi households |
| 8 | `08-screens` | Screen time चा रोजचा तंटा | Mobile/TV without daily battles |
| 9 | `09-pitfalls` | काय करू नये | Comparisons, lectures, "मी तुझ्या वयात…" — and what to do instead |

Credit line, displayed once on the book index page only:
> हे निबंध [source book title] या पुस्तकातील विचारांवर आधारित आहेत, मराठी कुटुंबांच्या context साठी पुन्हा लिहिलेले.

The placeholder `[source book title]` is filled in at content-write time.

## Tech stack

- **Frontend:** Vite + React 18 + TypeScript. Same versions and configuration shape as the carousels project at `/Users/anup/claude_tmp/carousels`.
- **Routing:** Path-based routing (not hash routing). This is a deliberate divergence from carousels, required so per-essay Open Graph tags resolve for crawlers. A custom 404.html on GitHub Pages performs the SPA-fallback redirect.
- **Markdown rendering:** Essay `.md` files imported via `import.meta.glob('/books/**/*.md', { as: 'raw', eager: true })`, rendered with `react-markdown` plus `remark-gfm` for tables.
- **Auth:** Firebase Auth, Google provider, popup flow. Reuses the existing carousels Firebase project. The `instamarathi.github.io` domain is already authorized.
- **Database:** Firestore. Same `users/{uid}` doc as carousels, with a new `progress["how-to-talk"]` shape (see "Firestore data model" below).
- **Build / deploy:** GitHub Actions workflow running `npm ci && npm run build` and publishing to GitHub Pages. `vite.config.ts` sets `base: '/books/'`.

## Repo layout

```
/src/
  firebase.ts                     copied from carousels (config unchanged)
  useAuth.ts                      copied from carousels
  useProgress.ts                  copied, generalized for {bookSlug -> {current_essay, scroll}}
  useTheme.ts                     new — light/dark/system with localStorage override
  useFontSize.ts                  new — A-/A/A+ with localStorage
  App.tsx                         routes: /, /:bookSlug, /:bookSlug/:essaySlug
  pages/
    Bookshelf.tsx                 home — list of books with continue-reading hint
    BookIndex.tsx                 per-book essay list + credit line + progress markers
    Essay.tsx                     renders the .md, drives scroll-progress tracking
  components/
    AuthWidget.tsx                copied from carousels
    ThemeToggle.tsx               sun/moon button
    FontSizeToggle.tsx            A- / A / A+
    ShareButton.tsx               Web Share API with copy-link fallback
    ReadingProgressBar.tsx        thin top bar showing scroll %
    BackToTop.tsx                 floating button after 30% scroll
    QuickRefCard.tsx              styled box for the do/don't list at essay end
  styles.css                      all styles in one file (small site)
/books/
  how-to-talk/
    meta.json                     { title, slug, credit, essays: [...] }
    01-feelings.md
    02-cooperation.md
    ... through 09-pitfalls.md
/scripts/
  generate-og-cards.ts            build-time per-essay 1200x630 PNG generator
  generate-static-html.ts         build-time per-essay HTML stub with OG tags
  generate-sitemap.ts             build-time sitemap.xml
/public/
  favicon.svg
  apple-touch-icon.png
  robots.txt
/firestore.rules                  copied verbatim from carousels
/.github/workflows/deploy.yml     copied from carousels, adjusted base path
/vite.config.ts                   base: '/books/'
/index.html                       site shell
/404.html                         GitHub Pages SPA fallback
/package.json
/tsconfig.json
```

## Essay Markdown format

Each essay is a Markdown file with YAML frontmatter:

```markdown
---
title: भावना आधी, उपाय नंतर
slug: 01-feelings
order: 1
summary: मूल रडत असेल तर आधी काय करायचं
read_time: 6
---

essay body in Markdown...
```

The body uses standard Markdown headings (`##`, `###`), bold for the principle line, numbered lists for techniques, and a final `## Quick reference` section that the renderer styles as a `QuickRefCard` block.

## Firestore data model

Single doc per user at `users/{uid}`. Extends the carousels schema; no new collections.

```
users/{uid}/
  email: string
  display_name: string
  last_seen: timestamp
  progress: {
    "how-to-talk": {
      current_essay: number,                  // last opened essay order, 1-indexed
      scroll: { [order: string]: number },    // 0..1 percent scrolled per essay
      updated_at: timestamp
    }
    // future books slot in alongside
  }
  completed_essays: {
    "how-to-talk": number[]                   // essay orders fully read (>=95% scroll)
  }
  streak: {
    current: number,
    longest: number,
    last_read_date: string | null             // YYYY-MM-DD
  }
```

**Write pattern:** debounced 1500 ms while reading (matches carousels). Pending writes flushed on `pagehide` and on essay navigation. An essay is recorded in `completed_essays` once its `scroll` value crosses 0.95. Streak logic is reused unchanged from `useProgress.ts` in carousels.

**Read pattern:** the user doc is fetched once on auth state change and cached in React state. The Bookshelf and BookIndex pages read from this cache to show "Continue reading: Essay 3 — कौतुक कसं करायचं" and per-essay completion checkmarks.

**`firestore.rules`:** copied verbatim from carousels — `allow read, write: if request.auth.uid == uid` on `users/{uid}`.

## Pages and routing

| Route | Page | Purpose |
|---|---|---|
| `/` | Bookshelf | Site title, tagline, book cards. If signed in and there's progress, a "Continue reading" link to the last-open essay. |
| `/:bookSlug` | BookIndex | Book title, intro paragraph, credit line (book 1 only), numbered essay list with per-essay completion checkmark and read-time, theme + font-size toggles. |
| `/:bookSlug/:essaySlug` | Essay | Sticky minimal top bar (back, theme toggle, share button), reading-progress bar, essay body, quick-ref card, prev/next essay buttons, back-to-top floating button. |

Login is offered but not required. Reading works fully without sign-in; signing in only enables progress, completion checkmarks, and streaks.

## Reading experience

- **Devanagari font:** Tiro Devanagari Marathi (Google Fonts). Designed for Marathi, handles `ळ`, `ऱ`, conjuncts well.
- **Latin font:** Inter (Google Fonts). Pairs cleanly with Tiro by weight and x-height.
- **Both fonts** loaded as `font-display: swap` from Google Fonts.
- **Body size:** 18px base on mobile, line-height 1.7 (Devanagari needs more vertical breathing room than Latin). Max content width 640px on tablet/desktop.
- **Color scheme:**
  - Light: background `#FAF7F2`, text `#1F1B16`
  - Dark: background `#1A1A1C`, text `#E8E4DD`
  - Accent (links, buttons): `#C76C2D` — works in both modes
- **Theme switching:** auto-detects `prefers-color-scheme` on first visit; sun/moon toggle in the top bar overrides and persists in `localStorage` under key `theme` with values `light | dark | system`.
- **Font size:** three steps (A- / A / A+) mapping to body sizes 16 / 18 / 20 px. Persisted in `localStorage` under key `font-size`.
- **Reading progress bar:** thin (3px) bar pinned to the top of the essay viewport, fills as the user scrolls.
- **Share button:** uses `navigator.share()` when available (mobile), falls back to copying the URL to clipboard with a toast confirmation on desktop.

## Sharing and metadata

This is a primary use case — links must unfurl nicely in WhatsApp / Telegram / Twitter.

- **Per-essay static HTML stub:** at build time, `scripts/generate-static-html.ts` reads each essay's frontmatter and writes a tiny `dist/<book>/<essay>/index.html` containing only OG/Twitter meta tags and a redirect (or pre-rendered shell) to the SPA. GitHub Pages serves this static HTML on first hit, so crawlers see the right tags.
  - `og:title` = essay title
  - `og:description` = essay `summary` from frontmatter (or first ~160 chars of body if missing)
  - `og:image` = per-essay social card URL
  - `og:type` = `article`
  - `og:locale` = `mr_IN`
  - Twitter card: `summary_large_image`
- **OG image generation:** `scripts/generate-og-cards.ts` produces a 1200×630 PNG per essay using `satori` + `sharp`. Layout: essay number top-left, essay title in Tiro Devanagari Marathi center, "instamarathi books" in small Inter at the bottom, accent-orange color block. Generated once per build into `public/og/<book>/<essay>.png`.
- **Sitemap:** `scripts/generate-sitemap.ts` emits `dist/sitemap.xml` with one entry per essay plus the bookshelf and book-index pages.
- **`robots.txt`:** allows all crawlers.
- **Page title and meta description** set client-side per essay via the React `<head>` (using `document.title` and a meta tag); also baked into the static stub for crawlers.
- **Favicon and apple-touch-icon** in `public/`.

## Build and deploy

- **Local dev:** `npm run dev` → Vite at `http://localhost:5173/books/`. Markdown files hot-reload.
- **Production build:** `npm run build` runs:
  1. `vite build` — produces the SPA bundle in `dist/`
  2. `tsx scripts/generate-og-cards.ts` — writes per-essay PNGs to `dist/og/`
  3. `tsx scripts/generate-static-html.ts` — overwrites per-essay `dist/.../index.html` with the OG-tagged stubs
  4. `tsx scripts/generate-sitemap.ts` — writes `dist/sitemap.xml`
- **CI:** `.github/workflows/deploy.yml` runs on push to `main`, executes `npm run build`, and publishes `dist/` to GitHub Pages via `actions/deploy-pages`.
- **GitHub Pages config:** project pages served from the GitHub Actions artifact (not from a `gh-pages` branch).

## Author workflow

| Task | Steps |
|---|---|
| Write a new essay | Create a new `.md` file in `/books/<book>/`, fill frontmatter, write body. Add the slug to `meta.json`. |
| Add a new book | `mkdir /books/<slug>`, add `meta.json` with `title/slug/credit/essays`, then write essays. The book auto-appears on the bookshelf via the Vite glob import. |
| Reorder essays | Edit the `order` field in frontmatter; `meta.json` order list also updates. |
| Local preview | `npm run dev` |
| Publish | `git push origin main` → CI builds and deploys, ~2 min to live. |

## Out of scope for v1

- Search across essays
- Bookmarks separate from progress
- Comments / reactions
- Email digests / newsletter
- Print stylesheet / PDF export
- Multilingual (English-only or Hindi-only) versions of the site chrome
- Analytics beyond Firebase Auth user counts (GoatCounter or similar can bolt on later)

## Open questions to resolve during implementation

- Final book title (working: *मुलांशी कसं बोलावं*) — confirmed before writing essays.
- Cover treatment for the bookshelf card — text-only stylized cover for v1, can add a real cover image later.
- Source-book credit line wording — exact title to insert in `meta.json` `credit` field.

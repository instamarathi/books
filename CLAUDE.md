# instamarathi/books — project guide

This repo is the source of https://instamarathi.github.io/books/ — a phone-first Marathi reading site that hosts original Marathi-language books. Most books are 9-chapter how-to titles inspired by the principles of a popular non-fiction book, but the site also supports fiction (original Marathi stories) and essay collections, contextualized for Marathi-speaking families and professionals.

This file is loaded by Claude on every session. It is the source of truth for content rules, structure, and tooling.

---

## Authoring rules — non-negotiable

These rules apply to every chapter generated for this site, whether written manually or by a scheduled agent. They are about voice, not structure — they hold across howto, fiction, and essay alike.

1. **Original prose only.** Chapters inspired by a source book draw on its *principles* (ideas, not copyrightable), but never reproduce, paraphrase, or do "minor changes / substitutions" of the source text. The book is the seed, not the script. If you find yourself remembering a specific sentence from the source, do not write it down — write a fresh sentence in your own words about the same idea. Fiction chapters must be original — do not retell a published story.
2. **Marathi prose in Devanagari, English loanwords in Roman script.** Example: `मुलाने tantrum केला तर लगेच react करू नका`. This matches how educated Marathi speakers actually write in WhatsApp/messages. Don't transliterate English words to Devanagari (no `टॅन्ट्रम`).
   - **Only swap in English for nouns, verbs, and adjectives that are genuinely common in Marathi WhatsApp** (`tantrum`, `react`, `EMI`, `manager`, `schedule`, `boring`, `viral`, `feedback`). Tech, work, and modern-life vocabulary is fair game.
   - **Do NOT replace Marathi function-words with English.** Adverbs like `never / always / ever / actually / really / maybe / already / deeply / secretly`, conjunctions, prepositions, and articles all have natural Marathi equivalents (`कधीच / नेहमी / कधीही / खरं तर / खरंच / कदाचित / आधीच / खूप / आतून`) and using English for them sounds clumsy. **Bad:** `नवीन मित्र हे never करणार` / `actually growth रोखतं` / `deeply uncomfortable विचार` / `पूर्ण cage बदलतात without leaving it` / `secretly miss करतात`. **Good:** `नवीन मित्र हे कधीच करणार नाहीत` / `खरं तर growth रोखतं` / `खूप uncomfortable विचार` / `पूर्ण cage बदलतात — पिंजरा न सोडता` / `आतून miss करतात`.
   - **Avoid Sanskritic/literary words when an everyday word exists.** `गुप्तपणे` is dictionary-correct but reads as formal/written register; `आतून` or `गुपचूप` is what an educated speaker actually types. Same trap: `अत्यंत` (formal) vs `खूप` (natural), `तथापि` (formal) vs `तरी` (natural), `यथार्थ` (formal) vs `खरंच` (natural). Default to the WhatsApp register, not the wedding-speech register.
   - The test: would an educated Marathi speaker actually type this in a WhatsApp message? `मला never जायचं` — no, they'd type `मला कधीच जायचं नाही`. `meeting reschedule कर` — yes. When in doubt, prefer Marathi for the connective tissue and English for the concrete object/action.
   - Quoted English phrases (dialogue, fixed psychological terms like `"all-or-nothing thinking"`, brand/product names, song titles) are exempt — those are quotes, not prose.
3. **Tone matches the kind.** Howto: practical, direct, friend-sharing-what-works. Fiction: scenes and dialogue, not preachy. Essay: reflective and argued, not academic. None of them should sound like a generic self-help blog post.
4. **Bait-worthy premise.** The strongest chapters name a struggle the reader feels but can't say out loud, and validate it without preaching. Counterintuitive framings beat obvious ones every time:
   - **Good:** `अंजली आणि "चांगला नवरा" चं अदृश्य तुरुंग` — the husband is genuinely good, *and* she's still trapped. The reader thinks "wait, can you actually say that?" and keeps reading.
   - **Bad:** `अंजली आणि नवऱ्याच्या वाईट सवयी` — same problem, obvious framing, no bait.
   - The test: does the title or opening make the reader uncomfortable in a "finally someone said it" way? If it reads like a Sunday-supplement headline, it's too safe. The reward the reader gets is *permission to think the silenced thought* — not a clever solution.
   - Anchor the bait in a specific concrete moment (the line your character can't unhear: "आई, गुरुवारच्या sports day ला uncle येणार आहेत का?", "तुम्ही reels मध्ये जास्त सुंदर दिसता. प्रत्यक्षात थोड्या सावळ्या आहात ना?"). One sharp line beats a paragraph of analysis.
5. **Structural variety across chapters — a book is chapters, not one story retold nine times.** Chapters in the same book legitimately share a thesis, a vocabulary, a protagonist archetype — that's what makes it *a book*. But when every chapter runs the identical narrative engine (protagonist stuck → one friend/senior delivers the reframe → protagonist writes it on paper → clean resolution), the book reads as one story retold with different names, and readers notice by chapter 4 or 5. This mainly applies to `howto` and `fiction` — `essay` is argument-driven, not scene-driven, so it's less exposed to this failure mode.
   - **Before writing chapter bodies, plan three things per chapter, one line each**, and make sure no two chapters repeat the same combination of all three:
     - **Opening-scene-type** — not every chapter opens mid-paralysis with two options laid out side by side. Vary it: open after a wrong choice was already made once before; open watching someone else live the problem; open mid-argument or mid-dialogue with no scene-setting; open post-decision, in flashback; open with the fear already spoken aloud to someone.
     - **Insight-source** — not every chapter needs one wise friend/senior delivering the reframing line. Vary it: the protagonist reasons it out alone; the protagonist is giving advice to someone else and only then sees it applies to them; two people disagree and neither is fully right; a mistake or a missed deadline reveals it, with no one saying anything.
     - **Resolution-mechanic** — the device that turns a vague fear into something workable doesn't have to be "wrote it down on paper" every time; that's the single most common convergence point in AI-drafted chapters. Vary it: said out loud to one person, a blunt message sent, a phone call that supplies the missing information, a physical trial run, a deadline arriving and forcing a decision by default.
   - **At least one chapter (two for a 12-chapter essay collection or a longer fiction book) should end with the technique or idea correctly applied and the outcome still mixed or unresolved.** Not every chapter needs to resolve cleanly — a book about decision-making that shows this once, in-scene, argues its own thesis more convincingly than a book that only states it.
   - **Keep the variation in service of the material, not a gimmick bolted onto an otherwise-identical scene.** If the natural telling of a chapter converges with an earlier chapter's shape, that's fine once — it's only a problem when it becomes the default for most chapters in the book. The test: could a reader who just finished chapter 3 predict chapter 6's shape before reading it? If yes, vary something.
6. **Length is kind-dependent.** Howto: 700–1000 words per chapter (~5–8 minute mobile read). Essay: 700–1500 words; reflections that need a longer arc are fine. Fiction: no upper bound — let the scene breathe; 800–2500 words per chapter is a reasonable range, longer is OK if the story demands it. Stay phone-readable: avoid single chapters past ~3000 words.
7. **Marathi-context examples / scenes only.** Use Indian household scenarios — homework, school, बस, cousins (मामेभाऊ/मावसभाऊ), neighbours, festivals, joint families, dabba, exam pressure, screen time, Marathi-medium vs English-medium school. Do NOT use Western settings unchanged ("soccer practice", "the cabin in the woods", "Thanksgiving") — translate the spirit into something the Marathi reader recognizes from daily life.
8. **Source book (when there is one) is credited once per book, on the book index page.** The credit line lives in `books/<slug>/meta.json` under the `credit` field. It does not appear in individual chapters. Original fiction can omit `credit` entirely.

---

## Book structure

Every book lives at `books/<slug>/`:

```
books/<slug>/
  meta.json
  01-<topic>.md
  02-<topic>.md
  ...
  NN-<topic>.md
```

Chapter count is **kind-dependent** (see `chapter_order` in `meta.json`):

- `howto` — exactly 9 chapters. The shape is fixed.
- `essay` — usually 7–12. Pick the count the argument actually needs; do not pad to hit 9, do not skip a real chapter to stay under 12.
- `fiction` — variable. A short-story collection might be 6 chapters; a serialized novella might be 15+. Length is whatever the story demands.

`meta.json` shape:

```json
{
  "slug": "<book-slug>",
  "title": "<Marathi title>",
  "subtitle": "<one-line description in Marathi or English>",
  "kind": "howto",
  "credit": "ही प्रकरणं <source-book-name> या पुस्तकातील विचारांवर आधारित आहेत, मराठी context साठी पुन्हा लिहिलेली.",
  "chapter_order": ["01-...", "02-...", ..., "NN-..."]
}
```

The `kind` field picks the chapter template. Allowed values:

- `"howto"` — practical/instructional. Numbered techniques, pitfalls, and a `## Quick reference` block. **Default if `kind` is omitted** (preserves backward compatibility for the 9 existing books).
- `"fiction"` — narrative. Free-form prose, scenes, dialogue. No techniques, no pitfalls, no Quick reference.
- `"essay"` — reflective/argumentative. Flowing prose, optional pull-quote, optional closing thought. No fixed sections.

Pick the kind that fits the source material. Do not force a memoir, short-story collection, or essay collection into the howto shape — pick `fiction` or `essay` instead.

`credit` is optional for `fiction` (an original story has no source to credit). For `howto` and `essay` it remains expected.

---

## Universal frontmatter (every chapter, every kind)

Every chapter file starts with the same frontmatter regardless of kind:

```markdown
---
title: <Marathi chapter title>
slug: <NN-topic>
order: <1..N>
summary: <one-line Marathi/Marathi+English description>
read_time: <integer minutes; ~5-8 for howto/essay, can be higher for fiction>
---
```

Required fields: `title`, `slug`, `order`, `read_time`. `summary` is recommended but the parser falls back to the first paragraph if absent. `read_time` should reflect the actual chapter length — fiction chapters of 2000+ words may legitimately be 10–15 minutes.

Important: if a `summary:` value starts with a `"` (a quoted phrase), wrap the whole summary value in single quotes — otherwise gray-matter's YAML parser treats the leading `"` as the start of a quoted scalar and chokes on the trailing text. Example: `summary: '"बूट जागेवर ठेव" — दिवसातून शंभर वेळा...'`. The browser-side parser in `src/books.ts` is more lenient, but the build-time scripts use gray-matter and will fail.

What follows the frontmatter depends on `kind`.

---

## Chapter body — `kind: "howto"`

```markdown
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

The literal heading `## Quick reference` is detected by the renderer (case-insensitive) and styled as a `QuickRefCard` block. **Only `howto` chapters use this heading.** Do not change the heading text or the styling will break.

Canonical reference: `books/how-to-talk/01-feelings.md`. Template stub: `docs/templates/howto-chapter.md`.

---

## Chapter body — `kind: "fiction"`

Free-form Marathi prose. A chapter is a story, scene, or set of scenes — there is no "principle" to extract. Use `## <heading>` only if you genuinely need a section break (e.g., time-skip, POV change). Most fiction chapters can be written as continuous prose with paragraph breaks.

What works:
- Open with action or dialogue, not a setup paragraph.
- Use real Marathi household detail (smell of दुपारची kitchen, बस stop, rickshaw stand, festival prep) to ground the scene.
- Keep dialogue in Devanagari + Roman loanwords, the same way the rest of the site does.
- If you want a short reflective beat at the chapter's end, write it as prose — not a "Quick reference" card.

Do NOT include `## Quick reference`, `## ही techniques वापरा`, `## हे टाळा`, or numbered technique lists. Those are for `howto` only.

Template stub: `docs/templates/fiction-chapter.md`.

---

## Chapter body — `kind: "essay"`

Flowing Marathi prose with one clear argument or reflection per chapter. Headings are optional. A pull-quote (a single bolded line on its own paragraph) is fine if it carries the chapter's central claim. A closing thought paragraph is fine.

Avoid the howto signposts (`## ही techniques वापरा`, `## हे टाळा`, `## Quick reference`). The essay carries itself; lists tend to flatten it.

Template stub: `docs/templates/essay-chapter.md`.

---

## Architecture decisions

| Area | Choice | Why |
|---|---|---|
| Stack | Vite + React 18 + TypeScript | Matches sibling project at `../carousels`; reuses auth/progress hooks |
| Routing | Path-based (`react-router-dom` BrowserRouter) | Per-chapter Open Graph tags must resolve for crawlers |
| Markdown | `react-markdown` + `remark-gfm`, loaded via `import.meta.glob` | All books bundle at build time; no runtime fetch |
| Quick-ref styling | Marker-heading detection (`## Quick reference`) | Simpler than custom remark plugin or frontmatter block; opportunistic — only `howto` chapters include it |
| Book kinds | `kind` field in `meta.json` (`howto` \| `fiction` \| `essay`); defaults to `howto` | Each kind has its own chapter template; the renderer is structure-agnostic and just renders markdown, with a soft hook for `## Quick reference` |
| Auth | Firebase Auth, Google provider, popup | Reuses existing `carousel-2a740` Firebase project |
| Database | Firestore, single `users/{uid}` doc | Same shape as carousels; book/chapter progress added under `progress[bookSlug]` |
| Progress write | Debounced 1500 ms, flushed on `pagehide` | Matches carousels |
| Chapter completion | Scroll position ≥ 0.95 | Tolerates "didn't quite reach the bottom" |
| Streak logic | Reused unchanged from carousels useProgress | Single user identity → unified streak across reading + carousels |
| Theme | `useTheme` hook with light/dark/system, CSS variables | Auto-detects `prefers-color-scheme`, manual override persists in localStorage |
| Font size | `useFontSize` hook with A-/A/A+ (17/20/22px) | Devanagari readers vary widely in eye comfort; baseline tuned up for phone reading |
| Fonts | Mukta (Devanagari) + Inter (Latin) from Google Fonts | Mukta is screen-optimized for Devanagari and reads less crowded than Tiro at phone body sizes |
| OG cards | Build-time satori + resvg, 1200×630 PNG per chapter | Required for WhatsApp/Telegram unfurls |
| Static stubs | Build-time `dist/<book>/<chapter>/index.html` with injected OG tags | Crawlers see correct meta on first hit |
| Sitemap | Build-time generator | One entry per chapter + book + bookshelf |
| Deploy | GitHub Actions → GitHub Pages | Push to main, ~2 min to live |
| Analytics | None for v1 | Keep clean; can add GoatCounter later |

---

## Adding a new book — manual workflow

1. `mkdir books/<slug>`
2. Write `meta.json`.
3. Write 9 `.md` chapters following the structure above.
4. `npm test && npx tsc --noEmit && npm run build` — all must pass.
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
npm run build           # Full pipeline: vite + OG cards + static stubs + sitemap (this is what CI runs)
```

`npm run build` is the same command CI runs on every push. Running it locally catches frontmatter issues that `npx vite build` alone misses (e.g., gray-matter YAML parse failures in the OG/static-stub generators).

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
docs/templates/
  howto-chapter.md      Template stub for kind: "howto" chapters
  fiction-chapter.md    Template stub for kind: "fiction" chapters
  essay-chapter.md      Template stub for kind: "essay" chapters
firestore.rules         Firestore security (copied from carousels)
.github/workflows/      GitHub Actions deploy
CLAUDE.md               This file
books.txt               User-curated queue for the scheduled agent (one title per line)
book_suggestions.txt    50-title pool to pick from when refilling books.txt
schedule.txt            Prompt the scheduled agent runs each night
```

---

## Paywall

Per book: the **first chapter (order=1) is open to everyone**; chapters 2–9 require Google sign-in. Implementation: `BookIndex.tsx` shows a 🔒 marker on locked rows; `Chapter.tsx` renders a `SignInGate` component instead of the body when `!user && chapter.order > 1`. The free-chapter threshold is the constant `FREE_CHAPTER_ORDER` in those two files — change in both if you ever raise/lower the wall.

OG card stubs are NOT gated (a shared link should still unfurl with title + image even when the recipient is logged out). The gate is client-side only.

## Things NOT to do

- Do not change the path-routing scheme to hash routing. OG card unfurls depend on real URLs.
- Do not transliterate English loanwords to Devanagari (`टॅन्ट्रम`). Keep them in Roman script.
- Do not write chapters that require Western cultural context to land. Translate examples into Marathi life.
- Do not put a credit line in individual chapters. It belongs only in `meta.json`.
- Do not pad or skip chapters to hit a target count. Howto is the only kind with a fixed shape (exactly 9). Essay should be the count the argument needs (commonly 7–12). Fiction is whatever the story demands (a collection may be 6, a novella 15+).
- Do not change the `## Quick reference` heading text — the renderer matches it literally.
- Do not add `## Quick reference`, `## ही techniques वापरा`, or `## हे टाळा` to `fiction` or `essay` chapters. Those headings are for `howto` only.
- Do not pick `kind: "howto"` for a memoir, story collection, or essay collection just to fit the existing template. Pick the kind that fits the source.
- Do not enable analytics, comments, or social features without an explicit ask.
- Do not commit secrets. The Firebase config is intentionally public; that's fine. Anything else is not.

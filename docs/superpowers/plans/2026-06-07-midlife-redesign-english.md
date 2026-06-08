# Midlife Redesign - English Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new English-language essay book version of `midlife-redesign` with India-specific examples and a fresh book slug.

**Architecture:** Create a standalone book directory with its own metadata and chapter files. Keep the existing essay structure and chapter count, but rewrite each chapter in original English prose so the book reads natively in English and feels regionally Indian rather than Maharashtra-specific. Validation is primarily content and build integrity: frontmatter correctness, chapter ordering, and a successful production build.

**Tech Stack:** Markdown, JSON metadata, Vite build pipeline, existing book renderer

---

### Task 1: Add the book metadata

**Files:**
- Create: `books/midlife-redesign-english/meta.json`

- [ ] **Step 1: Write the new metadata**

```json
{
  "slug": "midlife-redesign-english",
  "title": "Midlife Redesign - English",
  "subtitle": "Learning to slow down, reset, and design the second half of life for Indian readers",
  "category": "mindset",
  "kind": "essay",
  "credit": "These chapters are based on the ideas in \"मिडलाईफ ~~क्रायसिस~~ रीडिझाईन\", rewritten in English for a wider Indian context.",
  "chapter_order": [
    "01-stop-running",
    "02-autopilot",
    "03-what-happens-if-you-stop",
    "04-the-habit-of-saying-yes",
    "05-learn-to-say-no",
    "06-old-beliefs",
    "07-the-weight-of-experience",
    "08-fear-of-money",
    "09-lonely-in-the-crowd",
    "10-relationship-with-self",
    "11-what-to-teach-children",
    "12-the-next-twenty-years"
  ]
}
```

- [ ] **Step 2: Check that the metadata matches the existing essay-book conventions**

Run: `jq . books/midlife-redesign-english/meta.json`
Expected: valid JSON with 12 chapter slugs and `kind: "essay"`.

### Task 2: Add the twelve English chapters

**Files:**
- Create: `books/midlife-redesign-english/01-stop-running.md`
- Create: `books/midlife-redesign-english/02-autopilot.md`
- Create: `books/midlife-redesign-english/03-what-happens-if-you-stop.md`
- Create: `books/midlife-redesign-english/04-the-habit-of-saying-yes.md`
- Create: `books/midlife-redesign-english/05-learn-to-say-no.md`
- Create: `books/midlife-redesign-english/06-old-beliefs.md`
- Create: `books/midlife-redesign-english/07-the-weight-of-experience.md`
- Create: `books/midlife-redesign-english/08-fear-of-money.md`
- Create: `books/midlife-redesign-english/09-lonely-in-the-crowd.md`
- Create: `books/midlife-redesign-english/10-relationship-with-self.md`
- Create: `books/midlife-redesign-english/11-what-to-teach-children.md`
- Create: `books/midlife-redesign-english/12-the-next-twenty-years.md`

- [ ] **Step 1: Write chapter 1 with the opening thesis and a concrete Indian work/family scene**

```markdown
---
title: Stop Running
slug: 01-stop-running
order: 1
summary: You are not failing because you are weak; you are failing because you forgot how to pause.
read_time: 8
---

<chapter prose here>
```

- [ ] **Step 2: Write chapters 2-12 so each one develops a distinct part of the argument**

```markdown
---
title: Autopilot
slug: 02-autopilot
order: 2
summary: The routines that once helped you survive can quietly start living your life for you.
read_time: 8
---

<chapter prose here>
```

Continue the same frontmatter pattern for the remaining files, keeping each chapter focused on one idea:
- `03-what-happens-if-you-stop.md`: what stillness reveals
- `04-the-habit-of-saying-yes.md`: why midlife default agreement becomes costly
- `05-learn-to-say-no.md`: refusal as a practical skill, not a personality trait
- `06-old-beliefs.md`: beliefs that once protected you but now limit you
- `07-the-weight-of-experience.md`: experience becomes useful only after reflection
- `08-fear-of-money.md`: money fear, safety, status, and the stories we inherit
- `09-lonely-in-the-crowd.md`: crowded lives that still feel emotionally isolated
- `10-relationship-with-self.md`: self-relationship as the foundation for all other relationships
- `11-what-to-teach-children.md`: what children actually learn from your life
- `12-the-next-twenty-years.md`: midlife as a design phase, not a decline narrative

- [ ] **Step 3: Ensure each chapter uses India-specific details from multiple regions**

Use scenes and references from places such as Delhi, Bengaluru, Chennai, Hyderabad, Kolkata, Jaipur, Lucknow, Kochi, Guwahati, Surat, Chandigarh, and Bhopal so the book reads as pan-Indian rather than regionally narrow.

### Task 3: Validate the new book

**Files:**
- Review: `books/midlife-redesign-english/meta.json`
- Review: all chapter files under `books/midlife-redesign-english/`

- [ ] **Step 1: Check the chapter order and filenames**

Run: `jq -r '.chapter_order[]' books/midlife-redesign-english/meta.json`
Expected: the 12 filenames listed above in the same order.

- [ ] **Step 2: Run the project test suite and build**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: all commands pass with no frontmatter or build errors.


# Design Spec: The Research Multiplier

**Date:** 2026-05-01
**Slug:** `research-multiplier`
**Status:** Approved

---

## Overview

A 9-chapter English-language book for the *instamarathi/books* site, aimed at a part-time PhD student in Industrial Engineering at NTU Singapore who also holds a full-time job. The book applies Andy Grove's management frameworks from *High Output Management* to research productivity, with Claude Code as the primary force multiplier.

The central argument: you cannot add more hours, so you multiply output per hour. Grove's production-system thinking maps directly onto a research pipeline — identify bottlenecks, protect high-leverage activities, delegate everything delegable to AI.

---

## Identity

| Field | Value |
|---|---|
| Title | The Research Multiplier |
| Subtitle | A part-time PhD guide to producing more with the hours you have |
| Slug | `research-multiplier` |
| Language | English only (no Marathi, no Devanagari) |
| Credit line | "These chapters are inspired by the management frameworks in Andy Grove's *High Output Management*, rewritten for part-time researchers who need to multiply their output — not their hours." |

The credit line appears once, in `meta.json`, displayed on the book index page before the chapter list. It does not appear in individual chapters.

---

## Audience

A part-time PhD student who:
- Works full-time (industry, likely tech or engineering)
- Is Indian, studying at a foreign university (NTU Singapore context)
- Is in the middle stage of their PhD (experiments running, data collecting, some writing)
- Has ideas they cannot execute due to time scarcity
- Needs a mental model + a toolchain, not just productivity tips

---

## Tone & Voice

Same as the existing books on this site:
- Practical, direct, how-to
- A friend who has tried this and is sharing what works — not a coach, not an academic
- Indian professional in Singapore: uses scenarios like day-job appraisals bleeding into thesis guilt, WhatsApp messages to advisor at 11pm, long weekends as the primary research window, NTU thesis submission deadlines
- No Western examples unchanged. Translate to Indian professional context.
- No academic fussiness, no corporate jargon left unexplained

---

## Chapter Structure

Every chapter follows the standard template:

```
---
title: <chapter title>
slug: <NN-topic>
order: <1-9>
summary: <one-line description>
read_time: <integer, usually 6-8>
---

<Opening scenario — one paragraph, Indian professional context>

**<Bolded principle — 1-2 lines>**

<One paragraph on why this principle matters>

## Use these N techniques

1. **<technique>** — <example/scenario>
2. ...

## Avoid these

- **<pitfall>** — <explanation>
- ...

## Quick reference

**Say:**
- ...

**Avoid:**
- ...
```

The `## Quick reference` heading is matched literally by the renderer for `QuickRefCard` styling — do not change it.

Chapter length: 700–1000 words.

---

## 9-Chapter Arc

| # | Slug | Title | Grove concept |
|---|------|-------|---------------|
| 1 | `01-output` | Your Output Is the Paper, Not the Hours | Output = org output, not individual effort. Reframes what "work" means for a researcher. |
| 2 | `02-limiting-step` | Find the Step That's Slowing Everything | Breakfast factory / limiting step. For most part-time PhDs the bottleneck is writing, not ideas. Identify it, protect it, unblock it. |
| 3 | `03-leverage` | What Only You Can Do | Managerial leverage. Insight, framing, judgment = keep. Coding, data cleaning, lit summaries, first drafts = delegate to Claude Code. |
| 4 | `04-advisor` | The Advisor Meeting Is Your Highest-Leverage Hour | One-on-ones. Come with decisions, not questions. Structure 30 minutes to unblock 2 weeks of work. |
| 5 | `05-indicators` | Measure What Predicts, Not What Feels Good | Leading vs. lagging indicators. Papers submitted = lagging. Experiments-run-per-week = leading. Simple tracking system. |
| 6 | `06-task-maturity` | Know What to Hand Off | Task-relevant maturity. When to go deep yourself vs. when Claude Code is good enough. The delegation test for each research task type. |
| 7 | `07-job-advantage` | Your Job Is Your Research Advantage | Grove on org knowledge. Industrial Engineering PhD + industry job = real problems, real data, real constraints. How to mine day-job experience for research material. |
| 8 | `08-rhythm` | The Weekly Operating Rhythm | Grove's planning cadence. Sunday 30-min plan, mid-week check, Friday commit. Protecting research time when a full-time job wants everything. |
| 9 | `09-writing` | Writing Is a Production Line | Output quality and throughput. Thesis chapter as sprint: Claude Code for first draft + structure, you for substance + argument. Notes → submitted chapter in one long weekend. |

---

## Technical Requirements

- `meta.json` follows the standard schema (slug, title, subtitle, credit, chapter_order)
- All 9 `.md` files in `books/research-multiplier/`
- YAML frontmatter must not have unquoted `"` at the start of `summary:` values
- `## Quick reference` heading is case-insensitive in the renderer but must read exactly `Quick reference` to be safe
- `npm test && npx tsc --noEmit && npm run build` must pass before commit

---

## Out of Scope

- No Marathi text in this book
- No changes to routing, auth, or renderer
- No new UI components — existing chapter renderer handles English fine
- No analytics or social features

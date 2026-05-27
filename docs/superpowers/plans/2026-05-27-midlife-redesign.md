# मिडलाईफ ~~क्रायसिस~~ रीडिझाईन — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a 12-chapter Marathi essay book on critical thinking at 40, reframing midlife crisis as midlife redesign, plus code changes to support strikethrough (`~~`) in book titles.

**Architecture:** Two parts — (1) a small code change to render `~~text~~` as `<del>text</del>` in book titles across the UI, OG cards, and static stubs; (2) content: 1 directory, 1 meta.json, 12 markdown chapter files. Each chapter is 2500–3000 words of 90–95% Marathi prose.

**Tech Stack:** React + TypeScript (renderer fix), Markdown with YAML frontmatter (content). Validated by existing `npm test`, `npx tsc --noEmit`, and `npm run build` pipeline.

**Spec:** `docs/superpowers/specs/2026-05-27-midlife-redesign-design.md`

---

## Key constraints for all chapters

### Language rules
- Primary language: Marathi in Devanagari — 90–95% of text
- English loanwords in Roman script only when genuinely unavoidable: EMI, autopilot, design, feedback, manager, WhatsApp, reels, System 1/System 2
- Do NOT use English for function-words (never, always, actually, really, deeply, secretly, maybe, already) — always use Marathi equivalents (कधीच, नेहमी, खरं तर, खरंच, खूप, आतून, कदाचित, आधीच)
- Avoid Sanskritic/literary register: use खूप not अत्यंत, तरी not तथापि, खरंच not यथार्थ, गुपचूप not गुप्तपणे
- Address reader as "तुम्ही" (formal/respectful), not "तू"
- Use respectful verb forms throughout: थांबवा, शिका, विचार करा, बघा — never थांब, शिक, विचार कर, बघ

### Chapter structure template
Every chapter follows the essay kind template:

```markdown
---
title: <Marathi chapter title>
slug: <NN-topic>
order: <1-12>
summary: <one-line Marathi description — if starts with " wrap whole value in single quotes>
read_time: <integer, typically 15-20>
---

<Opening — a concrete scene, moment, or observation grounded in Indian daily life. NOT a thesis sentence. Earn the reader's attention with something specific and lived.>

<Argument development — 2-3 paragraphs building the chapter's central idea using Marathi-context examples (household, workplace, family, festivals, rickshaws, dabba, school admissions, joint families).>

**<Bolded pull-quote — a single line carrying the chapter's central claim. Optional but recommended.>**

<Deeper development — push the argument one step further. The non-obvious implication, the second-order effect. This is the chapter's reason to exist.>

<Closing — a thought the reader carries away. Not a checklist, not a moral. A resonant observation or reframe.>
```

Do NOT include: `## Quick reference`, `## ही techniques वापरा`, `## हे टाळा`, numbered technique lists, or any howto-style signposting.

### Voice reference
Match the voice of `books/sahaa-topya/01-gondhal.md` — reflective, conversational, argued. Like a thoughtful friend who's been through the same thing and is thinking out loud with you. Not preachy, not academic, not self-help-bloggy.

Research should be woven in naturally as confident claims ("संशोधन सांगतं की..."), not as academic citations. Name Kahneman sparingly; don't list researchers.

### Bait-worthy openings
Each chapter opens with a scene or line that names a struggle the reader feels but can't say aloud. The hook is "finally someone said it." Anchor bait in a specific concrete moment — one sharp line of dialogue or observation, not a paragraph of setup.

### Settings
Alternate between corporate/IT (Pune/Mumbai) and small-town (tier-2/3: Kolhapur, Nagpur, Sangli, Satara) scenarios across chapters.

---

## Task 1: Strikethrough support in book titles

**Files:**
- Create: `src/renderTitle.tsx`
- Modify: `src/pages/BookIndex.tsx:23`
- Modify: `src/pages/Bookshelf.tsx:73,75,118`
- Modify: `src/components/BookCover.tsx:37`
- Modify: `scripts/generate-og-cards.ts:65`
- Modify: `scripts/generate-static-html.ts:69,71,78,94,96`

- [ ] **Step 1: Create `src/renderTitle.tsx`**

This utility parses `~~text~~` in title strings. Two exports: one for React (returns JSX with `<del>`), one for plain-text contexts (strips `~~` markers).

```tsx
import type { ReactNode } from "react";

export function renderTitle(title: string): ReactNode {
  const parts = title.split(/~~(.*?)~~/);
  if (parts.length === 1) return title;
  return parts.map((part, i) =>
    i % 2 === 1 ? <del key={i}>{part}</del> : part,
  );
}

export function stripStrikethrough(title: string): string {
  return title.replace(/~~(.*?)~~/g, "$1");
}
```

- [ ] **Step 2: Update `src/pages/BookIndex.tsx:23`**

Replace:
```tsx
<h2>{book.title}</h2>
```
With:
```tsx
<h2>{renderTitle(book.title)}</h2>
```

Add import at top:
```tsx
import { renderTitle } from "../renderTitle";
```

- [ ] **Step 3: Update `src/components/BookCover.tsx:37`**

Replace:
```tsx
<span className="book-cover-title">{book.title}</span>
```
With:
```tsx
<span className="book-cover-title">{renderTitle(book.title)}</span>
```

Add import at top:
```tsx
import { renderTitle } from "../renderTitle";
```

- [ ] **Step 4: Update `src/pages/Bookshelf.tsx:73,75,118`**

Three locations to update. Replace:
```tsx
{chapter.title}
```
With:
```tsx
{renderTitle(chapter.title)}
```

Replace:
```tsx
<p className="featured-book-name">{book.title}</p>
```
With:
```tsx
<p className="featured-book-name">{renderTitle(book.title)}</p>
```

Replace:
```tsx
वाचणं सुरू ठेवा: {continueChapter.order}. {continueChapter.title} →
```
With:
```tsx
वाचणं सुरू ठेवा: {continueChapter.order}. {renderTitle(continueChapter.title)} →
```

Add import at top:
```tsx
import { renderTitle } from "../renderTitle";
```

- [ ] **Step 5: Update `scripts/generate-og-cards.ts:65`**

OG cards use satori (plain text, not React). Strip the `~~` markers so tildes don't appear on the card image.

Add at top of file:
```ts
function stripStrikethrough(s: string): string {
  return s.replace(/~~(.*?)~~/g, "$1");
}
```

Replace line 65:
```ts
children: c.title,
```
With:
```ts
children: stripStrikethrough(c.title),
```

- [ ] **Step 6: Update `scripts/generate-static-html.ts`**

Add at top of file (after existing imports/helpers):
```ts
function stripStrikethrough(s: string): string {
  return s.replace(/~~(.*?)~~/g, "$1");
}
```

Wrap all `c.title` and `m.title` references in `stripStrikethrough()`:

Line 69: `title: \`${stripStrikethrough(c.title)} — instamarathi books\``
Line 71: `"og:title": stripStrikethrough(c.title)`
Line 78: `"twitter:title": stripStrikethrough(c.title)`
Line 94: `title: \`${stripStrikethrough(m.title)} — instamarathi books\``
Line 95: `description: m.subtitle ?? stripStrikethrough(m.title)`
Line 96: `"og:title": stripStrikethrough(m.title)`
Line 97: `"og:description": m.subtitle ?? stripStrikethrough(m.title)`

- [ ] **Step 7: Verify build passes**

```bash
npx tsc --noEmit && npm run build
```

Expected: clean compile, build completes without errors.

- [ ] **Step 8: Commit**

```bash
git add src/renderTitle.tsx src/pages/BookIndex.tsx src/pages/Bookshelf.tsx src/components/BookCover.tsx scripts/generate-og-cards.ts scripts/generate-static-html.ts
git commit -m "feat: support ~~strikethrough~~ in book titles — render as <del> in UI, strip in OG/meta"
```

---

## Task 2: Create book directory and meta.json

**Files:**
- Create: `books/midlife-redesign/meta.json`

- [ ] **Step 1: Create directory and meta.json**

```bash
mkdir -p books/midlife-redesign
```

Write `books/midlife-redesign/meta.json`:

```json
{
  "slug": "midlife-redesign",
  "title": "मिडलाईफ ~~क्रायसिस~~ रीडिझाईन",
  "subtitle": "चाळिशीत थांबायला शिकणं — म्हणजे आयुष्य design करायला शिकणं",
  "category": "mindset",
  "kind": "essay",
  "chapter_order": [
    "01-dhavnya-thambva",
    "02-autopilot",
    "03-thambla-tar-kay",
    "04-ho-mhanaychi-savay",
    "05-nahi-mhanayala-shika",
    "06-june-vishwas",
    "07-anubhavachi-takad",
    "08-paisyacha-bhiti",
    "09-gardi-madhla-ekta",
    "10-naati-swataashi",
    "11-mulanna-kay-shikvaycha",
    "12-pudchya-vees-varsha"
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add books/midlife-redesign/meta.json
git commit -m "book: midlife-redesign — add meta.json for 12-chapter essay on critical thinking at 40"
```

---

## Task 3: Chapter 1 — धावणं थांबवा

**Files:**
- Create: `books/midlife-redesign/01-dhavnya-thambva.md`

**Frontmatter:**
```yaml
title: धावणं थांबवा
slug: 01-dhavnya-thambva
order: 1
summary: तुम्ही थकला नाहीत — तुम्ही थांबायला विसरलात
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (corporate setting):** A Pune IT professional, 40, alarm at 5:45 AM. Before the chai is even ready: school WhatsApp group (tomorrow is sports day — white shoes compulsory), team Slack (client escalation), bank SMS (EMI deducted, balance low), mother's call (doctor's appointment Thursday — "तू येशील ना?"). All before 6:15 AM. The running has begun. It doesn't stop until midnight.
- **Name the feeling:** This isn't "busy" — busy is what you were at 25. This is something else. At 40, the running has become invisible. You don't notice it because you've been doing it for 20 years. It's your default mode.
- **Introduce the thesis:** The problem isn't that you don't know enough. By 40, you have two decades of experience, thousands of decisions behind you. The problem is you never pause to actually use what you know. Every decision is reactive — fire, respond, next.
- **The autopilot trap:** Draw a brief picture of how the day unfolds — meeting to meeting, EMI to EMI, parent-teacher meeting to parent-teacher meeting. Where in this day does thinking happen? Not reacting — actual thinking?
- **The book's promise (positive):** This is not a book that tells you you're thinking wrong. You already know enough. You just need to learn one skill: थांबणं. Pausing. And the science says your brain at 40 is perfectly equipped for it — better than at 25.
- **Close with:** A small moment of pause — the protagonist puts the phone down for five minutes and notices the chai has gone cold. That's where this book begins.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter following the essay template and content direction above. 90–95% Marathi.

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build` to confirm no parse errors

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/01-dhavnya-thambva.md
git commit -m "book: midlife-redesign ch01 — धावणं थांबवा"
```

---

## Task 4: Chapter 2 — वीस वर्षांचा Autopilot

**Files:**
- Create: `books/midlife-redesign/02-autopilot.md`

**Frontmatter:**
```yaml
title: वीस वर्षांचा Autopilot
slug: 02-autopilot
order: 2
summary: तुमचं आयुष्य तुम्ही चालवत नाही — ते autopilot वर आहे
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (small-town):** A Kolhapur doctor, 42. Father was a doctor, grandfather was a doctor. MBBS, MD, own clinic, marriage to a doctor's daughter, flat in a good society, son in CBSE school. At 42 he realizes: he has never made a single original decision. Every milestone was pre-scripted. He followed the path perfectly — and has no idea whose life he's living.
- **What autopilot is:** Introduce Kahneman's System 1/System 2 in accessible Marathi. System 1 = autopilot — fast, effortless, pattern-matching. System 2 = deliberate thinking — slow, effortful, questioning. By 40, System 1 runs 95% of your life. That's efficient, but it means you stopped choosing 15 years ago.
- **How autopilot gets built:** Marriage decision (family approved, community approved — "चांगलं स्थळ आहे"). Career choice (engineering because marks allowed it, not because it called). Financial decisions ("सगळे flat घेतात, आपणही घेऊ"). Parenting style (copy-paste from your own parents, with minor edits).
- **The inherited scripts:** The most powerful autopilot programs aren't the ones you wrote — they're the ones your parents, teachers, and community installed. "Settled" means X. "Good life" means Y. "Responsible adult" means Z. At 40, these scripts are invisible. You confuse them with your own values.
- **The first step — noticing:** You can't redesign what you can't see. The chapter's practical core: how to notice your own autopilot. Not to judge it — just to see it. Ask: "Did I choose this, or did it happen to me?"
- **Close with:** The Kolhapur doctor doesn't abandon his practice. But for the first time, he asks himself: "हे माझं आयुष्य आहे — का माझ्या बाबांनी लिहिलेलं?"

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter following the essay template and content direction above

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/02-autopilot.md
git commit -m "book: midlife-redesign ch02 — वीस वर्षांचा Autopilot"
```

---

## Task 5: Chapter 3 — थांबला तर काय होतं?

**Files:**
- Create: `books/midlife-redesign/03-thambla-tar-kay.md`

**Frontmatter:**
```yaml
title: थांबला तर काय होतं?
slug: 03-thambla-tar-kay
order: 3
summary: थांबायला भीती वाटते — पण विज्ञान सांगतं की चाळिशीचा मेंदू थांबण्यासाठीच तयार आहे
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (corporate):** A Mumbai marketing manager takes a week of leave. First two days she panics — checks email, feels guilty, imagines things falling apart. By day four, something shifts. She has a thought she hasn't had in years: "मला actually काय हवंय?" And the thought terrifies her, because she doesn't have an answer.
- **The fear of pausing:** Name it directly. "If I stop, everything collapses." The kids won't get to school, the EMI won't get paid, the project will slip, the family will fall apart. This fear is real — and it's also a lie your autopilot tells you to keep running.
- **The science (positive framing):** This is the chapter where the research lands. Draw on:
  - Seattle Longitudinal Study: no reliable cognitive decline before 60. At 40, verbal ability and comprehension are at or near peak.
  - MIT study (Hartshorne & Germine): different abilities peak at different ages, some as late as 40-50.
  - Emotional regulation improves through midlife (Stanford Center on Longevity). You're less reactive, more reflective.
  - Labouvie-Vief's postformal thought: the ability to hold paradox, to think in contradictions, develops specifically through lived experience. A 25-year-old can't do this — their brain hasn't seen enough contradictions yet.
- **The reframe:** "Midlife crisis" is actually midlife awakening. The 2024 research (Tang et al.) explicitly uses this term. What feels like breakdown is reorganization — the brain is restructuring around accumulated experience, not deteriorating.
- **Your best thinking is ahead:** Crystallized intelligence peaks in the 50s. Emotional regulation continues improving. The midlife brain is built for exactly the kind of reflective, nuanced thinking that critical decisions require.
- **Close with:** The marketing manager goes back to work on Monday. Nothing collapsed. But she has one new practice: 15 minutes of chai in silence before the phone comes on. That's enough.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/03-thambla-tar-kay.md
git commit -m "book: midlife-redesign ch03 — थांबला तर काय होतं?"
```

---

## Task 6: Chapter 4 — "हो" म्हणायची सवय

**Files:**
- Create: `books/midlife-redesign/04-ho-mhanaychi-savay.md`

**Frontmatter:**
```yaml
title: '"हो" म्हणायची सवय'
slug: 04-ho-mhanaychi-savay
order: 4
summary: '"हो" म्हणणं सोपं वाटतं — पण प्रत्येक "हो" तुमचा एक तास दुसऱ्यासाठी गहाण ठेवतो'
read_time: 18
```

Note: summary starts with `"` so the entire value is wrapped in single quotes to prevent YAML parse failure.

**Content direction (2500–3000 words):**
- **Opening scene (small-town):** A Sangli schoolteacher, 41. Saturday morning. Brother-in-law calls: "दादा, लग्नासाठी hall बघायला चला ना." He had planned to take his daughter to a science exhibition. He says "हो, येतो." His daughter's face falls. This has happened before — hundreds of times.
- **The cultural machinery:** In Marathi families, "हो" isn't just agreement — it's identity. It proves you're a good son, a reliable brother, a responsible community member. "नाही" isn't just refusal — it's a rupture. "लोक काय म्हणतील" isn't vanity — it's survival in a dense social network where reputation is currency.
- **The cost of always yes:** Walk through a typical month: office stretch assignment (said yes), cousin's house painting help (said yes), society meeting secretary role (said yes), wife's relative's wedding trip (said yes). At the end of the month, zero hours spent on anything the protagonist actually wanted. His calendar is full. None of it is his.
- **Why 40 is the tipping point:** At 25, saying yes to everything felt generous — you had energy, fewer responsibilities, and the cost was low. At 40, every "yes" comes at the expense of something real: time with your child, your health, your sanity, your own thinking time.
- **The deeper pattern:** The "yes" habit isn't just cultural pressure — it's also avoidance. Saying yes means never having to figure out what you actually want. It's easier to fill your life with other people's priorities than to face the terrifying question: "माझ्या priorities काय आहेत?"
- **Close with:** The teacher doesn't call his brother-in-law back to cancel. Not yet. But he notices something he hadn't before: the "हो" came out before he'd even thought about it. Noticing is the first step.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/04-ho-mhanaychi-savay.md
git commit -m "book: midlife-redesign ch04 — \"हो\" म्हणायची सवय"
```

---

## Task 7: Chapter 5 — नाही म्हणायला शिका

**Files:**
- Create: `books/midlife-redesign/05-nahi-mhanayala-shika.md`

**Frontmatter:**
```yaml
title: नाही म्हणायला शिका
slug: 05-nahi-mhanayala-shika
order: 5
summary: नाही म्हणणं स्वार्थ नाही — ते स्पष्टता आहे
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (corporate):** A Pune IT architect, 39. His manager asks him to lead a weekend hackathon — "तू team मध्ये सगळ्यात experienced आहेस." His wife has been asking him to be home this weekend — their son's birthday. He says "हो" to the manager. On the drive home, he rehearses what he'll tell his wife. He's been rehearsing these speeches for 15 years.
- **The practical "no":** This chapter is the action companion to chapter 4. Specific scenarios with actual Marathi dialogue:
  - **The relative's financial request:** "भाऊ, थोडे पैसे लागतात — तीन महिन्यांत परत करतो." How to say: "आत्ता माझं बजेट tight आहे — मी इतकं मदत करू शकतो: [specific smaller amount/alternative help]."
  - **The boss's weekend assignment:** How to say: "मी हे weekday मध्ये करू शकतो — Monday पर्यंत देतो." Not a flat no — a redirect with a boundary.
  - **The society/community obligation:** "Secretary बना ना — तुम्ही responsible आहात." How to say: "या वर्षी नाही जमणार — पण [specific smaller contribution] करू शकतो."
  - **The WhatsApp group pressure:** The group collecting ₹5000 per family for Ganpati. You don't want to contribute that much. How to handle it without becoming "the difficult one."
- **The guilt cycle:** After saying no, you'll feel terrible for approximately 48 hours. Name this. It's withdrawal from a 20-year habit. The guilt doesn't mean you did something wrong — it means you did something new.
- **The distinction:** This is not about becoming selfish. It's about becoming deliberate. A deliberate "yes" is worth more than a reflexive one — to you and to the person you're helping.
- **Close with:** The IT architect says no to the next weekend assignment. His manager is surprised but adjusts. His son's birthday happens with both parents present. The guilt lasts two days. The memory lasts longer.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/05-nahi-mhanayala-shika.md
git commit -m "book: midlife-redesign ch05 — नाही म्हणायला शिका"
```

---

## Task 8: Chapter 6 — जुने विश्वास, नवे प्रश्न

**Files:**
- Create: `books/midlife-redesign/06-june-vishwas.md`

**Frontmatter:**
```yaml
title: जुने विश्वास, नवे प्रश्न
slug: 06-june-vishwas
order: 6
summary: तुमचे विश्वास तुमचे नाहीत — ते तुमच्या आई-बाबांचे आहेत, तुम्ही फक्त forward केलेत
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (small-town):** A Satara businessman, 43. His son wants to study design. The father's first reaction: "Design? पोट कसं भरणार?" He hears his own father's voice coming out of his mouth — the exact words, the exact tone. For a moment he sees it clearly: this isn't his opinion. It's inherited code.
- **The inherited beliefs inventory:** Walk through the big ones that Marathi families carry:
  - Money: "FD सगळ्यात safe आहे." "Shares म्हणजे जुगार." "घर हीच खरी गुंतवणूक."
  - Success: "Government job / stable MNC = settled." "Business म्हणजे risk."
  - Marriage: "Adjust करा — सगळ्यांचं असंच असतं." "लग्न म्हणजे compromise."
  - Education: "Engineering किंवा medicine — बाकी सगळं timepass."
  - Life path: "शिक, नोकरी लाव, लग्न कर, मुलं हो, घर घे — settled."
- **Why these beliefs persist:** They weren't stupid when they were formed. Your parents' generation had genuinely limited options. FD was safe when inflation was predictable. Government job was security when the private sector barely existed. These were rational responses to their world. The problem is you're living in a different world with inherited maps.
- **The Stanovich trap:** Draw on Keith Stanovich's myside bias research — the more intelligent you are, the better you are at defending beliefs you already hold. Your experience at 40 makes you a better lawyer for your existing beliefs, not a better judge. Intelligence is not the same as rationality.
- **Questioning ≠ rejecting:** This is the key distinction. You can honor your parents' wisdom while updating the beliefs that no longer serve you. Your father's "FD is safest" came from genuine care. Recognizing that it no longer applies doesn't mean he was wrong — it means the world changed.
- **Close with:** The Satara businessman doesn't say yes to design school yet. But he does something he's never done before: he asks his son, "तुला design मध्ये नक्की काय आवडतं? मला सांग — मला समजून घ्यायचंय." The conversation is awkward. It's also the first real conversation they've had in years.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/06-june-vishwas.md
git commit -m "book: midlife-redesign ch06 — जुने विश्वास, नवे प्रश्न"
```

---

## Task 9: Chapter 7 — अनुभवाची ताकद

**Files:**
- Create: `books/midlife-redesign/07-anubhavachi-takad.md`

**Frontmatter:**
```yaml
title: अनुभवाची ताकद
slug: 07-anubhavachi-takad
order: 7
summary: तुमच्याकडे वीस वर्षांचा data आहे — तुम्ही तो वापरत नाही, एवढंच
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (corporate):** A Pune product manager, 41. In a meeting, a 28-year-old colleague presents a plan. Something feels off. The PM can't articulate what — it's a gut feeling. He stays quiet because "data दाखव" is the culture, and gut feelings don't count. Three months later, the plan fails for exactly the reason his gut had flagged. His 15 years of pattern recognition were right. He just didn't trust them.
- **The positive chapter:** This is the "you're not broken, you're powerful" turn in the book. At 40, you have:
  - Thousands of decisions behind you — and the pattern recognition that comes from them
  - Hundreds of relationship negotiations — you know how people actually behave, not how textbooks say they do
  - Dozens of financial decisions — you know what "too good to be true" feels like in your bones
  - Twenty years of watching promises, plans, and predictions play out
- **Crystallized intelligence:** Explain in accessible terms — this is the kind of intelligence that comes from accumulated knowledge and experience. It peaks in your 50s and 60s. At 40, it's still rising. Your "gut feeling" isn't irrational — it's your brain's pattern-matching engine running on 20 years of data.
- **The dismissal trap:** Many 40-year-olds dismiss their own experience: "मी काय जाणतो — जमाना बदलला." "नवीन generation ला जास्त कळतं." This self-dismissal is partly cultural humility, partly genuine uncertainty about a changing world. But throwing out 20 years of data because the surface has changed is like throwing out a compass because the map is new.
- **How to access experience deliberately (from Galef's scout mindset):** The practice of pausing to ask: "मी असं काही आधी पाहिलंय का? तेव्हा काय झालं?" Instead of reacting on reflex OR dismissing your intuition, use it as a starting point for deliberate thinking.
- **Close with:** The PM speaks up in the next meeting. "माझा अनुभव असं सांगतो..." He's wrong sometimes. But he's right more often than he expected — and the team starts listening.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/07-anubhavachi-takad.md
git commit -m "book: midlife-redesign ch07 — अनुभवाची ताकद"
```

---

## Task 10: Chapter 8 — पैशाची भीती आणि स्वच्छ विचार

**Files:**
- Create: `books/midlife-redesign/08-paisyacha-bhiti.md`

**Frontmatter:**
```yaml
title: पैशाची भीती आणि स्वच्छ विचार
slug: 08-paisyacha-bhiti
order: 8
summary: पैशाची भीती तुमचे निर्णय चालवते — तुम्ही नाही
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (mixed setting):** Two 40-year-olds. A Nagpur government schoolteacher earning ₹45,000/month — EMI ₹18,000, school fees ₹8,000, parents' medical bills irregular but terrifying. A Pune IT lead earning ₹2,20,000/month — EMI ₹65,000, second flat EMI ₹42,000, international school ₹15,000, car loan ₹12,000. Both feel the same thing: "पैसे कमी पडतात." Both are terrified of the same thing: "काहीतरी चुकलं तर?"
- **How money fear hijacks thinking:** When you're financially anxious, your cognitive bandwidth narrows (draw on Sendhil Mullainathan and Eldar Shafir's scarcity research). You can only think about the immediate threat. Long-term planning, creative problem-solving, career pivots — all require bandwidth that financial anxiety consumes.
- **The permanence illusion:** At 40, financial decisions feel permanent. "मी नोकरी सोडली तर EMI कसं भरणार?" — the fear makes every choice feel irreversible. But most financial decisions at 40 are actually more recoverable than they feel. You have experience, skills, a network. A bad financial quarter is not a life sentence.
- **The golden handcuffs:** The specific trap of staying in a job you hate because the salary covers the lifestyle you built. The lifestyle was built on autopilot (chapter 2). The "no" you can't say (chapters 4-5) now has a price tag. Everything connects.
- **Separating real constraints from fear:** A practical framework — what is your actual monthly minimum? What is your fear-inflated number? The gap between these two is the space where clear thinking can happen.
- **Close with:** The IT lead runs the numbers — actually runs them, not in his head at 2 AM, but on paper, in daylight. His actual minimum is ₹1,10,000. He's been living at ₹2,20,000 because that's what autopilot built. The gap is the space where choices live.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/08-paisyacha-bhiti.md
git commit -m "book: midlife-redesign ch08 — पैशाची भीती आणि स्वच्छ विचार"
```

---

## Task 11: Chapter 9 — गर्दीमधला एकटा

**Files:**
- Create: `books/midlife-redesign/09-gardi-madhla-ekta.md`

**Frontmatter:**
```yaml
title: गर्दीमधला एकटा
slug: 09-gardi-madhla-ekta
order: 9
summary: तुम्ही वेगळा विचार करायला लागलात — आणि अचानक सगळे जवळचे लोक दूर वाटतात
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (small-town):** A Kolhapur CA, 40. Diwali family gathering. Uncle declares "मोदी सगळं ठीक करतील." Cousin says "Mutual funds म्हणजे risk." Aunt says "मुलाला IIT ला पाठवा — बाकी सगळं timepass." He used to agree with all of it — or at least nod along. This Diwali, something has changed. He has doubts. Not answers — doubts. And he's the only one in the room who does.
- **The loneliness of questioning:** When you start thinking for yourself at 40, you discover something uncomfortable: your social circle was built on shared assumptions, not shared thinking. Your WhatsApp groups, your college friends, your family — they bond over certainty. Political opinions, parenting advice, financial wisdom. Everyone has answers. You suddenly have only questions.
- **Identity-protective cognition (Dan Kahan):** The smartest people in your circle aren't the most rational — they're the most effective at defending their group's beliefs. Intelligence doesn't protect against bias; it amplifies it. When you step outside the group consensus, you're not just wrong — you're disloyal.
- **The WhatsApp echo chamber:** Specific to modern Marathi life — the family WhatsApp group, the school parents group, the society group, the college friends group. Each one has an orthodoxy. Forward the right memes, agree with the right opinions, and you belong. Question something, and the silence is deafening.
- **Doubt as courage:** Reframe: the person who questions at 40 isn't weak — they're brave. It takes no courage to agree with a room full of people who agree with each other. It takes enormous courage to say "मला खात्री नाही" when everyone else is certain.
- **Finding your own compass:** You don't need to leave your family, quit your friend group, or become a contrarian. You just need to know the difference between "I agree because I've thought about it" and "I agree because disagreeing is exhausting."
- **Close with:** The CA doesn't argue with his uncle at Diwali. But on the drive home, he thinks: "माझं मत काय आहे — खरंच?" And for the first time, the question doesn't feel like failure. It feels like beginning.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/09-gardi-madhla-ekta.md
git commit -m "book: midlife-redesign ch09 — गर्दीमधला एकटा"
```

---

## Task 12: Chapter 10 — नातं स्वतःशी

**Files:**
- Create: `books/midlife-redesign/10-naati-swataashi.md`

**Frontmatter:**
```yaml
title: नातं स्वतःशी
slug: 10-naati-swataashi
order: 10
summary: तुम्ही नवरा, बाबा, मुलगा, employee आहात — पण तुम्ही कोण आहात?
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (corporate):** A Pune HR manager, 42, woman. Husband asks: "रविवारी काय करायचं?" She says "तुम्ही ठरवा." He asks what she wants for dinner. "काहीही चालेल." He asks which movie. "तुम्हाला आवडेल ते." This has been her answer to every personal preference question for 15 years. She genuinely doesn't know what she wants — not because she's easygoing, but because somewhere between becoming a wife, mother, daughter-in-law, and team lead, she stopped asking.
- **Roles ate the person:** At 40, your identity is a stack of roles — spouse, parent, child, employee, neighbor, society member. Each role has expectations, scripts, obligations. The stack is so tall that the person underneath is invisible — even to yourself. You know what a good father should do. You know what a responsible employee should do. You have no idea what you actually want.
- **The preference extinction:** Walk through how it happens — slowly, over 15-20 years. You negotiate away your weekend preferences for family consensus. You drop your hobbies because "time nahi." You stop reading what interests you and start reading what's useful for work. You haven't listened to music you chose (not the kids' or spouse's) in years. Each small surrender was reasonable. The cumulative effect is erasure.
- **Why this matters for thinking:** If you don't know what you want, every decision is either reactive (respond to the loudest demand) or borrowed (do what everyone else does). Clear thinking requires a foundation: "I know what matters to me." Without it, all the pausing and questioning from earlier chapters has no anchor.
- **The practice:** Start small. Not "find your passion" — that's too big. Just: "मला कॉफी आवडते का चहा?" — and actually answer from preference, not convenience. "मला हा cinema आवडला — का?" Rebuild the muscle of having an opinion.
- **Close with:** The HR manager takes a Sunday afternoon alone. Goes to a bookshop — not for her son's textbooks, not for her husband's tech books. She doesn't know what she's looking for. She walks the aisles for 45 minutes and picks up a novel. It's the first book she's chosen for herself in twelve years.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/10-naati-swataashi.md
git commit -m "book: midlife-redesign ch10 — नातं स्वतःशी"
```

---

## Task 13: Chapter 11 — मुलांना काय शिकवायचं

**Files:**
- Create: `books/midlife-redesign/11-mulanna-kay-shikvaycha.md`

**Frontmatter:**
```yaml
title: मुलांना काय शिकवायचं
slug: 11-mulanna-kay-shikvaycha
order: 11
summary: तुम्ही चाळिशीत जे शिकत आहात — ते तुमच्या मुलांना वीस वर्षं आधी शिकवता आलं तर?
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene (small-town):** A Nagpur engineer, 43. His 15-year-old son comes home and says: "बाबा, मला science नको — मला commerce करायचंय." The father's first instinct: "Science सोडू नकोस — options बंद होतात." He catches himself. This is his father's voice. This is the autopilot. He pauses. And then he does something terrifying: he asks a genuine question instead of giving a rehearsed answer.
- **The irony:** You're at 40, learning to pause, to question, to think for yourself. Your children are at 15, already being installed with the same autopilot you're trying to uninstall. The inherited scripts are being forwarded to the next generation in real time — by you.
- **What you wish someone taught you:** Walk through the core skills from this book — pausing, questioning inherited beliefs, saying no, trusting experience, thinking independently — and the specific age-appropriate ways they could have been introduced. Not as philosophy lectures, but as habits: "तुला काय वाटतं?" as a real question (not a trap), allowing disagreement without punishment, modeling uncertainty.
- **The modeling problem:** Children don't learn from lectures — they learn from watching. If your child sees you always saying yes, never questioning, never admitting doubt, never having your own preferences — they learn that too. The most powerful thing you can teach is to let them see you pause, change your mind, say "मला माहीत नाही — शोधू."
- **The trap of overcompensation:** Some 40-year-olds, discovering their own autopilot, try to prevent it in their children by giving them unlimited freedom. "मला choices नव्हत्या, तुला सगळ्या choices आहेत." But freedom without structure isn't liberation — it's abandonment. The goal isn't no guidance, it's honest guidance.
- **Close with:** The Nagpur engineer doesn't say yes to commerce. He doesn't say no either. He says: "मला सांग — commerce मध्ये तुला काय attract करतंय? आणि science मध्ये तुला काय nako वाटतंय?" It's a longer conversation than usual. It's also the first time his son looks at him with something other than resignation.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/11-mulanna-kay-shikvaycha.md
git commit -m "book: midlife-redesign ch11 — मुलांना काय शिकवायचं"
```

---

## Task 14: Chapter 12 — पुढच्या वीस वर्षांचं Design

**Files:**
- Create: `books/midlife-redesign/12-pudchya-vees-varsha.md`

**Frontmatter:**
```yaml
title: पुढच्या वीस वर्षांचं Design
slug: 12-pudchya-vees-varsha
order: 12
summary: पहिली वीस वर्षं autopilot वर गेली — पुढची वीस तुमची आहेत
read_time: 18
```

**Content direction (2500–3000 words):**
- **Opening scene:** Pull back from individual stories. Address the reader directly. "तुम्ही इथपर्यंत आलात — या पुस्तकात, आणि आयुष्यात. चाळीस वर्षं. अर्धा रस्ता." Not with heaviness — with possibility.
- **The midpoint reframe:** 40 is not the beginning of decline. It's the midpoint. The first 20 adult years were spent building — career, family, house, responsibilities. Most of it was on autopilot, running inherited scripts. That's not failure — that's normal. Everyone does it. The question is: what do you do with the next 20?
- **The science of what's ahead (positive):** Bring back the research from chapter 3, now as a promise:
  - Crystallized intelligence peaks in the 50s-60s — your accumulated wisdom becomes your superpower
  - Emotional regulation continues improving — you get calmer, more measured, less reactive
  - Postformal thought deepens — you get better at holding complexity, paradox, uncertainty
  - Conscientiousness and openness both increase through midlife
  - This is not a sunset — it's a second sunrise
- **What redesign actually looks like:** Not a dramatic life upheaval. Not "quit your job and follow your passion." Redesign is quieter:
  - One pause a day — before reacting, before saying yes, before forwarding the inherited script
  - One "मला काय वाटतं?" a week — rebuild the muscle of personal opinion
  - One "नाही" a month — practice boundary-setting as a skill, not a crisis
  - One old belief questioned per quarter — not to reject, but to examine
- **The twelve chapters as one skill:** Connect the threads. Pausing (ch 1-3) gives you space. Saying no (ch 4-5) protects that space. Questioning beliefs (ch 6) and trusting experience (ch 7) fills the space with your own thinking. Managing money fear (ch 8) removes the panic. Handling loneliness (ch 9) gives you courage. Knowing yourself (ch 10) gives you direction. Teaching your children (ch 11) gives it meaning. And this chapter — designing forward — gives it momentum.
- **Close with:** No grand declaration. Just a quiet image — a 40-year-old, morning chai in hand, phone still in the other room. Five minutes of silence before the day begins. In that silence: a thought. Not a reaction, not a forwarded opinion, not an inherited script. An original thought. That's the redesign. It already started.

- [ ] **Step 1: Write chapter** — full 2500–3000 word Marathi chapter

- [ ] **Step 2: Verify frontmatter parses** — run `npm run build`

- [ ] **Step 3: Commit**
```bash
git add books/midlife-redesign/12-pudchya-vees-varsha.md
git commit -m "book: midlife-redesign ch12 — पुढच्या वीस वर्षांचं Design"
```

---

## Task 15: Full build verification and final commit

**Files:**
- None (verification only)

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run full build**

```bash
npm run build
```

Expected: build completes successfully, OG cards generated for all 12 chapters, static stubs generated, sitemap updated.

- [ ] **Step 4: Verify OG card generated**

```bash
ls dist/og/midlife-redesign/ | head -5
```

Expected: PNG files for each chapter slug.

- [ ] **Step 5: Verify static stubs generated**

```bash
ls dist/midlife-redesign/
```

Expected: `index.html` plus a folder per chapter slug.

- [ ] **Step 6: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "book: midlife-redesign — 12-chapter Marathi essay on critical thinking at 40"
```

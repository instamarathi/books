# घोडं कुठे अडलंय? Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Tasks 2–10 (the nine chapters) have no interdependencies — dispatch them in parallel rather than one at a time; this repo's established practice for multi-chapter books is one drafting agent per chapter, run concurrently.

**Goal:** Add the new `howto` book `घोडं कुठे अडलंय?` (slug `ghoda-kuthe-adlay`) — 9 chapters that push a 16–22 year-old Marathi reader to make decisions instead of analyzing them, per the approved design spec.

**Architecture:** Standard book directory (`books/ghoda-kuthe-adlay/`) with `meta.json` + 9 chapter markdown files, following the site's fixed `howto` template (opening scenario → principle → numbered techniques → pitfalls → Quick reference card). No renderer or code changes — this is a content-only addition. Validation is frontmatter correctness, chapter ordering, and a clean production build.

**Tech Stack:** Markdown + YAML frontmatter, JSON metadata, Vite build pipeline, existing book renderer (`src/books.ts`, `Chapter.tsx`)

## Global Constraints

- Marathi prose in Devanagari, English loanwords in Roman script — no transliterating English to Devanagari. Only swap in English for nouns/verbs/adjectives genuinely common in Marathi WhatsApp use; keep adverbs/conjunctions/prepositions in Marathi (see CLAUDE.md rule 2 for the full word list).
- Original prose only — research and source-book principles may inform a chapter, never reproduce or paraphrase source text.
- Each chapter 700–1000 words (howto length rule), phone-readable.
- The literal heading `## Quick reference` must appear exactly once per chapter, spelled exactly that way (renderer matches it case-insensitively but the text itself must not change).
- Exactly 3–5 numbered techniques under `## ही N techniques वापरा` and 2–3 pitfalls under `## हे टाळा` per chapter, per the howto template in CLAUDE.md.
- Every chapter's Quick reference card ends its **टाळा:** (or final) bullet list with one concrete one-week micro-commitment tied to that chapter's technique — this book's forcing-function beat, carried inside the existing card.
- Examples must be Marathi-household-context and specific (a named exam, a named EMI amount, a specific family conversation) — no unchanged Western scenarios.
- If a chapter's `summary:` value starts with a `"`, wrap the whole value in single quotes (gray-matter YAML parsing rule).
- No credit line inside chapter files — credit lives only in `meta.json`.

---

### Task 1: Add book metadata

**Files:**
- Create: `books/ghoda-kuthe-adlay/meta.json`

- [ ] **Step 1: Write the metadata**

```json
{
  "slug": "ghoda-kuthe-adlay",
  "title": "घोडं कुठे अडलंय?",
  "subtitle": "Analysis paralysis सोडून निर्णय घेण्याची सवय लावणारा practical guide — शाळा संपल्यापासून करिअरच्या सुरुवातीपर्यंत (16-22)",
  "category": "mindset",
  "kind": "howto",
  "credit": "ही प्रकरणं Thinking in Bets (Annie Duke) आणि The Paradox of Choice (Barry Schwartz) या पुस्तकांमधल्या विचारांवर, तसंच निर्णय-शास्त्रातील संशोधनावर (Bezos यांची reversible-decisions चौकट, Suzy Welch यांचा 10-10-10 नियम, Gollwitzer यांचं implementation-intentions संशोधन, Gilovich व Medvec यांचं regret-संशोधन, Bandura यांचं self-efficacy संशोधन) आधारित आहेत — मराठी context साठी पुन्हा लिहिलेली.",
  "chapter_order": [
    "01-vichar-mhanje-pragati-nahi",
    "02-stream-college-nivadtana",
    "03-don-offers-madhe-adkalyavar",
    "04-nokri-ki-shikshan",
    "05-gharchyanna-nahi-mhantana",
    "06-nata-tikvaycha-ki-sodaycha",
    "07-motha-paishacha-nirnay",
    "08-navya-shaharat-ekta-jane",
    "09-chuk-nirnay-tharla-tar"
  ]
}
```

- [ ] **Step 2: Validate the JSON**

Run: `jq . books/ghoda-kuthe-adlay/meta.json`
Expected: valid JSON, 9 entries in `chapter_order`, `kind: "howto"`, `category: "mindset"`.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/meta.json
git commit -m "book: ghoda-kuthe-adlay — add meta.json"
```

---

### Task 2: Chapter 1 — विचार करणं म्हणजे प्रगती नाही

**Files:**
- Create: `books/ghoda-kuthe-adlay/01-vichar-mhanje-pragati-nahi.md`

**Interfaces:**
- Produces: chapter file matching `chapter_order[0]` in Task 1's `meta.json`.

- [ ] **Step 1: Write the chapter**

Frontmatter (use exactly):

```markdown
---
title: विचार करणं म्हणजे प्रगती नाही
slug: 01-vichar-mhanje-pragati-nahi
order: 1
summary: जास्त विचार केला की निर्णय चांगला होतो असं वाटतं, पण खरं तर ते फक्त उशीर असतो.
read_time: 6
---
```

Content brief for the drafting agent (expand into full original prose per CLAUDE.md's `howto` template and the site's authoring rules — this is a directive, not text to copy):

- Opening scenario: a specific 16–22 year-old stuck re-comparing the same two options for the Nth time (name the actual decision — e.g., which coaching class, which elective) — physical detail of the stalling (phone notes full of pros/cons, a WhatsApp group asked five times).
- Bolded principle: overthinking feels like progress but produces no evidence you can act on; only doing does. Confidence is downstream of having decided, not upstream of it.
- Why it matters: one paragraph connecting to the book's spine — analysis is a way to avoid the vulnerability of being wrong while still feeling productive.
- 3–5 numbered techniques, drawing on: the 70% rule (decide on 70% of the information you wish you had, not 90% — attributed conceptually to Bezos-style reversible-decision thinking, not quoted), time-boxing a decision (set a deadline and a channel — e.g., "उद्या संध्याकाळपर्यंत ठरवायचं"), and treating "not deciding" as a decision with its own cost (name the cost concretely — a missed form deadline, a friend group that moved on).
- 2–3 पिटफॉल्स (हे टाळा): e.g., mistaking "asking one more person" for progress; confusing gathering information with making a decision; treating every choice as equally high-stakes.
- Quick reference: बोला / टाळा phrasing per the template, ending with the week's micro-commitment — e.g., "या आठवड्यात एक असा निर्णय घे जो तू गेला महिनाभर लांबवत होतास — deadline आजच ठरव."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/01-vichar-mhanje-pragati-nahi.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: prints `{ title, slug: '01-vichar-mhanje-pragati-nahi', order: 1, summary, read_time: 6 }` with no parse error, word count roughly 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/01-vichar-mhanje-pragati-nahi.md
git commit -m "book: ghoda-kuthe-adlay — ch.1 विचार करणं म्हणजे प्रगती नाही"
```

---

### Task 3: Chapter 2 — स्ट्रीम/कॉलेज निवडताना

**Files:**
- Create: `books/ghoda-kuthe-adlay/02-stream-college-nivadtana.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: स्ट्रीम/कॉलेज निवडताना
slug: 02-stream-college-nivadtana
order: 2
summary: streamची निवड आयुष्यभराचा निर्णय वाटतो, पण बहुतेक वेळा तो मागे फिरवता येण्यासारखा असतो.
read_time: 6
---
```

Content brief:

- Opening scenario: a 10th/12th-pass student frozen over science-vs-commerce or which college form to fill, family pressure in the background (an uncle's opinion, a topper cousin's path being held up as the template).
- Principle: almost none of these choices are the life sentence they feel like — most are two-way doors, not one-way.
- Techniques (3–5): the reversibility test ("चुकलं, तर मागे येता येतं का?" — walk through what "coming back" actually looks like for a stream/college switch, e.g., bridge courses, lateral entry, drop year); naming the real (not imagined) cost of switching later; separating "what my family will say" from "what can actually be undone."
- Pitfalls: treating a reversible choice as irreversible because of social embarrassment, not practical cost; letting one relative's single data point stand in for the whole decision.
- Quick reference ending with the week's micro-commitment: e.g., "या आठवड्यात लिहून काढ — हा निर्णय खरंच किती परत फिरवता येण्यासारखा आहे, आणि मग निर्णय घे."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/02-stream-college-nivadtana.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter matching above, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/02-stream-college-nivadtana.md
git commit -m "book: ghoda-kuthe-adlay — ch.2 स्ट्रीम/कॉलेज निवडताना"
```

---

### Task 4: Chapter 3 — दोन ऑफर्समध्ये अडकल्यावर

**Files:**
- Create: `books/ghoda-kuthe-adlay/03-don-offers-madhe-adkalyavar.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: दोन ऑफर्समध्ये अडकल्यावर
slug: 03-don-offers-madhe-adkalyavar
order: 3
summary: परफेक्ट ऑफर शोधण्यात वेळ घालवण्यापेक्षा, पुरेशी चांगली ऑफर स्वीकारून पुढे जा.
read_time: 6
---
```

Content brief:

- Opening scenario: two job/internship offers (or two colleges) being compared feature by feature in a notes app for weeks, both offers' deadlines approaching.
- Principle: comparing endlessly against every possible option produces worse decisions and less satisfaction than picking the first option that clears a real bar (satisficing beats maximizing).
- Techniques: set the "पुरेसं चांगलं" bar *before* comparing (name 3 non-negotiables, not 15 nice-to-haves); a hard stop on research (e.g., "तीन दिवसांनी जी माहिती आहे, त्यावरच ठरवायचं"); noticing when a new comparison criterion is invented specifically to keep the decision open.
- Pitfalls: adding new criteria only after both options already clear the old ones (moving the goalposts); asking more people instead of applying your own bar.
- Quick reference micro-commitment: e.g., "आजच तुझे ३ non-negotiable मुद्दे लिही, आणि जो पर्याय ते तीनही clear करतो, तो घे — बाकी सगळं गौण आहे."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/03-don-offers-madhe-adkalyavar.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/03-don-offers-madhe-adkalyavar.md
git commit -m "book: ghoda-kuthe-adlay — ch.3 दोन ऑफर्समध्ये अडकल्यावर"
```

---

### Task 5: Chapter 4 — नोकरी की पुढचं शिक्षण

**Files:**
- Create: `books/ghoda-kuthe-adlay/04-nokri-ki-shikshan.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: नोकरी की पुढचं शिक्षण
slug: 04-nokri-ki-shikshan
order: 4
summary: हा निर्णय 10 मिनिटांनी, 10 महिन्यांनी आणि 10 वर्षांनी कसा वाटेल, ते आधी बघ.
read_time: 6
---
```

Content brief:

- Opening scenario: a graduating student torn between a starting salary offer and an MS/MBA/further-study path, financial pressure from home visible in the scene (a specific fee number, a parent's EMI already running).
- Principle: the 10-10-10 rule — a decision's emotional weight at this exact moment (10 minutes) is a bad guide; ask how it will feel in 10 months and 10 years instead.
- Techniques: writing out the honest 10-minute, 10-month, 10-year answer for each path; noticing when the 10-minute answer (fear of disappointing parents, fear of missing out) is doing all the work; using the 10-year answer as the tiebreaker, not the 10-minute one.
- Pitfalls: letting the loudest short-term fear (what will people say this week) stand in for the 10-year view; treating this as a one-shot decision when it usually isn't (see ch.2's reversibility idea, referenced lightly, not repeated).
- Quick reference micro-commitment: e.g., "आजच तिन्ही उत्तरं (10 मिनिटं / 10 महिने / 10 वर्षं) लिहून काढ, आणि 10-वर्षांच्या उत्तराला निर्णायक मत दे."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/04-nokri-ki-shikshan.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/04-nokri-ki-shikshan.md
git commit -m "book: ghoda-kuthe-adlay — ch.4 नोकरी की पुढचं शिक्षण"
```

---

### Task 6: Chapter 5 — घरच्यांना नाही म्हणताना

**Files:**
- Create: `books/ghoda-kuthe-adlay/05-gharchyanna-nahi-mhantana.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: घरच्यांना नाही म्हणताना
slug: 05-gharchyanna-nahi-mhantana
order: 5
summary: निर्णय अवघड नसतो, तो बोलून दाखवणं अवघड असतं — म्हणून आधीच स्क्रिप्ट तयार ठेव.
read_time: 6
---
```

Content brief:

- Opening scenario: a specific family conversation the reader keeps avoiding (declining an arranged introduction meeting, saying no to a relative's business/job suggestion, pushing back on a marriage-timeline expectation) — show the avoidance itself (changing the subject, "नंतर बोलू").
- Principle: the freeze here is usually about the conversation, not the underlying choice — the decision was already made internally; what's missing is a rehearsed way to say it.
- Techniques: implementation intentions — scripting the exact if-then response in advance ("जर बाबा असं म्हणाले, तर मी असं म्हणेन"); picking the specific moment and setting for the conversation instead of waiting for it to arise naturally; a fallback line for when the conversation goes off-script.
- Pitfalls: over-preparing the script to the point of further delay (this chapter's own version of ch.1's trap — note it lightly); ambushing the conversation in anger instead of at the planned moment.
- Quick reference micro-commitment: e.g., "आज रात्री तुझं if-then वाक्य लिहून काढ, आणि या आठवड्यात तो संवाद कर."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/05-gharchyanna-nahi-mhantana.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/05-gharchyanna-nahi-mhantana.md
git commit -m "book: ghoda-kuthe-adlay — ch.5 घरच्यांना नाही म्हणताना"
```

---

### Task 7: Chapter 6 — नातं टिकवायचं की सोडायचं

**Files:**
- Create: `books/ghoda-kuthe-adlay/06-nata-tikvaycha-ki-sodaycha.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: नातं टिकवायचं की सोडायचं
slug: 06-nata-tikvaycha-ki-sodaycha
order: 6
summary: आजचा आरामदायक पर्याय नाही, तर चाळीशीत कशाचा पस्तावा होईल, तो विचार कर.
read_time: 6
---
```

Content brief:

- Opening scenario: a specific relationship at a fork (staying in a comfortable-but-stalled relationship out of fear of being alone/judged vs. a decision to commit further) — one concrete recent moment that crystallizes the doubt.
- Principle: regret-minimization — which choice will you regret more at 40, not which feels safer today. Short-term, wrong action stings; long-term, the thing never tried is what people regret.
- Techniques: writing the "at 40, looking back" version of each path in the reader's own words; separating fear of the breakup conversation from fear of the actual outcome; a time-boxed trial commitment when genuinely unsure (a real, dated check-in, not indefinite limbo).
- Pitfalls: staying in "let's see how it goes" indefinitely as a way of avoiding the decision entirely; making the call in the heat of one fight rather than from the regret-minimization view.
- Quick reference micro-commitment: e.g., "आजच लिहून काढ — 'हे नातं असंच राहिलं तर, चाळीशीत मी काय म्हणेन?' — आणि त्या उत्तराप्रमाणे एक पाऊल टाक."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/06-nata-tikvaycha-ki-sodaycha.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/06-nata-tikvaycha-ki-sodaycha.md
git commit -m "book: ghoda-kuthe-adlay — ch.6 नातं टिकवायचं की सोडायचं"
```

---

### Task 8: Chapter 7 — मोठा पैशाचा निर्णय

**Files:**
- Create: `books/ghoda-kuthe-adlay/07-motha-paishacha-nirnay.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: मोठा पैशाचा निर्णय
slug: 07-motha-paishacha-nirnay
order: 7
summary: अस्पष्ट भीतीपेक्षा, सगळ्यात वाईट काय होऊ शकतं ते स्पष्ट लिहून काढ — भीती आपोआप लहान होते.
read_time: 6
---
```

Content brief:

- Opening scenario: a specific money decision under deadline (an education loan for a course, an EMI on a bike/laptop needed for a new job, a course fee that eats into savings) with the vague, free-floating anxiety it produces (checking the bank balance repeatedly, not opening the loan app).
- Principle: premortem — naming the concrete worst case in advance kills the vague anxiety that keeps a decision stuck; unnamed fear is worse than the actual named risk.
- Techniques: writing the specific worst-case scenario in full detail (what exactly happens if the EMI can't be paid one month — who do you call, what's the actual consequence); pricing the worst case in real numbers, not feelings; deciding the fallback plan before signing, not after.
- Pitfalls: treating "I'll figure it out if it goes wrong" as a plan (it isn't one until it's written down); letting the worst-case exercise turn into another form of endless research.
- Quick reference micro-commitment: e.g., "आज संध्याकाळी हा निर्णयाचा worst-case पूर्ण detail मध्ये लिहून काढ, आणि मग निर्णय घे — पुढचं संशोधन नाही."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/07-motha-paishacha-nirnay.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/07-motha-paishacha-nirnay.md
git commit -m "book: ghoda-kuthe-adlay — ch.7 मोठा पैशाचा निर्णय"
```

---

### Task 9: Chapter 8 — नव्या शहरात एकटं जाणं

**Files:**
- Create: `books/ghoda-kuthe-adlay/08-navya-shaharat-ekta-jane.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: नव्या शहरात एकटं जाणं
slug: 08-navya-shaharat-ekta-jane
order: 8
summary: खात्री आधी येत नाही, ती फक्त केल्यानंतर येते — म्हणून लहान पाऊल आधी टाक.
read_time: 6
---
```

Content brief:

- Opening scenario: a job/course offer in another city, the reader waiting to "feel ready" or "feel sure" before accepting, family worry adding to the freeze (specific worry: safety, cooking for oneself, being far from home during a festival).
- Principle: certainty never arrives before you start; competence (mastery experience) comes only after, from having done small pieces of the thing.
- Techniques: a small-pilot decision (a short solo trip, staying with a known contact for the first week, a trial visit) instead of waiting for full certainty; naming what specifically would need to be true to feel "ready" and noticing most of it can only be learned by being there; building one small proof-of-competence before the big move (e.g., managing one weekend alone first).
- Pitfalls: waiting for the fear to disappear entirely before moving (it won't, until after); treating the pilot step itself as another excuse to delay the real decision.
- Quick reference micro-commitment: e.g., "या आठवड्यात एक लहान pilot पाऊल टाक — एक दिवस/एक वीकांड स्वतःहून manage कर, आणि तो अनुभव घेऊनच पुढचा निर्णय घे."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/08-navya-shaharat-ekta-jane.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/08-navya-shaharat-ekta-jane.md
git commit -m "book: ghoda-kuthe-adlay — ch.8 नव्या शहरात एकटं जाणं"
```

---

### Task 10: Chapter 9 — चुकीचा निर्णय ठरला तर?

**Files:**
- Create: `books/ghoda-kuthe-adlay/09-chuk-nirnay-tharla-tar.md`

- [ ] **Step 1: Write the chapter**

Frontmatter:

```markdown
---
title: चुकीचा निर्णय ठरला तर?
slug: 09-chuk-nirnay-tharla-tar
order: 9
summary: चुकीचा निर्णय आणि वाईट परिणाम, या दोन वेगळ्या गोष्टी आहेत — दोन्ही सराव असतात.
read_time: 6
---
```

Content brief:

- Opening scenario: a decision from earlier in the book (or a clearly analogous one — a stream switch, a job that didn't work out, a relationship that ended) that turned out badly, the reader's instinct to conclude "I'm bad at deciding."
- Principle: a bad decision and a bad outcome are not the same thing (the "resulting" trap) — judging yourself only by how things turned out teaches the wrong lesson and fuels more anxious over-analysis next time. Judge the process, then move to the next decision.
- Techniques: separating, after the fact, what was knowable at the time from what wasn't (was the process reasonable given what you knew then?); starting a simple decision-journal habit — one line per real decision: what you chose, why, and later what happened; treating every entry, right or wrong, as a training rep rather than a verdict on your character.
- Pitfalls: using one bad outcome as proof you should go back to over-analyzing (this undoes the whole book — name it explicitly); journaling only the decisions that worked out, which defeats the habit's purpose.
- Closing beat: this chapter should explicitly tie back to chapter 1's core reframe — the book's whole arc is that decision-making is a practiced skill built through reps, not a puzzle solved by enough thinking.
- Quick reference micro-commitment: e.g., "आज एक ओळ लिही — यातला एक जुना निर्णय, तो का घेतला, आणि पुढे काय झालं. ही सवय पुढच्या प्रत्येक निर्णयासाठी चालू ठेव."

- [ ] **Step 2: Validate frontmatter and length**

Run: `npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('books/ghoda-kuthe-adlay/09-chuk-nirnay-tharla-tar.md','utf8')); console.log(d.data); console.log('words:', d.content.split(/\s+/).length)"`
Expected: valid frontmatter, word count 700–1000.

- [ ] **Step 3: Commit**

```bash
git add books/ghoda-kuthe-adlay/09-chuk-nirnay-tharla-tar.md
git commit -m "book: ghoda-kuthe-adlay — ch.9 चुकीचा निर्णय ठरला तर?"
```

---

### Task 11: Quality pass and full build validation

**Files:**
- Modify: all 9 chapter files under `books/ghoda-kuthe-adlay/` (in place, no filename/frontmatter changes)
- Review: `books/ghoda-kuthe-adlay/meta.json`

**Interfaces:**
- Consumes: all files produced by Tasks 1–10.

- [ ] **Step 1: Run one quality-improvement agent per chapter, in place**

For each of the 9 chapters, dispatch an agent to review and tighten (in place, same file, same frontmatter) for: (a) authenticity of the Marathi-English code-mixing per CLAUDE.md rule 2 (no English function-words standing in for Marathi adverbs/conjunctions); (b) the opening scenario is concrete and specific, not generic; (c) the bait-worthy-premise test from CLAUDE.md rule 4 is met; (d) the Quick reference's micro-commitment is genuinely concrete and actionable, not vague; (e) word count is within 700–1000. This mirrors the second-pass quality dispatch used for prior multi-chapter books in this repo.

- [ ] **Step 2: Re-run frontmatter validation on all 9 chapters after the quality pass**

Run:
```bash
for f in books/ghoda-kuthe-adlay/*.md; do
  npx tsx -e "const fs=require('fs'); const matter=require('gray-matter'); const d=matter(fs.readFileSync('$f','utf8')); if(!d.data.title||!d.data.slug||typeof d.data.order!=='number'||!d.data.read_time) throw new Error('bad frontmatter: $f'); console.log('$f OK', d.content.split(/\s+/).length, 'words')"
done
```
Expected: all 9 files print `OK` with word counts in the 700–1000 range, no thrown errors.

- [ ] **Step 3: Run the full project verification suite**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: all three pass with no errors. If `npm run build` fails on YAML parsing, check for `summary:` values starting with `"` that need single-quote wrapping, or titles containing `:` that need quoting.

- [ ] **Step 4: Commit the quality pass**

```bash
git add books/ghoda-kuthe-adlay/
git commit -m "book: ghoda-kuthe-adlay — quality pass on all 9 chapters"
```

- [ ] **Step 5: Push**

```bash
git push
```

Confirm with the user before this step, per the repo's standing rule on actions visible to others.

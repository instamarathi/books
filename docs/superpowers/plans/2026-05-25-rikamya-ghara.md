# रिकामी घरं, भरलेले कर्ज — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a 9-chapter Marathi book exploring India's potential housing crisis via TFR decline, with global case studies (Japan, China, Spain, US 2008) and balanced bull/bear analysis.

**Architecture:** Content-only addition — 1 directory, 1 meta.json, 9 markdown chapter files. No code changes needed. Each chapter is 1800–2200 words of primarily Marathi prose with minimal English (≤5 English words per 100 Marathi words). Chapters 2–9 are independent and can be written in parallel.

**Tech Stack:** Markdown with YAML frontmatter. Validated by existing `npm test`, `npx tsc --noEmit`, and `npm run build` pipeline.

**Spec:** `docs/superpowers/specs/2026-05-25-rikamya-ghara-design.md`

---

## Key constraints for all chapters

### Language rules
- Primary language: Marathi in Devanagari
- English words in Roman script only (never transliterated to Devanagari — no `टॅन्ट्रम`, write `tantrum`)
- Maximum ~5 English words per 100 Marathi words
- English only when no commonly-used Marathi word exists: EMI, builder, RERA, TFR, GDP, subprime, default, bubble, CDO, credit rating, NPA
- Use Marathi for: गुंतवणूक (investment), कर्ज (debt), मागणी (demand), पुरवठा (supply), भाडं (rent), व्याजदर (interest rate), महागाई (inflation), लोकसंख्या (population), जन्मदर (birth rate), बांधकाम (construction), भांडवल (capital), बाजारभाव (market price), तारण (mortgage/collateral), नफा (profit), तोटा (loss)
- Address reader as "तुम्ही" (formal), not "तू"

### Chapter structure template
Every chapter must follow this exact structure:

```markdown
---
title: <Marathi chapter title>
slug: <NN-topic>
order: <1-9>
summary: <one-line Marathi description — if it starts with " wrap whole value in single quotes>
read_time: 15
---

<Opening paragraph — sets up the chapter's question or story, grounded in Indian daily life>

**<Bolded principle/thesis statement, 1–2 lines>**

<Explanation paragraph — why this matters>

<Core content — 3-5 sections of narrative, data, analysis>

## भारताचा आरसा
(ONLY in chapters 2–5: how this global pattern maps or doesn't map to India. Be honest about differences.)

## थोडक्यात

- <takeaway 1>
- <takeaway 2>
- <takeaway 3>
(3–5 bullet points)

## Quick reference

**लक्षात ठेवा:**
- <key insight 1>
- <key insight 2>
- <key insight 3>

**सावध राहा:**
- <warning 1>
- <warning 2>
- <warning 3>
```

### Voice reference
Match the voice of `books/how-to-talk/01-feelings.md` — practical, direct, conversational. Like a financially-literate friend explaining what they've researched. Not literary, not academic, not preachy.

### Category
Use `"society"` (not "economics" — that's not a valid CategoryKey in `src/books.ts`).

---

## Task 1: Create book directory and meta.json

**Files:**
- Create: `books/rikamya-ghara/meta.json`

- [ ] **Step 1: Create directory and meta.json**

```bash
mkdir -p books/rikamya-ghara
```

Write `books/rikamya-ghara/meta.json`:

```json
{
  "slug": "rikamya-ghara",
  "title": "रिकामी घरं, भरलेले कर्ज",
  "subtitle": "भारतातल्या गृहनिर्माण संकटाची शक्यता — जागतिक धडे आणि भारतीय वास्तव",
  "category": "society",
  "credit": "ही प्रकरणं Paul Krugman यांच्या demand-side economics विचारसरणीवर आधारित आहेत, भारतीय संदर्भासाठी मूळ विश्लेषण.",
  "chapter_order": [
    "01-ghar-ghya",
    "02-japan",
    "03-china",
    "04-spain",
    "05-america-2008",
    "06-bharatachi-sankhya",
    "07-faayda-ani-tota",
    "08-donhi-baaju",
    "09-tumcha-nirnay"
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add books/rikamya-ghara/meta.json
git commit -m "book: rikamya-ghara — add meta.json for housing crisis book"
```

---

## Task 2: Chapter 1 — सगळे सांगतात — घर घ्या

**Files:**
- Create: `books/rikamya-ghara/01-ghar-ghya.md`

**Frontmatter:**
```yaml
title: सगळे सांगतात — घर घ्या
slug: 01-ghar-ghya
order: 1
summary: सगळे म्हणतात घर घ्या, पण आकडे काय सांगतात?
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: A 28-year-old IT professional in a tier-2 city (Nagpur/Indore). Family pressure to buy. Builder ads. Bank pre-approved loan SMS. "भाडं देणं म्हणजे पैसे वाया" — everyone says this.
- The counter-data: 5 lakh+ unsold flats nationally. Builders defaulting. TFR below replacement level (~1.7). Introduce what TFR means in plain Marathi — जन्मदर.
- Introduce Krugman's demand-side lens simply: "जेव्हा घरं बांधण्याचा वेग, लोकसंख्या वाढण्याच्या वेगापेक्षा जास्त होतो, तेव्हा काय होतं?" What happens when supply grows faster than the people who need homes?
- Set up the book's question: has this happened before elsewhere? What can we learn?
- NO "भारताचा आरसा" section (this IS about India)
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter** — full 1800–2200 word Marathi chapter following the structure template and content direction above

- [ ] **Step 2: Verify frontmatter parses** — run `npm test` to confirm no parse errors

- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/01-ghar-ghya.md
git commit -m "book: rikamya-ghara ch01 — सगळे सांगतात — घर घ्या"
```

---

## Task 3: Chapter 2 — जपानचं वचन

**Files:**
- Create: `books/rikamya-ghara/02-japan.md`

**Frontmatter:**
```yaml
title: जपानचं वचन — जमीन कधीच स्वस्त होणार नाही
slug: 02-japan
order: 2
summary: जपानमध्ये जमिनीचे भाव कधीच कमी होणार नाहीत असं सगळ्यांना वाटत होतं — मग काय झालं?
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: 1980s Tokyo — a salaryman buys a tiny apartment, confident land prices only go up. The cultural belief: 土地神話 (land myth).
- Data: Tokyo land valued more than all of California. Nikkei at 39,000. Banks lending 100% against land.
- The crash: 1991 bubble burst. But the REAL story is what came after — demographics. TFR fell below replacement in 1975. By the 2000s, population started declining. Demand never came back.
- Akiya (vacant homes): 9 million+ today. Rural homes selling for near-zero. Government programs paying people to take abandoned houses.
- **भारताचा आरसा section:** "भारतात लोक म्हणतात — 140 कोटी लोकसंख्या, जागा कमी, भाव वाढणारच." Same structural belief as Japan's 土地神話. India's TFR (~1.7) is now where Japan's was in the mid-1970s. The 25-year lag means the demand shortfall shows up around 2045-2050 — but in southern states (TFR 1.4-1.5) it's already visible.
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/02-japan.md
git commit -m "book: rikamya-ghara ch02 — जपानचं वचन"
```

---

## Task 4: Chapter 3 — चीनची रिकामी शहरं

**Files:**
- Create: `books/rikamya-ghara/03-china.md`

**Frontmatter:**
```yaml
title: चीनची रिकामी शहरं
slug: 03-china
order: 3
summary: जगातल्या सर्वात मोठ्या बांधकाम व्यवसायाचं पतन — चीनमध्ये काय चुकलं?
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: Ordos, Inner Mongolia — a city built for 1 million, occupied by 100,000. Drone footage of empty towers. The ghost city phenomenon.
- How it happened: Real estate = 30% of China's GDP. Local governments funded entirely by land sales. Evergrande grew to $300B in debt. "तुमचं घर = तुमची संपत्ती" — property was 70% of household wealth.
- The collapse: Evergrande default (2021). Country Garden followed. Millions of pre-sold apartments never delivered. Middle-class families who paid full price for unbuilt homes.
- Demographics: TFR crashed to ~1.0 (among the lowest in the world). Population started declining 2022. One-child policy's delayed effect.
- **भारताचा आरसा section:** Builder lobby power, bank-builder nexus, "real estate never falls" sentiment mirrors China. BUT be honest: India's RBI regulation is genuinely stronger than China's shadow banking system. RERA (2016) adds transparency China lacked. India doesn't have local governments funded by land sales. The parallels are real but not exact — and being honest about differences makes the argument stronger.
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/03-china.md
git commit -m "book: rikamya-ghara ch03 — चीनची रिकामी शहरं"
```

---

## Task 5: Chapter 4 — स्पेनचा बांधकाम उन्माद

**Files:**
- Create: `books/rikamya-ghara/04-spain.md`

**Frontmatter:**
```yaml
title: स्पेनचा बांधकाम उन्माद
slug: 04-spain
order: 4
summary: स्पेनने जर्मनी, फ्रान्स आणि ब्रिटन या तिन्हींपेक्षा जास्त घरं बांधली — आणि मग ती रिकामी राहिली.
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: A coastal Spanish town — rows of identical apartment blocks on the Mediterranean, not a soul in sight. Built for Northern European retirees who never came.
- The boom: Spain built more houses than Germany, France, and UK combined during 2000-2008. Cajas (local savings banks) lent recklessly — 110% mortgages, no income verification.
- The belief: "Spain is different" (España es diferente) — tourism, EU membership, sun-seeking retirees would drive eternal demand.
- The crash: 2008 hit — prices dropped 40%+. Unemployment hit 27% (youth unemployment 55%). Bad bank SAREB created to absorb toxic assets. Entire developments demolished because maintaining them cost more than they were worth.
- **भारताचा आरसा section:** The critical difference — Spain partially recovered through immigration. Latin American and North African workers filled demand gaps. India does NOT have this valve. India doesn't attract foreign labor to settle — no work visa pipeline, no cultural draw for immigration. This makes India structurally more vulnerable than Spain if housing demand drops. Tier-2 cities (Indore, Lucknow, Jaipur) are building like Spain's coast — but who will fill those apartments if local population growth slows?
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/04-spain.md
git commit -m "book: rikamya-ghara ch04 — स्पेनचा बांधकाम उन्माद"
```

---

## Task 6: Chapter 5 — अमेरिकेचा 2008

**Files:**
- Create: `books/rikamya-ghara/05-america-2008.md`

**Frontmatter:**
```yaml
title: अमेरिकेचा 2008 — कर्जाचा डोंगर
slug: 05-america-2008
order: 5
summary: जगातली सर्वात मोठी अर्थव्यवस्था कशी कोसळली — आणि त्यातून कोणी पैसे कमावले?
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: A strawberry picker in California with a $720,000 mortgage. No income verification, no down payment. The bank approved it anyway. How?
- The machine: Banks made loans → sold them as mortgage-backed securities → rating agencies stamped AAA → global investors bought them → banks made more loans. Nobody held the risk, so nobody cared about quality.
- Subprime: Teaser rates (low EMI for 2 years, then doubles). NINJA loans (No Income, No Job, No Assets). The belief: "housing prices always go up, so even bad loans are safe."
- The Big Short: Michael Burry read the actual loan documents and realized 80% would default. John Paulson bet $15B against the housing market. Steve Eisman investigated and found the fraud. They were mocked, called crazy — then made billions.
- The crash: Lehman Brothers collapse (September 2008). $9 trillion in household wealth evaporated. 10 million Americans lost homes.
- **भारताचा आरसा section:** India's home loan market growing aggressively. Banks compete on lowest EMI. Teaser rates appearing. BUT: Indian mortgage standards are currently stricter — 80% LTV cap, income verification required, RBI oversight. The direction of travel matters though — are standards loosening? What would an Indian "Big Short" look like? Honestly note: India doesn't have the securitization depth that made the US crisis systemic. The risk in India is more direct — builder defaults and NPA accumulation.
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/05-america-2008.md
git commit -m "book: rikamya-ghara ch05 — अमेरिकेचा 2008"
```

---

## Task 7: Chapter 6 — भारताची संख्या

**Files:**
- Create: `books/rikamya-ghara/06-bharatachi-sankhya.md`

**Frontmatter:**
```yaml
title: भारताची संख्या — जन्मदर, बांधकाम, आणि मागणी
slug: 06-bharatachi-sankhya
order: 6
summary: भारताचे आकडे काय सांगतात — लोकसंख्या, बांधकाम, आणि मागणी यांचं गणित.
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: A simple question — India has 140 crore people, the most in the world. How can there ever be too many homes? The answer lies in the math of growth rates, not absolute numbers.
- TFR by state: Kerala 1.5, Tamil Nadu 1.5, Andhra 1.5, Karnataka 1.6, Maharashtra 1.7, West Bengal 1.6, Gujarat 2.0, Rajasthan 2.0, UP 2.4, Bihar 2.98. The north-south divergence — crisis won't be uniform. South and West India hit the wall first.
- Krugman's framework explained simply: मागणी = नवीन कुटुंबं तयार होण्याचा दर. पुरवठा = नवीन घरं बांधण्याचा दर. जेव्हा पुरवठा > मागणी, बाजारभाव कमी होतात.
- Housing inventory: unsold units by city. Months of inventory. Cities where supply is 3-5 years ahead of demand.
- Builder stress: RERA-registered projects delayed. Builder debt levels. History of NPA cycles (2015-2019).
- Affordability ratios: price-to-income ratio in Indian cities vs. global benchmarks. Many tier-1 cities already worse than pre-crash US/Spain.
- The 25-year lag: babies not born today won't need homes in 2050. The supply being built today is for buyers who may not exist.
- NO "भारताचा आरसा" section (this IS the India chapter)
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/06-bharatachi-sankhya.md
git commit -m "book: rikamya-ghara ch06 — भारताची संख्या"
```

---

## Task 8: Chapter 7 — कोण फायदा घेतो, कोण अडकतो

**Files:**
- Create: `books/rikamya-ghara/07-faayda-ani-tota.md`

**Frontmatter:**
```yaml
title: कोण फायदा घेतो, कोण अडकतो
slug: 07-faayda-ani-tota
order: 7
summary: गृहनिर्माण संकटात कोणाचा फायदा होतो आणि कोण अडकतो — जगभरातले धडे.
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: In every housing crisis, the same pattern — the majority loses, a small minority profits enormously. Who are these people, and what did they see that others missed?
- Winners across crises:
  - Distressed-debt funds: Blackstone bought 50,000+ Spanish apartments at 30 cents on the euro. Cerberus bought Irish bank portfolios. In Japan, foreign investors bought prime Tokyo real estate at 80% discounts in the late 1990s.
  - Short sellers: Paulson ($15B profit), Burry ($100M personal profit from $1.3B fund gain), Eisman (featured in The Big Short).
  - Cash holders: Those who stayed liquid through the crash and bought at the bottom. Patient capital wins.
- Losers across crises:
  - Middle-class EMI payers: locked into 20-year loans on depreciating assets. Negative equity — कर्ज घराच्या किमतीपेक्षा जास्त. Can't sell, can't move, can't stop paying.
  - Small builders: can't service debt, can't finish projects, RERA penalties pile up.
  - Banks: concentrated real estate NPA exposure. In India, PSU banks already burned by 2015-2019 NPA cycle.
  - The informal sector: construction workers, brokers, agents — the first to lose livelihoods.
- What this means for a 25-year-old Indian professional: you're not Blackstone, you can't short the market. Your edge is patience and information. Understanding the cycle means not being the person who buys at the peak.
- NO "भारताचा आरसा" section (examples are woven throughout)
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/07-faayda-ani-tota.md
git commit -m "book: rikamya-ghara ch07 — कोण फायदा घेतो, कोण अडकतो"
```

---

## Task 9: Chapter 8 — दोन्ही बाजू

**Files:**
- Create: `books/rikamya-ghara/08-donhi-baaju.md`

**Frontmatter:**
```yaml
title: दोन्ही बाजू — बैल आणि अस्वल
slug: 08-donhi-baaju
order: 8
summary: घरांचे भाव वाढतील की कमी होतील — दोन्ही बाजू ऐकूया.
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: Two friends arguing at a chai stall. One says "आत्ताच घ्या, नंतर परवडणार नाही." The other says "थांबा, bubble फुटणार." Who's right? Let's hear both sides with data.
- THE BULL CASE (भाव वाढतील):
  1. Urbanization: only 35% urban, will reach 50% by 2047. That's 200 million+ new urban residents needing homes.
  2. Nuclear family formation: joint families breaking up = more households even with fewer children.
  3. Infrastructure: new metros, highways, bullet train corridors creating fresh demand zones.
  4. Government push: PMAY (Pradhan Mantri Awas Yojana), affordable housing incentives, tax benefits on home loans.
  5. Cultural value: "आपलं घर" is deeply emotional in Indian culture. Marriage prospects, family status, retirement security — all tied to owning a home.
  6. Rental yields: in some tier-2 cities, rental income still makes buying reasonable.
- THE BEAR CASE (भाव कमी होतील):
  1. TFR below replacement: fewer people = fewer households in 20-25 years.
  2. Unsold inventory: 5+ lakh units unsold in top 7 cities. Years of supply overhang.
  3. Builder stress: many builders overleveraged, unable to deliver projects on time.
  4. Affordability crisis: price-to-income ratios in Mumbai, Pune, Bangalore worse than pre-crash global cities.
  5. No immigration valve: India doesn't attract foreign workers to fill the demand gap.
  6. Technology: WFH reduces need for city apartments. Smaller families need smaller homes — the 3BHK being built may not match future demand.
- Let the reader weigh both arguments. Don't push a conclusion.
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/08-donhi-baaju.md
git commit -m "book: rikamya-ghara ch08 — दोन्ही बाजू"
```

---

## Task 10: Chapter 9 — तुमचा पैसा, तुमचा निर्णय

**Files:**
- Create: `books/rikamya-ghara/09-tumcha-nirnay.md`

**Frontmatter:**
```yaml
title: तुमचा पैसा, तुमचा निर्णय
slug: 09-tumcha-nirnay
order: 9
summary: घर घ्यायचं की नाही — हा भावनिक नाही, आर्थिक प्रश्न आहे.
read_time: 15
```

**Content direction (1800–2200 words):**
- Opening: You've read 8 chapters. You've seen Japan, China, Spain, America. You've seen India's numbers. Now what? This chapter doesn't tell you what to do — it gives you the tools to decide.
- Rent-vs-buy math: show the actual calculation with realistic Indian numbers. Monthly EMI vs rent. Opportunity cost of down payment. Maintenance + society charges + property tax. Break-even period. The honest answer: in many Indian cities, renting is currently cheaper than buying when you factor in all costs.
- Checklist before buying:
  1. RERA registration — is the project registered? Check state RERA website.
  2. Builder financial health — can you find their balance sheet? Have they completed previous projects on time?
  3. Occupancy rates in the area — visit the neighborhood at 8 PM. How many lights are on? Ghost towers are visible to anyone who bothers to look.
  4. City/state TFR trends — is the local population growing or shrinking?
  5. Infrastructure pipeline — is there a metro/highway/IT park coming? Or just a builder's promise?
  6. Price-to-income ratio — if the EMI is > 40% of your take-home, you're stretching too thin.
- Diversification: mutual funds (SIP), gold (digital gold, sovereign gold bonds), PPF, NPS. Don't put everything in real estate. The Marathi middle class traditionally treats property as the only "safe" investment — show why diversification reduces risk.
- The emotional vs financial decision: "आपलं घर" is a powerful feeling. Acknowledge it. But separate the emotional decision (I want a home for my family) from the investment decision (is this a good use of my money?). You can fulfill the emotional need by renting a nice place — you don't have to buy to have a home.
- Closing: "घर हे sentiment नाही, गुंतवणूक आहे — गुंतवणुकीसारखं विचार करा." But also: if you've done the math, the builder checks out, the area is growing, and the EMI fits your budget — buying can be the right choice. The point is to decide with data, not pressure.
- Include थोडक्यात and Quick reference sections

- [ ] **Step 1: Write chapter**
- [ ] **Step 2: Verify** — `npm test`
- [ ] **Step 3: Commit**
```bash
git add books/rikamya-ghara/09-tumcha-nirnay.md
git commit -m "book: rikamya-ghara ch09 — तुमचा पैसा, तुमचा निर्णय"
```

---

## Task 11: Final validation

- [ ] **Step 1: Run full test suite**
```bash
npm test
```
Expected: all existing tests pass, no new failures.

- [ ] **Step 2: TypeScript check**
```bash
npx tsc --noEmit
```
Expected: clean, no errors.

- [ ] **Step 3: Full build (includes OG cards, static stubs, sitemap)**
```bash
npm run build
```
Expected: build succeeds. OG cards generated for all 9 chapters. Static HTML stubs created. Sitemap includes new book entries.

- [ ] **Step 4: Verify all 10 files exist**
```bash
ls -la books/rikamya-ghara/
```
Expected: meta.json + 9 .md files (01 through 09).

- [ ] **Step 5: Final commit if any fixes were needed**
```bash
git add books/rikamya-ghara/
git commit -m "book: rikamya-ghara — final fixes after build validation"
```

---

## Parallelization notes

- **Task 1** (meta.json) must complete first — agents need the directory to exist.
- **Tasks 2–10** (chapters 1–9) are fully independent and can run in parallel.
- **Task 11** (validation) must run after all chapters are written.

# रिकामी घरं, भरलेले कर्ज — Book Design Spec

**Date:** 2026-05-25
**Slug:** `rikamya-ghara`
**Category:** economics / personal-finance

---

## Overview

A 9-chapter Marathi book exploring the thesis that India may face a housing/mortgage crisis driven by declining fertility rates (TFR below replacement at ~1.7) outpacing real estate development, combined with India's inability to attract immigrant labor as a demographic backstop. The book applies Paul Krugman's demand-side economic frameworks to India, examines four global precedents (Japan, China, Spain, US 2008), and presents both the bull and bear case for Indian real estate — letting the reader decide.

## Audience

Young professionals aged 22–35 — first-time buyers or about to buy. Navigating builder promises, RERA, bank loan offers. They want to understand whether now is the right time to take on a 20-year EMI. They read Marathi digitally (WhatsApp, phone browsers), not print.

## Tone

**Balanced explainer.** Present both sides — the bull case and the bear case — with data. Not doom-saying, not cheerleading. The reader walks away equipped to make their own decision. Practical, direct, conversational — like a financially-literate friend explaining what they've researched.

## Attribution

Paul Krugman's demand-side economic frameworks applied to India. The India-specific thesis is original analysis, not a Krugman publication. Credit line: "ही प्रकरणं Paul Krugman यांच्या demand-side economics विचारसरणीवर आधारित आहेत, भारतीय संदर्भासाठी मूळ विश्लेषण."

## Geographic scope

Pan-India with tier-2/tier-3 city examples (Nagpur, Indore, Lucknow, Jaipur, Coimbatore, Visakhapatnam). Some Mumbai/Pune references where relevant, but the reader is not assumed to be in a metro.

## Language rules

- **Primary language:** Marathi in Devanagari script
- **English ceiling:** Maximum 5 English words per 100 Marathi words on average
- **English words in Roman script** (never transliterated to Devanagari)
- **English only when no commonly-used Marathi word exists:** EMI, builder, loan (but कर्ज preferred), RERA, TFR, GDP, subprime, default, bubble, CDO, credit rating
- **Marathi preferred for:** गुंतवणूक (investment), कर्ज (debt), मागणी (demand), पुरवठा (supply), भाडं (rent), व्याजदर (interest rate), महागाई (inflation), लोकसंख्या (population), जन्मदर (fertility rate/birth rate), बांधकाम (construction), भांडवल (capital), बाजारभाव (market price), तारण (mortgage/collateral), नफा (profit), तोटा (loss)
- **Tone markers:** "तुम्ही" (formal you), not "तू". Direct but respectful.

## Chapter length

1800–2200 words per chapter. Target read time: 15 minutes per chapter.

## Chapter structure

Each chapter follows the repo's standard structure (YAML frontmatter + sections) but adapted for this book's explainer format:

```
---
title: <Marathi chapter title>
slug: <NN-topic>
order: <1-9>
summary: <one-line Marathi description>
read_time: 15
---

<Opening — sets up the chapter's question or story>

<Core content — data, narrative, analysis>

## भारताचा आरसा (India mirror section — present in chapters 2-5)

<How this global pattern maps (or doesn't) to India>

## थोडक्यात (In brief)

<3-5 bullet points summarizing the chapter's key takeaways>

## Quick reference

**लक्षात ठेवा:** (replaces "बोला" from parenting books — this book gives insights, not dialogue)
- <key insight 1>
- <key insight 2>
- <key insight 3>

**सावध राहा:** (replaces "टाळा")
- <warning/pitfall 1>
- <warning/pitfall 2>
- <warning/pitfall 3>
```

---

## Chapter-by-chapter design

### Chapter 1: "सगळे सांगतात — घर घ्या"
- **Slug:** 01-ghar-ghya
- **Order:** 1
- **Summary:** सगळे म्हणतात घर घ्या, पण आकडे काय सांगतात?
- **Content:** A 28-year-old professional in a tier-2 city (Nagpur/Indore type) pressured by family to buy. Builder ads everywhere. Bank pre-approved loans. "भाडं देणं म्हणजे पैसे वाया." Introduces the tension: 5 lakh+ unsold flats nationally, TFR below replacement, builders defaulting. Introduces Krugman's demand-side lens: what happens when supply keeps growing but the people to fill the homes are shrinking? Sets up the core question the book will answer. This chapter is FREE (no login required).

### Chapter 2: "जपानचं वचन — जमीन कधीच स्वस्त होणार नाही"
- **Slug:** 02-japan
- **Order:** 2
- **Summary:** जपानमध्ये जमिनीचे भाव कधीच कमी होणार नाहीत असं सगळ्यांना वाटत होतं — मग काय झालं?
- **Content:** The 1980s land myth (土地神話). Tokyo land "worth more than California." Banks lent against inflated land. Bubble burst 1991. TFR had fallen below replacement in 1975 — demand never recovered. 9 million akiya (vacant homes) today. Rural homes selling for near-zero.
- **भारताचा आरसा:** "भारतात लोक म्हणतात — 140 कोटी लोकसंख्या, जागा कमी, भाव वाढणारच." The same structural belief. But India's TFR is now where Japan's was in 1975.

### Chapter 3: "चीनची रिकामी शहरं"
- **Slug:** 03-china
- **Order:** 3
- **Summary:** जगातल्या सर्वात मोठ्या बांधकाम व्यवसायाचं पतन — चीनमध्ये काय चुकलं?
- **Content:** Ghost cities. Evergrande and Country Garden collapse. TFR at 1.0, population declining since 2022. Property was 70% of household wealth. Local governments funded by land sales — revenue engine collapsed.
- **भारताचा आरसा:** Builder lobby power, bank-builder nexus, "real estate never falls" sentiment mirrors China. BUT: India's RBI regulation is stronger than China's shadow banking. RERA exists. Not everything maps 1:1 — be honest about what's different.

### Chapter 4: "स्पेनचा बांधकाम उन्माद"
- **Slug:** 04-spain
- **Order:** 4
- **Summary:** स्पेनने जर्मनी, फ्रान्स आणि ब्रिटन या तिन्हींपेक्षा जास्त घरं बांधली — आणि मग ती रिकामी राहिली.
- **Content:** More houses than Germany + France + UK combined. Cajas (local banks) lent recklessly. 2008 hit — prices down 40%+, unemployment 27%. Bad bank (SAREB) created.
- **भारताचा आरसा:** Spain partially recovered through immigration (Latin American, North African workers filling demand). India does NOT have this demographic valve — we don't attract foreign labor to settle. This is a critical structural vulnerability that makes India's position potentially worse than Spain's.

### Chapter 5: "अमेरिकेचा 2008 — कर्जाचा डोंगर"
- **Slug:** 05-america-2008
- **Order:** 5
- **Summary:** जगातली सर्वात मोठी अर्थव्यवस्था कशी कोसळली — आणि त्यातून कोणी पैसे कमावले?
- **Content:** Subprime lending, CDOs, rating agencies, "housing always goes up." How loose lending creates artificial demand that masks oversupply. The Big Short — Burry, Paulson, Eisman — how they saw through the consensus and profited.
- **भारताचा आरसा:** India's home loan market growing aggressively. Banks compete on lowest EMI. Teaser rates emerging. Indian mortgage standards currently stricter than US 2006, but the direction of travel matters. What would an Indian "Big Short" look like?

### Chapter 6: "भारताची संख्या — जन्मदर, बांधकाम, आणि मागणी"
- **Slug:** 06-bharatachi-sankhya
- **Order:** 6
- **Summary:** भारताचे आकडे काय सांगतात — लोकसंख्या, बांधकाम, आणि मागणी यांचं गणित.
- **Content:** Deep data chapter. TFR by state: South India 1.4-1.6, UP/Bihar still ~2.0. Housing inventory data by city. RERA compliance rates. Builder debt levels. NPA history (2015-2019 cycle). The north-south divergence — crisis won't be uniform. South and West India hit the wall first. Krugman's demand-side framework: when population growth slows but supply doesn't, prices must adjust. Affordability ratios in Indian cities vs. global benchmarks.

### Chapter 7: "कोण फायदा घेतो, कोण अडकतो"
- **Slug:** 07-faayda-ani-tota
- **Order:** 7
- **Summary:** गृहनिर्माण संकटात कोणाचा फायदा होतो आणि कोण अडकतो — जगभरातले धडे.
- **Content:** Who profits from housing crashes? Distressed-debt funds (Blackstone bought Spanish apartments at 30 cents on the euro). Short-sellers. Patient cash holders who waited. Who gets trapped? Middle-class EMI payers locked into 20-year loans on depreciating assets. Small builders who can't service debt. Banks with concentrated real estate NPA exposure. Practical: what does this mean for a young professional weighing a home purchase?

### Chapter 8: "दोन्ही बाजू — बैल आणि अस्वल"
- **Slug:** 08-donhi-baaju
- **Order:** 8
- **Summary:** घरांचे भाव वाढतील की कमी होतील — दोन्ही बाजू ऐकूया.
- **Content:** THE balanced chapter. Bull case presented honestly: urbanization still at 35%, nuclear family formation increasing, infrastructure (metro, highways) creating new demand corridors, government push (PMAY), emotional/cultural value of homeownership, rental yields in some cities still decent. Bear case: TFR decline, unsold inventory, builder stress, affordability ratios in some cities worse than pre-crash global cities, no immigration valve. Present each argument with data. Let the reader weigh.

### Chapter 9: "तुमचा पैसा, तुमचा निर्णय"
- **Slug:** 09-tumcha-nirnay
- **Order:** 9
- **Summary:** घर घ्यायचं की नाही — हा भावनिक नाही, आर्थिक प्रश्न आहे.
- **Content:** The action chapter. Not "don't buy" — but "how to think about it." Rent-vs-buy math for Indian cities (with realistic numbers). What to check before buying: RERA registration, builder financial health, area occupancy rates, city/state TFR trends, infrastructure pipeline. Diversification beyond real estate (mutual funds, gold, PPF as alternatives to second/third property). The emotional vs. financial decision — separating "आपलं घर" sentiment from investment logic. Closing: "घर हे sentiment नाही, गुंतवणूक आहे — गुंतवणुकीसारखं विचार करा."

---

## meta.json

```json
{
  "slug": "rikamya-ghara",
  "title": "रिकामी घरं, भरलेले कर्ज",
  "subtitle": "भारतातल्या गृहनिर्माण संकटाची शक्यता — जागतिक धडे आणि भारतीय वास्तव",
  "category": "economics",
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

---

## What this book is NOT

- Not a prediction that Indian real estate WILL crash — it's an exploration of whether the conditions exist
- Not anti-homeownership — it's pro-informed-decision
- Not a translation or paraphrase of any Krugman book — it's original Marathi analysis using his economic frameworks
- Not a financial advisory document — no specific buy/sell recommendations

## Technical notes

- Chapter 1 is free (no login gate) per repo convention
- Chapters 2-9 require Google sign-in
- `## Quick reference` heading triggers QuickRefCard styling
- All English words in Roman script, never Devanagari transliteration
- 15-minute read time = ~1800-2200 words per chapter
- Build pipeline: `npm test && npx tsc --noEmit && npm run build`

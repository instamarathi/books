---
title: वचन देताना — Overpromise चा सापळा
slug: 07-vachan
order: 7
summary: Boss खुश करायला overpromise करणं हा manager चा सर्वात कोरा सापळा. Underpromise + deliver हा compound interest, overpromise + miss हा compound debt.
read_time: 10
---

विवेक engineering manager होऊन तीन महिने झाले. एका Tuesday ला director ने roadmap meeting मध्ये विचारलं — "हे payment integration किती वेळ लागेल?" विवेक ने पटकन — "तीन आठवडे." Director हसले, "great, मी CEO ला सांगतो." Meeting नंतर विवेक तत्क्षणी ची senior engineer कडे गेला आणि विचारलं — "खरंच तीन आठवडे लागतील?" त्या engineer ने laptop उघडला, dependencies list केल्या, edge cases मोजल्या आणि शांत आवाजात — "विवेक, सहा आठवडे minimum, आणि ते integration partners च्या response time वर depend आहे." विवेक च्या पोटात गोळा. CEO पर्यंत आता "तीन आठवडे" गेलं होतं. आता दोन options — boss कडे जाऊन correct करायचं (embarrassing), किंवा team ला push करून तीन आठवड्यात deliver करायचा प्रयत्न (impossible). त्याने दुसरा निवडला, team साठी सहा आठवडे hell झाले, integration shipped साडेपाच आठवड्यांनी, quality compromised, आणि CEO आला director कडे — "तुम्ही तीन आठवडे म्हणाला होतात ना?"

**Overpromise हा short-term हसरा निर्णय आणि long-term विषारी debt आहे. एक "त्रुसरा आठवडा" वर्षभर तुमच्या credibility ला खाऊन टाकतो.**

नवीन manager ला overpromise करायचं मोह सर्वात तीव्र असतो — कारण boss खुश दिसायचं असतं, "competent" वाटायचं असतं, "no" म्हणायला कठीण असतं. आणि एका तासात तुम्ही तीन वर्षांची credibility घालवू शकता. एकदा तुम्ही miss झालात, boss पुढच्या वेळी तुमच्या estimate ला automatic 1.5x ने multiply करायला लागेल. दोनदा miss झालात, तो तुमच्या team च्या लोकांकडे जाऊन parallel verify करायला लागेल. तीनदा miss झालात, तुमच्यावर "high-risk" tag पडेल जो काढायला वर्षं लागतात. Underpromise + deliver याची विरुद्ध दिशा आहे — पहिल्यांदा boss थोडा disappointed वाटेल "इतका वेळ का?", पण deliver केल्यावर "हा reliable आहे" हा compound interest वर्षानुवर्ष चालत राहतो.

## ही चार techniques वापरा

1. **Estimate on the spot देऊ नका.** Boss विचारेल "किती वेळ?" — तुमचा reflex उत्तर देणं असेल. हा reflex कापून टाका. म्हणा — "मी team सोबत बघून परत येतो, उद्यापर्यंत." Boss disappointed नाही होणार — actually तो impressed होईल कारण हा signal आहे की तुम्ही गृहीत धरून बोलत नाही. एका रात्रीत team सोबत scope clarify करा, dependencies list करा, मग realistic estimate द्या. ही 24-hour rule तुम्हाला अर्धा गणित वाचवते.

2. **Multiplier rule वापरा.** Engineering estimates मध्ये गृहीत bias असतो — गोष्टी जास्त वेळ लागतात कारण आपण happy-path imagine करतो आणि edge cases विसरतो. Team चा estimate जो आला त्याला 1.5x करा (जर experienced team असेल) किंवा 2x करा (नव्या team साठी). हे "padding" नाही, हे realism आहे. आणि actually 1.3x लागलं तर तुम्ही under-budget delivered. Boss च्या डोक्यात तुम्ही reliable.

3. **Commitment स्पष्टपणे लिहून ठेवा.** Boss शी जे ठरलं ते त्याच meeting नंतर एका email/doc मध्ये — "आज आपण ठरवलं की team हे feature ६ आठवड्यांत ship करेल, conditional on payment partner च्या APIs ची documentation आम्हाला १ आठवड्यात मिळणं. कोणतीही condition बदलली तर मी proactively कळवीन." Written record memory disagreements रोखतो आणि dependencies/conditions explicit करतो.

4. **Under-commit, over-deliver — हा pattern build करा.** एका वर्षभर हा pattern repeat करा — promise केलं ६ आठवडे, deliver केलं ५; promise केलं Q3 launch, ship Q3 mid; promise केलं team कडून ८ stories, ship १०. Boss च्या डोक्यात तुमचं brand "reliable predictable" बनेल. हा brand stable होतो, मग "high-stakes project कोणाला द्यावा?" अशा question वर तुमचं नाव default वर येतं.

## हे टाळा

- **Hero मोडचा मोह** — "मीच ही गोष्ट तीन आठवड्यात करून दाखवीन." Hero हे promotional, sustainable नाही. एका quarter चा hero पुढच्या quarter चा burnt-out manager होतो.
- **"तेच एक exception" mindset** — "ही एकदा overpromise केली कारण situation special होती." नाही — exceptions नियम बनतात. एकदा overpromise केली, पुढच्या वेळी तीच situation आल्यावर परत overpromise कराल.
- **Conditions न सांगणं** — "६ आठवडे" म्हणालात पण "जर X partner ने Y वेळेत Z दिलं तरच" हे न सांगितलं — मग X delay झाला तर सगळा blame तुमच्यावर. Conditions front-loaded ठेवा.

## Quick reference

**बोला:**
- "मी team सोबत बघून उद्यापर्यंत estimate देतो."
- "हा scope ६ आठवड्यांचा आहे, हे ३ assumptions वर."
- "एखादी condition बदलली तर मी आधी कळवीन."
- "मला underpromise करण्याची सवय आहे — तुमचा अंदाज त्याप्रमाणे लावा."

**टाळा:**
- "हो हो, होईल लवकर." (specifics नसताना)
- "मी देतो handle करून, तीन आठवडे enough."
- "नक्की करतो — fingers crossed."
- "Worst case मध्ये थोडा delay" (worst case — सांगायचं असेल तर expected case म्हणून सांगा).

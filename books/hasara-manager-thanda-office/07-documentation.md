---
title: आठवणीपेक्षा evidence
slug: 07-documentation
order: 7
summary: विषारी manager च्या धुक्यात टिकण्यासाठी documentation म्हणजे revenge नाही; ती reality ला anchor देण्याची सवय आहे.
read_time: 15
---

अभिजितला mail लिहायला आवडत नव्हतं. तो developer होता. त्याला वाटायचं, काम करा, code push करा, बाकी process लोकांसाठी आहे. त्याचा manager देवाशीष मात्र verbally direction द्यायचा आणि नंतर बदलायचा. "Cache layer पुढच्या sprint ला" म्हणायचा, मग release अडला की "मी कधी postpone म्हणालो?" विचारायचा. अभिजित दोनदा अडकला. तिसऱ्यांदा त्याने ठरवलं की प्रत्येक discussion नंतर summary लिहायची. पहिल्याच mail वर देवाशीषने reply केला: "Why are we becoming bureaucratic?"

अभिजित घाबरला. Documentation म्हणजे boss वर अविश्वास दाखवणं असं त्याला वाटलं. पण मग त्याच्या team मधल्या अनुभवी QA lead ने सांगितलं, "Documentation म्हणजे boss ला trap करणं नाही. उद्या आपणच विसरू नये म्हणून लिहिणं." हा framing बदल महत्त्वाचा होता. कारण विषारी manager नेमकं हेच करतो: clarity मागणं म्हणजे attitude, written confirmation म्हणजे mistrust, boundary म्हणजे lack of ownership. तो survival tools ला character flaws बनवतो.

**जेव्हा power memory बदलते, तेव्हा लिखित record हा employee चा छोटा संविधान असतो.**

Documentation ची गरज फक्त legal fight साठी नसते. बहुतेक लोक कधीच formal complaint करणार नाहीत. त्यांना रोजच्या कामात स्वतःचं sanity वाचवायचं असतं. काय ठरलं? कोण owner? deadline का? risk कोणता? scope काय? हे लिहिलं की धुकं कमी होतं. आणि धुकं कमी झालं की विषारी manager ला हवा तसा story rewrite करणं कठीण होतं.

पण documentation चुकीच्या पद्धतीने केली तर उलट नुकसान होऊ शकतं. लांबलचक emotional mails, प्रत्येक वाक्यावर CC, "as you clearly instructed despite my warning" असा tone — याने तुम्ही defensive दिसता. चांगल्या evidence ला दोन गुण हवेत: ती साधी असावी आणि वेळेवर असावी. Call संपल्यानंतर दोन दिवसांनी summary पाठवली तर ती argument वाटते. Call संपताच पाच ओळी पाठवल्या तर ती working note वाटते.

अभिजितने एक format बनवलं:

"Thanks for the discussion. My understanding:
1. Cache layer moves to Sprint 18.
2. Current release will handle load using rate limit.
3. Risk: peak traffic may still cause latency above 900ms.
4. Owner: Abhijit to add monitoring; Devashish to update product on risk.
Please correct if I missed anything."

देवाशीषला पहिल्या काही mails त्रासदायक वाटले. पण अभिजितने tone बदलला नाही. ना sarcasm, ना लपलेला राग. फक्त facts. दोन आठवड्यांनी एक issue आला तेव्हा देवाशीषने blame ढकलायचा प्रयत्न केला. अभिजितने mail पुढे केला. देवाशीषने लगेच subject बदलला. तो चांगला झाला नाही, पण सावध झाला. कधी कधी आपल्याला villain reform करायचा नसतो; त्याला आपल्यावर सोपा prey समजू नये इतकं पुरेसं असतं.

Evidence फक्त mails नसतात. Calendar invites, ticket comments, pull request notes, design version history, Slack threads, meeting notes, approval screenshots, workload logs — हे सगळं context तयार करतं. Indian offices मध्ये बरीच कामं WhatsApp वरही येतात. "Can you quickly do this?" "Client wants by tonight." शक्यतो काम official tool मध्ये आणा. "Sure, please add this to Jira so I can track priority" किंवा "I'll start after you confirm this replaces the current item." जर WhatsApp वापरावंच लागलं तर summary official mail/Slack वर परत आणा.

Documentation करताना company policy आणि ethics लक्षात ठेवणं आवश्यक. Secret recordings अनेक ठिकाणी legal किंवा policy problem होऊ शकतात. Confidential data personal Gmail वर forward करणं धोकादायक. Client documents घरी download करणं मूर्खपणा. स्वतःला वाचवताना स्वतःवर वेगळा case उघडू नका. तुम्हाला facts लागतात, चोरीचा archive नाही. Dates आणि descriptions personal notebook मध्ये ठेवू शकता; sensitive files company systems मध्येच राहू द्या.

एक मोठा psychological फायदा असा की documentation तुम्हाला स्वतःच्या भावनेपासून थोडं अंतर देते. विषारी manager call वर तुम्हाला confuse करतो. Call संपल्यावर तुम्ही धडधडत्या हृदयाने विचार करता, "मी काय ऐकलं?" त्या क्षणी summary लिहिणं म्हणजे मनावर control परत घेणं. "त्याने मला कमी लेखलं" हे भावनिक सत्य आहे. पण log मध्ये लिहिता: "Meeting 4:30 pm: Devashish said API delay due to engineering ownership gap; I stated dependency on vendor approval; he asked for revised ETA by 6 pm." हे वाक्य थंड आहे, पण मजबूत आहे.

काही लोक म्हणतात, "इतकं लिहायचं म्हणजे काम कधी करायचं?" खरं आहे. प्रत्येक गोष्ट document करणं शक्य नाही. म्हणून risk-based करा. High-impact decisions, changed deadlines, blame-prone assumptions, public criticism, workload beyond normal hours, performance feedback, credit-sensitive deliverables. बाकी छोट्या गोष्टी सोडा. Documentation हा full-time job नको; तो seatbelt आहे. Seatbelt दिवसभर हातात धरत नाहीत, पण गाडी चालू झाली की लावतात.

एक personal log सुद्धा ठेवा, पण तो diary आणि evidence यांच्या मध्ये असावा. तारीख, काय झालं, कोण उपस्थित, तुमची action, पुढचा impact. "देवाशीष खूप वाईट आहे" असं लिहिलं तर त्या क्षणी हलकं वाटेल, पण नंतर उपयोग कमी. "12 June, release planning: Devashish asked to skip load test despite stated risk; present: product, QA; follow-up mail sent 6:14 pm" हे उपयोगी. महिन्यानंतर pattern पाहताना तुम्हाला कळतं की problem isolated नाही. आणि जर तुम्ही mentor किंवा HR शी बोललात तर तुमच्याकडे scattered emotion नाही, structured history असते.

Documentation तुमच्या भाषेला देखील train करतं. विषारी environment मध्ये आपण मोठ्या adjectives वापरतो: always, never, impossible, harassment, sabotage. काही शब्द खरंच लागू शकतात, पण अति वापरले तर credibility कमी होते. Record तुम्हाला exact बनवतो. "ती नेहमी अपमान करते" ऐवजी "गेल्या तीन sprint reviews मध्ये तिने public comments केले: X, Y, Z." Exactness राग कमी करत नाही; तो रागाला दिशा देतो. Senior लोक vague pain dismiss करतात; specific pattern dismiss करायला कठीण जातं.

एक limitation स्पष्ट: documentation करताना तुम्ही human relationship पूर्णपणे contract मध्ये बदलू नका. प्रत्येक friendly chat नंतर mail पाठवलात तर healthy colleague सुद्धा दूर जातील. Context पाहा. ज्यांच्यासोबत trust आहे त्यांच्यासोबत normal राहा. जिथे pattern आहे तिथे record ठेवा. विषारी manager मुळे तुम्ही संपूर्ण जगावर संशय घेत बसलात तर त्याचा प्रभाव team बाहेरही पसरतो. Documentation ने तुम्हाला स्वच्छ करायला हवं, थंड नाही.

Evidence organise करायलाही शिस्त लागते. Random screenshots folder मध्ये टाकून उपयोग नाही. Month-wise notes, project-wise decisions, performance feedback, workload evidence, credit records असे buckets ठेवा. जर कधी तुम्हाला HR, skip-level, lawyer, किंवा mentor शी बोलावं लागलं तर तुम्ही पाच मिनिटांत story दाखवू शकता. पण पुन्हा तोच नियम: confidential material leak करू नका. तुम्हाला proof of pattern हवा आहे, company data चं illegal संग्रहालय नाही.

Documentation ने एक वेगळा फायदा होतो: तो तुम्हाला तुमची स्वतःची growthही दाखवतो. Toxic manager मुळे आपण फक्त नुकसान पाहतो. पण notes मध्ये तुमचे shipped features, solved incidents, saved clients, mentored juniors दिसतात. Appraisal मध्ये manager तुम्हाला "not enough impact" म्हणाला तर तुमच्याकडे स्वतःसाठी counter-memory असते. जरी company ने मान्य केलं नाही तरी तुमच्या पुढच्या interview साठी तुम्हाला तुमचा impact माहीत असतो. Evidence फक्त बचाव नाही; तो self-respect चा archive आहे.

Performance review साठी documentation वेगळ्या प्रकारे useful आहे. विषारी manager vague feedback देतो: "strategic नाही", "ownership कमी", "communication improve कर", "stakeholder maturity कमी." तुम्ही विचारू शकता: "कृपया दोन examples द्या जिथे ownership कमी दिसली आणि पुढच्या quarter साठी measurable expectation काय?" हे विनम्रपणे written मध्ये आणा. जर तो examples देत नसेल तर तुम्ही स्वतः summary पाठवा: "My takeaway is to improve stakeholder updates by sending weekly risk notes and closing open decisions within 24 hours. Please confirm if this addresses the feedback." Vague shadow ला measurable आकार द्या.

Documentation चा एक social side आहे: credit visible करणं. Team mail मध्ये "Analysis by Aakanksha, validation by Vaibhav, deck narrative by Rohit" असं लिहिणं खूप साधं वाटतं, पण credit theft कमी करतं. Project kickoff मध्ये RACI किंवा owners chart बनवणं boring वाटतं, पण पुढे blame कमी करतं. Meeting notes मध्ये "Decision made by..." लिहिणं काही लोकांना bureaucratic वाटतं, पण decision आणि execution वेगळे ठेवतं.

अभिजितने हळूहळू documentation team habit बनवली. सुरुवातीला लोक त्याला process uncle म्हणाले. मग एकदा production issue मध्ये त्याच्या notes ने पूर्ण team वाचली. Product ने deadline pull केली होती; engineering ने risk सांगितला होता; manager ने proceed approve केलं होतं. Incident review मध्ये blame engineering वर येणार होता. अभिजितच्या notes ने discussion बदली: "कुणी चूक केली?" वरून "risk accept करण्याची process कशी improve करायची?" वर. त्या दिवशी team ला documentation चं खरं मूल्य समजलं.

तरीही documentation सर्वकाही नाही. जर organisation विषारी manager ला protect करणारच असेल, तर तुमचे records तुमचं मन वाचवतील, कदाचित transfer मदत करतील, पण न्याय हमखास देणार नाहीत. हे मान्य करणं कडू आहे. Evidence म्हणजे magic wand नाही. पण evidence नसताना तुम्ही फक्त तुमच्या आठवणी घेऊन उभे राहता, आणि power असलेला माणूस म्हणतो, "तुला चुकीचं आठवतं." त्या क्षणी एक शांत mail खूप मोठं शस्त्र असतं.

Documentation चा शेवटचा नियम: लिहा, पण त्यात राहू नका. काही लोक प्रत्येक अन्यायाची file बनवत राहतात आणि बाहेर पडायचा निर्णय पुढे ढकलतात. Evidence जमा करणं आणि स्वतःला सतत जखम आठवणं यात फरक आहे. महिन्यातून एकदा तुमची log पाहा आणि विचारा: pattern सुधारतोय का? मी सुरक्षित आहे का? हा record मला action कडे नेत आहे का फक्त राग जपायला लावत आहे? Documentation ने reality दाखवली पाहिजे; तुरुंग बनू नये.

अभिजित आजही कमी बोलतो. पण आता तो call संपल्यावर दोन मिनिटं काढतो. Summary लिहितो. Risk लिहितो. Owner लिहितो. त्याने corporate politics आवडायला सुरुवात केलेली नाही. त्याने फक्त एवढं शिकलंय: काम करणाऱ्या माणसाला स्वतःच्या कामाचा पुरावा ठेवणं लाजिरवाणं नाही.

# Shweta Sharma — Portfolio

> **UX Researcher · AI & ML Grad Student at Drexel**
> Full documentation of [shwetasharma.tech](https://www.shwetasharma.tech/)
> `doc: portfolio/work` · `version: 2026.1` · `status: open_to_work`

---

## Table of Contents

1. [Home / Introduction](#1-home--introduction)
2. [About Me](#2-about-me)
3. [Featured Work (Index)](#3-featured-work-index)
4. [Experience](#4-experience)
5. [Education](#5-education)
6. [Certifications](#6-certifications)
7. [Tech Stack](#7-tech-stack)
8. [Case Studies](#8-case-studies)
   - [8.1 ABIM — Measuring Patient-Centered Communication with NLP](#81-abim--measuring-patient-centered-communication-with-nlp)
   - [8.2 John Deere — PM Design Thinking](#82-john-deere--pm-design-thinking)
   - [8.3 Healthcare Bias — NLP Detection](#83-healthcare-bias--nlp-detection)
   - [8.4 Stories by Children — Platform Redesign](#84-stories-by-children--platform-redesign)
   - [8.5 E-Commerce Personalization at Scale (Arcadia / Wallis)](#85-e-commerce-personalization-at-scale-arcadia--wallis)
   - [8.6 John Deere — Enterprise Survey Logic & Analytics](#86-john-deere--enterprise-survey-logic--analytics)
   - [8.7 GesturePro — Real-Time Sign Language Translation](#87-gesturepro--real-time-sign-language-translation)
   - [8.8 CryptoSecure — AI-Powered Smart Contract Security](#88-cryptosecure--ai-powered-smart-contract-security)
9. [Contact](#9-contact)
10. [Site Map](#10-site-map)

---

## 1. Home / Introduction

**Page:** `/` — *Shweta Sharma | UX Researcher · AI & ML*

**Hero headline:** DESIGNING EXPERIENCES · research

> Hi! I'm Shweta Sharma, a UX Researcher & AI/ML Grad Student at Drexel — I design experiences people actually want to use, and lately, I've been teaching machines to help.

---

## 2. About Me

My 6+ year journey started with a simple obsession: figuring out why people do what they do, and caring about what happens when they can't.

I began in UX design, shaping e-commerce at Arcadia, building wellness platforms, and redesigning enterprise tools at John Deere. Behavioral analytics pulled me deeper — not just tracking clicks, but understanding the *why* behind every hesitation.

With a Masters in AI/ML from Drexel and my current work at ABIM building NLP models that detect bias in clinical communication, the mission got sharper: how a doctor talks to a patient shouldn't depend on who that patient is.

Whether I'm in a user interview or fine-tuning a transformer, I'm still just trying to understand people. I just have better tools now.

**When I'm not researching**
I work hard and then I go find something that has nothing to do with work. Slopes, cities, finish lines, ship decks — whatever gets me out of my head and into the world.

---

## 3. Featured Work (Index)

*Selected research & design* · `// featured_work.index`

| # | Category | Project | Headline Metric |
|---|---|---|---|
| 01 | NLP & UX Research | **Measuring Patient-Centered Communication** (ABIM, 2025) | 985 conversations · BERT classifier · 11 constructs |
| 02 | UX Research | **PM Design Thinking @ John Deere** | 80% UX confidence lift · design thinking · enterprise UX |
| 03 | Data Science & ML | **Healthcare Bias — NLP Detection** | 4-label bias framework |
| 04 | UX Research & Design | **Stories by Children** | Task success 50% → 85% |
| 05 | UX Personalization | **E-Commerce Personalization at Scale** | 11% conversion lift |
| 06 | Product Design | **Enterprise Survey Logic & Analytics** | 60% faster build time |
| 07 | AI / Accessibility | **GesturePro — Sign Language Translation** | Real-time · zero hardware |
| 08 | Blockchain / ML | **CryptoSecure — Smart Contract Security** | $10k audit → 30 seconds |

---

## 4. Experience

**Page:** `/experience` — *Where I've worked — and what I shipped.*

> 6+ years across data science, UX research, and design — from healthcare NLP pipelines to fashion personalization at scale. Here's the full story.

**Headline stats:** `6+` years of experience · `15+` products shipped · `250K+` users impacted · `4` industries

---

### 4.1 Data Analyst CO-OP (Data Science) — American Board of Internal Medicine
**Philadelphia, PA · Sep 2025 – Present · Currently Here**

Working within ABIM's data science team to build NLP and machine learning systems that bring rigour and scale to how clinical communication quality is assessed. My work sits at the intersection of healthcare data, transformer models, and responsible AI — building pipelines that a medical certifying body can trust.

- **Bias Detection at Scale.** ABIM needed to move beyond subjective, manual review of clinical communication for bias. I engineered a 4-label NLP classification pipeline by fine-tuning ClinicalBERT and RoBERTa on 3,500+ annotated records, replacing inconsistent human review with a structured, scalable system that classifies structural bias, clinical stigma, and diagnostic framing bias with documented confidence scores.
- **Automating Communication Assessment.** Trained clinicians were manually coding doctor–patient dialogues against established frameworks (Calgary–Cambridge, NURSE, SHARE) — a process too slow for ABIM's assessment volume. I built a supervised NLP model using Label Studio for gold-standard annotation, creating a system that detects these communication behaviours automatically while meeting the evidentiary standards required for clinical audit.
- **Making LLM Deployment Trustworthy.** Before ABIM could deploy large language models for internal SQL generation tasks, the team needed to know how often the models were wrong — and in what ways. I built an LLM evaluation framework that generated measurable confidence metrics rather than anecdotal trust.
- **Protecting Patient Privacy by Design.** Real clinical data can't leave ABIM's secure environment, but ML models need training data at volume. I designed an automated synthetic data generation loop using LLMs with rigid JSON validation and rationale-based leakage detection, creating audit-friendly datasets that keep real patient information entirely out of model workflows while supporting rapid iteration.

**Stack:** NLP · ClinicalBERT · RoBERTa · Python · Label Studio · LLM Evaluation · Synthetic Data · PyTorch

---

### 4.2 Course Assistant — Drexel University, College of Computing & Informatics
**Philadelphia, PA · Sep 2025 – Present · Currently Here**

Supporting graduate instruction in AI and machine learning coursework while completing my own M.S. in AI & ML. Helping students navigate core concepts in deep learning, NLP, and applied machine learning through office hours, assignment guidance, and lab support.

**Stack:** Teaching · AI/ML · Deep Learning · Graduate Studies

---

### 4.3 Senior Technical Lead — Research — John Deere
**Pune, India · Nov 2022 – Aug 2024**

Joined as the only UX researcher on John Deere's India team and built the research practice from the ground up. Over two years, I led behavioural research and experimentation across six product teams, turning user data into the decisions that shaped enterprise product roadmaps. The role evolved from pure UX research into a hybrid position bridging research, analytics, and data-driven product strategy.

- **Building UX Research from Zero.** John Deere's India team had engineering depth but no dedicated UX research capability. I established the function from scratch — creating research protocols, reference case studies, and orientation materials that built confidence across multiple engineering teams. Within six months, product teams were proactively requesting research rather than treating it as an afterthought.
- **Experiments That Drove Launch Decisions.** Product teams needed evidence before committing AI-driven features to production. I designed and ran hypothesis-driven experiments — A/B tests, usability studies, multivariate analyses — that validated features used by thousands of users. These experiments directly informed go/no-go decisions within sprint cycles, replacing opinion-based arguments with data.
- **Replacing Manual Reporting with Self-Serve Analytics.** Leadership and product teams needed visibility into adoption curves and feature impact, but the existing process relied on analysts manually pulling data and building slide decks — a cycle that took days. I built automated Tableau dashboards and analytics pipelines that provided real-time, self-serve access to the metrics that mattered, freeing up analyst hours for deeper work.
- **Behavioural Patterns That Enabled Personalization.** Across the product portfolio, user behaviour varied significantly by role, region, and workflow. I applied segmentation and clustering techniques to surface these patterns, identifying distinct user cohorts that enabled personalization strategies and AI-assisted recommendation systems — improving engagement and task completion rates.

**Stack:** UX Research · A/B Testing · Tableau · Behavioural Analytics · Segmentation · Figma · Jira · Design Systems

---

### 4.4 UI/UX Designer — Urbanfit Wellness Private Limited
**Pune, India · Jan 2021 – Nov 2022**

Owned end-to-end design across two products — the Urbanfit wellness web platform and Poshmera, a new mobile fashion app built from scratch. The work spanned research, prototyping, testing, and design system management, with direct accountability for engagement and conversion metrics.

- **Redesigning a Wellness Platform That Wasn't Converting.** Urbanfit's website had strong traffic but weak engagement — high mobile bounce rates and users abandoning multi-step flows before completing them. I conducted behavioural analysis using Hotjar heatmaps and session recordings to pinpoint the exact drop-off moments, then redesigned the core flows (meal logging, membership signup) with fewer steps, smarter defaults, and clear progress indicators. The result: a **35%** increase in on-page engagement, a **28%** drop in mobile bounce rate, and a **2.5×** lift in newsletter sign-ups.
- **Shipping a Fashion App from Concept to 8,000 Installs.** Urbanfit wanted to expand into fashion with a new mobile app called Poshmera. I led the UX from research through launch over 24 weeks — interviewing 15 target shoppers, surveying 250 more, running three rounds of usability testing, and iterating through rapid prototyping cycles. The app launched to **8,000 installs** in the first month (60% above the 5,000 target), earned a **4.3-star** App Store rating, and achieved a **13%** checkout completion rate.
- **A Component Library That Halved Handoff Time.** Design-to-dev handoff was creating friction — engineers were interpreting designs inconsistently, and every new screen required custom specification. I built a modular Figma component library covering both the Urbanfit web platform and the Poshmera mobile app, with documented tokens, interaction states, and responsive rules. Design-to-dev handoff time dropped by roughly **50%**, and interface consistency improved across both products.

**Stack:** Figma · Hotjar · Usability Testing · React · Mobile Design · Component Libraries · User Interviews

---

### 4.5 UX Personalization Designer — Capita (for Arcadia Group)
**Pune, India · Jan 2018 – Oct 2022**

Embedded with Qubit's London team as the personalization specialist for Arcadia Group's entire retail portfolio — seven brands (**Topshop, Topman, Dorothy Perkins, Miss Selfridge, Evans, Burton, Wallis**), each with distinct audiences and shopping behaviours. The work combined behavioural data analysis, conversion psychology, and UX design to create personalized shopping experiences at scale.

- **11% Conversion Lift Through Personalization.** Arcadia's online experiences were generic — every visitor saw the same homepage, the same product listings, the same checkout flow regardless of how they arrived or who they were. I designed a four-layer personalization framework (campaign mirroring, behavioural triggers, recovery experiences, and segmented journeys) implemented across all seven brands through Qubit's platform. For Topshop alone, personalization drove an **11% increase** in overall conversion rate.
- **Measurement That Proved Real Impact.** The standard approach to measuring display campaign ROI was to count all conversions from people who saw an ad — a method that inflates results by including people who would have bought anyway. I implemented a **10% control group** methodology (served blank ads, validated as statistically significant via two-tailed test) that calculated true incremental ROI, giving Arcadia's board defensible numbers rather than vanity metrics.
- **300+ Page Migration That Cut Load Times by a Third.** The legacy codebase was slow, SEO-unfriendly, and difficult to maintain. I led the migration of **300+ pages** to a Magento/React/Redux stack, cutting page load times by one-third and lifting SEO scores from **65 to 85** — directly improving organic traffic and discoverability across brand properties.
- **Prototyping That Prevented Cart Abandonment.** Before launch, I developed storyboards, sitemaps, and high-fidelity prototypes that caught and resolved **40%** of critical UI issues in review — issues that would have surfaced as friction in the live checkout flow. This contributed to a **15% reduction** in cart abandonment across brand sites after launch.

**Stack:** Qubit · Google Analytics · A/B Testing · Personalization · Magento · React · Conversion Optimization · Behavioural Segmentation

---

### 4.6 Senior Web Designer — Capita (for NEXT)
**Pune, India · Jan 2018 – Oct 2022**

Delivered rapid-turnaround web and email campaigns for NEXT, one of the UK's largest fashion retailers. The work was execution-heavy and fast-paced — same-day website updates, hand-coded email templates, and pixel-perfect creative production under tight deadlines.

- **Email Campaigns That Moved the Needle.** NEXT needed email campaigns that performed, not just looked good. I hand-coded **20+ responsive HTML5/CSS3/jQuery** templates, segmented audiences of **50,000+** in IBM Silverpop, and rigorously QA-tested across Outlook, Gmail, and mobile clients. The campaigns secured click-through rate improvements up to **18%** and a **2.5%** lift in conversion — strong numbers for a mature retail brand with an already-optimized email programme.
- **Same-Day Delivery Under Pressure.** Retail moves fast, and NEXT's promotional calendar didn't wait. I managed the full cycle from stakeholder brief to live deployment within same-day windows — building responsive microsites, updating campaign pages, and ensuring everything was on-brand and functional before the promotion went live. This required a combination of technical speed (clean code under pressure) and design judgment (making quick decisions that held up).
- **Visual Consistency Across Every Touchpoint.** I directed all visual design decisions — colour, typography, illustration, layout — ensuring brand consistency across campaigns while producing pixel-perfect creatives in Photoshop, InDesign, and Adobe XD. Every asset, from a banner ad to a landing page, met NEXT's brand standards without requiring design review cycles that the timeline didn't allow.

**Stack:** HTML/CSS · jQuery · Email Marketing · Adobe XD · Photoshop · InDesign · IBM Silverpop · Responsive Design

---

### 4.7 Technical Executive — Vodafone
**Pune, India · Jan 2016 – Jan 2018**

My first role working with large-scale enterprise systems. Managed defect lifecycles in Siebel CRM across multiple product releases, building the structured analytical thinking and stakeholder communication skills that became foundational to everything that followed.

- **Reducing Defect Recurrence Through Root-Cause Analysis.** Contract-change failures were recurring across releases without clear understanding of why. I performed systematic root-cause analysis on each failure pattern and applied targeted patches, reducing recurrence rates and shortening turnaround time for fixes. The approach shifted the team from reactive patching to preventive debugging.
- **Making Technical Data Actionable for Stakeholders.** Engineering teams had the data but stakeholders didn't have the visibility. I built weekly bug-status dashboards in Excel and delivered trend analysis presentations that translated technical defect data into prioritisation guidance. Stakeholders could see release health at a glance and make faster, better-informed decisions about where to focus resources.
- **Safeguarding Production Through Disciplined Validation.** Every patch needed validation in an Oracle Citrix environment before reaching production. I managed this validation process across releases, ensuring service-level targets were consistently met and production stability was maintained during periods of active iteration.

**Stack:** Siebel CRM · Oracle Citrix · Excel Dashboards · Root-Cause Analysis · Defect Management · QA

---

### 4.8 Marketing Intern — TomTom
**Pune, India · Jun 2014 – Aug 2015**

My first professional role — providing defect management and technical analysis within TomTom's Siebel CRM environment. Built the foundations of structured problem-solving, stakeholder communication, and systematic quality assurance that I've carried through every role since.

- **Building Triage Processes from Scratch.** Incoming defect reports didn't have a consistent triage structure. I developed a standardised triage process for incoming reports across product releases, creating a framework that helped the team prioritise effectively and reduce time-to-resolution for critical issues.
- **Translating Technical Complexity for Decision-Makers.** Built reporting dashboards in Excel and delivered weekly stakeholder presentations that took raw defect data and turned it into clear prioritisation guidance. The focus was always on making technical information useful for people who needed to make business decisions, not just engineering decisions.

**Stack:** Siebel CRM · Oracle Citrix · Excel · Defect Triage · Stakeholder Reporting

---

## 5. Education

- **M.S. in Artificial Intelligence and Machine Learning** — Drexel University, College of Computing & Informatics · Philadelphia, PA · *2024 – Mar 2026*
- **Postgraduate Degree, Artificial Intelligence and Machine Learning** — IIT Jodhpur · *2024 – Present*
- **Diploma in Business Management** — NMIMS (Narsee Monjee Institute of Management Studies) · Pune, India · *2020 – 2021*
- **Bachelor of Computer Science** — G.H. Raisoni College of Engineering and Management · Pune, India · *2010 – 2015*

---

## 6. Certifications

- **Google UX Design Specialization** — Google · 2024
- **Understanding Research Methods** — University of London (Online Course) / SOAS · 2024
- **Journey Mapping for Users** — Nielsen Norman Group
- **Foundations of UX Design** — Google
- **Conduct UX Research and Test Early Concepts** — Google

---

## 7. Tech Stack

**Data Science & ML**
Python · R · SQL · scikit-learn · TensorFlow · PyTorch · pandas · NumPy · Matplotlib

**NLP & LLMs**
NLP · Hugging Face Transformers · ClinicalBERT · RoBERTa · Label Studio · LLM Evaluation

**Analytics & Experimentation**
Tableau · Qualtrics · Google Analytics · Hotjar · A/B Testing · Hypothesis Testing · Behavioural Segmentation · Multivariate Testing · Surveys · Behavioral Analytics · Heatmaps · Session Analysis · Clustering

**UX Research & Design**
Figma · Adobe XD · Illustrator · Photoshop · Canva · Usability Testing · Journey Mapping · Contextual Inquiry · Interviews · Guerrilla Testing · Diary Studies · Card Sorting · Affinity Mapping · Synthesis · Persona

**Frameworks & Ops**
Double Diamond · HCD · Design Thinking · Lean UX · Research Ops & Practice Building

**Engineering & Tools**
JavaScript · TypeScript · React · Next.js · HTML/CSS · Framer Motion · Git · MongoDB · Magento · Dreamweaver · VS Code

**Project Management**
Jira · Agile / Scrum · Confluence · Stakeholder Management

---

## 8. Case Studies

Eight in-depth case studies spanning NLP research, enterprise UX, personalization, accessibility engineering, and blockchain security. Each follows the same narrative arc: **Tension → Craft → Evidence → Growth.**

---

### 8.1 ABIM — Measuring Patient-Centered Communication with NLP

**Page:** `/work/abim` · **Category:** NLP & UX Research
**Role:** Data Scientist Co-op · **Team:** I/O Psychologists, Data Scientist, and AI/ML Engineer · **Timeline:** Co-Op (6 months)

#### Overview — Why Communication Measurement Matters, and Why It's Hard

**Skill constellation**
- *Primary:* NLP Pipeline Engineering · Transformer Fine-Tuning (BERT) · Rubric Design
- *Supporting:* Prompt Engineering · LLM-Assisted Labeling · Data Curation
- *Emerging:* Research Ethics & AI Governance · PHI De-identification

The American Board of Internal Medicine (ABIM) exists to certify physicians who demonstrate the knowledge, skills, and attitudes essential for excellent patient care. Communication behaviors — the "skills and attitudes in action" — are the hardest competency to quantify at scale. ABMS standards require boards to assess Interpersonal & Communication Skills and Professionalism as core competencies, but evaluating these behaviors traditionally depends on trained clinician raters manually scoring dialogue against rubrics — slow, expensive, and subject to inter-rater variability.

#### The Craft — From Rubric to Scalable Classifier

**The Pipeline.** Each step protects a specific standard: the rubric protects construct validity, seed labels protect interpretability, the LLM pass provides scale, and BERT provides reproducibility at near-zero cost.

1. **Rubric Design** — Construct-specific scoring criteria aligned to Calgary-Cambridge and NURSE frameworks.
2. **Seed Labels** — 8–10 exemplar excerpts per construct, manually annotated in Label Studio.
3. **Prompt Engineering** — Construct-specific prompts with rubric definition, inclusion/exclusion criteria, and structured output.
4. **LLM Labeling** — Scale annotation across ~985 conversations, one construct at a time to reduce contamination.
5. **BERT Training** — Fine-tuned encoder for cheap, scalable inference with audit-friendly probability outputs.

**Frameworks:** Calgary-Cambridge Guide (6-step consultation model) and NURSE (Naming, Understanding, Respecting, Supporting, Exploring) for empathic communication.

**Baseline → Target**

| Dimension | Baseline | Target |
|---|---|---|
| Manual annotation consistency | Variable ICC | Rubric-anchored |
| Labeling scalability | ~50 convos/week | 985 convos labeled |
| Cost per inference | LLM API costs | BERT (near-zero) |

#### Dataset Sources
We aggregated ~985 conversations from four complementary sources, balancing real-world realism with benchmark coverage:

| Source | Real vs Simulated | Contribution | Labeling Implication |
|---|---|---|---|
| ACI-BENCH | Mixed simulation / role-play | Benchmark-style transcripts with clinical documentation behaviors | Can introduce "dictation" language that confounds Calgary constructs |
| VHA 4C Lineage | Real recorded encounters | Real-world primary care dynamics and patient context clues | Strongest realism anchor; supports patient-centered measurement framing |
| OSCE Simulated Interviews | Simulated (audio + transcripts) | High-quality respiratory-focus transcripts, domain-labeled | Good for NER and general NLP; limited vs real-world nuance |
| PriMock57 | Simulated mock primary care | Multi-artifact dataset (audio, transcripts, notes, eval) | Useful for benchmarking communication-to-note pipelines |

**Key methodological decisions**
- **🎯 One Construct at a Time.** We labeled each Calgary or NURSE construct independently across all encounters — simpler prompts, less cross-construct contamination.
- **📐 Prompts as Measurement Tools.** Each prompt included: rubric definition, inclusion criteria, exclusion criteria, borderline examples, and required structured output — reducing free-text ambiguity and supporting ethical scaling.
- **🔄 Simulated → Real Pivot.** Synthetic scripts contain explicit structure that real encounters lack. We incorporated VHA 4C real encounters as the realism anchor.

**Skill spotlights**
- *Rubric Design* — Translated two clinical communication frameworks into construct-level scoring rubrics with inclusion/exclusion criteria and borderline examples. Evidence: 11 distinct construct rubrics reducing subjective interpretation.
- *Data Curation & Source Evaluation* — Evaluated 4 transcript corpora across realism, domain coverage, and labeling implications. Made the strategic call to anchor on real-encounter data.
- *Prompt Engineering for Measurement* — Designed prompts that function as measurement instruments, not generation prompts.
- *LLM-Assisted Labeling at Scale* — Used LLMs as scalable annotators constrained by rubric-grounded prompts. 985 conversations × 11 constructs labeled, replacing months of manual work.
- *Transformer Fine-Tuning (BERT)* — Fine-tuned BERT encoder for per-construct classification with probability outputs. Near-zero inference cost replacing expensive LLM API calls.

#### The Evidence — What We Built and Learned

| Metric | Value |
|---|---|
| Conversations labeled | **985** — Construct-wise labels (Calgary 6-step + NURSE 5-step) across aggregated corpus |
| Communication constructs | **11** — Each with explicit scoring criteria, rubric boundaries, and exemplar annotations |
| Pipeline | Reusable framework: end-to-end rubric → seed → LLM → BERT, transferable to other domains |
| BERT | Trained classifier with per-construct probabilities enabling audit-friendly formative feedback |

**Successes — engineering + measurement achievement**
We operationalized two widely used communication frameworks into measurable constructs with explicit scoring criteria — reducing subjectivity and enabling scalable, reusable labeling.

- ✅ *Rubric Operationalization* — Translated Calgary-Cambridge and NURSE into construct-level scoring rubrics with borderline examples.
- 🔁 *Scalable Pipeline* — A labeling pipeline that can be reused by future co-ops and extended to other communication domains beyond internal medicine.

**Known gaps**
- 🔍 *Gold-Standard Validation* — Stronger human-annotation validation sets and slice-based fairness checks are needed before any higher-stakes use.
- 📊 *Cross-Source Generalization* — Per-construct performance across simulated vs. real data sources needs explicit evaluation and reporting.

#### The Growth — What We Recommend *Not* Doing

ACGME explicitly warns that Milestones are an educational, formative assessment tool and were **not** designed for high-stakes external decisions (credentialing / licensing). Automation can introduce false precision, biased measurement, and misuse risks. These governance constraints shaped our entire framing.

- 🚫 **Don't** present output as a "Milestone Score." Never make automated output determinative for advancement or credentialing without full governance review and validation.
- ⚠️ **Don't** rely only on simulated data. Simulated/roleplay corpora cannot fully represent clinical realism.
- 🔬 **Don't** skip label quality monitoring. Training BERT on raw LLM labels can cause instability and training plateaus. Monitor training variance; consider entropy filtering, ensembling, or human fallback for ambiguous samples.
- 📉 **Don't** report only "overall accuracy." Communication constructs are sparse and imbalanced. Report per-construct precision/recall/F1, calibration metrics (ECE), and run-to-run variance.

**Core limitations**
- 🎙️ *Text-only signal* — Transcripts omit nonverbal cues, physical examination actions, and many contextual behaviors.
- ⚖️ *Fairness risks* — Language style varies across cultures, dialects, and literacy levels. Automated scoring must be audited by demographic slices.
- 🔄 *Label noise propagation* — LLM labels are not gold. Error propagation from LLM→BERT can cause instability.

**What I'd do differently.** Build human validation sets earlier. The rubric **is** the product, not the classifier — weeks of rubric iteration paid off more than any model tuning.

> *Disclaimer: This case study documents NLP research conducted during an ABIM Co-Op. The project is framed as formative, developmental research — not as a validated clinical assessment tool. All governance recommendations follow ACGME Milestone usage guidelines.*

---

### 8.2 John Deere — PM Design Thinking

**Page:** `/work/design-thinking` · **Category:** UX Research Case Study
**Role:** Lead UX Consultant · **Team:** 2 UX Researchers, 1 Tech Lead, 1 PM · **Timeline:** 12 weeks

#### The Starting Point — A Systems Problem Nobody Was Naming

**Skill constellation**
- *Primary:* Contextual Inquiry · Workshop Facilitation · Organizational Change Management
- *Supporting:* Persona Development · Affinity Mapping · Usability Testing (SUS)
- *Emerging:* Stakeholder Mapping · Co-creation Methods

At John Deere, Product Managers are the connective tissue between users, engineering, and business strategy across a **250+ product** portfolio. But observations revealed a critical gap: PMs were making decisions about user-facing features without a shared UX language. Research findings sat in slide decks, and usability results arrived too late to impact development.

**The Challenge:** Equip PMs with UX frameworks and collaborative workflows so they can confidently lead user-centred design, moving from ad-hoc practices to systematic execution.

#### The Evidence — Measurable Cultural Shift

Impact of deploying the *PM-UX Playbook* pilot to a 50-person cohort over 4 weeks:

| Metric | Result |
|---|---|
| UX confidence | **80%** — participants reported greater confidence interpreting research deliverables |
| Faster specs | **25%** reduction in average time to complete feature specifications |
| Forum threads | **120** threads started in month one (peer learning happened organically) |
| Buddy retention | **10 / 12** mentorship pairs voluntarily continued beyond the pilot |

#### The Craft — Double Diamond Framework

**Phase 1 — DISCOVER (Diverge) — Going Wide**
- 15 contextual interviews with mid-to-senior PMs
- Shadowed planning meetings & backlog refinements
- Stakeholder mapping across PMs, UX, Engineering, Leadership
- Affinity mapping in Miro (3 macro-clusters emerged)

**Phase 2 — DEFINE — What The Research Revealed**
15 contextual interviews revealed structural gaps that showed up consistently across product lines:

| Gap | Prevalence |
|---|---|
| No shared UX language | 90% |
| Research arrived too late | 80% |
| PMs solving UX problems alone | 75% |
| Technical confidence gap | 65% |
| No career pathway at intersection | 55% |

Research synthesised into **"Rajesh"**, capturing the composite behaviours and frustrations of our target PMs. Identifying his true baseline was critical: they needed collaboration templates, not UX encyclopedias.

**Persona — Rajesh, The Product Manager**
- *Demographics:* 38 yrs old · 4 years as PM · loves to read, travel, and play cricket · extrovert · married with 2 kids
- *Behaviors:* willing to learn/upskill · workaholic · seeks advice from other PMs or GPMs · keen on leadership
- *Expectations / gains:* wants to understand career options for PM · UX support · set path and direction for new PMs · gain better understanding on the technical side
- *Pain points / challenges:* benchmarking/repository of best practices · no PM forums · doesn't know how to utilize P&C team · needs help with research · doesn't know how to analyze data · doesn't know how to proceed in career/aim · technical challenges from non-tech background · finding the right courses for PMs

**Rajesh's baseline proficiency:** Research Interpretation 20% · Design Critique 15% · UX Vocabulary 30% · User Empathy 45%

**Phase 3 — DEVELOP — Four Solutions from Co-creation**
Co-creation sessions generated 40+ ideas, narrowed to four high-impact concepts designed to integrate into existing workflows:

1. **PM-UX Playbook** — Template-driven heuristic guides.
2. **Buddy-Up Programme** — Quarterly UX/PM collaboration pairs.
3. **Community Forum** — Internal platform for sharing templates & wins.
4. **Micro-Learning** — 5-min UX concepts delivered via Slack & Jira.

**Phase 4 — DELIVER — Testing in the Real World**
Tested directly during actual monthly planning workshops. The key insight: *contextual timing is everything.*

- Simplified navigation: merged "Learn" and "Templates" into a workflow-staged "Resources" hub.
- Contextual prompts: added "Use this when…" tips to all UX Playbooks.

SUS score: **78** validated usability; qualitative feedback drove the contextual-timing iteration.

> *"Now I know when to use this, not just that it exists."* — PM participant, Round 2 testing

**Skill spotlights**
- *Stakeholder Mapping* — Mapped the full ecosystem of PMs, UX, Engineering, and Leadership to identify the highest-leverage intervention points.
- *Contextual Inquiry* — Conducted 15 interviews AND shadowed real planning meetings.
- *Persona Development* — Synthesized interview data into 'Rajesh' with quantified baseline scores.
- *Affinity Mapping* — Clustered raw interview data into 3 macro-themes.
- *Workshop Facilitation & Co-creation* — Designed and facilitated 2 co-creation workshops (40+ ideas → 4 feasible solutions).
- *Usability Testing & SUS Scoring* — Tested during actual planning workshops, not lab settings.

#### The Growth — Key Learnings & Next Steps

**What worked**
- **Embedded learning beats standalone training.** PMs have time for a 5-minute module between meetings but not a 2-hour workshop.
- **Community drives adoption faster than mandates.** The forum took off because PMs shared real wins with peers who understood their context.
- **Contextual research reveals what surveys cannot.** Shadowing PMs in their actual meetings surfaced friction points interview questions alone would never have found.

**What happened next**
- *Scale & personalise* — role-based learning tracks for data-driven PMs versus platform PMs.
- *Measure ROI* — connecting UX literacy to downstream business metrics like conversion lift and support tickets.
- *Extend to product ops* — folding in analytics playbooks and A/B testing frameworks.

The community forum is still active. The Buddy-Up programme is in its third cohort. And the phrase *"What does the research say?"* is now heard in sprint planning meetings across the organisation.

---

### 8.3 Healthcare Bias — NLP Detection

**Page:** `/work/healthcare-bias` · **Category:** Data Science & ML Engineering
**Role:** Data Scientist Co-op · **Team:** 1 Data Scientist Co-op, 1 Advisor · **Timeline:** Sept 2025 – Present

#### Overview — Building ML Pipelines to Surface What Clinicians Can't See at Scale

**Skill constellation**
- *Primary:* NLP Pipeline Design · Gold-Standard Annotation · LLM Evaluation
- *Supporting:* Transformer Fine-Tuning (ClinicalBERT, RoBERTa) · Synthetic Data Generation
- *Emerging:* Ethics in AI · HIPAA Compliance · Bias Taxonomy Design

The American Board of Internal Medicine certifies over 300,000 physicians. Part of their mission involves evaluating how physicians communicate, reason, and make decisions. However, humans are susceptible to unconscious biases — structural biases, clinical stigma, and assumptions baked into medical training. These biases are nearly invisible at an individual level; it's only at scale that patterns emerge.

**Tools:** Python · PyTorch · Hugging Face · Label Studio · ClinicalBERT · RoBERTa · GPT-family LLMs

#### The Tension — Why This Project Exists
Assessment of clinical communication quality previously relied on manual review — subjective, slow, and inconsistent. Without a shared classification system, tracking patterns or measuring the prevalence of bias was nearly impossible. The question wasn't *whether* bias exists in healthcare communication, but whether we could build a system that detects it reliably, automatically, and at the scale ABIM needs to act on it.

#### The Craft — What I Built and Why

**Experiment 1 — NLP Bias Detection**
A 4-label classification framework developed iteratively with domain experts and validated against clinical literature.

| Label | What It Captures | Example Signal |
|---|---|---|
| Structural Bias | Systemic patterns reflecting institutional or socioeconomic inequities | Assumptions about treatment adherence based on patient demographics |
| Clinical Stigma | Language or framing that reflects prejudice toward specific diagnoses or populations | Dismissive tone toward patients with substance use disorders or mental health conditions |
| Diagnostic Framing Bias | Asymmetric language when describing similar clinical presentations across patient groups | Different urgency or thoroughness in workup descriptions based on patient characteristics |
| No Bias Detected | Communication that meets equitable standards | Consistent, patient-centred language regardless of demographics |

**Model selection: ClinicalBERT vs. RoBERTa.** I fine-tuned and compared both. Both performed well on binary tasks; differentiation appeared in granular classification. ClinicalBERT excelled with dense medical terminology, while RoBERTa provided consistent robustness.

**Experiment 2 — Communication Behaviour Detection.** Beyond bias, I built supervised models to detect evidence-based behaviors like Calgary-Cambridge, NURSE Protocol, and SHARE Approach — structural patterns in doctor-patient dialogues.

**Experiment 3 — LLM Evaluation Framework.** Before trusting LLMs with internal tasks like SQL generation, we needed to quantify their accuracy. I built a pipeline measuring hallucination rates, logic errors, and schema fidelity across varying query complexities.

**Experiment 4 — Synthetic Data Engineering.** To solve healthcare data privacy (HIPAA), I designed an automated synthetic data loop creating high-quality dialogues for training without touching real PHI.

**Skill spotlights**
- *Bias Taxonomy Design* — Domain-specific 4-label framework operationalizing abstract bias concepts into measurable text signals. Categories not found in existing NLP bias benchmarks.
- *Gold-Standard Annotation Protocol* — Guidelines with inclusion/exclusion criteria, borderline examples, and inter-annotator agreement measures.
- *LLM Evaluation* — Systematically evaluated LLM outputs against human gold-standard labels, measuring category-specific failure modes.
- *Synthetic Data Generation* — Engineered synthetic clinical transcripts to augment scarce training data without touching real PHI.

#### Technical Architecture — Interconnected Infrastructure

- **Bias Detection** — ClinicalBERT + RoBERTa ensemble · 4-class bias classification · Confidence scores
- **Behaviour Classifier** — Supervised NLP model · Turn-level detection
- **Evaluation Engine** — SQL generation benchmarks · Hallucination metrics · Deployment confidence
- **Synthetic Loop** — LLM generation + validation · PHI-free training data · Reproducibility datasets

*Ensemble Model Architecture* — combined domain-specific ClinicalBERT with general-purpose RoBERTa in a 4-experiment design isolating detection, behavior, LLM quality, and data.

#### Ethics & Privacy — Trust Through Transparency
Every design decision adhered to **HIPAA compliance**, **Common Rule/IRB standards**, and **Belmont Principles**. The system is designed to recommend and surface patterns for human review — not to act as a black-box decision maker.

#### The Evidence — Evidence-Based Impact
- **Scalable throughput** — Thousands of records processed automatically versus ~50 manually.
- **Deterministic consistency** — Reproducible classifications across all cohorts.
- **Privacy-first data pipeline** — Unlimited iteration via synthetic data engineering.
- **Quantified accuracy** — Documented error and hallucination rates for LLMs.

#### The Growth — Key Learnings
- **Taxonomy design is the hardest part.** Weeks of iteration with domain experts on the framework paid off more than model tuning did.
- **Healthcare AI must earn trust.** Confidence scores and human-in-the-loop review are not optional features; they are foundational requirements for clinical adoption.

> *Disclaimer: This project documents research conducted at ABIM. All publicly shared artifacts use synthetic data.*

---

### 8.4 Stories by Children — Platform Redesign

**Page:** `/work/stories-by-children` · **Category:** UX Research & Design
**Role:** Lead IA & UI Designer · **Team:** 1 Designer, 1 Developer, 1 Stakeholder · **Timeline:** 6 weeks

#### Overview — 60% of Users Never Reached a Story

**Skill constellation**
- *Primary:* Information Architecture · Usability Testing · User Research with Families
- *Supporting:* Lean UX · Rapid Prototyping
- *Emerging:* Design for Children · Accessibility

Stories by Children is an online platform where young readers aged 6–12 discover stories and budding writers aged 7–17 share original work. It's a space families and educators rely on to nurture creativity — but the platform was quietly failing its users. Analytics told the story: **60% of users dropped off** before reaching a story listing. Parents trying to upload work got lost. Styling varied wildly. There were no visual cues for age-appropriate content. The platform had heart — its UX was the problem.

**Approach:** Lean UX sprints + Double Diamond framework — research with real families, rapid prototyping, two validation cycles.
**Audience:** Young readers (6–12), aspiring writers (7–17), parents & educators managing content and uploads.

#### The Craft — Testing With Real Families
I recruited family units — children alongside their parents — for moderated usability testing followed by contextual interviews. Testing with families *together* was deliberate: it revealed the natural dynamics of how children and adults collaborate when browsing and submitting content.

**Three signals from children**
- 🎨 **Colour = Fun.** Kids responded positively to vibrant layouts. White = boring. Visual richness drove perceived fun.
- 🏆 **Recognition = Motivation.** Being featured as a 'winner' or seeing their profile displayed was a powerful motivator.
- 👫 **Peers = Trust.** Kids engaged far more with content from children they knew. Familiarity drove discovery.

**The critical parent finding.** Parents consistently broke down at the upload workflow. They couldn't place their child's submission in the right section, didn't understand the review process, and frequently abandoned the flow entirely. This wasn't friction — it was a complete barrier to contribution.

#### Research → Design — How Every Insight Became a Design Decision

| Research Insight (source) | Design Decision |
|---|---|
| Children called plain white layouts 'boring' and engaged 3× more with colourful interfaces. *(Usability sessions, ages 7–11)* | **Vibrant, illustration-rich visual system** — Bold colour blocks, playful illustrations, and gradient accents across every page. |
| Kids lit up when asked *"What if your picture was on the website?"* — being seen was the strongest motivator. *(Contextual interviews, post-task)* | **Contributor spotlights & winner sections** — Prominent 'Winners' and 'Featured Authors' sections with children's photos and names on the homepage. |
| Children explored 4× more content when it was created by someone they recognised or related to. *(Behavioral observation during testing)* | **Peer-based content feeds** — 'Stories by Kids Like You' and age-matching recommendation surfaces to leverage social trust. |
| 100% of parents failed to complete the upload flow. They got lost between sections and abandoned. *(Task failure analysis, all parent participants)* | **Guided step-by-step upload wizard** — Linear wizard with progress bar, category picker, preview, and clear confirmation at every step. |
| No visual cues helped parents or children identify age-appropriate content at a glance. *(Heuristic analysis + parent interviews)* | **Colour-coded age-group badges** — Every story card and section header displays a colour-coded age badge. |

**Skill spotlights**
- *User Research with Children & Families* — Adapted methods for child participants (shorter sessions, visual prompts, parent co-participation). 5 distinct insights, each mapped to a design decision.
- *Information Architecture* — Task success 50% → 85%; navigation depth 4+ clicks → 1–2 clicks.
- *Rapid Prototyping* — Two rapid Lean UX sprint cycles completed within the 6-week constraint.

#### The Platform Experience — Key Screens

- 🏠 **Homepage** — Featured stories, winner spotlights, and age-filtered browsing within one scroll.
- 📖 **Reading Page** — Large type, playful accents, minimal chrome. Designed for immersion.
- 📚 **Bookstore** — Cover-forward grid with author photos. Peer discovery through visual browsing.
- 🏅 **Reading Challenges** — Progress tracking, milestone badges, and leaderboards that gamify engagement.
- ℹ️ **About & Trust** — Warm, transparent page explaining safety, editorial review, and community values.

#### Validation: 50% → 85% Task Success

Prototypes were tested through moderated sessions with real families. Two rapid Lean UX sprint cycles improved task success from 50% to 85%.

| Metric | Baseline | Target |
|---|---|---|
| Task success rate | 50% | **85%** |
| Navigation depth to stories | 4+ clicks | **1–2 clicks** |
| Upload completion (parents) | Broken | **End-to-end** |

#### The Evidence & Growth — The Numbers After Launch

- **+40% page views** in the first month post-launch.
- **+25% story submissions** — upload volume from young contributors.
- **70% category exploration** — new users exploring 2+ categories per session.
- **50% → 85% task success** across moderated usability testing.

**What came next.** Post-launch heatmaps confirmed contributor spotlights and peer content feeds are the most-interacted elements. The roadmap now includes multi-language support, educator-focused reading-level filters, peer feedback features, and enhanced accessibility.

**Key growth learnings**
- Designing for children requires fundamentally different IA thinking.
- Lean UX works when committed to real users, not just fast timelines.
- Insight-to-decision mapping makes design rationale transparent and defensible.

> *Visit the live platform at storiesbychildren.com.*

---

### 8.5 E-Commerce Personalization at Scale (Arcadia / Wallis)

**Page:** `/work/personalization` · **Category:** UX Personalization & Data Strategy
**Role:** UX Personalization Specialist · **Team:** Capita, Qubit, Wallis · **Timeline:** Jan 2018 – Oct 2022

#### Overview — Designing Conversion Strategies for Wallis

**Skill constellation**
- *Primary:* Behavioral Segmentation · A/B Testing & Experimentation · Real-Time Personalization
- *Supporting:* Funnel Diagnostics · Campaign Mirroring · Statistical Rigor
- *Emerging:* Ethical Persuasion Design · Audience Empathy

The project focused on bridging the gap between high-volume marketing and generic website experiences. For Wallis, the challenge wasn't a lack of traffic; it was that a vast number of shoppers saw exactly the same experience, leading to significant revenue leakage. As a Personalization Specialist embedded within Qubit's London team, I designed and implemented real-time behavioral interventions for the Wallis website, turning generic sessions into contextually relevant journeys.

#### The Tension — What the Data Revealed
Before designing interventions, I mapped behavioral data across the portfolio. Three critical friction points emerged as the primary sources of conversion loss.

1. **The Disconnected Journey.** Email campaigns drove massive spikes, but the website remained "unaware" of why the visitor was there. Discount code usage was significantly lower than open rates because the site failed to remind customers of the offers they'd clicked on.
2. **Dead Ends.** Empty bags and zero-results search pages functioned as exits. Instead of recovering the session, the site simply displayed a "Sorry" message, abandoning thousands of daily visitors at the point of intent.
3. **One Size Fit Nobody.** First-time international visitors saw the same homepage as loyal UK customers. Despite having the data, the sites provided no acknowledgement of history or context.

Diagnosis: these websites weren't broken. They were *generic*. And in e-commerce, generic is broken — it just breaks quietly, one lost session at a time.

#### The Craft — Building a Systematic Approach
To move beyond scattered A/B testing, I developed a four-layer framework that addressed friction at every stage of the funnel.

**1. Campaign Mirroring** — *Principle: the website should know what brought the customer there.*
- Dynamic banners on product pages reinforcing email offers.
- In-bag reminders of active discount codes.
- Pre-populated codes at checkout to reduce friction.

**2. Behavioural Triggers** — *Principle: real-time data should power moments of urgency and proof.*
- Urgency messaging grounded in real inventory velocity.
- Geo-specific social proof (e.g., *"Trending in Chicago"*).
- Threshold nudges for free shipping qualification.

**3. Recovery & Re-engagement** — *Principle: turn dead ends into opportunities.*
- Personalized product carousels on empty bag pages.
- Recommendation engine backup for zero-results search.
- Checkout simplification for high-friction segments.

**4. Segmented Experiences** — *Principle: different customers deserve fundamentally different journeys.*
- Orienting onboarding for non-digitally native audiences.
- Tailored promotions based on user segments.
- Product prioritization based on IP-detected location.

#### Implementation — Rigorous Execution
Implementation wasn't just about UI changes — it was about statistical rigour. We introduced **10% blank-ad control groups (placebos)** to calculate true incremental ROI, moving from correlation to causation. We synchronized on-site messaging with a relentless daily promotional calendar, ensuring creative was always aligned with the trade plan.

**Skill spotlights**
- *Funnel Diagnostics* — Diagnosed 3 friction patterns that accounted for the majority of revenue leakage.
- *Behavioral Segmentation* — Segments from behavioral signals, not just demographics. Real-time triggers responded to in-session actions.
- *Real-Time Personalization* — Interventions that responded to in-session behavior, not pre-defined user segments.
- *A/B Testing & Statistical Rigor* — 10% blank-ad control groups isolating true incremental lift from confounds.

#### The Evidence — Measuring the Lift
- **11% ↑ conversion lift** — significant revenue lift driven by targeted segments and geo-social proof.
- **Increased campaign ROI** — vast reduction in leaked conversion via mirroring.
- **Improved UX simplicity** — increased engagement through orienting onboarding.
- **Site-wide deployment scale** across all key funnels.

> *"Personalization is helping us build relationships with our customers that translate into increased engagement, loyalty and revenue."* — Simon Pritchard, Arcadia Group Digital Director

#### The Growth — Key Learnings

- **Complexity ≠ Impact.** The most impactful interventions were often the simplest: code reminders and dead-end recovery. Clarity consistently beat sophisticated algorithms in driving immediate ROI.
- **Honest Scarcity Wins.** Fake countdowns erode trust. Grounding urgency in real inventory data ensured that signals remained useful and respected over the long term.
- **The Audience Lesson.** Personalization isn't just about adding more — it's about adding the right thing. For less digitally native users, "good personalization" meant restraint and orientation. It shifted my perspective from extracting value to genuinely helping the user, making *"Is this better for the person?"* my primary design filter.

> *Disclaimer: This case study documents personalization design conducted with Qubit for Wallis. Proprietary metrics have been generalized for confidentiality.*

---

### 8.6 John Deere — Enterprise Survey Logic & Analytics

**Page:** `/work/john-deere` · **Category:** UX/UI Case Study
**Role:** Product Designer · **Team:** 1 PM, 2 Developers, 1 Designer · **Timeline:** 8 weeks

#### Overview — The 2-Hour Survey Tax

**Skill constellation**
- *Primary:* Interaction Design · User Research · Information Architecture
- *Supporting:* Inline Logic Design · Design Systems
- *Emerging:* Enterprise UX · Self-Serve Platform Design

John Deere's 250+ products all need user feedback. But building a single survey took **~120 minutes** of back-and-forth between a Product Manager and an engineer — filing tickets, reviewing builds, requesting changes. For an organisation that needs feedback constantly, this wasn't just inefficient. It was a bottleneck slowing down product decisions across the entire company.

Before touching a pixel, I set three baseline metrics with the product owner so we'd know whether we actually succeeded:

| Metric | Baseline | Target |
|---|---|---|
| Time to build a survey | ~120 mins | **< 48 mins** |
| User satisfaction (CSAT) | 3.8 / 5 | **> 4.25 / 5** |
| Survey completion rate | 50% | **> 62.5%** |

#### The Craft — How UX Research Reshaped the Entire Workflow
I started with 45-minute semi-structured interviews across product owners, engineers, and UX researchers — everyone who touched a survey. The finding that changed the project came from observing users building branching logic: they had to save their question, switch to a separate "Logic Rules" tab, manually look up question IDs, and write conditional rules by hand. This cognitively heavy process led to a **60% drop-off rate** when building complex surveys.

**The solution.** I fundamentally restructured the mental model. By introducing an **Inline Branching UI** directly on the Question Card, users could define rules contextually without ever leaving the builder canvas.

| Before (Legacy Workflow) | After (Redesigned Workflow) |
|---|---|
| Create Question 1 | Create Question 1 |
| Save & Switch to 'Logic' Tab *(context switch)* | Click 'Add Branch' Inline *(zero context switch)* |
| Lookup Question ID (Q1) *(high cognitive load)* | Select Target (Q4) from Dropdown *(visual mapping)* |
| Write Rule: If Q1 = Yes, goto Q4 | — |

Fragmented cognitive load replaced by contextual execution — branching rules defined directly inline with the question, dropping cognitive load entirely. Round 2 testing confirmed that hesitation around branching dropped to **zero**.

#### The Interface — Designing a Self-Serve Platform
Research revealed four core capabilities the platform needed:

- Drag-and-drop question builder
- Inline branching logic
- Real-time preview with John Deere branding
- Analytics dashboard that eliminated the manual CSV-to-Excel pipeline entirely

**Solving the analytics dead zone.** The old process: export a CSV, open Excel, build a chart, share it in an email. By the time insights reached decision makers, the data was stale. I designed an **expandable data table** — expanding a survey row reveals interactive analytics right where PMs track their surveys. No separate reports page. No context switch.

**Skill spotlights**
- *Metric-Driven Design* — 3 measurable targets defined pre-design; all exceeded post-launch.
- *Contextual User Research* — Observation uncovered the branching logic pain point that interview questions alone missed.
- *Inline Logic Design* — Replaced tab-switching workflow with contextual inline branching.
- *Analytics-in-Context Design* — Insights accessible in one click, not a multi-step export workflow.

#### The Evidence & Growth — Every Baseline Target Was Exceeded

Pilot: 50-person PM cohort across four product lines, tracked over 4 weeks.

| Metric | Result |
|---|---|
| Creation Time | **−60%** — Survey build time dropped from ~120 minutes to just 48 minutes |
| Completion Rate | **+25%** — Jumped from 50% to 62.5% due to better logic and branding |
| User CSAT | **+16%** — Platform satisfaction hit 4.4 / 5 |
| Self-Serve Adoption | **100%** — Completely eliminated engineering dependency for routine surveys |

> *"I can spin up a survey in under five minutes — no coding needed."* — Product Manager, Pilot Participant

**What came next.** The pilot's success led directly to funding for Multi-Language Support, Advanced Cross-Tabulation Analytics, a permanent Template Library, and full CRM integrations. A tool meant to solve a 2-hour bottleneck became the foundation for how John Deere listens to its users.

> *Disclaimer: This case study documents design and research work conducted at John Deere. Metrics and details have been shared with permission. Visual assets have been omitted to respect internal confidentiality.*

---

### 8.7 GesturePro — Real-Time Sign Language Translation

**Page:** `/work/gesturepro` · **Category:** AI / Accessibility
**Role:** Full-Stack Developer & ML Engineer · **Team:** 4 Engineers · **Timeline:** Ongoing

#### Overview — Breaking the Communication Barrier

**Skill constellation**
- *Primary:* Computer Vision (MediaPipe) · ML Model Training (TensorFlow) · Full-Stack Engineering
- *Supporting:* Real-Time Inference · Docker Containerization
- *Emerging:* Accessibility Engineering · Open-Source Development

**Stack:** Next.js · FastAPI · Python · TensorFlow · MediaPipe · PostgreSQL · Docker · Vercel
**Links:** Live Demo · GitHub

GesturePro is an interactive sign language translator that empowers hearing-impaired and aphonic individuals by using advanced AI to instantly translate sign language gestures into real-time text and speech. The platform uses computer vision and deep learning to recognize hand gestures through a webcam feed and convert them into readable text — bridging the communication gap in real time.

**Problem.** Hearing-impaired individuals face daily communication barriers. Existing translation tools are either expensive, non-real-time, or require specialized hardware.

**Solution.** A browser-based, real-time sign language translator using just a webcam — no special hardware needed. Powered by ML hand-tracking and gesture recognition.

#### The Craft — Full-Stack AI Architecture
A three-tier architecture — a Next.js frontend for real-time video capture, a FastAPI backend for authentication and data management, and an ML pipeline for gesture recognition. The entire system is containerized with Docker for consistent deployment.

- 🖥️ **Frontend — Next.js + TailwindCSS.** Real-time webcam capture, video streaming UI, authentication flow, and responsive gesture translation display.
- ⚡ **Backend — FastAPI + PostgreSQL.** RESTful API with user authentication, session management, translation history storage, and health-checked Docker services.
- 🧠 **ML Pipeline — Python + TensorFlow.** Hand landmark detection via MediaPipe, processed training data, Jupyter notebooks for experimentation, and saved models for inference.

**Project structure**
```
gesturepro/
├── client/            # Next.js frontend (signin, signup, video capture)
├── server/            # FastAPI backend (auth, API, models, services)
├── ml/                # ML pipeline (notebooks, saved models, processed data)
├── data/              # Training datasets
└── docker-compose.yml # Full-stack orchestration
```

**Codebase stats**
- Languages: JavaScript 51.5% · Python 31.9%
- Codebase: 56 commits · 3 services
- Deployment: Docker Compose · Vercel + Cloud

#### Key Features — What GesturePro Does

- 📹 **Real-Time Video Capture.** Browser-based webcam access streams hand gestures directly to the ML model.
- ✋ **Hand Landmark Detection.** MediaPipe extracts **21 hand landmarks** per frame, creating a skeleton representation of hand position and finger orientation.
- 🤖 **AI Gesture Classification.** TensorFlow model classifies hand landmarks into sign language letters and words with real-time inference.
- 💬 **Instant Text Translation.** Recognized gestures are immediately converted to on-screen text, enabling fluid conversation without delays.
- 🔐 **User Authentication.** Secure sign-in/sign-up flow with session management, enabling personalized translation history.
- 🐳 **Containerized Deployment.** Docker Compose orchestrates all services with health checks.

**Skill spotlights**
- *Three-Tier System Design* — Docker Compose orchestration with health checks across 3 services.
- *Computer Vision Pipeline (MediaPipe)* — Real-time 21-landmark tracking powering gesture recognition at webcam speed.
- *ML Model Training (TensorFlow)* — Working real-time gesture → text translation pipeline.
- *Accessibility-First Engineering* — Open-source, zero-hardware-cost solution deployed on Vercel.

#### The Evidence & Growth — Accessibility Through Technology

- **Real-time translation speed** — gestures recognized and displayed as text within milliseconds of capture.
- **Zero hardware cost** — works with any standard webcam.
- **Full-stack production architecture** — containerized 3-tier system with auth, persistence, and ML inference.
- **Open source code** — fully available on GitHub for community contribution and extension.

**Future roadmap**
- 🌍 **Multi-language ASL support** — expand beyond ASL to include BSL, ISL, and other sign language systems.
- 🗣️ **Text-to-speech output** — add voice synthesis for two-way communication.
- 📱 **Mobile-first PWA** — Progressive Web App for on-the-go translation.
- 📊 **Learning analytics** — track user progress with personalized practice recommendations.

> *GesturePro is an open-source project. Contributions, feedback, and feature requests are welcome on GitHub.*

---

### 8.8 CryptoSecure — AI-Powered Smart Contract Security

**Page:** `/work/crypto-secure` · **Category:** Blockchain Security / ML Engineering
**Role:** ML/AI Engineering & Frontend · **Team:** 4 Members · **Timeline:** ~3 months
**Project type:** Graduate Team Project — Drexel University

#### Overview — Making Blockchain Security Accessible to Every Developer on the TON Network

**Skill constellation**
- *Primary:* Prompt Engineering for Security · Dual-Layer Analysis Architecture · Developer-Centric UX
- *Supporting:* Static Analysis · LLM Integration (GPT-4o) · React Frontend
- *Emerging:* Blockchain Security · Adversarial Thinking

**Stack:** Next.js · React · TypeScript · Tailwind CSS · Shadcn UI · OpenAI GPT-4o · Recharts · Vercel
**Links:** Live App · GitHub

#### The Problem — The Problem Nobody Was Solving
**14,995 vulnerabilities** were recently discovered across just **1,640 smart contracts** on the TON blockchain — more than **9 bugs per contract** on average. These aren't cosmetic bugs; they're security holes that let hackers drain wallets, steal funds, and exploit users.

The TON blockchain is exploding. Telegram's 900+ million users are being funnelled into a crypto ecosystem that's growing faster than the security infrastructure can keep up. Developers — many building their first smart contracts — are deploying code that handles real money. And the safety net doesn't exist.

- **Traditional option.** A professional security audit costs **$10,000–$50,000** and takes **2–4 weeks**. Impossible for independent developers, students, or small NFT teams.
- **Automated option.** Existing tools catch syntax errors — like spell-checking a legal document. They miss semantic vulnerabilities and logic flaws that get exploited.

Developers are left with a choice: spend money they don't have on a manual audit, or launch and hope for the best. We built CryptoSecure to eliminate that choice.

> Smart contract vulnerabilities aren't just technical bugs — they're real money at risk. A reentrancy flaw in a DeFi contract doesn't just cause an error, it lets someone drain the entire liquidity pool.

#### The Solution — What We Built
**CryptoSecure** (also called **TON Guardian**) is an AI-powered security scanner that analyses TON smart contracts in seconds, identifies vulnerabilities across **8+ categories**, explains them in plain English, and generates the actual code fixes — not just warnings, but working patches.

The experience is designed for developer velocity: **Upload → Analyse → Fix → Export.**

A developer drags in their FunC or Tact smart contract file. The AI engine scans it in under 30 seconds. A security score from 0 to 100 appears, with vulnerabilities broken down by severity (Critical/High/Medium/Low). Each finding comes with a plain-language explanation, affected lines, and a recommended fix with working replacement code. The developer reviews fixes in an interactive diff viewer — side-by-side comparison, colour-coded changes, accept/reject/edit suggestions — then exports a professional PDF audit report.

> What used to cost $10,000 and take a month now takes 30 seconds and costs nothing.

#### The Craft — Owning the Engine & Interface
In a team of four, I owned two areas: the AI/ML analysis pipeline and portions of the frontend interface.

**The AI Engine — Dual-Layer Architecture**

1. **Layer 1 — Static Analysis & Heuristic Engine.** Custom vulnerability database built from TONScanner research and known exploit patterns specific to TON. Catches deterministic issues; works without any API dependency; provides baseline detection.
2. **Layer 2 — AI-Powered Semantic Analysis.** OpenAI GPT-4o performing deeper semantic reasoning about the contract's logic. Understands the *intent* of the code, spots logical flaws not captured by pattern matching, and reasons about how different functions interact to create emergent vulnerabilities.

Static analysis is fast and deterministic but limited to known patterns. AI semantic analysis can catch novel vulnerabilities but can hallucinate or miss deterministic issues. Together, they're more reliable than either alone.

**Vulnerability categories detected**

| Category | What It Catches | Why It Matters on TON |
|---|---|---|
| Reentrancy | Functions called recursively before state updates complete | The #1 exploit vector in DeFi — the classic "drain" attack |
| Access Control | Missing permission checks on privileged functions | Allows unauthorised users to execute admin operations |
| Integer Overflow | Arithmetic operations that exceed data type bounds | Can manipulate balances, mint tokens, or bypass limits |
| Unchecked Returns | External calls whose return values aren't validated | Failed operations that proceed as if they succeeded |
| Gas Limit Issues | Operations that could exceed gas limits mid-execution | Transactions that revert after partial state changes |
| TON Defects | Vulnerabilities unique to FunC/Tact and TON | Issues not caught by tools designed for Ethereum/Solidity |
| Input Validation | Missing or insufficient validation of external inputs | Allows attackers to pass malicious data |
| Logic Errors | Semantic flaws in business logic | Requires understanding what the code is supposed to do |

**"Hacker Mode".** An advanced analysis mode (powered by GPT-4o with a dedicated API key) that goes beyond detection into adversarial thinking. It describes how an attacker would exploit each vulnerability, step by step — turning abstract vulnerability reports into concrete threat models.

**Frontend contributions.** I worked on the security score visualisation (Recharts), the vulnerability report display, and the integration between the analysis engine output and the UI components. The interface uses Shadcn UI + Tailwind CSS with a dark-mode aesthetic matching developer tooling context.

#### Design Craft — The Decisions That Mattered

1. **Plain English Over Error Codes.** Most security tools speak in jargon. We made a deliberate choice: every finding is explained in language a developer with no security background can understand.
2. **Fix It, Don't Just Flag It.** Every finding includes a remediation section with working replacement code. The interactive diff viewer shows vulnerable code on the left and patched code on the right.
3. **The Security Score as a Trust Signal.** The 0–100 score isn't vanity — it's designed to be shareable with investors, partners, and users to demonstrate a minimum security threshold.
4. **Sample Contracts for Education.** Pre-loaded vulnerable contracts let developers see the tool in action immediately, removing the "cold start" barrier while educating them about common vulnerability patterns.

> The best security tool is one that makes developers better at security — not just one that catches their mistakes. If a developer uses CryptoSecure ten times and starts writing more secure code on the eleventh, that's a bigger win than catching ten bugs.

#### Architecture

```
Developer Input
├── File Upload (.fc, .tact)
└── Code Paste (inline editor)
        │
        ▼
┌──────────────────────────┐
│ Static Analysis Engine   │  Layer 1: Pattern matching against
│ (Custom heuristics)      │  known vulnerability database
└──────────┬───────────────┘  (TONScanner research + known exploits)
           │
           ▼
┌──────────────────────────┐
│ AI Semantic Analysis     │  Layer 2: GPT-4o deep reasoning
│ (OpenAI API)             │  about logic, intent, and emergent
│                          │  vulnerability patterns
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Results Aggregation      │  Merge findings, deduplicate,
│ & Scoring                │  calculate severity-weighted
│                          │  security score (0–100)
└──────────┬───────────────┘
           │
           ├──▶ Security Score Dashboard (Recharts)
           ├──▶ Vulnerability Report (detailed findings)
           ├──▶ Auto-Fix Engine (patched code generation)
           ├──▶ Diff Viewer (side-by-side comparison)
           └──▶ PDF Report Export (audit-ready document)
```

#### Competitive Positioning

| Capability | CryptoSecure | Manual Audits | Existing Tools |
|---|---|---|---|
| Speed | 30 seconds | 2–4 weeks | Minutes |
| Cost | Free | $10k–$50k | Free–$1k |
| Explanation | Plain English with fixes | Technical reports | Error codes |
| Understanding | AI-powered reasoning | Human expertise | Pattern match |
| Accessibility | Any developer | Enterprise only | Sec-minded |
| TON support | Built for FunC/Tact | Varies | Almost none |
| Fix gen | Automatic patched code | Manual advice | None |
| Learning | Adapts to new exploits | Manual updates | Fixed rules |

#### The Evidence — What We Compressed

The value proposition is a compression ratio: **$10,000–$50,000 and 2–4 weeks** of manual audit → **30 seconds and $0**. That's not a marginal improvement — it's a category shift in who can afford to write secure smart contracts.

- **< 30s** analysis speed.
- **8+** vulnerability types detected, including TON-specific defects.
- **19** production deployments on Vercel ensuring continuous availability.
- **AutoFix generation** — working patched code for every detected issue.

Why it matters at scale: TON aims to onboard **500 million users by 2027**. That growth will be built on smart contracts written by thousands of developers — most without security budgets. CryptoSecure makes the difference between those contracts being audited or being deployed blind.

#### The Growth — Reflections & Next Steps

- **AI is a tool, not an oracle.** Layering static analysis under the AI engine — rather than relying on AI alone — was the most important design decision. GPT-4o is remarkably good at semantic reasoning but can hallucinate or produce overconfident assessments.
- **Explanation is a feature, not a nice-to-have.** A security tool that says "reentrancy vulnerability detected" is technically correct but practically useless to 80% of its audience. Making security knowledge accessible isn't UX polish — it's the core value proposition.
- **Developer experience drives adoption for developer tools.** The diff viewer, auto-fix engine, and one-click export aren't the "smart" parts of the tool — but they're why developers actually use it.
- **UX instincts shaped the ML output design.** Eight years of UX thinking directly influenced how the analysis engine presents findings: severity hierarchy, progressive disclosure, visual score dashboard — UX patterns applied to ML output.

**What's next**
- Expanded language support — extending beyond FunC and Tact to Solidity (Ethereum) and Move (Aptos/Sui).
- CI/CD integration — a GitHub Action / CLI tool that runs CryptoSecure as part of the deployment pipeline.
- Vulnerability knowledge base — a public, searchable database of TON vulnerability patterns feeding back into the analysis engine.
- Community-driven rule sets — allowing security researchers to contribute custom detection rules.

---

## 9. Contact

**Status:** `OPEN TO WORK` — *Looking for a UX Researcher?*

- **Email:** [shwetayeolesharma@gmail.com](mailto:shwetayeolesharma@gmail.com)
- **LinkedIn:** [linkedin.com/in/sharmashweta08](https://www.linkedin.com/in/sharmashweta08)
- **GitHub (portfolio):** [github.com/yeoleshweta/portfolio](https://github.com/yeoleshweta/portfolio)
- **Download CV:** [UX_Researcher_Resume.pdf](https://www.shwetasharma.tech/assets/UX_Researcher_Resume.pdf)

**Other projects referenced on the site**
- **PocketSaver** — [pocket-saver.vercel.app](https://pocket-saver.vercel.app/) · ([GitHub](https://github.com/yeoleshweta/PocketSaver))
- **Klyro Pro** — [klyro-pro.vercel.app](https://klyro-pro.vercel.app/)

---

## 10. Site Map

| Section | URL |
|---|---|
| Home | https://www.shwetasharma.tech/ |
| Projects (anchor) | https://www.shwetasharma.tech/#work |
| Work Experience | https://www.shwetasharma.tech/experience |
| Contact (anchor) | https://www.shwetasharma.tech/#contact |
| CV (PDF) | https://www.shwetasharma.tech/assets/UX_Researcher_Resume.pdf |
| Case Study — ABIM | https://www.shwetasharma.tech/work/abim |
| Case Study — PM Design Thinking | https://www.shwetasharma.tech/work/design-thinking |
| Case Study — Healthcare Bias | https://www.shwetasharma.tech/work/healthcare-bias |
| Case Study — Stories by Children | https://www.shwetasharma.tech/work/stories-by-children |
| Case Study — Personalization | https://www.shwetasharma.tech/work/personalization |
| Case Study — John Deere Survey | https://www.shwetasharma.tech/work/john-deere |
| Case Study — GesturePro | https://www.shwetasharma.tech/work/gesturepro |
| Case Study — CryptoSecure | https://www.shwetasharma.tech/work/crypto-secure |

---

*Document compiled from a full crawl of every page on [shwetasharma.tech](https://www.shwetasharma.tech/).*

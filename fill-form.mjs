#!/usr/bin/env node
/**
 * fill-form.mjs — Fully automated job application form filler + auto-submitter
 * Usage:
 *   node fill-form.mjs <slug>              — AUTO mode (default): fill → submit → log → notify
 *   node fill-form.mjs <slug> --review     — fill only, you click Submit
 *   node fill-form.mjs <slug> --debug-fields — dump field map, don't fill
 *
 * Flags automatically when human attention is needed:
 *   CAPTCHA | empty required fields | unfilled essay questions | submit errors
 *
 * All answers from config/answers.yml. Browser profile persists sessions/passwords.
 */

import { chromium }   from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { join }        from 'path';
import { homedir }     from 'os';
import { parse }       from 'yaml';

// ─── Load master answer sheet ──────────────────────────────────────────────────
const cfg = parse(readFileSync('config/answers.yml', 'utf8'));
const id  = cfg.identity;
const loc = cfg.location;
const lnk = cfg.links;
const cmp = cfg.compensation;
const aut = cfg.authorization;
const avl = cfg.availability;
const src = cfg.source;
const eeo = cfg.eeo;
const ans = cfg.standard_answers;
const res = cfg.resumes;

const CANDIDATE = {
  firstName:    id.first_name,
  lastName:     id.last_name,
  name:         id.full_name,
  email:        id.email,
  password:     id.password,
  phone:        id.phone,
  phoneIntl:    id.phone_intl,
  location:     loc.full,
  city:         loc.city,
  state:        loc.state,
  zip:          loc.zip,
  country:      loc.country,
  linkedin:     lnk.linkedin,
  portfolio:    lnk.portfolio,
  website:      lnk.website,
  salary:       cmp.target,
  salaryRange:  cmp.range,
  source:       src.default,
  workAuth:     aut.authorized_answer,
  visaNeeded:   aut.sponsorship_answer,
  citizenship:  aut.citizenship_answer,
  startDate:    avl.start_date,
  experience:   avl.years_of_experience,
  gender:       eeo.gender,
  race:         eeo.race,
  hispanic:     eeo.hispanic,
  veteran:      eeo.veteran,
  disability:   eeo.disability,
  about:        ans.about,
  whyResearch:  ans.why_ux_research,
  additional:   ans.additional_info,
  pronouns:     id.pronouns || '',
  relocate:     avl.willing_to_relocate || 'Yes',
  remotePref:   avl.remote_preference || 'Remote or Hybrid',
  defaultResume: res.default,
};

// ─── Per-role data ─────────────────────────────────────────────────────────────
const ROLES = {

  claylabs: {
    url:    'https://jobs.ashbyhq.com/claylabs/51f3f226-daeb-4476-b221-c30b9badf355',
    pdf:    'output/tailored-cvs/claylabs-senior-ux-researcher.pdf',
    why:    `Clay sits at a genuinely interesting inflection point: the company serves customers like Anthropic, Notion, and Google, just hit a $5B valuation, and is now scaling complex AI/agents features to both SMB and enterprise users. That combination — powerful automation capabilities meeting diverse personas with different mental models — is exactly the kind of research problem I find most compelling. The role's focus on AI/agents, data enrichment, and emerging automation features matches my current work: at ABIM, I design workflows that require annotators to navigate complex AI-assisted tasks, and I build the systems to measure where that breaks down. At John Deere, I built the research practice from scratch and created shared tools that served 250+ products — I know what it means to make research a system, not a service.`,
    cover:  `Dear Clay Research Team,

Clay is building AI-powered workflows for some of the most sophisticated users in tech — and as your user base scales from early adopters to enterprise customers, the research complexity grows fast. I want to help you navigate that.

At John Deere, I was the sole UX researcher on the India team. I ran mixed-methods research across 6+ product teams, built a PM-UX Playbook that raised PM UX literacy 80%, and created a self-serve survey platform for 250+ products that cut setup time 60% and raised completion rates 25%. Building research infrastructure that scales isn't just something I've thought about — it's what I did. At ABIM, I shifted toward AI-native research: designing annotation taxonomies, building bias-detection frameworks with ClinicalBERT and RoBERTa across 3,500+ clinical records, and creating synthetic data validation pipelines. That work gave me direct experience studying how expert users navigate complex AI-assisted tasks — precisely what Clay needs as it deepens its agents and automation features.

I'm drawn to Clay's ambition to make sophisticated growth strategies accessible through smart automation. Understanding how users — from technical operators to non-technical sales teams — build mental models of AI agents is a research problem worth investing in. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a senior UX researcher and data scientist with 7+ years studying how users interact with complex technical systems. I built the UX research function at John Deere's India team from zero, ran studies for 6+ product teams, and now apply NLP and AI techniques to behavioral research at ABIM. I have genuine hands-on experience with AI/agents both as a researcher and as a practitioner — a rare ability to study these systems from the inside out.`,
    experience: `At John Deere, I built a self-serve survey platform for 250+ products (cutting setup time 60%, raising completion rates 25%) and drove mixed-methods research that shaped quarterly roadmaps for 6+ product teams. At ABIM, I research how expert users navigate AI-assisted annotation workflows with complex rules and edge cases, using NLP frameworks on 3,500+ records. That experience studying users of sophisticated AI systems maps directly to Clay's AI/agents feature set.`,
  },

  anthropic: {
    url:    'https://job-boards.greenhouse.io/anthropic/jobs/4502417008',
    pdf:    'output/cv-gitlab-ai.pdf',
    why:    `Anthropic's mission — building AI systems that are safe and beneficial — is one I want to work on directly. What draws me to this UX Researcher role specifically is the intersection of safety research and human understanding: figuring out how real users interact with AI systems, where mental models break down, and what responsible design looks like when the stakes are this high. My current work at ABIM involves exactly this kind of inquiry — designing annotation taxonomies and bias-detection frameworks for clinical NLP models, where user misunderstanding can have real consequences. I want to bring that rigor to the question of how people relate to large language models.`,
    cover:  `Dear Anthropic Hiring Team,

I research how humans understand and misuse AI systems — and I want to do that work at the organization most focused on getting AI right. At ABIM, I build NLP bias-detection frameworks using ClinicalBERT and RoBERTa across 3,500+ clinical records, design annotation pipelines, and study how annotators apply subjective judgment to behavioral classification. That work taught me that the gap between how a model behaves and how users perceive it is a research problem as much as an engineering one.

Before pivoting to AI, I built UX research from the ground up. At John Deere, I was the sole researcher on the India team: I ran mixed-methods studies across 6+ product teams, created a PM-UX Playbook that raised PM UX literacy 80%, and built a self-serve survey platform that cut setup time 60% and raised completion rates 25%. I know what it takes to make research actionable in environments where decision-makers don't speak researcher fluently.

Anthropic is uniquely positioned to define what safe, human-centered AI looks like in practice. I want to help answer the hard questions: what do users actually expect from Claude, where does trust break down, and what does responsible AI interaction design require? My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX researcher and AI practitioner with 7+ years spanning human-computer interaction, mixed-methods research, and applied NLP. I currently work as a Co-op Data Scientist at ABIM, where I build clinical NLP systems and study how annotation behavior reflects human judgment under ambiguity. Before that, I led UX research at John Deere and drove platform redesigns that measurably improved engagement and conversion across large user bases.`,
    experience: `At ABIM, I designed supervised NLP models to detect clinical communication behaviors across 3,500+ medical records, built inter-rater reliability protocols for human annotators, and engineered bias-detection frameworks — all work at the intersection of AI systems and human judgment. At John Deere, I led mixed-methods UX research for 6+ product teams and built a self-serve survey platform for 250+ products, cutting setup time 60% and raising completion rates 25%.`,
  },

  abridge: {
    url:    'https://jobs.ashbyhq.com/abridge/d9234ea7-6052-42e7-b9f3-ed2c35085639',
    pdf:    'output/cv-abridge.pdf',
    why:    `Abridge is doing something rare: applying rigorous AI research to clinical conversations, where the cost of getting it wrong is measured in patient outcomes. I want to bring UX research that matches that seriousness. My work at ABIM — building NLP annotation pipelines and bias-detection frameworks on 3,500+ clinical records — sits directly in this space. I understand both the technical constraints and the human stakes of AI in medical contexts. At John Deere, I ran end-to-end mixed-methods research across complex enterprise systems, influencing roadmaps for 6+ product teams. I'm drawn to Abridge because the research here isn't about engagement metrics — it's about whether clinicians and patients can actually communicate better.`,
    cover:  `Dear Abridge Team,

Clinical AI works when it earns trust from the people using it — and that trust is built through rigorous research into how clinicians and patients actually behave, not how we assume they do. That's the work I want to do at Abridge.

At ABIM, I build NLP systems that analyze clinical communication across 3,500+ medical records, design annotation taxonomies for complex behavioral classification, and develop bias-detection frameworks using ClinicalBERT and RoBERTa. I understand both the technical architecture of clinical AI and the human judgment calls baked into it. Before that, at John Deere, I built a UX research practice from scratch — running contextual interviews, usability studies, and behavioral analytics across 6+ product teams, creating a PM-UX Playbook that raised PM UX literacy 80%, and launching a self-serve survey platform that cut setup time 60% and raised completion rates 25%.

The combination of clinical domain knowledge and research craft is rare. I want to use it at Abridge to study how ambient AI changes the dynamics of clinical encounters — and ensure that what gets built actually serves the people in the room. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX researcher with clinical AI experience — currently at ABIM building NLP systems on medical records, previously leading mixed-methods research at John Deere across 6+ product teams. I bring both qualitative research craft and hands-on NLP/ML depth to understanding how people interact with complex AI systems.`,
    experience: `At ABIM, I work directly in clinical AI: building NLP annotation pipelines, training classifiers on physician-patient communication, and developing bias-detection frameworks on 3,500+ clinical records. This gives me first-hand understanding of how AI systems are built and where they can fail in medical contexts. At John Deere, I ran end-to-end UX research — contextual inquiry through validated design recommendations — across 6+ product teams, shaping quarterly roadmaps and building shared research infrastructure used across 250+ products.`,
  },

  handshake: {
    url:    'https://jobs.ashbyhq.com/handshake/b35bc23c-a28e-493d-92d9-0bfa1200607e',
    pdf:    'output/cv-gitlab-ai.pdf',
    why:    `Handshake connects students and early-career talent to opportunity at massive scale — and now you're integrating AI to make that connection smarter. That intersection of human transition moments and AI assistance is exactly where good UX research matters most. Students navigating their first job search are anxious, uncertain, and often misled by opaque systems. I want to help make sure Handshake AI actually helps them. My background spans mixed-methods research in high-stakes environments (clinical AI at ABIM, enterprise products at John Deere) and hands-on NLP experience that lets me think clearly about what AI can and can't do for users.`,
    cover:  `Dear Handshake Research Team,

The first job search is one of the most consequential moments in a person's early career — and Handshake is the platform millions of students trust to navigate it. Adding AI to that experience raises the research stakes considerably: how do students understand AI-generated recommendations, and when does AI assistance build confidence versus create confusion?

At John Deere, I built UX research from the ground up as the sole researcher on the India team — running contextual interviews, usability studies, and behavioral analytics for 6+ product teams, creating a PM-UX Playbook that raised PM UX literacy 80%, and launching a self-serve survey platform for 250+ products. I've worked in environments where research had to be both rigorous and fast, and where I had to build the infrastructure that made research possible, not just run studies.

At ABIM, I moved into AI-native research: building annotation pipelines, studying how expert users navigate complex AI-assisted judgment tasks, and developing bias-detection frameworks on clinical records. That work sharpened my ability to study AI systems from the inside — understanding both the model behavior and the human experience of using it.

I want to bring that combination to Handshake AI — studying how students build trust in AI recommendations and ensuring the product serves the people who need it most. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a senior UX researcher with 7+ years in mixed-methods research across enterprise products and AI systems. I've built research practices from scratch, run studies that shaped product roadmaps at scale, and spent the last year doing AI-native research at ABIM — studying how users navigate complex AI-assisted tasks and building NLP systems to measure where that breaks down.`,
    experience: `At John Deere, I built and ran the UX research function as sole researcher on the India team — mixed-methods studies for 6+ product teams, a PM-UX Playbook raising PM literacy 80%, and a self-serve survey platform for 250+ products. At ABIM, I research how expert users make judgments in AI-assisted workflows, building annotation pipelines and bias-detection frameworks on 3,500+ clinical records. Both experiences involved studying user behavior in high-stakes systems where misunderstanding has real consequences.`,
  },

  'gitlab-ai': {
    url:    'https://job-boards.greenhouse.io/gitlab/jobs/8364868002',
    pdf:    'output/cv-gitlab-ai.pdf',
    why:    `GitLab's all-remote model and its commitment to building in the open are things I genuinely respect — and the AI UX Researcher role sits at a fascinating intersection: studying how developers adopt and trust AI-assisted features in a product they already rely on for critical work. My background spans both sides of that problem. I've done deep qualitative research with technical users (enterprise developers at John Deere) and I've built AI systems myself at ABIM — which gives me the ability to ask sharper questions about what AI is actually doing versus what users think it's doing.`,
    cover:  `Dear GitLab Research Team,

Developer tools are some of the hardest products to research well — users are expert, opinionated, and quick to distrust anything that feels like it's making decisions for them. Adding AI to that context makes the research more interesting and more consequential. I want to help GitLab get it right.

I've spent 7+ years doing mixed-methods research on complex technical systems. At John Deere, I led research for 6+ product teams across enterprise software — running contextual interviews, usability studies, and behavioral analytics that shaped quarterly roadmaps. I built a PM-UX Playbook that raised PM UX literacy 80% and a self-serve survey platform for 250+ products that removed developer dependency entirely. I know how to work with and for technical audiences.

At ABIM, I shifted into AI-native research: building NLP annotation pipelines, studying how expert users navigate AI-assisted judgment tasks, and developing bias-detection frameworks using ClinicalBERT and RoBERTa on 3,500+ clinical records. That work gave me hands-on experience with how AI systems behave and where users' mental models of them break down.

GitLab's AI features will succeed or fail based on whether developers trust them. I want to build the research foundation that earns that trust. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX researcher with 7+ years studying technical users and complex software systems. I currently work at ABIM building clinical NLP systems while pursuing my MS in AI & ML at Drexel. Before that, I ran mixed-methods research at John Deere across enterprise dev tools and built research infrastructure that scaled to 250+ products. I'm comfortable in fully remote, async environments and have written publicly about research practice.`,
    experience: `At John Deere, I led UX research for 6+ product teams in an enterprise software environment — contextual inquiry, usability studies, and behavioral analytics driving quarterly roadmap decisions — and built shared research infrastructure used across 250+ products. At ABIM, I work directly with AI systems: building annotation pipelines, training NLP classifiers on complex behavioral data, and studying how expert users navigate AI-assisted judgment tasks. The combination makes me well-suited to research AI feature adoption in developer tools.`,
  },

  betterhelp: {
    url:    'https://job-boards.greenhouse.io/betterhelpcom/jobs/5023260008',
    pdf:    'output/cv-betterhelp.pdf',
    why:    `BetterHelp is hiring its first dedicated UX Researcher — and I've already done this exact role. At John Deere, I built a UX research practice from scratch as the sole researcher for 6+ product teams: PM-UX Playbook (80% UX literacy lift), self-serve survey platform across 250+ products, and cross-functional research programs that made research indispensable to product decisions. The mental health mission matters to me personally, and my clinical AI experience at ABIM means I can bring the ethical sensitivity that research with therapy users demands.`,
    cover:  `Dear BetterHelp Team,

You're hiring your first dedicated UX Researcher — and I've already built exactly what you're describing. At John Deere, I was the sole UX Researcher on the India team. I built the research practice from zero: a PM-UX Playbook that raised PM UX literacy by 80%, a self-serve survey platform deployed across 250+ products that cut setup time 60% and raised completion rates 25%, and cross-functional research programs that made research a first-class input to product decisions across 6 product teams. Building from scratch isn't a risk factor for me — it's my proven track record.

At ABIM, I shifted into clinical AI research: building NLP annotation pipelines, studying behavioral patterns in 3,500+ clinical records, and developing bias-detection frameworks for physician assessment. Working with sensitive health data taught me the ethical rigor that mental health research requires. BetterHelp's users are at vulnerable moments — the research standards have to match that.

BetterHelp is at a critical stage: large enough to have real complexity, early enough that the research function can still shape the culture. I want to build something that lasts. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a mixed-methods UX Researcher with 7+ years. I built a research practice from scratch at John Deere (sole researcher, 6+ product teams, PM-UX Playbook, self-serve survey platform for 250+ products) and currently work in clinical AI research at ABIM. I bring both the research craft and the ethical sensitivity that a mental health platform requires.`,
    experience: `At John Deere, I built the UX research function from zero as sole researcher — mixed-methods studies for 6+ product teams, a PM-UX Playbook raising PM literacy 80%, and a self-serve survey platform for 250+ products cutting setup time 60%. At ABIM, I apply NLP and behavioral analytics to clinical records, building systems that require the same ethical rigor that mental health research demands. Both roles required me to work cross-functionally without a research team, building trust with PMs, designers, and engineers through research quality alone.`,
    salary: '$155,000',
  },

  huckleberry: {
    url:    'https://jobs.lever.co/Huckleberrylabs/5789699b-1937-4ce0-8c72-382a71499f33',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Huckleberry helps over 4 million families navigate some of the most stressful early parenting moments — and the research behind that product has to understand users who are exhausted, anxious, and making decisions for someone entirely dependent on them. I have direct experience with family-focused research: for the Stories by Children platform, I led usability testing and contextual interviews with parents and children, synthesized findings into personas, and drove redesigns that improved task success from 50% to 85%. That, combined with 7+ years of mixed-methods research depth and my current NLP work at ABIM, is the combination I want to bring to this role.`,
    cover:  `Dear Huckleberry Team,

Parenting is one of the highest-stakes, most emotionally loaded user experiences there is — and research that doesn't account for that will miss everything that matters. I've spent time studying families directly. For the Stories by Children platform, I led contextual interviews and usability testing with parents and young children, synthesized findings into personas that captured both the child's and parent's perspective, and drove redesigns through Lean UX sprints that improved task success from 50% to 85%.

Beyond that family-specific experience, I bring 7+ years of mixed-methods research across enterprise (John Deere, 6+ product teams), behavioral analytics (Capita, 11% conversion lift via A/B testing and segmentation), and clinical AI (ABIM, NLP analysis on 985+ conversations). My MS in AI & Machine Learning at Drexel means I'm also comfortable working alongside your data science and AI teams — I can bridge the behavioral research side with the quantitative analysis your product relies on.

I'm drawn to Huckleberry's combination of behavioral science, AI, and human-centered design. Building products that genuinely improve how families experience early childhood is exactly the kind of work I want to be doing. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a mixed-methods UX Researcher with 7+ years spanning family-focused UX (Stories by Children), behavioral analytics (Capita), enterprise research ops (John Deere), and clinical AI (ABIM). MS in AI & Machine Learning, Drexel (2026). I'm comfortable with both qualitative depth and quantitative rigor — and I genuinely love research that helps real people through hard moments.`,
    experience: `At John Deere, I built the research practice from scratch as sole researcher — mixed-methods studies for 6+ product teams, a PM-UX Playbook raising PM literacy 80%, and a survey platform for 250+ products. At ABIM, I analyze behavioral patterns in clinical conversations using NLP, bringing statistical rigor to qualitative data. The Stories by Children project gave me direct experience researching families and children — a sensitive population that requires both methodological care and genuine empathy.`,
    salary: '$130,000',
  },

  betterup: {
    url:    'https://jobs.ashbyhq.com/betterup/85ef9c10-2c33-41a8-b035-eff8dfce6165',
    pdf:    'output/cv-ux-research.pdf',
    why:    `BetterUp's mission — helping people do the best work of their lives — aligns with how I think about research: not as a way to optimize metrics, but as a way to understand what people actually need to grow. The Senior UX Researcher role appeals to me because of the scope: a platform serving both enterprise buyers and individual coaching participants requires research that works at multiple levels of complexity. My John Deere experience (6+ product teams, PM enablement, practice building) maps directly to this, and my clinical AI work at ABIM adds the behavioral analytics depth that a data-informed platform like BetterUp values.`,
    cover:  `Dear BetterUp Research Team,

Professional growth is deeply personal — and research that treats coaching participants as data points will miss the most important part of the experience. I want to help BetterUp understand the human side of what makes coaching transformative.

At John Deere, I led UX research across 6+ product teams as the sole researcher: contextual interviews, usability studies, and behavioral analytics that shaped quarterly roadmaps. I built a PM-UX Playbook that raised PM UX literacy by 80% — teaching non-researchers to think about evidence and user needs is, in a real sense, the same work BetterUp does for professionals. The self-serve survey platform I built for 250+ products cut setup time 60% and raised completion rates 25%. At ABIM, I apply NLP and behavioral analytics to 3,500+ clinical records, building systems that surface patterns invisible to manual analysis.

BetterUp sits at a compelling intersection: enterprise scale, individual impact, and AI-powered personalization. That combination rewards researchers who can work at both the strategic and tactical levels — which is exactly how I've operated for the last 7+ years. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a Senior UX Researcher with 7+ years studying complex sociotechnical systems — from enterprise software (John Deere, 6+ teams) to clinical AI (ABIM) to consumer platforms (UrbanFit, Capita). I specialize in mixed-methods research that connects behavioral data to human meaning. MS in AI & Machine Learning, Drexel (2026).`,
    experience: `At John Deere, I built and ran the research function as sole researcher: mixed-methods studies across 6+ product teams, PM-UX Playbook raising literacy 80%, survey platform for 250+ products. At ABIM, I apply NLP (ClinicalBERT, RoBERTa) to behavioral analysis of 3,500+ clinical records. At UrbanFit, I drove a platform redesign that delivered 35% engagement lift and 28% bounce rate reduction through iterative usability testing and behavioral analytics.`,
    salary: '$155,000',
  },

  'grow-therapy': {
    url:    'https://boards.greenhouse.io/growtherapy/jobs/4349772005',
    pdf:    'output/cv-abridge.pdf',
    why:    `Grow Therapy is reducing one of the biggest friction points in mental healthcare: finding and accessing a therapist. That mission matters, and it's one where research can directly improve outcomes — not just engagement metrics. My clinical AI work at ABIM gives me firsthand experience with the complexity of healthcare systems and the sensitivity required when users are navigating mental and physical health. Combined with my mixed-methods depth from John Deere and behavioral analytics experience, I want to help Grow Therapy build a product that actually reduces barriers to care.`,
    cover:  `Dear Grow Therapy Team,

Mental health access is a research problem as much as a technology problem. The friction that keeps people from finding a therapist — confusion, stigma, insurance complexity, mismatch anxiety — requires deep qualitative understanding, not just funnel optimization. I want to help Grow Therapy understand those barriers from the inside.

My research background covers both sides of what this role requires. At John Deere, I led mixed-methods research for 6+ product teams: contextual interviews, usability studies, and behavioral analytics shaping quarterly roadmaps. I built a PM-UX Playbook that raised PM UX literacy 80% and a self-serve survey platform for 250+ products. At ABIM, I work with clinical data — building NLP pipelines for physician communication analysis, studying behavior in high-stakes healthcare contexts, and developing bias-detection frameworks that require ethical care at every step.

Grow Therapy's dual-sided marketplace (patients and therapists) is exactly the kind of research complexity I'm drawn to. Understanding both user groups, the friction between them, and how technology can reduce that gap is a meaningful problem worth working on. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX Researcher with 7+ years in mixed-methods research, healthcare AI, and behavioral analytics. Currently applying clinical NLP at ABIM; previously built the research function at John Deere (sole researcher, 6+ teams, PM-UX Playbook). Strong background in sensitive-population research and dual-sided platform dynamics.`,
    experience: `At ABIM, I work with clinical data — NLP annotation pipelines, behavioral pattern analysis on 3,500+ medical records, bias-detection in physician communication. At John Deere, I ran mixed-methods research for 6+ product teams and built research infrastructure from scratch. At UrbanFit, I led research that improved a wellness platform's engagement 35% through behavioral analytics and usability testing.`,
    salary: '$145,000',
  },

  openai: {
    url:    'https://jobs.ashbyhq.com/openai/250c5184-edb5-49eb-bb7e-1ddb47f1140d',
    pdf:    'output/cv-gitlab-ai.pdf',
    why:    `OpenAI is defining what AI interaction looks like for hundreds of millions of people — and the quantitative UX researcher role is exactly where I can contribute most distinctly. I bring behavioral analytics at scale (Capita: A/B testing with statistical significance across 7 brands, 11% conversion lift; John Deere: survey analytics across 250+ products), NLP-based behavioral modeling (ABIM: pattern analysis on 985+ clinical conversations), and Python/SQL fluency that lets me work directly with product data. What makes my profile unusual is the combination of quant rigor and qualitative depth — I understand the human story behind the numbers.`,
    cover:  `Dear OpenAI Research Team,

Quantitative UX research at OpenAI means studying how hundreds of millions of people understand, trust, and use AI systems that are genuinely novel. That's a research problem that demands both statistical rigor and behavioral theory — and it's exactly the intersection I work in.

At ABIM, I apply NLP and behavioral analytics to 985+ clinical conversations — building classification models, running statistical validation, and surfacing patterns that require both quantitative analysis and qualitative interpretation. At Capita, I ran A/B and multivariate experiments with 10% holdout methodology across 7 fashion brands, delivering 11% conversion lift through statistically validated behavioral interventions. At John Deere, I built a survey analytics platform for 250+ products and ran behavioral analytics across 6+ product teams. I work comfortably in Python, SQL, and statistical frameworks.

What makes me a strong fit for this specific role is the combination: quantitative rigor paired with the user empathy and qualitative craft to understand what the numbers mean for real people. My MS in AI & Machine Learning (Drexel, 2026) means I can engage with the model side of these questions too. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a data-fluent UX Researcher with 7+ years combining behavioral analytics, A/B testing, NLP, and qualitative methods. Current co-op at ABIM applies statistical modeling and NLP to clinical behavioral data; previous work at Capita ran controlled experiments across large user cohorts. MS in AI & Machine Learning, Drexel (2026). Python, SQL, comfortable with statistical significance testing and behavioral modeling.`,
    experience: `At ABIM, I apply NLP (ClinicalBERT, RoBERTa) and behavioral analytics to 985+ clinical conversations, building classification models and statistical validation frameworks on 3,500+ records. At Capita, I ran A/B/n experiments with holdout methodology across 7 brands, building user segmentation models and delivering 11% conversion lift. At John Deere, I built a survey analytics platform for 250+ products and conducted behavioral analytics for 6+ product teams.`,
    salary: '$185,000',
  },

  'you-com': {
    url:    'https://jobs.ashbyhq.com/youdotcom/fdc3b84d-2b16-4379-8b24-8f99907a6e0b',
    pdf:    'output/cv-gitlab-ai.pdf',
    why:    `YOU.com is building AI-powered search in a space where user trust, information interpretation, and AI transparency are all research-critical. I'm drawn to this role because of how it intersects two things I work in directly: understanding how users make sense of AI-generated content (from my ABIM annotation and bias-detection work) and behavioral analytics at scale (from my Capita A/B testing and John Deere analytics work). The question of how users evaluate AI-generated search results — what builds trust, what triggers skepticism, when do they act on it versus verify — is exactly the kind of research problem I want to work on.`,
    cover:  `Dear YOU.com Research Team,

AI-powered search changes the fundamental question of how users decide what to trust. Unlike traditional search, where users evaluate sources, AI search asks users to evaluate synthesized outputs — a different cognitive challenge that demands rigorous research to get right.

At ABIM, I study exactly this kind of problem: how do expert users evaluate AI-generated behavioral classifications? I build annotation pipelines, design inter-rater reliability protocols, and use NLP (ClinicalBERT, RoBERTa) to detect where AI outputs diverge from human judgment — on 985+ clinical conversations and 3,500+ records. At John Deere, I led mixed-methods research across 6+ product teams, building a PM-UX Playbook that raised PM UX literacy 80% and a survey analytics platform for 250+ products. At Capita, I ran behavioral experiments that delivered 11% conversion lift through statistically validated segmentation and A/B testing.

The intersection of AI product research and behavioral analytics is exactly where I add the most value. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX Researcher at the intersection of AI product research and behavioral analytics — currently studying AI output evaluation at ABIM, previously leading research at John Deere and running behavioral experiments at Capita. MS in AI & Machine Learning, Drexel (2026). I bring both qualitative depth and quantitative rigor to understanding how users interact with AI-generated content.`,
    experience: `At ABIM, I build evaluation frameworks for AI-generated outputs — annotation pipelines, IRR protocols, NLP classifiers across 985+ conversations and 3,500+ records. At John Deere, I ran mixed-methods research for 6+ product teams and built research infrastructure at scale. At Capita, I ran A/B experiments with statistical validation across 7 brands, delivering 11% conversion lift through behavioral segmentation.`,
    salary: '$155,000',
  },

  rula: {
    url:    'https://jobs.ashbyhq.com/rula/65263e60-9adc-41ce-a259-2141c20d4ada',
    pdf:    'output/cv-betterhelp.pdf',
    why:    `Rula is solving one of the most persistent access problems in mental healthcare — connecting patients to in-network therapists at scale. The Lead UX Researcher role appeals to me specifically because of the strategic scope: research leadership, practice building, and influence on product direction. I've done this before. At John Deere, I was the sole researcher building a function from scratch. At Rula, I'd be taking that further — leading a practice with real stakes: every friction point removed in the patient or provider experience is a person getting mental healthcare who might not have otherwise. My ABIM work adds clinical sensitivity; my John Deere experience adds the practice-building foundation.`,
    cover:  `Dear Rula Research Team,

Mental health access in the US is broken in part because the systems connecting patients to care are confusing, slow, and poorly designed. Research that understands that friction — from the patient's anxiety and the provider's administrative burden — can directly fix it. That's the work I want to do at Rula.

I've already built what this Lead role requires. At John Deere, I was the sole UX Researcher on the India team — building a research practice from zero, running mixed-methods studies across 6+ product teams, creating a PM-UX Playbook that raised PM UX literacy 80%, and launching a self-serve survey platform for 250+ products. At ABIM, I work with clinical data: NLP annotation pipelines, behavioral analysis on 3,500+ medical records, and bias-detection frameworks for physician assessment. That clinical domain experience gives me firsthand sensitivity to how healthcare systems work and where they fail people.

Rula's mission is meaningful and the research complexity is real — dual-sided marketplace, clinical credentialing workflows, insurance navigation. I want to build the research function that makes that complexity legible. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a Lead-level UX Researcher with 7+ years. Built research practices from scratch (John Deere, sole researcher, 6+ teams), applied clinical AI research (ABIM, NLP on medical records), and driven behavioral analytics at scale (Capita, UrbanFit). MS in AI & Machine Learning, Drexel (2026). I lead through research quality and stakeholder enablement, not headcount.`,
    experience: `At John Deere, I built the UX research function as sole researcher — mixed-methods for 6+ product teams, PM-UX Playbook (80% literacy lift), survey platform for 250+ products. At ABIM, I apply NLP and clinical behavioral analytics to physician communication data, requiring the same ethical care that mental health research demands. At UrbanFit, I drove a 35% engagement lift through behavioral research and iterative usability testing.`,
    salary: '$155,000',
  },

  multiverse: {
    url:    'https://apply.workable.com/multiverse/j/55217FE7F0/',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Multiverse is reimagining how employers develop talent — and the Client Experience research role is about understanding how employers engage with, commit to, and get value from apprenticeship programs. That's enterprise B2B research with real behavioral and attitudinal complexity. My John Deere work is the closest analog: I researched enterprise software users (operators, engineers, PMs) and built a PM-UX Playbook that taught non-researchers how to think about user evidence — essentially the same "enabling client success" mission Multiverse has. I'm drawn to the education + workforce angle as a meaningful problem worth solving.`,
    cover:  `Dear Multiverse Research Team,

Enterprise client experience research requires understanding both the rational and emotional dimensions of business decisions — why organizations commit to something new, what sustains adoption, and where friction quietly kills momentum. That's the kind of nuanced research I've done throughout my career.

At John Deere, I ran UX research across 6+ product teams serving enterprise customers — contextual interviews, usability studies, and behavioral analytics shaping quarterly roadmaps. I built a PM-UX Playbook that raised PM UX literacy 80%, essentially teaching a large enterprise organization how to use research as a decision-making tool. That stakeholder enablement mindset maps directly to how Multiverse thinks about client success. I also built a self-serve survey platform for 250+ products that democratized data collection across the organization.

At ABIM, I moved into AI-native research — building NLP pipelines and behavioral analysis frameworks that surface insights invisible to manual analysis. That technical depth lets me work effectively with data science teams and ask sharper questions about what behavioral data actually means.

Multiverse's mission — making talent development work for employers and apprentices alike — is one I believe in. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a Senior UX Researcher specializing in enterprise B2B and complex stakeholder ecosystems. 7+ years spanning John Deere (enterprise software, 6+ product teams), ABIM (clinical AI, NLP), and Capita (e-commerce behavioral analytics). Built research practices that scale and enable non-researchers to act on evidence.`,
    experience: `At John Deere, I ran enterprise UX research for 6+ product teams, built a PM-UX Playbook raising UX literacy 80%, and launched a self-serve research platform for 250+ products. At ABIM, I apply NLP and behavioral analytics to complex clinical data. At Capita, I ran behavioral experiments and segmentation research across large enterprise clients.`,
    salary: '$140,000',
  },

  feeld: {
    url:    'https://apply.workable.com/feeldco/j/834B977B48',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Feeld is doing something genuinely rare: building a product for human connection, desire, and identity in ways that most tech companies are too risk-averse to approach honestly. The research challenge is equally rare — studying behavior that users rarely discuss in public, in a product where safety, trust, and authenticity are load-bearing. My background combines the methodological rigor to do this well (mixed-methods, diary studies, behavioral analytics) with the ethical sensitivity required (ABIM clinical data, Stories by Children with families and children). I'm drawn to Feeld because the research here has to be done with genuine curiosity and care, not just efficiency.`,
    cover:  `Dear Feeld Research Team,

Understanding what people actually want — not what they say they want, and not what's easy to measure — is one of the hardest problems in user research. It's also the most interesting one. Feeld has built a product that asks users to be honest about desire and identity, which means your research has to match that honesty.

I bring mixed-methods depth (contextual inquiry, diary studies, usability testing, behavioral analytics), a track record of ethically careful research with sensitive populations (ABIM clinical data, Stories by Children with families), and the behavioral analytics fluency to work with the kind of implicit signal that matters most for a product like Feeld. At John Deere, I ran research across 6+ product teams and built a PM-UX Playbook that raised PM UX literacy 80%. At ABIM, I work with clinical data that requires the same care — research where getting the ethics wrong has real consequences.

What I'd bring to Feeld is genuine curiosity about human behavior, methodological flexibility to study what's hard to study, and respect for the users who are trusting the product with something personal. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a mixed-methods UX Researcher with 7+ years studying human behavior across enterprise products (John Deere), clinical AI (ABIM), consumer platforms (UrbanFit, Capita), and family-focused research (Stories by Children). I specialize in research with sensitive populations and behavioral questions that require both methodological rigor and genuine empathy. MS in AI & Machine Learning, Drexel (2026).`,
    experience: `At ABIM, I study clinical communication behaviors using NLP on 3,500+ records — research requiring ethical care, sensitivity to power dynamics, and careful annotation of subjective human behavior. At John Deere, I built mixed-methods research infrastructure for 6+ teams and drove PM adoption of evidence-based decisions. At UrbanFit and for Stories by Children, I conducted family and behavioral research that required understanding diverse, sometimes vulnerable users.`,
    salary: '$135,000',
  },

  innovaccer: {
    url:    'https://job-boards.greenhouse.io/innovaccer/jobs/7895797002',
    pdf:    'output/cv-abridge.pdf',
    why:    `Innovaccer's health data platform sits at the intersection of clinical workflow, interoperability, and AI — exactly the domain I work in at ABIM. Health system administrators and clinical staff are expert users navigating genuinely complex systems; research that doesn't understand their workflows, constraints, and mental models will produce surface-level insights. My combination of clinical AI experience (ABIM), enterprise B2B research (John Deere), and behavioral analytics depth makes me well-positioned to do the deep research Innovaccer's platform requires.`,
    cover:  `Dear Innovaccer Research Team,

Health data platforms succeed when they fit how clinical and administrative users actually work — not how product teams imagine they work. Getting that right requires research that goes deep into clinical workflows, not just usability studies of the interface.

At ABIM, I build NLP pipelines for clinical communication analysis and behavioral pattern detection on 3,500+ medical records. I understand clinical data, physician workflows, and the complexity of healthcare AI from the inside. At John Deere, I led enterprise B2B UX research for 6+ product teams — contextual inquiry with expert users, behavioral analytics, and research that shaped quarterly roadmaps. I built a PM-UX Playbook raising PM UX literacy 80% and a self-serve survey platform for 250+ products.

Innovaccer's platform serves health systems navigating data interoperability, population health, and clinical AI — a research environment that rewards deep domain knowledge. I want to bring that knowledge to your research function. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX Researcher with clinical AI and enterprise B2B experience. Currently applying NLP to clinical behavioral data at ABIM; previously led mixed-methods research for 6+ enterprise product teams at John Deere. MS in AI & Machine Learning, Drexel (2026). Deep understanding of healthcare workflows, clinical data, and complex enterprise user ecosystems.`,
    experience: `At ABIM, I work with clinical data — NLP annotation, behavioral pattern analysis on 3,500+ records, bias-detection in physician communication. Deep familiarity with clinical workflows and healthcare AI constraints. At John Deere, I ran enterprise UX research for 6+ product teams: contextual interviews with expert users, behavioral analytics, and research infrastructure at scale.`,
    salary: '$140,000',
  },

  smartsheet: {
    url:    'https://boards.greenhouse.io/smartsheet/jobs/4820321',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Smartsheet is a work management platform used by enterprise teams at scale — exactly the kind of complex, multi-stakeholder product environment I know best. At John Deere, I ran research for enterprise users across 6+ product teams, understanding how large organizations make decisions about tools and workflows. Building a self-serve survey platform for 250+ products gave me firsthand experience with the research challenges of large, distributed enterprise software. I'm drawn to Smartsheet because of the scale and the research complexity: enterprise collaboration tools require understanding both the individual user's experience and the organizational dynamics that shape how software actually gets used.`,
    cover:  `Dear Smartsheet Research Team,

Enterprise work management research has a depth that consumer research often lacks: you're studying not just individual behavior but organizational processes, team dynamics, and the gap between how work is supposed to flow and how it actually does. That's the kind of research I find most compelling.

At John Deere, I led UX research across 6+ product teams serving enterprise customers — contextual interviews with operators and engineers, behavioral analytics, and usability studies that shaped quarterly roadmaps. I built a PM-UX Playbook raising PM UX literacy 80% and a self-serve survey platform for 250+ products that cut setup time 60% and raised completion rates 25%. At ABIM, I apply NLP and behavioral analytics to complex institutional data, requiring the same stakeholder navigation and cross-functional influence that enterprise research demands.

Smartsheet's remote-eligible structure fits my work style and the research problems are meaningful — understanding how real teams coordinate work at scale. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a Senior UX Researcher specializing in enterprise products and complex organizational contexts. 7+ years at John Deere (enterprise software, 6+ teams, practice-building), ABIM (clinical AI, behavioral analytics), and Capita (e-commerce experimentation). Strong cross-functional stakeholder skills. MS in AI & Machine Learning, Drexel (2026).`,
    experience: `At John Deere, I ran enterprise UX research for 6+ product teams — contextual interviews, usability studies, behavioral analytics shaping roadmaps, plus a survey platform for 250+ products. At ABIM, I apply NLP and statistical analysis to institutional behavioral data. At Capita, I ran controlled experiments at enterprise scale.`,
    salary: '$140,000',
  },

  intercom: {
    url:    'https://job-boards.greenhouse.io/intercom/jobs/7431143',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Intercom's VoC research role sits at the intersection of product research and the voice of real customers — exactly the kind of work that connects qualitative insight to product strategy. My background in mixed-methods research (John Deere, 6+ product teams), behavioral analytics (Capita, UrbanFit), and AI-assisted analysis (ABIM NLP) makes me well-suited to build and scale VoC programs that surface actionable signal. I'm particularly drawn to the opportunity to shape how customer feedback becomes product decisions — which is precisely what my PM-UX Playbook at John Deere was designed to do.`,
    cover:  `Dear Intercom Research Team,

Customer voice programs succeed when they translate messy qualitative feedback into decisions that product teams can act on. That translation — from customer language to product insight — is one of the research problems I've focused on throughout my career.

At John Deere, I built the UX research function as sole researcher: mixed-methods studies for 6+ product teams, a PM-UX Playbook that raised PM UX literacy 80%, and a self-serve survey platform for 250+ products that cut setup time 60%. Building systems that made customer insight accessible to non-researchers is exactly the mandate of a senior VoC role. At ABIM, I apply NLP to 985+ clinical conversations — experience that maps directly to synthesizing large-scale customer feedback at Intercom's scale. At Capita, I ran behavioral analytics and A/B experiments, connecting customer signal to product outcomes.

Intercom's customer communication platform needs research that understands both the business users and their customers — a multi-stakeholder dynamic I've navigated throughout my career. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a mixed-methods UX Researcher with 7+ years bridging qualitative insights and quantitative signal. Built VoC-adjacent research infrastructure at John Deere (PM-UX Playbook, survey platform for 250+ products), applied NLP to customer communication analysis at ABIM, and ran behavioral analytics at Capita.`,
    experience: `At John Deere, I built research infrastructure making customer insights accessible at scale — PM-UX Playbook raising literacy 80%, survey platform for 250+ products. At ABIM, I apply NLP to analyze communication patterns in 985+ conversations. At Capita, I ran behavioral segmentation and A/B experiments connecting customer signal to product outcomes.`,
    salary: '$135,000',
  },

  'aurora-solar': {
    url:    'https://jobs.ashbyhq.com/aurorasolar/957c76bb-16f2-4cfc-a468-c350bdc65d9a',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Aurora Solar is building the software layer for the clean energy transition — a mission I care about, and a product domain with genuinely complex users: solar installers and project managers navigating technical specifications, permitting, and financial modeling. That expert-user research complexity is something I've navigated directly at John Deere (operators and engineers using complex field software) and ABIM (clinicians and health system administrators). I'm drawn to Aurora because the research here has real stakes: better solar design tools mean more clean energy deployed faster.`,
    cover:  `Dear Aurora Solar Research Team,

Clean energy software has a research challenge most consumer products don't: your users are domain experts with strong opinions about tools, working in conditions where software errors have real cost. Getting the UX right requires deep qualitative understanding of expert workflows — exactly what I've specialized in.

At John Deere, I led enterprise UX research for 6+ product teams serving field operators and agricultural engineers — contextual inquiry, usability studies, and behavioral analytics for complex technical software. I built a PM-UX Playbook raising PM UX literacy 80% and a self-serve survey platform for 250+ products. At ABIM, I study clinical workflows and communication behavior using NLP on 3,500+ records — expert-user research in a high-stakes domain. At Capita, I ran behavioral analytics and controlled experiments at scale.

Aurora's mission and research complexity are both compelling. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX Researcher specializing in expert-user and enterprise B2B research. 7+ years at John Deere (field operators, engineers, complex enterprise software), ABIM (clinical workflows, NLP), and Capita (behavioral analytics). MS in AI & Machine Learning, Drexel (2026).`,
    experience: `At John Deere, I ran enterprise UX research for complex technical software used by field operators and engineers — 6+ product teams, contextual inquiry, behavioral analytics, roadmap influence. At ABIM, I study expert clinical behavior using NLP and behavioral modeling. At Capita, I ran A/B experiments and segmentation research at enterprise scale.`,
    salary: '$140,000',
  },

  skylight: {
    url:    'https://apply.workable.com/skylight/j/681D1CD9D5/',
    pdf:    'output/cv-ux-research.pdf',
    why:    `Skylight works on digital transformation for government and public sector services — a research context where getting UX right directly affects how well citizens access services they depend on. The stakes are different from consumer products: bad UX in a benefits system or public health tool doesn't just reduce engagement, it prevents real people from getting things they need. My mixed-methods depth, practice-building background, and experience with complex institutional users (ABIM, John Deere) makes me well-suited to the research complexity Skylight's work requires.`,
    cover:  `Dear Skylight Research Team,

Government digital services are some of the highest-stakes UX problems there are — the people who most need services like benefits access or public health tools are often the least equipped to work around bad design. Research that takes that seriously has to go beyond usability testing.

At John Deere, I built a research practice from scratch as sole researcher: mixed-methods studies for 6+ product teams, PM-UX Playbook raising PM literacy 80%, and a self-serve survey platform for 250+ products. Building research infrastructure that scales to complex institutional contexts is what I've done throughout my career. At ABIM, I work with institutional stakeholders in a regulated healthcare environment — the same kind of multi-stakeholder, high-stakes context Skylight operates in.

Public sector digital transformation is meaningful work. I want to contribute to making government services work for the people who need them. My portfolio is at shwetasharma.tech.

Sincerely, Shweta Sharma`,
    about:  `I'm a UX Researcher with institutional and enterprise research experience — John Deere (complex enterprise systems, 6+ teams), ABIM (regulated healthcare, clinical AI), and consumer platforms. Practice-builder, stakeholder enabler, mixed-methods depth. MS in AI & Machine Learning, Drexel (2026). Remote-comfortable with strong async collaboration skills.`,
    experience: `At John Deere, I ran enterprise research for 6+ product teams and built research infrastructure from scratch. At ABIM, I work in a regulated healthcare institution — complex stakeholders, high ethical standards, institutional constraints. Both environments required the same blend of research craft and organizational navigation that Skylight's government work demands.`,
    salary: '$125,000',
  },

};

// ─── ATS Detection ─────────────────────────────────────────────────────────────

function detectATS(url) {
  if (/ashbyhq\.com/i.test(url))    return 'ashby';
  if (/greenhouse\.io/i.test(url))  return 'greenhouse';
  if (/lever\.co/i.test(url))       return 'lever';
  if (/workable\.com/i.test(url))   return 'workable';
  return 'generic';
}

// Greenhouse is excluded from the automated apply workflow.
// Applications via Greenhouse must be submitted manually via the company's own site.
const GREENHOUSE_EXCLUDED = true;

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function fill(page, selectors, value) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.fill(value);
        console.log(`  ✓ ${sel.slice(0, 60)}`);
        return true;
      }
    } catch {}
  }
  return false;
}

async function click(page, selectors) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.click();
        console.log(`  ✓ clicked: ${sel.slice(0, 55)}`);
        return true;
      }
    } catch {}
  }
  return false;
}

// Type into a combobox and pick the first matching option
async function comboSelect(page, comboSel, typed, optionContains) {
  try {
    const combo = page.locator(comboSel).first();
    if (!await combo.isVisible({ timeout: 1500 })) return false;
    await combo.click();
    await combo.pressSequentially(typed, { delay: 60 });
    await page.waitForTimeout(1200);
    const opt = page.locator(`[role="option"]:has-text("${optionContains}")`).first();
    if (await opt.isVisible({ timeout: 2000 })) {
      await opt.click();
      console.log(`  ✓ combobox → "${optionContains}"`);
      return true;
    }
  } catch {}
  return false;
}

// Label-based filler: finds an input/textarea whose visible label matches
// `labelRegex`, then fills with `value`. Handles Ashby's "Type here..." fields
// where all inputs share the same placeholder and differ only by label text.
async function fillByLabel(page, labelRegex, value) {
  if (!value) return false;
  try {
    const target = await page.evaluate((pattern) => {
      const re = new RegExp(pattern, 'i');
      for (const label of document.querySelectorAll('label')) {
        if (!re.test(label.innerText)) continue;
        const forId = label.getAttribute('for');
        let input = forId ? document.getElementById(forId) : null;
        if (!input) input = label.querySelector('input, textarea, select');
        if (!input) {
          const container = label.closest('.ashby-application-form-field-entry, [class*="field"], [class*="Field"], div');
          if (container) input = container.querySelector('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea, select');
        }
        if (input && input.offsetParent !== null && !input.value?.trim()) {
          if (input.id) return `#${CSS.escape(input.id)}`;
          if (input.name) return `${input.tagName.toLowerCase()}[name="${input.name}"]`;
          return null;
        }
      }
      for (const el of document.querySelectorAll('input, textarea')) {
        if (!el.offsetParent || el.value?.trim()) continue;
        const wrapper = el.closest('.ashby-application-form-field-entry, [class*="field"], [class*="Field"], fieldset, div');
        const text = wrapper?.querySelector('label, legend, [class*="label"], [class*="Label"]')?.innerText || '';
        if (re.test(text)) {
          if (el.id) return `#${CSS.escape(el.id)}`;
          if (el.name) return `${el.tagName.toLowerCase()}[name="${el.name}"]`;
          return null;
        }
      }
      return null;
    }, labelRegex.source || labelRegex);

    if (target) {
      const el = page.locator(target).first();
      if (await el.isVisible({ timeout: 600 })) {
        await el.fill('');
        await el.pressSequentially(String(value), { delay: 30 });
        console.log(`  ✓ label fill: ${labelRegex}`);
        return true;
      }
    }
  } catch {}
  return false;
}

// ── Ashby-specific helpers (Playwright locator-based clicks for React compat) ──
// DOM .click() doesn't trigger React synthetic events. Must use Playwright's
// locator.click() which dispatches real mousedown/mouseup/click events.

async function clickToggleByLabel(page, labelRegex, answer) {
  try {
    const entries = page.locator('.ashby-application-form-field-entry');
    const count = await entries.count();
    for (let i = 0; i < count; i++) {
      const entry = entries.nth(i);
      const lbl = entry.locator('label').first();
      if (!await lbl.isVisible({ timeout: 200 }).catch(() => false)) continue;
      const text = await lbl.innerText().catch(() => '');
      if (!labelRegex.test(text)) continue;
      const btn = entry.locator('button', { hasText: new RegExp(`^\\s*${answer}\\s*$`, 'i') }).first();
      if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(200);
        return true;
      }
    }
  } catch {}
  return false;
}

async function clickRadioByLabel(page, labelRegex, optionMatch) {
  try {
    const containers = page.locator('fieldset, .ashby-application-form-field-entry');
    const count = await containers.count();
    for (let i = 0; i < count; i++) {
      const fs = containers.nth(i);
      const lbl = fs.locator('label, legend').first();
      if (!await lbl.isVisible({ timeout: 200 }).catch(() => false)) continue;
      const text = await lbl.innerText().catch(() => '');
      if (!labelRegex.test(text)) continue;
      const options = fs.locator('[class*="option"]');
      const optCount = await options.count();
      for (let j = 0; j < optCount; j++) {
        const opt = options.nth(j);
        const optText = await opt.innerText().catch(() => '');
        if (!optionMatch.test(optText.trim())) continue;
        const radioLabel = opt.locator('label').first();
        if (await radioLabel.isVisible({ timeout: 200 }).catch(() => false)) {
          await radioLabel.click();
        } else {
          await opt.click();
        }
        await page.waitForTimeout(200);
        return true;
      }
      const labels = fs.locator('label');
      const lblCount = await labels.count();
      for (let j = 0; j < lblCount; j++) {
        const labelEl = labels.nth(j);
        const labelText = await labelEl.innerText().catch(() => '');
        if (!optionMatch.test(labelText.trim())) continue;
        const radio = labelEl.locator('input[type="radio"]').first();
        if (await radio.count() > 0) {
          await labelEl.click();
          await page.waitForTimeout(200);
          return true;
        }
      }
      const radios = fs.locator('input[type="radio"]');
      const radioCount = await radios.count();
      for (let j = 0; j < radioCount; j++) {
        const radio = radios.nth(j);
        const id = await radio.getAttribute('id');
        if (!id) continue;
        const labelFor = page.locator(`label[for="${id}"]`).first();
        if (!await labelFor.isVisible({ timeout: 200 }).catch(() => false)) continue;
        const labelText = await labelFor.innerText().catch(() => '');
        if (optionMatch.test(labelText.trim())) {
          await labelFor.click();
          await page.waitForTimeout(200);
          return true;
        }
      }
    }
  } catch {}
  return false;
}

async function clickCheckboxesByLabel(page, labelRegex, skillsToCheck) {
  try {
    const skillSet = new Set(skillsToCheck.map(s => s.toLowerCase()));
    const containers = page.locator('fieldset, .ashby-application-form-field-entry');
    const count = await containers.count();
    let clicked = 0;
    for (let i = 0; i < count; i++) {
      const fs = containers.nth(i);
      const lbl = fs.locator('label, legend').first();
      if (!await lbl.isVisible({ timeout: 200 }).catch(() => false)) continue;
      const text = await lbl.innerText().catch(() => '');
      if (!labelRegex.test(text)) continue;
      const options = fs.locator('[class*="option"]');
      const optCount = await options.count();
      for (let j = 0; j < optCount; j++) {
        const opt = options.nth(j);
        const optText = (await opt.innerText().catch(() => '')).trim().toLowerCase();
        if (skillSet.has(optText) || [...skillSet].some(s => optText.includes(s))) {
          const cbLabel = opt.locator('label').first();
          if (await cbLabel.isVisible({ timeout: 200 }).catch(() => false)) {
            await cbLabel.click();
          } else {
            await opt.click();
          }
          await page.waitForTimeout(150);
          clicked++;
        }
      }
      if (clicked > 0) return true;
    }
  } catch {}
  return false;
}

async function comboSelectByLabel(page, labelRegex, typedText, optionMatch) {
  try {
    const entries = page.locator('.ashby-application-form-field-entry, fieldset');
    const count = await entries.count();
    for (let i = 0; i < count; i++) {
      const entry = entries.nth(i);
      const lbl = entry.locator('label, legend').first();
      if (!await lbl.isVisible({ timeout: 200 }).catch(() => false)) continue;
      const text = await lbl.innerText().catch(() => '');
      if (!labelRegex.test(text)) continue;
      const combo = entry.locator('[role="combobox"], input[placeholder*="typing" i], input[placeholder*="Start" i]').first();
      if (await combo.isVisible({ timeout: 300 }).catch(() => false)) {
        await combo.click();
        await combo.pressSequentially(typedText, { delay: 40 });
        await page.waitForTimeout(800);
        const opt = page.locator('[role="option"]').filter({ hasText: new RegExp(optionMatch, 'i') }).first();
        if (await opt.isVisible({ timeout: 1500 }).catch(() => false)) {
          await opt.click();
          await page.waitForTimeout(300);
        }
        return true;
      }
    }
  } catch {}
  return false;
}

// ─── Per-ATS fill functions ────────────────────────────────────────────────────

async function fillAshby(page, role) {
  console.log('  [ATS: Ashby]');

  // Standard text fields
  const fullName = `${CANDIDATE.firstName} ${CANDIDATE.lastName}`;
  await fill(page, ['input[name="_systemfield_name"]', 'input[placeholder*="Full name" i]', 'input[placeholder*="Your name" i]'], fullName);
  await fill(page, ['input[type="email"]', 'input[name*="email" i]'], CANDIDATE.email);
  await fill(page, ['input[type="tel"]',   'input[name*="phone" i]'], CANDIDATE.phone);

  // Preferred Name
  await fillByLabel(page, /preferred\s*name/i, CANDIDATE.firstName);

  // SMS consent radio
  await clickRadioByLabel(page, /phone|sms|text\s*message/i, /yes.*consent|I\s*consent/i);

  // LinkedIn & portfolio
  await fillByLabel(page, /linkedin/i, CANDIDATE.linkedin);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'], CANDIDATE.linkedin);
  await fillByLabel(page, /portfolio|website|personal\s*site/i, CANDIDATE.portfolio);
  await fill(page, ['input[name*="website" i]', 'input[placeholder*="Portfolio" i]', 'input[placeholder*="Website" i]'], CANDIDATE.portfolio);

  // Yes/No toggle buttons
  // Yes/No toggle buttons — loose patterns to catch wording variations across companies
  await clickToggleByLabel(page, /(currently|now)\s+(based|living|located|reside)|US\s+citizen|based\s+in.*United\s+States|live\s+in.*United\s+States/i, 'Yes');
  await clickToggleByLabel(page, /authoriz(ed|ation).{0,40}(work|employ)|legal(ly)?\s+(authorized|right).{0,30}work|right\s+to\s+work|eligible\s+to\s+work/i, 'Yes');
  await clickToggleByLabel(page, /sponsor(ship)?|visa.*sponsor|require.*sponsor|need.*sponsor|H-?1B/i, 'No');
  await clickToggleByLabel(page, /willing.*(commute|relocate|work).*(office|onsite|on.?site|local|in.?person)|work\s+from.*(office|local)|onsite.*in.?person|in.?person.{0,20}Monday|come\s+to.*office|able\s+to\s+(commute|work\s+from)/i, 'Yes');
  await clickToggleByLabel(page, /willing.*relocat|able\s+to\s+relocat|open\s+to\s+relocat|relocat.*for.*(this\s+)?(role|position|job)/i, (CANDIDATE.relocate || 'Yes').toLowerCase().startsWith('y') ? 'Yes' : 'No');
  await clickToggleByLabel(page, /at\s+least\s+18|18\s+(years|or\s+older)|legal\s+age/i, 'Yes');
  await clickToggleByLabel(page, /background\s+check|drug\s+(test|screen)|consent\s+to.*screen/i, 'Yes');
  await clickToggleByLabel(page, /previously\s+(applied|worked|interview)|prior\s+(employ|application)|ever\s+(worked|applied)/i, 'No');
  await clickToggleByLabel(page, /non.?compete|conflict\s+of\s+interest|restrictive\s+covenant/i, 'No');

  // Location combobox
  await comboSelectByLabel(page, /city\/state.*reside|which\s*city|current.*location|where.*live/i, CANDIDATE.city, CANDIDATE.city);

  // Radio: working location
  await clickRadioByLabel(page, /where\s*in\s*the\s*United\s*States.*working\s*from/i, /willing\s*to\s*relocate/i);

  // Radio: years of experience (pick correct bracket)
  const yrs = parseInt(CANDIDATE.experience) || 7;
  let yrsPattern;
  if (yrs >= 8) yrsPattern = /8\+|8 or more|8\s*years/i;
  else if (yrs >= 6) yrsPattern = /6.?8\s*year/i;
  else if (yrs >= 4) yrsPattern = /4.?6\s*year/i;
  else if (yrs >= 2) yrsPattern = /2.?4\s*year/i;
  else if (yrs >= 1) yrsPattern = /1.?2\s*year/i;
  else yrsPattern = /0.?6\s*month|less\s*than/i;
  await clickRadioByLabel(page, /years.*experience.*python|how\s*many\s*years/i, yrsPattern);

  // Checkboxes: select applicable skills
  const skills = ['python', 'sql', 'r', 'experience working in a product-facing role',
    'tableau', 'bigquery', 'seaborn'];
  await clickCheckboxesByLabel(page, /professional\s*experience.*select\s*all|which.*following.*experience/i, skills);

  // Text fields by label
  await fillByLabel(page, /why.*interested|why.*abridge|why.*company|cover\s*letter/i, role.cover || CANDIDATE.whyResearch || '');
  await fillByLabel(page, /about\s*(you|yourself)|tell\s*us|introduction/i, role.about || CANDIDATE.about);
  await fillByLabel(page, /additional\s*(info|comment|note)/i, CANDIDATE.additional);
  await fillByLabel(page, /salary|compensation|pay\s*expect/i, role.salary || CANDIDATE.salary);
  await fillByLabel(page, /how\s*did\s*you\s*(hear|find|learn)/i, CANDIDATE.source);
  await fillByLabel(page, /start\s*date|when.*start|earliest.*date|available.*start/i, CANDIDATE.startDate);
  await fillByLabel(page, /pronoun/i, CANDIDATE.pronouns || '');

  const emptyCount = await page.evaluate(() => {
    return [...document.querySelectorAll('input[placeholder="Type here..."], textarea[placeholder="Type here..."]')]
      .filter(el => el.offsetParent && !el.value?.trim()).length;
  }).catch(() => 0);
  if (emptyCount > 0) console.log(`  ⚠️  ${emptyCount} "Type here..." field(s) still empty after label matching`);
}

async function fillGreenhouse(page, role) {
  console.log('  [ATS: Greenhouse]');

  await fill(page, ['input[name="first_name"]', 'input[id*="first"]',  'input[placeholder*="First"]', '[data-field="first_name"] input'], CANDIDATE.firstName);
  await fill(page, ['input[name="last_name"]',  'input[id*="last"]',   'input[placeholder*="Last"]',  '[data-field="last_name"] input'],  CANDIDATE.lastName);
  await fill(page, ['input[name="email"]', 'input[type="email"]', '[data-field="email"] input'], CANDIDATE.email);
  await fill(page, ['input[name="phone"]', 'input[type="tel"]',   '[data-field="phone"] input', 'input[placeholder*="Phone"]'], CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[id*="linkedin" i]', 'input[placeholder*="LinkedIn"]', 'input[name="urls[LinkedIn]"]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="website" i]',  'input[id*="website" i]',  'input[placeholder*="Portfolio"]', 'input[name="urls[Portfolio]"]', 'input[name="urls[Other]"]'], CANDIDATE.portfolio);

  // Location combobox
  await comboSelect(page,
    'input[role="combobox"][id*="location" i], input[role="combobox"][id*="city" i]',
    'Philadelphia', 'Philadelphia, Pennsylvania');

  // Country combobox
  await comboSelect(page,
    'input[role="combobox"][id*="country" i]',
    'United States', 'United States');

  // Essay fields
  await fill(page, ['textarea[name*="cover" i]', 'textarea[id*="cover" i]', '[data-field*="cover"] textarea'], role.cover || '');
  await fill(page, ['textarea[name*="why" i]',   'textarea[id*="why" i]',   '[data-field*="why"] textarea'],   role.why   || '');
  await fill(page, ['textarea[name*="about" i]', 'textarea[id*="about" i]', '[data-field*="about"] textarea', 'textarea[name*="intro" i]'], role.about || '');

  // How did you hear
  await fill(page, ['input[name*="source" i]', 'textarea[name*="source" i]', 'input[placeholder*="hear" i]'], CANDIDATE.source);

  // Salary
  await fill(page, ['input[name*="salary" i]', 'input[id*="salary" i]', 'input[placeholder*="salary" i]', 'textarea[name*="salary" i]'], role.salary || CANDIDATE.salary);

  // Sponsorship combobox
  await comboSelect(page, 'input[role="combobox"][id*="sponsor" i]', 'No', 'No');

  // EEO — decline to self-identify
  try {
    await comboSelect(page, 'input[role="combobox"][id*="gender" i]',   'Decline', 'Decline');
    await comboSelect(page, 'input[role="combobox"][id*="race" i]',     'Decline', 'Decline');
    await comboSelect(page, 'input[role="combobox"][id*="veteran" i]',  'I am not', 'not a protected');
    await comboSelect(page, 'input[role="combobox"][id*="disab" i]',    'No, I do not', 'No, I do not');
  } catch {}
}

async function fillLever(page, role) {
  console.log('  [ATS: Lever]');

  await fill(page, ['input[name="name"]',  'input[placeholder*="Full name" i]'],      `${CANDIDATE.firstName} ${CANDIDATE.lastName}`);
  await fill(page, ['input[name="email"]', 'input[placeholder*="Email" i]'],            CANDIDATE.email);
  await fill(page, ['input[name="phone"]', 'input[placeholder*="Phone" i]'],            CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'],   CANDIDATE.linkedin);
  await fill(page, ['input[name*="urls" i]',     'input[placeholder*="Portfolio" i]',
                    'input[placeholder*="Website" i]'],                                  CANDIDATE.portfolio);
  await fill(page, ['input[name*="location" i]', 'input[placeholder*="Location" i]',
                    'input[placeholder*="City" i]'],                                     CANDIDATE.location);

  // Lever cover / comments field
  await fill(page, ['textarea[name="comments"]', 'textarea[name*="cover" i]',
                    'textarea[placeholder*="cover" i]', 'textarea[placeholder*="additional" i]'],
    role.cover || '');

  await fill(page, ['input[name*="salary" i]', 'textarea[name*="salary" i]'], role.salary || CANDIDATE.salary);
}

async function fillWorkable(page, role) {
  console.log('  [ATS: Workable]');

  await fill(page, ['input[name="firstname"]',  'input[id*="first" i]',  'input[placeholder*="First" i]'], CANDIDATE.firstName);
  await fill(page, ['input[name="lastname"]',   'input[id*="last" i]',   'input[placeholder*="Last" i]'],  CANDIDATE.lastName);
  await fill(page, ['input[name="email"]',      'input[type="email"]'],   CANDIDATE.email);
  await fill(page, ['input[name="phone"]',      'input[type="tel"]'],     CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]','input[id*="linkedin" i]'],CANDIDATE.linkedin);
  await fill(page, ['input[name*="website" i]', 'input[name*="portfolio" i]', 'input[placeholder*="Portfolio" i]'], CANDIDATE.portfolio);
  await fill(page, ['input[name*="location" i]','input[placeholder*="City" i]'], CANDIDATE.location);

  await fill(page, ['textarea[name*="cover" i]',  'textarea[id*="cover" i]'],  role.cover || '');
  await fill(page, ['textarea[name*="about" i]',  'textarea[id*="about" i]'],  role.about || '');
  await fill(page, ['textarea[name*="summary" i]','textarea[id*="summary" i]'], role.about || '');
  await fill(page, ['input[name*="salary" i]',    'textarea[name*="salary" i]'], role.salary || CANDIDATE.salary);
}

async function fillGeneric(page, role) {
  console.log('  [ATS: generic/unknown — best-effort fill]');

  // Try both single-name and split-name patterns
  const fullName = `${CANDIDATE.firstName} ${CANDIDATE.lastName}`;
  const nameFilled = await fill(page, [
    'input[name="name"]', 'input[id*="name" i][type="text"]',
    'input[placeholder*="Full name" i]', 'input[placeholder*="Your name" i]',
    'input[name="_systemfield_name"]',
  ], fullName);
  if (!nameFilled) {
    await fill(page, ['input[name="first_name"]', 'input[id*="first"]', 'input[placeholder*="First"]'], CANDIDATE.firstName);
    await fill(page, ['input[name="last_name"]',  'input[id*="last"]',  'input[placeholder*="Last"]'],  CANDIDATE.lastName);
  }

  await fill(page, ['input[type="email"]', 'input[name*="email" i]'], CANDIDATE.email);
  await fill(page, ['input[type="tel"]',   'input[name*="phone" i]'], CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="website" i]',  'input[placeholder*="Portfolio" i]', 'input[placeholder*="Website" i]'], CANDIDATE.portfolio);
  await fill(page, ['input[name*="location" i]', 'input[placeholder*="City" i]',      'input[placeholder*="Location" i]'], CANDIDATE.location);

  await fill(page, ['textarea[name*="cover" i]', 'textarea[id*="cover" i]', 'textarea[placeholder*="cover" i]'], role.cover || '');
  await fill(page, ['textarea[name*="why" i]',   'textarea[id*="why" i]',   'textarea[placeholder*="why" i]'],   role.why   || '');
  await fill(page, ['textarea[name*="about" i]', 'textarea[id*="about" i]', 'textarea[name*="intro" i]'],        role.about || '');
  await fill(page, ['input[name*="salary" i]',   'input[placeholder*="salary" i]', 'textarea[name*="salary" i]'], role.salary || CANDIDATE.salary);
  await fill(page, ['input[name*="source" i]',   'input[placeholder*="hear" i]'], CANDIDATE.source);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

const slug       = process.argv[2];
const debugMode  = process.argv.includes('--debug-fields');

if (!slug || !ROLES[slug]) {
  console.error(`Usage: node fill-form.mjs <role> [--debug-fields]\nAvailable: ${Object.keys(ROLES).join(', ')}`);
  process.exit(1);
}

const role = ROLES[slug];
const ats  = detectATS(role.url);

// ── Greenhouse is excluded from automated apply ────────────────────────────────
if (GREENHOUSE_EXCLUDED && ats === 'greenhouse') {
  console.log(`\n🚫  GREENHOUSE EXCLUDED: "${slug}"`);
  console.log(`    URL: ${role.url}`);
  console.log(`\n    Greenhouse applications must be submitted manually via the company's careers page.`);
  console.log(`    This role has been removed from the automated workflow.\n`);
  process.exit(3);
}

console.log(`\n🚀  Filling form: ${slug}  (${ats})`);
console.log(`    URL: ${role.url}\n`);

const _knownChrome = join(homedir(), 'Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const CHROMIUM_PATH   = existsSync(_knownChrome) ? _knownChrome : undefined;
const BROWSER_PROFILE = cfg.account?.browser_profile || join(homedir(), '.career-ops-browser-profile');

// Use a persistent context so cookies, saved passwords, and sessions survive
// across runs. The profile lives at BROWSER_PROFILE.
const context = await chromium.launchPersistentContext(BROWSER_PROFILE, {
  headless:        false,
  slowMo:          60,
  ...(CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {}),
  args:            ['--disable-blink-features=AutomationControlled'],
  ignoreDefaultArgs: ['--enable-automation'],
});
const page = await context.newPage();

await page.goto(role.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2000);

// ── Accept cookie banners ──────────────────────────────────────────────────────
try {
  const cookieBtn = page.locator('button:has-text("Accept"), button:has-text("Accept all"), button:has-text("I agree")').first();
  if (await cookieBtn.isVisible({ timeout: 1000 })) await cookieBtn.click();
} catch {}

// ── Job not found detection ───────────────────────────────────────────────────
const pageText = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
const notFoundPhrases = [
  'job not found', 'position not found', 'no longer accepting',
  'this job is not available', 'this position has been filled',
  'job has been closed', 'opening is no longer', 'page not found', '404',
];
if (notFoundPhrases.some(p => pageText.includes(p))) {
  console.log(`\n⚠️  JOB CLOSED: "${slug}" — page shows job not found or position unavailable.`);
  console.log('    Skipping. Mark as Discarded in tracker.\n');
  await context.close();
  process.exit(2);
}

// ── Auto account creation / login ─────────────────────────────────────────────
// If the page asks us to log in or create an account before the form, handle it.
async function handleAccountWall(pg) {
  const txt = await pg.evaluate(() => document.body?.innerText?.toLowerCase() || '');
  const needsLogin  = txt.includes('sign in') || txt.includes('log in') || txt.includes('login');
  const needsSignup = txt.includes('create account') || txt.includes('sign up') || txt.includes('register');

  if (!needsLogin && !needsSignup) return;

  console.log('  🔐 Account wall detected — attempting auto sign-in/sign-up...');

  // Try sign-in first (we may already have an account)
  const emailSel  = 'input[type="email"], input[name="email"], input[id*="email" i]';
  const passSel   = 'input[type="password"], input[name="password"], input[id*="password" i]';
  const submitSel = 'button[type="submit"], input[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Continue")';

  try {
    const emailEl = pg.locator(emailSel).first();
    if (await emailEl.isVisible({ timeout: 2000 })) {
      await emailEl.fill(CANDIDATE.email);
      const passEl = pg.locator(passSel).first();
      if (await passEl.isVisible({ timeout: 1500 })) {
        await passEl.fill(CANDIDATE.password);
        const submitEl = pg.locator(submitSel).first();
        if (await submitEl.isVisible({ timeout: 1500 })) {
          await submitEl.click();
          await pg.waitForTimeout(2500);
          console.log('  ✔ Submitted login form');
          return;
        }
      }
    }
  } catch {}

  // If sign-in failed, look for a "Create account" / "Sign up" path
  try {
    const signupLink = pg.locator('a:has-text("Create account"), a:has-text("Sign up"), button:has-text("Create account")').first();
    if (await signupLink.isVisible({ timeout: 1500 })) {
      await signupLink.click();
      await pg.waitForTimeout(1500);

      // Fill signup form
      await fill(pg, ['input[name="first_name"]', 'input[id*="first" i]', 'input[placeholder*="First" i]'], CANDIDATE.firstName);
      await fill(pg, ['input[name="last_name"]',  'input[id*="last" i]',  'input[placeholder*="Last" i]'],  CANDIDATE.lastName);
      await fill(pg, [emailSel], CANDIDATE.email);
      // Fill password twice if confirm field exists
      const passFields = pg.locator(passSel);
      const passCount  = await passFields.count();
      for (let i = 0; i < passCount; i++) await passFields.nth(i).fill(CANDIDATE.password);

      const createBtn = pg.locator('button[type="submit"], button:has-text("Create"), button:has-text("Register"), button:has-text("Sign up")').first();
      if (await createBtn.isVisible({ timeout: 1500 })) {
        await createBtn.click();
        await pg.waitForTimeout(2500);
        console.log('  ✔ Account created with', CANDIDATE.email);
      }
    }
  } catch {}
}

await handleAccountWall(page);

// ── Click Apply button if on JD page ─────────────────────────────────────────
try {
  const applyBtn = page.locator(
    'a:has-text("Apply for this job"), button:has-text("Apply for this job"), ' +
    'a:has-text("Apply Now"), button:has-text("Apply Now"), ' +
    'a:has-text("Apply"), button:has-text("Apply")'
  ).first();
  if (await applyBtn.isVisible({ timeout: 2000 })) {
    await applyBtn.click();
    await page.waitForTimeout(2000);
    console.log('  → Clicked Apply button');
    // Check for account wall again after clicking Apply
    await handleAccountWall(page);
  }
} catch {}

// ── Debug mode: dump all fields and exit ─────────────────────────────────────
if (debugMode) {
  console.log('\n🔍  DEBUG MODE — scanning all form fields on page...\n');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  const fields = await page.evaluate(() => {
    const results = [];

    // All interactive form elements
    const selectors = 'input, textarea, select, [role="combobox"], [role="listbox"], [type="file"], button';
    document.querySelectorAll(selectors).forEach((el, i) => {
      // Find closest label
      let labelText = '';
      if (el.id) {
        const label = document.querySelector(`label[for="${el.id}"]`);
        if (label) labelText = label.innerText.trim();
      }
      if (!labelText) {
        const closest = el.closest('label');
        if (closest) labelText = closest.innerText.trim();
      }
      if (!labelText) {
        // Look for a sibling/parent label or legend
        const parent = el.parentElement;
        const legend = parent?.closest('fieldset')?.querySelector('legend');
        if (legend) labelText = legend.innerText.trim();
        else {
          // Walk up to find a nearby text node
          const prevSib = parent?.querySelector('label, [class*="label"], [class*="Label"]');
          if (prevSib) labelText = prevSib.innerText.trim();
        }
      }

      // Aria label fallback
      const ariaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';

      results.push({
        index:       i,
        tag:         el.tagName.toLowerCase(),
        type:        el.type || el.getAttribute('role') || '',
        name:        el.name || '',
        id:          el.id || '',
        placeholder: el.placeholder || '',
        ariaLabel:   ariaLabel,
        labelText:   labelText,
        visible:     el.offsetParent !== null,
        required:    el.required || el.getAttribute('aria-required') === 'true',
        value:       el.value || '',
        cssSelector: (() => {
          // Build a useful CSS selector
          if (el.name)        return `${el.tagName.toLowerCase()}[name="${el.name}"]`;
          if (el.id)          return `#${el.id}`;
          if (el.placeholder) return `${el.tagName.toLowerCase()}[placeholder="${el.placeholder}"]`;
          const role = el.getAttribute('role');
          if (role)           return `[role="${role}"]`;
          return el.tagName.toLowerCase();
        })(),
      });
    });
    return results;
  });

  // Filter to visible fields only (optionally show all)
  const visible  = fields.filter(f => f.visible);
  const hidden   = fields.filter(f => !f.visible);

  console.log(`Found ${visible.length} visible fields, ${hidden.length} hidden\n`);
  console.log('─'.repeat(60));

  visible.forEach(f => {
    const label = f.labelText || f.ariaLabel || f.placeholder || '(no label)';
    const req   = f.required ? ' 🔴' : '';
    console.log(`[${f.index}] ${f.tag}[${f.type}]${req}`);
    console.log(`    Label:       ${label}`);
    if (f.name)        console.log(`    name:        ${f.name}`);
    if (f.id)          console.log(`    id:          ${f.id}`);
    if (f.placeholder) console.log(`    placeholder: ${f.placeholder}`);
    console.log(`    selector:    ${f.cssSelector}`);
    console.log();
  });

  // Save to file
  const { writeFileSync, mkdirSync } = await import('fs');
  const date     = new Date().toISOString().slice(0, 10);
  const outDir   = 'debug';
  const outFile  = `${outDir}/fields-${slug}-${date}.json`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify({ slug, url: role.url, ats, date, visible, hidden }, null, 2));

  console.log('─'.repeat(60));
  console.log(`✅  Field map saved to: ${outFile}`);
  console.log('   Use the selectors above to add/fix fill logic for this form.');
  console.log('   Browser is open for visual inspection. Ctrl+C to close.\n');

  await new Promise(() => {}); // keep browser open
}

// ── Route to per-ATS filler ───────────────────────────────────────────────────
switch (ats) {
  case 'ashby':      await fillAshby(page, role);      break;
  case 'greenhouse': await fillGreenhouse(page, role);  break;
  case 'lever':      await fillLever(page, role);       break;
  case 'workable':   await fillWorkable(page, role);    break;
  default:           await fillGeneric(page, role);
}

// ── Scroll to reveal any below-fold fields ────────────────────────────────────
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);

// ── EEO / demographic fields (universal pass after main fill) ─────────────────
try {
  await comboSelect(page, 'input[role="combobox"][id*="author" i], select[name*="author" i]',   CANDIDATE.workAuth,    CANDIDATE.workAuth);
  await comboSelect(page, 'input[role="combobox"][id*="sponsor" i], select[name*="sponsor" i]', CANDIDATE.visaNeeded,  CANDIDATE.visaNeeded);
  await comboSelect(page, 'input[role="combobox"][id*="citizen" i], select[name*="citizen" i]', CANDIDATE.citizenship, CANDIDATE.citizenship);
  await comboSelect(page, 'input[role="combobox"][id*="gender" i], select[name*="gender" i]',   CANDIDATE.gender,      CANDIDATE.gender);
  await comboSelect(page, 'input[role="combobox"][id*="race" i], select[name*="race" i]',       CANDIDATE.race,        CANDIDATE.race);
  await comboSelect(page, 'input[role="combobox"][id*="ethnic" i], select[name*="ethnic" i]',   CANDIDATE.race,        CANDIDATE.race);
  await comboSelect(page, 'input[role="combobox"][id*="veteran" i], select[name*="veteran" i]', 'I am not',           'not a protected');
  await comboSelect(page, 'input[role="combobox"][id*="disab" i], select[name*="disab" i]',     'No, I do not',       'No, I do not');
  await fill(page, ['input[name*="start" i]', 'input[placeholder*="start date" i]'],            CANDIDATE.startDate);
  await fill(page, ['input[name*="experience" i]', 'input[placeholder*="years" i]'],            CANDIDATE.experience);
  await fill(page, ['textarea[name*="additional" i]', 'textarea[name*="anything" i]',
                    'textarea[placeholder*="additional" i]', 'textarea[placeholder*="anything" i]'], CANDIDATE.additional);
} catch { /* best-effort */ }

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-SUBMIT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

/** Send a macOS notification */
async function notify(title, message) {
  const { exec } = await import('child_process');
  exec(`osascript -e 'display notification "${message}" with title "${title}"'`);
}

/** Flag reasons — accumulate all blockers, then decide what to do */
const FLAGS = [];

/** Scan for conditions that require human attention before submitting */
async function checkFlags(pg) {
  const issues = [];

  // CAPTCHA
  const hasCaptcha = await pg.evaluate(() =>
    !!(document.querySelector('iframe[src*="recaptcha"], iframe[src*="captcha"], .g-recaptcha, [data-sitekey]'))
  );
  if (hasCaptcha) issues.push('CAPTCHA detected — cannot auto-submit');

  // Empty required visible fields
  const emptyRequired = await pg.evaluate(() => {
    const empties = [];
    document.querySelectorAll('input[required], textarea[required], select[required], [aria-required="true"]').forEach(el => {
      if (el.offsetParent !== null && !el.value?.trim()) {
        const label = document.querySelector(`label[for="${el.id}"]`)?.innerText?.trim()
          || el.getAttribute('aria-label') || el.placeholder || el.name || '(unknown field)';
        empties.push(label);
      }
    });
    return empties;
  });
  if (emptyRequired.length) issues.push(`Empty required fields: ${emptyRequired.slice(0, 5).join(', ')}`);

  // Unexpected long-text / essay fields not in role config
  const hasEssay = await pg.evaluate(() => {
    const textareas = [...document.querySelectorAll('textarea')].filter(t => t.offsetParent !== null && !t.value?.trim());
    return textareas.length > 0;
  });
  if (hasEssay) issues.push('Unfilled essay/textarea field(s) — custom question may need review');

  // Form validation errors already visible
  const hasErrors = await pg.evaluate(() => {
    const errSel = '[class*="error" i]:not(:empty), [class*="invalid" i]:not(:empty), [role="alert"]:not(:empty)';
    return !![...document.querySelectorAll(errSel)].find(el => el.offsetParent !== null && el.innerText?.trim());
  });
  if (hasErrors) issues.push('Form validation errors visible on page');

  return issues;
}

/** Navigate multi-page forms: click Next/Continue until final Submit is visible */
async function navigateToSubmit(pg) {
  const nextSel = [
    'button:has-text("Next")', 'button:has-text("Continue")',
    'button:has-text("Next Step")', 'input[type="submit"][value*="Next" i]',
  ].join(', ');
  const submitSel = [
    'button[type="submit"]:has-text("Submit")',
    'button:has-text("Submit Application")',
    'button:has-text("Submit my application")',
    'button:has-text("Apply Now")',
    'input[type="submit"]',
  ].join(', ');

  let pages = 0;
  while (pages < 8) {  // guard against infinite loops
    await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pg.waitForTimeout(800);

    const submitEl = pg.locator(submitSel).first();
    if (await submitEl.isVisible({ timeout: 1500 }).catch(() => false)) {
      return submitEl; // found the final submit button
    }

    const nextEl = pg.locator(nextSel).first();
    if (await nextEl.isVisible({ timeout: 1500 }).catch(() => false)) {
      console.log(`  → Page ${pages + 1}: clicking Next...`);
      await nextEl.click();
      await pg.waitForTimeout(2000);
      pages++;
    } else {
      break; // no Next and no Submit visible
    }
  }
  return null;
}

/** Detect a confirmation / thank-you page after submission */
async function isConfirmed(pg) {
  const txt = await pg.evaluate(() => document.body?.innerText?.toLowerCase() || '');
  const confirmPhrases = [
    'application submitted', 'application received', 'thank you for applying',
    'thanks for applying', 'successfully submitted', 'we\'ll be in touch',
    'we will review', 'your application is complete', 'application complete',
  ];
  return confirmPhrases.some(p => txt.includes(p));
}

/** Write a row to data/applied-jobs.md */
async function logApplication(status = 'Applied', note = '') {
  const { appendFileSync, readFileSync: rfs } = await import('fs');
  const path      = 'data/applied-jobs.md';
  const date      = new Date().toISOString().slice(0, 10);
  const company   = role.company   || slug;
  const roleTitle = role.role      || slug;
  const resume    = role.pdf       || CANDIDATE.defaultResume;
  const existing  = rfs(path, 'utf8');
  const nums      = [...existing.matchAll(/^\| (\d+) \|/gm)].map(m => parseInt(m[1]));
  const next      = nums.length ? Math.max(...nums) + 1 : 1;
  appendFileSync(path, `| ${next} | ${date} | ${company} | ${roleTitle} | ${ats.toUpperCase()} | ${role.url} | ${resume} | ${status} | ${note} |\n`);
  return next;
}

// ── Main auto-submit flow ─────────────────────────────────────────────────────
const autoMode = process.argv.includes('--auto') || !process.argv.includes('--review');

if (autoMode) {
  console.log('\n⚡  AUTO mode — checking for blockers before submit...\n');

  // 1. Check flags
  FLAGS.push(...(await checkFlags(page)));

  if (FLAGS.length) {
    // Has blockers — pause and notify
    console.log('🚩  FLAGS — human review needed:');
    FLAGS.forEach(f => console.log(`    • ${f}`));
    await notify('career-ops 🚩 Action needed', `${role.company || slug}: ${FLAGS[0]}`);
    console.log('\n    Browser is open. Fix the issues above, then click Submit manually.');
    console.log('    Application NOT logged until you confirm submit.\n');
    await new Promise(() => {}); // keep open
  }

  // 2. Navigate multi-page forms and find Submit
  const submitBtn = await navigateToSubmit(page);

  if (!submitBtn) {
    const msg = 'Submit button not found — may be multi-step or custom form';
    FLAGS.push(msg);
    await notify('career-ops ⚠️ Submit not found', `${role.company || slug}`);
    console.log(`\n⚠️  ${msg}`);
    console.log('    Please locate and click Submit manually. Browser stays open.\n');
    await new Promise(() => {});
  }

  // 3. Final flag check on the submit page
  FLAGS.push(...(await checkFlags(page)));
  if (FLAGS.length) {
    console.log('🚩  FLAGS on submit page:');
    FLAGS.forEach(f => console.log(`    • ${f}`));
    await notify('career-ops 🚩 Action needed', `${role.company || slug}: ${FLAGS[0]}`);
    await new Promise(() => {});
  }

  // 4. Click Submit
  console.log('  🖱  Clicking Submit...');
  await submitBtn.click();
  await page.waitForTimeout(3000);

  // 5. Confirm success
  const confirmed = await isConfirmed(page);
  const company   = role.company || slug;
  const roleTitle = role.role    || slug;

  if (confirmed) {
    const rowNum = await logApplication('Applied', 'Auto-submitted via fill-form.mjs');
    console.log(`\n✅  SUBMITTED: ${company} — ${roleTitle}`);
    console.log(`📝  Logged to data/applied-jobs.md (row #${rowNum})`);
    await notify(`career-ops ✅ Applied!`, `${company} — ${roleTitle}`);
    await context.close();
    process.exit(0);
  } else {
    // May have errored or gone to another page — check for errors
    FLAGS.push(...(await checkFlags(page)));
    if (FLAGS.length) {
      console.log('\n🚩  Submit may have failed — errors detected:');
      FLAGS.forEach(f => console.log(`    • ${f}`));
      await notify('career-ops ❌ Submit failed', `${company}: ${FLAGS[0]}`);
    } else {
      // Ambiguous — not a clear error, not a clear confirmation
      console.log('\n⚠️  Could not confirm submission. Page state is ambiguous.');
      console.log('    Please verify in the browser window and log manually if submitted.');
      await notify('career-ops ⚠️ Verify submission', `${company} — ${roleTitle}`);
    }
    console.log('    Browser stays open for manual verification.\n');
    await new Promise(() => {});
  }

} else {
  // --review mode: fill only, human clicks Submit
  console.log('\n──────────────────────────────────────────────');
  console.log('✅  Form filled. Browser is open for your review.');
  console.log('');
  console.log('📎  Upload your resume:');
  console.log(`    ${role.pdf || CANDIDATE.defaultResume}`);
  console.log('');
  console.log('⚠️   Review all fields then click Submit yourself.');
  console.log('    Remove --review to enable full auto-submit.');
  console.log('──────────────────────────────────────────────\n');
  await new Promise(() => {});
}



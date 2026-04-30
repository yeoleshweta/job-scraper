# Mode: apply-flow — Sequential Job Application Workflow

Full end-to-end flow: pick a job from the discover list → verify it's open → read the form → tailor resume → review → cover letter → review → ready to apply.

**Credentials for account creation if required:**
- Email: shwetayeole09@gmail.com
- Password: Hakunamatata@456

---

## Step 0 — Identify the target job & dedup check

The user provides a job number (e.g. "#3") or company name from the discover list.

If the discover list isn't in context, ask: "Which job would you like to apply to? Give me the number from the list or paste the URL."

**MANDATORY: Check `data/applied-jobs.md` before proceeding.**
- Grep the file for the company name and role title
- If a matching entry exists with status `Applied`, `Interview`, or `Offer` → tell the user:
  > "⚠️ Already applied to [Company] — [Role] on [Date]. Status: [Status]. Skipping to avoid duplicate."
  Then suggest the next job on the list.
- If status is `Closed` or `Rejected` → tell the user and confirm they want to proceed with a new role at the same company.
- If no match → continue to Step 1.

Load candidate context:
- Read `config/profile.yml`
- Read `cv.md`

---

## Step 1 — Verify the job is open

Use Playwright MCP (`browser_navigate` → `browser_snapshot`) to visit the job URL.

**Active indicators (job is open):**
- Apply button visible: "Apply", "Apply Now", "Submit Application", "Apply for this job"
- Job title and description are visible
- No "Job not found", "This position has been filled", "No longer accepting applications"

**Closed indicators:**
- "Job not found", "Position no longer available", "This job has expired"
- Page redirects to company careers home
- Only nav/footer visible, no job content

If closed → tell user: "This job is no longer active. Skipping to next on the list."  
Move to the next job with score ≥ 4 from the discover list.

**Greenhouse check:** If the URL contains `greenhouse.io` or `boards.greenhouse.io`:
> "⛔ This role uses Greenhouse, which is excluded from the automated workflow. Please apply manually via the company's careers page. Want me to move to the next job?"  
Do NOT proceed to Step 2 for Greenhouse URLs.

If open and not Greenhouse → proceed to Step 2.

---

## Step 2 — Open and read the application form

**Via Playwright MCP:**
1. `browser_navigate` to the job URL
2. `browser_snapshot` to capture current state
3. Look for "Apply Now" / "Apply" button — `browser_click` it
4. If redirected to a login/account page:
   - Try to log in with shwetayeole09@gmail.com / Hakunamatata@456
   - If no account exists → create one with those credentials
5. `browser_snapshot` of the full form
6. If multi-page form: capture each page by scrolling or navigating forward

**Extract all form fields:**
List every field visible:
- Text fields: Name, Email, Phone, LinkedIn URL, Portfolio URL, Address
- File uploads: Resume (PDF), Cover Letter (PDF)
- Dropdowns: Work authorization, How did you hear, Years of experience
- Open text: "Why do you want to work here?", "Tell us about yourself", "Describe a challenge", "What is your expected salary?"
- Yes/No: Visa sponsorship, Relocation willingness, Remote preference
- Any custom application questions

Output a **Form Map** before proceeding:
```
FORM MAP — [Company] [Role]
URL: [url]
Status: OPEN ✅

Fields to fill:
1. Full Name → [value]
2. Email → shwetayeole09@gmail.com
3. Phone → +1-947-466-5006
4. LinkedIn → https://linkedin.com/in/sharmashweta08
5. Portfolio → https://shwetasharma.tech
6. Resume PDF → [will generate]
7. Cover Letter PDF → [will generate]
8. Work Authorization → US Citizen / No sponsorship needed
9. [Custom Q1] → [will generate]
10. [Custom Q2] → [will generate]
...
```

---

## Step 3 — Gather fresh data from LinkedIn and Portfolio

Before generating the resume, always fetch current data:

1. `browser_navigate` to https://www.linkedin.com/in/sharmashweta08/ OR WebFetch
2. Extract: current role, all positions, dates, descriptions, skills, recommendations
3. `browser_navigate` to https://shwetasharma.tech OR WebFetch
4. Extract: projects listed, case studies, tools used, key metrics
5. Check for GitHub link on portfolio → if found, WebFetch the pinned repos

**Key data points to capture:**
- All work experience entries (company, title, dates, description bullets)
- All projects (name, description, tech stack, outcomes)
- Certifications (current)
- Any new achievements or metrics not in cv.md

---

## Step 4 — Tailor the resume

Generate a tailored resume in Deedy-ATS format using `templates/deedy-ats.html`.

### Header (always include all of these)
```
Shweta Sharma
shwetayeole09@gmail.com | +1-947-466-5006 | Philadelphia, PA
linkedin.com/in/sharmashweta08 | shwetasharma.tech
```

### Summary (2–3 sentences, tailored to JD)
- Lead with the primary alignment to this specific role
- Include 1 key differentiator (e.g., "...combining clinical NLP research at ABIM with 7+ years of mixed-methods UX research")
- Match language/keywords from the JD

### Education (Drexel ONLY — do not include NMIMS or G.H. Raisoni)
```
Drexel University — MS in Artificial Intelligence & Machine Learning
March 2026 | Philadelphia, PA | College of Computing & Informatics
```

### Work Experience — RELEVANCE RULES
Only include experiences that are relevant to the job description.

**Always include:**
- ABIM co-op (most recent, strong AI/clinical credentials)
- John Deere (UXR practice building, enterprise scale)

**Include if relevant to JD:**
- UrbanFit (wellness/health tech, behavioral analytics, usability testing)
- Capita (e-commerce, personalization, A/B testing, data-driven design)

**Never include:**
- Any experience not in cv.md or LinkedIn
- Anything not relevant to the specific JD

**Bullet format — STAR-aligned:**
Each bullet should follow: Situation/Task → Action → Result
- Lead with strong action verbs
- Include quantifiable outcomes wherever possible
- Match keywords from the JD

Example:
```
– Built NLP bias-detection framework (ClinicalBERT, RoBERTa) on 3,500+ clinical records, improving physician assessment fairness — directly applying ABIM co-op work to [JD keyword]
```

### Projects (pick exactly 2 most relevant to this JD)

**Project pool — always fetch from portfolio + GitHub:**

From ABIM/Drexel:
- Clinical NLP Communication Behavior Detection (ClinicalBERT, RoBERTa, Label Studio, synthetic data)
- NLP Bias Detection in Physician Assessment

From John Deere:
- Self-Serve Survey Platform (250+ products, 60% setup time reduction)
- PM-UX Playbook (80% increase in PM UX literacy)

From UrbanFit:
- Wellness Platform Redesign (35% engagement lift, 28% bounce reduction)
- Stories By Children UX Research (usability + persona + Lean UX)

From Capita:
- E-Commerce Personalization System (7 brands, 11% conversion lift)

**Selection logic:**
- JD mentions AI/NLP/clinical → pick ABIM NLP project + one UXR project
- JD is pure UXR → pick Survey Platform + one UXR project
- JD is Data Analyst/DS → pick ABIM NLP + E-Commerce Personalization
- JD is healthcare → pick ABIM NLP + Wellness Platform Redesign

**Project entry format:**
```html
<div class="project-entry">
  <div class="project-header">
    <span class="project-name">[Project Name]</span>
    <span class="project-tech">[Tech: Python, RoBERTa, Label Studio, etc.]</span>
  </div>
  <p class="project-desc">[2–3 lines: what it was, what you built, key outcome/metric]</p>
</div>
```

### Skills — curated to JD keywords
Group into 3–4 categories based on what the JD emphasizes:

**For UXR roles:**
- Research Methods: [qual methods relevant to JD]
- Quantitative & Analytics: [quant methods relevant]
- AI & Data: [AI/data skills if JD mentions them]
- Tools: [only tools mentioned in JD or directly relevant]

**For Data Science roles:**
- Languages & Frameworks: Python, SQL, PyTorch, [JD-specific]
- NLP & ML: ClinicalBERT, RoBERTa, transformers, [JD-specific]
- Research Methods: A/B Testing, Behavioral Analytics, Statistical Modeling
- Tools: Label Studio, Jupyter, Git, [JD-specific]

**For Data Analyst roles:**
- Analytics: SQL, Python, [BI tools if in JD]
- Research & Insights: Behavioral Analytics, A/B Testing, Segmentation
- Methods: [relevant quant methods from JD]
- Tools: [relevant tools from JD]

---

## Step 5 — Generate the HTML resume

Fill `templates/deedy-ats.html` template with the tailored content.

Replace all `{{PLACEHOLDER}}` variables with actual content.

Save the output to: `output/resume-{company-slug}-{YYYY-MM-DD}.html`

Then convert to PDF:
```bash
cd ~/Documents/career-ops && node generate-pdf.mjs output/resume-{slug}-{date}.html output/resume-{slug}-{date}.pdf
```

---

## Step 6 — Resume review with user

Show the complete resume content as a formatted markdown preview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUME PREVIEW — [Company] [Role]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAME: Shweta Sharma
CONTACT: shwetayeole09@gmail.com | +1-947-466-5006 | Philadelphia, PA
         linkedin.com/in/sharmashweta08 | shwetasharma.tech

SUMMARY:
[full summary text]

EXPERIENCE:
[each role with bullets]

PROJECTS:
[2 projects]

EDUCATION:
Drexel University — MS in AI & Machine Learning | March 2026 | Philadelphia, PA

SKILLS:
[skills by category]

PDF saved to: output/resume-{slug}-{date}.pdf
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then ask:
> "Resume ready for [Company]. Any changes before I write the cover letter? (say 'good' to proceed, or tell me what to adjust)"

**On user feedback:**
- "good" / "looks good" / "approved" → proceed to Step 7
- "change X to Y" → edit the specific field and show updated section, re-ask
- "shorten bullets" → condense experience bullets, re-show
- Do NOT regenerate the entire resume for small changes — edit inline

---

## Step 7 — Write cover letter

Write a tailored cover letter using this structure:

**Format:** 3 short paragraphs, max 250 words, professional but direct.

**Paragraph 1 — The hook (why this company + role)**
- Start with something specific to the company: a product feature, recent news, their mission
- State the role you're applying to
- 2–3 sentences max

**Paragraph 2 — Your strongest proof point for this JD**
- Lead with your biggest differentiator for this specific role
- One concrete achievement with metric
- Bridge explicitly: "my work at [X] directly maps to your need for [Y]"
- 3–4 sentences

**Paragraph 3 — Closing**
- Reinforce one key alignment
- Express genuine interest (not generic)
- CTA: "I'd love to explore how my background can contribute to [specific team/goal]"
- 2–3 sentences

**Tone guidelines:**
- Confident, not boastful
- Specific, not generic ("your AI-powered EHR platform" not "your company")
- Match formality to company culture (startup → direct, enterprise → professional)

Show cover letter as:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COVER LETTER — [Company] [Role]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Date]

[Full cover letter text]

Sincerely,
Shweta Sharma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then ask:
> "Cover letter ready. Any edits? (say 'good' to generate PDF, or tell me what to adjust)"

**On approval:** Generate cover letter PDF:
```bash
node generate-pdf.mjs output/cover-letter-{slug}-{date}.html output/cover-letter-{slug}-{date}.pdf
```

---

## Step 8 — Confirm and hand off

Once both are approved, confirm:

```
✅ [Company] — [Role] is ready to apply

Files:
  Resume:       output/resume-{slug}-{date}.pdf
  Cover Letter: output/cover-letter-{slug}-{date}.pdf

Form answers: [Show pre-filled answers for all custom questions]

Next:
  • The form is open at [URL]
  • Upload resume + cover letter PDFs
  • I've pre-filled the form map above — copy-paste each answer
  • Say "applied" when done and I'll update the tracker
  • Say "next" to move to the next job on the list
```

---

## Step 9 — Update tracker (on "applied")

When user says "applied" or "done":
1. **Append a row to `data/applied-jobs.md`** using today's date:
   ```
   | {next #} | {YYYY-MM-DD} | {Company} | {Role} | {ATS} | {URL} | {resume PDF path} | Applied | {1-line note} |
   ```
2. Write TSV to `batch/tracker-additions/{num}-{slug}.tsv`
3. Run `node merge-tracker.mjs`
4. Confirm: "✅ Logged to applied-jobs.md and tracker. {N} jobs applied so far today."
5. Ask: "Ready for the next one? Say 'next' and I'll start job #{N+1}."

# Mode: pdf — ATS-Optimized PDF Generation

> **Source-of-truth hierarchy** (resolve conflicts top-down):
>
> 1. `config/profile.yml` — name, contact, links
> 2. `cv.md` — narrative content, dates, employers
> 3. `https://shwetasharma.tech` — live portfolio (project framing, current role, latest case studies)
> 4. `https://github.com/yeoleshweta` — code-level evidence (repos, READMEs, languages)
>
> The portfolio and GitHub are **canonical for project descriptions** — recruiters click them. If `cv.md` disagrees with the portfolio, trust the portfolio and surface the drift to the user; do not silently overwrite either source.

---

## ATS Compliance Spec (the contract)

Every PDF this pipeline produces MUST satisfy every item below. These are not style preferences. Applicant Tracking Systems are rules-based parsers, and failing any item means the resume gets dropped before a human ever sees it.

### Layout

- Single column. NO sidebars, NO multi-column layouts, NO text boxes.
- NO `<table>` elements for visual layout (flex/grid only).
- HTML reading order MUST equal visual reading order. No `position: absolute` on content elements (only on the decorative gradient line).
- Section order is fixed: Header → Summary → Core Competencies → Work Experience → Projects → Education → Certifications → Skills.

### Section headers (exact strings ATS parsers recognize)

| Use this               | Acceptable alternates                   | Never use                        |
| ---------------------- | --------------------------------------- | -------------------------------- |
| `Professional Summary` | `Summary`                               | "About Me", "Profile", "Bio"     |
| `Core Competencies`    | `Skills Highlights`                     | "What I'm Good At", "Strengths"  |
| `Work Experience`      | `Professional Experience`, `Experience` | "Career Journey", "My Path"      |
| `Projects`             | `Selected Projects`                     | "Things I've Built", "Portfolio" |
| `Education`            | —                                       | "Schooling", "Academics"         |
| `Certifications`       | `Licenses & Certifications`             | "Credentials"                    |
| `Skills`               | `Technical Skills`                      | "Toolbox", "Tech Stack"          |

### Typography

- All text must be selectable. No rasterized name banners, no SVG text outlines, no text-as-image.
- Bullet character: `•` (U+2022 BULLET). NOT `▸ ◆ ✦ ➤ ▪ ‣`.
- En-dash `–` (U+2013) for date ranges, em-dash `—` for inline asides.
- Hyphenation disabled on body (CSS: `hyphens: none`). Prevents "JavaScript" from breaking into "Java-Script" across lines.
- Maximum 2 fonts. Default: Space Grotesk (headings) + DM Sans (body).
- **ATS Strict Mode** (`profile.yml` → `ats_strict: true`) swaps fonts to system stack: Arial / Calibri / Helvetica. Use this when applying through Taleo, iCIMS, or Workday — common at hospitals, Fortune 500, and government employers.

### Contact format

| Field     | Format                                                     |
| --------- | ---------------------------------------------------------- |
| Email     | `name@domain.com` (no `mailto:` brackets in display text)  |
| Phone     | `+1-555-555-5555` (international format, hyphen-separated) |
| LinkedIn  | `linkedin.com/in/username` (no protocol prefix in display) |
| Portfolio | `shwetasharma.tech` (no protocol prefix in display)        |
| GitHub    | `github.com/yeoleshweta` (no protocol prefix in display)   |
| Location  | `City, State` or `City, Country`                           |

The `href` attributes DO include `https://`. Only the visible display text omits the protocol prefix.

### Date format (consistent across the entire document)

- Work Experience: `MMM YYYY – MMM YYYY` → `Jan 2022 – Mar 2024`.
- Current role: `MMM YYYY – Present`.
- Education with known months: `MMM YYYY – MMM YYYY`.
- Education with year-only knowledge: `YYYY – YYYY` (consistent within the Education section).
- In-progress education: `Expected MMM YYYY`.
- NEVER: `01/2022 – 03/2024`, `Spring 2022`, `'22–'24`.

### File output

- Filename: `cv-shweta-{company-slug}-{role-slug}-{YYYY-MM-DD}.pdf`.
- Size: under 500KB (some ATS reject larger files).
- PDF version: 1.4 or 1.7 (broadest compatibility).
- Metadata: `title = "Shweta Sharma — {Role Title}"`, `author = "Shweta Sharma"`.
- Companion `.docx` for strict ATS targets — see Phase 4.

### Anti-bingo guardrails (the human-recruiter check)

- No keyword appears more than 3 times in the entire document.
- Summary reads as natural prose. Test by reading aloud — if it sounds like a list of keywords stitched together, rewrite for flow.
- No "keyword soup" lines (e.g., "Python, R, SQL, Tableau, Power BI, Excel, JavaScript, AWS, GCP, Azure" as one bullet).
- Skills section: maximum 15 items total, grouped into 3–4 named categories.

### Acronym handling

- Spell out every acronym on first use, with the short form in parentheses: `Natural Language Processing (NLP)`, `Kubernetes (K8s)`, `User Experience (UX) Researcher`.
- After first use, the short form alone is fine.
- Pure shorthand without expansion (`K8s`, `nginx`, `DRF`, `RAG`) fails RPA parsers because they look up the full dictionary form.

---

## Hard Length Caps (prevents layout breakage)

These caps exist because the HTML template has fixed dimensions. Tailored content that exceeds these caps causes the PDF to overflow to a second page, push the Skills section off the bottom, or wrap bullets to four lines and create uneven spacing. **Treat caps as compile-time errors: if generated content exceeds a cap, condense before rendering.**

### Per-element character / word budgets

| Element                | Hard cap                                                         | Notes                                        |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| Professional Summary   | 60 words / 4 lines / 380 chars                                   | Read aloud check                             |
| Core Competencies      | 6–8 items                                                        | Each item: 2–4 words, ≤ 35 characters        |
| Work Experience bullet | 30 words / 180 chars / max 2 visual lines                        | Lead with verb                               |
| Bullets per role       | Most recent role: 4. Others: 3. Capita-era roles: 2.             | Reverse-chronological seniority              |
| Projects section       | 4 projects max                                                   | Drop the weakest if JD doesn't justify all 4 |
| Project description    | 25 words / 150 chars / 1–2 visual lines                          | One-line is preferred                        |
| Education entry        | 1 institution + 1 degree + 1 location line + optional 1 sub-line | No bullets under education                   |
| Certifications         | Max 6 entries, single-line each                                  | Format: `Cert Name — Issuer`                 |
| Skills group           | Max 4 groups, max 8 items per group, each item ≤ 25 chars        | Comma-separated within group                 |

### Page count enforcement

- 1 page is the target for ≤ 10 years of experience.
- 2 pages is the maximum, ever.
- If content overflows after applying caps, the order of removal is:
  1. Drop the weakest project (Projects section can shrink to 3).
  2. Drop the oldest role's least-relevant bullet.
  3. Collapse Skills groups (5 → 4 items per group).
  4. Tighten Summary to 50 words.
     Never drop sections entirely. Never reduce font size below 10pt body / 12pt headings.

### Overflow handling decision tree

1. Generate tailored content following Phase 2.
2. Render HTML.
3. Run `pdftotext` to get text. Count Total visual lines (estimate: chars per line × lines available).
4. If page count > target: apply removal-order steps above, regenerate.
5. If still over after step 3 of removal order: alert user, do not deliver.

---

## Pipeline

### Phase 0 — Pre-flight (run once per session)

1. Read `config/profile.yml` and `cv.md`.
2. `web_fetch https://shwetasharma.tech`. Extract: featured projects, current role framing, summary tagline.
3. `web_fetch https://github.com/yeoleshweta`. Extract: pinned repos, top languages, recent activity, READMEs of pinned projects.
4. Build evidence index: `{project_name → {portfolio_url, github_url, tech_stack, one_line_pitch, last_updated, metrics}}`.
5. Cache for the rest of the session. Re-fetch only if the user says portfolio or GitHub was updated.
6. Surface any drift between `cv.md` and the portfolio (e.g., email mismatch, role title differences) to the user before proceeding.

### Phase 1 — Job ingestion

1. Ask the user for the JD if not in context (text or URL). If URL, `web_fetch` it.
2. Extract keywords into **three buckets** (NOT one flat list):
   - **Hard skills (5–10):** exact tools, languages, frameworks, certifications. Match verbatim if Shweta has them.
   - **Soft skills / methods (3–5):** "stakeholder management", "mixed-methods research", "cross-functional collaboration". Reformulate naturally into existing bullets.
   - **Domain signals (2–4):** "healthcare", "fintech", "enterprise SaaS", "regulated industries". Surface only if cv.md/portfolio support them.
3. Detect company location → paper format:
   - US/Canada → `letter`
   - Rest of world → `a4`
4. Detect role archetype (UX Researcher / Data Analyst / Data Scientist / Product Designer / Forward-Deployed Engineer) → adapts framing in Summary.
5. Detect ATS strictness signal: if the JD mentions Taleo / iCIMS / Workday, or the company is healthcare / Fortune 500 / government, set `ats_strict_mode: true` for this run regardless of profile default.

### Phase 2 — Content tailoring

1. **Match projects to JD using the evidence index** (NOT just cv.md):
   - Score each project on hard-skill overlap, domain match, recency.
   - Select top 3–4. Each MUST have a working portfolio or GitHub URL — if neither exists, drop it or flag to user.
2. **Rewrite Professional Summary** within the 60-word cap:
   - Line 1: positioning statement with seniority + role + years.
   - Line 2: current context (ABIM + Drexel) with 1–2 hard-skill keywords.
   - Line 3: track record with 2 specific metrics from cv.md.
   - Maximum 5 hard-skill keywords across the entire summary (anti-bingo).
3. **Reorder bullets within each role** by JD relevance. Do not rewrite bullets that are already strong; only reorder.
4. **Build Core Competencies:** 6–8 keyword phrases pulled directly from JD's hard-skills bucket, only those Shweta actually has. Format as middot-separated inline list: `Item · Item · Item`.
5. **Inject keywords into existing achievements** using the reformulation table below. Use the JD's exact vocabulary over real experience — never invent.

### Phase 3 — Truthfulness + ATS audit (mandatory; failing any item triggers rebuild)

1. **Truthfulness:** every claim traces to cv.md, portfolio, or GitHub. No exceptions, no "close enough".
2. **Anti-bingo:** read summary + first bullet of each role aloud. If it sounds stitched-together, rewrite for flow.
3. **Acronym audit:** every acronym spelled out on first use.
4. **Header audit:** section headers match the exact strings in the ATS Compliance Spec table.
5. **Keyword frequency audit:** scan the full doc — no term appears more than 3 times.
6. **Length audit:** every element is within its hard cap from the Hard Length Caps table.

### Phase 4 — Render

1. Generate HTML from template + tailored content.
2. Write to `/tmp/cv-shweta-{company-slug}.html`.
3. Generate PDF:
   ```bash
   node generate-pdf.mjs /tmp/cv-shweta-{company-slug}.html \
     output/cv-shweta-{company-slug}-{role-slug}-{YYYY-MM-DD}.pdf \
     --format={letter|a4} \
     --strict={true|false}
   ```
4. **ATS readback** (mandatory checkpoint — fail rebuilds the PDF):
   ```bash
   pdftotext output/cv-shweta-{...}.pdf - | tee /tmp/ats-readback.txt
   ```
   Verify all of the following:
   - Shweta's name appears within the first 3 lines.
   - All 7 section header strings present, in correct order.
   - Bullets render as `•`, not `?` or empty boxes.
   - No ligature corruption (`ﬁ` `ﬂ` should appear as `fi` `fl`).
   - Date format `MMM YYYY` consistent throughout.
   - Email, phone, LinkedIn, portfolio URL, GitHub URL all extractable as plain text.
   - File size under 500KB.
   - Page count ≤ 2.
5. **Word doc companion** (if `export_docx: true` in profile, OR if `ats_strict_mode` was set in Phase 1):
   ```bash
   pandoc /tmp/cv-shweta-{company-slug}.html \
     -o output/cv-shweta-{company-slug}-{role-slug}-{YYYY-MM-DD}.docx \
     --reference-doc=templates/reference.docx
   ```
   For Taleo / iCIMS / Workday targets, ship the `.docx` as primary and the PDF as backup.

### Phase 5 — Report to user

- PDF path + page count (target: 1 page; max 2).
- `.docx` companion path (if generated).
- **Coverage score:** percentage of JD hard-skills present in CV. Healthy band: **60–85%**. Below 60% indicates a genuine mismatch (consider not applying). Above 85% is almost always keyword stuffing — re-audit.
- Keywords NOT included, with reason (usually: Shweta does not have that experience, which is correct).
- Portfolio / GitHub links surfaced in the PDF (every project must have one).
- Drift warnings between cv.md and portfolio (if any).
- ATS readback score: number of sections detected (target 7/7), name in first 3 lines, etc.

---

## Keyword Injection Patterns (ethical, evidence-based)

Use the JD's exact vocabulary over real experience. Reformulate; never fabricate.

| JD term                  | Existing cv.md phrasing                  | Tailored output                                                                             |
| ------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| "RAG pipelines"          | "LLM workflows with retrieval"           | "RAG pipeline design and LLM orchestration workflows"                                       |
| "MLOps"                  | "observability, evals, error handling"   | "MLOps and observability: evals, error handling, cost monitoring"                           |
| "stakeholder management" | "collaborated with team"                 | "stakeholder management across engineering, operations, and business"                       |
| "mixed-methods research" | "ran user interviews and surveys"        | "mixed-methods research combining qualitative interviews with quantitative survey analysis" |
| "behavioral analytics"   | "Hotjar heatmaps and session recordings" | "behavioral analytics via Hotjar heatmaps and session recordings"                           |

### Hard rules

- **NEVER add skills Shweta does not have.** Verify against cv.md, portfolio, and GitHub. If unsure, leave it out.
- **NEVER inflate seniority.** Title comes from cv.md, not aspirations.
- **NEVER invent metrics.** If cv.md says "improved engagement", do NOT change it to "improved engagement by 32%".
- **Reformulate ≠ fabricate.** If the JD asks for something Shweta does not have, leave it out. Coverage below 100% is healthy.
- **Anti-bingo cap:** any keyword used more than 3 times → reformulate one instance with a synonym or drop it.

---

## HTML Template

Use `cv-template.html`. Replace `{{...}}` placeholders.

| Placeholder                                   | Content                                                                            |
| --------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| `{{PAGE_WIDTH}}`                              | `8.5in` (letter) or `210mm` (A4)                                                   |
| `{{ATS_STRICT_CLASS}}`                        | `ats-strict` if strict mode is active, otherwise empty. Toggles font swap via CSS. |
| `{{NAME}}`                                    | from `profile.yml`                                                                 |
| `{{TAGLINE}}`                                 | Role positioning, e.g. `UX Researcher                                              | AI & ML` |
| `{{EMAIL}}`                                   | from `profile.yml`                                                                 |
| `{{PHONE}}`                                   | from `profile.yml`, format `+1-555-555-5555`                                       |
| `{{LINKEDIN_URL}}` / `{{LINKEDIN_DISPLAY}}`   | full URL in `href`, `linkedin.com/in/username` in display text                     |
| `{{PORTFOLIO_URL}}` / `{{PORTFOLIO_DISPLAY}}` | `https://shwetasharma.tech` / `shwetasharma.tech`                                  |
| `{{GITHUB_URL}}` / `{{GITHUB_DISPLAY}}`       | `https://github.com/yeoleshweta` / `github.com/yeoleshweta`                        |
| `{{LOCATION}}`                                | from `profile.yml`                                                                 |
| `{{SUMMARY_TEXT}}`                            | Tailored summary, ≤ 60 words / 4 lines                                             |
| `{{COMPETENCIES}}`                            | 6–8 items, middot-separated: `Item · Item · Item`                                  |
| `{{EXPERIENCE}}`                              | Per-role HTML with reordered bullets (3–4 per role)                                |
| `{{PROJECTS}}`                                | 3–4 projects, **each with `<a href>` to portfolio or GitHub**                      |
| `{{EDUCATION}}`                               | Education HTML (no bullets under entries)                                          |
| `{{CERTIFICATIONS}}`                          | Single-line certs, max 6                                                           |
| `{{SKILLS}}`                                  | Grouped skills, max 4 groups, max 8 items per group                                |

### Required CSS (ATS-safe)

```css
body {
  hyphens: none;
  -webkit-hyphens: none;
  -ms-hyphens: none;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 11pt;
  line-height: 1.5;
}
.ats-strict body,
.ats-strict h1, .ats-strict h2, .ats-strict h3 {
  font-family: Arial, Calibri, Helvetica, sans-serif !important;
}
.competency-tag {
  display: inline-block;        /* visual chip */
  /* No ::before or ::after content that injects characters not in source text. */
  /* ATS only sees source text. */
}
ul { list-style: none; padding-left: 0; }
li::before { content: "• "; }   /* real U+2022, parses cleanly */
li {
  word-break: normal;
  overflow-wrap: break-word;    /* allows long URLs to wrap, prevents horizontal overflow */
}
@page { size: {{PAGE_WIDTH}} 11in; margin: 0.6in; }
/* Decorative gradient line is CSS background only. NOT an SVG. */
```

---

## Canva CV Generation (optional, NOT for ATS)

Canva designs are **not ATS-friendly** by default. They use absolute positioning, fonts that don't always embed, and visual structures that confuse parsers. The Canva flow is for **human-eyes contexts**: warm intros, recruiter-shared decks, networking. NEVER submit a Canva PDF to a corporate ATS without also submitting the HTML/PDF version.

If `config/profile.yml` has `canva_resume_design_id`, offer the user:

- **HTML/PDF** — ATS-optimized, default for cold applications.
- **Canva** — visual, for warm intros and portfolio review.
- **Both** — Canva for human, HTML/PDF for ATS.

### Canva workflow

#### Step 1 — Duplicate the base design

1. `export-design` the base (using `canva_resume_design_id`) as PDF → download URL.
2. `import-design-from-url` using that URL → editable duplicate.
3. Note new `design_id`.

#### Step 2 — Read the design structure

1. `get-design-content` → all text elements with content.
2. Map elements to CV sections by content matching:
   - Candidate's name → header
   - "Summary" or "Professional Summary" → summary
   - Company names from cv.md → experience sections
   - Degree or school names → education
   - Skill keywords → skills
3. If mapping fails, show user what was found and ask for guidance.

#### Step 3 — Generate tailored content

Same generation as Phase 2 + Phase 3 above, including portfolio/GitHub verification, truthfulness audit, and anti-bingo.

**Character budget rule (CRITICAL):** Each replacement must be within ±15% of the original character count. Canva text boxes are fixed-size; longer text overlaps adjacent elements. Count chars in each original element from Step 2 and enforce.

#### Step 4 — Apply edits

1. `start-editing-transaction` on the duplicate.
2. `perform-editing-operations` with `find_and_replace_text` for each section.
3. **Reflow layout after replacement:**
   - Read updated element positions and dimensions from the response.
   - For each Work Experience section (top → bottom): `end_y = top + height`.
   - The next section's header should start at `end_y + consistent_gap` (~30px from the template).
   - Use `position_element` to move the next section's date, company, role, and bullets.
   - Repeat for all sections.
4. **Verify layout before commit:**
   - `get-design-thumbnail` with `transaction_id` and `page_index=1`.
   - Inspect for: text overlap, uneven spacing, cut-off text, text too small.
   - If issues remain: `position_element`, `resize_element`, `format_text`. Repeat until clean.
5. Show user the preview and ask for approval.
6. `commit-editing-transaction` only after user approval.

#### Step 5 — Export and download

1. `export-design` as PDF (`a4` or `letter` based on JD location).
2. **IMMEDIATELY** download — pre-signed S3 URL expires in ~2 hours:
   ```bash
   curl -sL -o "output/cv-shweta-{company}-canva-{YYYY-MM-DD}.pdf" "{download_url}"
   ```
3. Verify:
   ```bash
   file output/cv-shweta-{company}-canva-{YYYY-MM-DD}.pdf
   ```
   Output must show "PDF document". If XML/HTML, the URL expired — re-export.
4. Report: PDF path, file size, Canva design URL (for manual tweaks).

#### Error handling

- `import-design-from-url` fails → fall back to HTML/PDF with message.
- Element mapping fails → warn user, show what was found, ask for manual mapping.
- `find_and_replace_text` finds no matches → try broader substring matching.
- Always provide the Canva design URL so the user can edit manually if auto-edit fails.

---

## Final QA Checklist (run before delivering)

### Truthfulness

- [ ] Every claim traces to cv.md, portfolio, or GitHub.
- [ ] No fabricated metrics or skills.
- [ ] No inflated titles or seniority.
- [ ] cv.md ↔ portfolio drift flagged to user.

### ATS parsing (mandatory — failing any forces a rebuild)

Run `pdftotext output/cv-*.pdf -` and verify:

- [ ] Name appears in first 3 lines.
- [ ] All 7 section headers present in order.
- [ ] Section header strings match the ATS Compliance Spec exactly.
- [ ] Bullets render as `•` (U+2022).
- [ ] No ligature corruption (no `ﬁ` `ﬂ` — should be `fi` `fl`).
- [ ] Date format `MMM YYYY – MMM YYYY` consistent throughout.
- [ ] Email, phone, LinkedIn, portfolio URL, GitHub URL all extractable.
- [ ] No characters render as `?` or boxes.

### Content quality

- [ ] No keyword appears more than 3 times.
- [ ] Summary reads as natural prose (read aloud test).
- [ ] All acronyms spelled out on first use.
- [ ] Every project has a portfolio or GitHub link.
- [ ] Coverage 60–85% (healthy band).

### Length compliance

- [ ] Summary ≤ 60 words.
- [ ] Core Competencies: 6–8 items, each ≤ 35 chars.
- [ ] Bullets ≤ 30 words / 180 chars each.
- [ ] Bullets per role: 4 (current), 3 (recent), 2 (oldest).
- [ ] Projects ≤ 4, each description ≤ 25 words.
- [ ] Skills: max 4 groups, max 8 items per group.

### Format

- [ ] 1 page (preferred) or 2 pages max.
- [ ] File size under 500KB.
- [ ] Filename: `cv-shweta-{company-slug}-{role-slug}-{YYYY-MM-DD}.pdf`.
- [ ] PDF metadata set (title, author).
- [ ] `.docx` companion generated if `ats_strict_mode` was triggered.

---

## Post-generation

- Update tracker: change PDF status from ❌ to ✅.
- Save JD source alongside PDF for audit: `output/cv-shweta-{company}-{role}-{YYYY-MM-DD}.jd.txt`.
- If coverage < 60%: warn the user this is likely not a fit before applying.
- If coverage > 85%: re-audit for keyword stuffing.
- If ATS readback failed any check: rebuild before delivering. Never ship a PDF the parser cannot read.

# Resume Structure & Generation Guide

## Overview

Three tailored 1-page CVs, all using the same HTML/CSS template (`templates/cv-template.html`).

| File | Target roles | Lead with |
|------|-------------|-----------|
| `cv-ux-research.md` | UX Researcher, Senior UX Researcher, UX Researcher – AI/ML | Research craft + mixed-methods depth |
| `cv-data-analyst.md` | Data Analyst, Behavioral Analyst, Insights Analyst, Product Analyst | Analytics + A/B testing + behavioral data |
| `cv-data-science.md` | Data Scientist, NLP Engineer, ML Researcher, Applied Scientist | ML/NLP + Drexel MS + ABIM clinical NLP |

---

## The 1-Page Rule

Every variant must fit on a single letter-size page (8.5×11"). The template font is 11px. To stay in 1 page:

- **Summary:** 2–3 sentences max
- **Core competencies:** 6–8 tags, one line
- **Experience:** 3 roles, 3 bullets each (no more)
- **Projects:** 2–3 entries, 1–2 lines each
- **Education:** 2 entries (Drexel + NMIMS or GH Raisoni), no descriptions
- **Skills:** 1–2 lines, category-prefixed

If a PDF renders as 2 pages, cut bullets — never shrink font.

---

## Personal Details (same across all variants)

```
Name:      Shweta Sharma
Email:     shwetayeole09@gmail.com
Phone:     +1 947-466-5006
LinkedIn:  linkedin.com/in/sharmashweta08
Portfolio: shwetasharma.tech
Location:  Philadelphia, PA
```

---

## Education (same across all variants)

| Degree | Institution | Date |
|--------|-------------|------|
| MS in AI & Machine Learning | Drexel University, Philadelphia PA | March 2026 |
| Diploma in Business Management | NMIMS, Pune India | 2021 |
| BS in Computer Science | G.H. Raisoni College, Pune India | 2015 |

**Co-op:** ABIM — Data Scientist Co-op, Sep 2025 – Mar 2026 (part of Drexel MS program)

---

## Certifications (same across all variants)

- Google UX Design Specialization
- Research Methods — University of London
- Journey Mapping — Nielsen Norman Group (NN/g)

---

## Generating a PDF

```bash
# 1. Edit the target cv-{variant}.md
# 2. Run the auto-pipeline — it will convert md → html → pdf:
node generate-pdf.mjs output/{variant}.html output/{variant}.pdf

# Or trigger via career-ops:
# /career-ops pdf   →  select variant → generates tailored PDF
```

---

## Section Order by Variant

### UX Research
1. Summary
2. Core Competencies (research methods)
3. Experience (John Deere → ABIM → Capita)
4. Projects (ABIM communication pipeline, Stories by Children, John Deere survey)
5. Education
6. Skills

### Data Analyst
1. Summary
2. Core Competencies (analytics tools)
3. Experience (ABIM → Capita → John Deere)
4. Projects (Healthcare Bias, E-Commerce Personalization, Survey Analytics)
5. Education
6. Skills

### Data Science
1. Summary
2. Core Competencies (ML/NLP tools)
3. Experience (ABIM → John Deere → Capita)
4. Projects (Clinical NLP Pipeline, Healthcare Bias Detection, GesturePro)
5. Education
6. Skills

---

## Tailoring Checklist (per application)

- [ ] Summary: first sentence names the exact role title from the JD
- [ ] Competency tags: match keywords from JD (ATS)
- [ ] Top bullet of top job: mirrors the JD's #1 requirement
- [ ] At least one metric per job
- [ ] Project section: pick the 2–3 most relevant to the role type
- [ ] No orphan lines (single word on last line of a bullet)
- [ ] PDF renders as exactly 1 page before sending

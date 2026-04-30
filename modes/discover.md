# Mode: discover — Daily Job Batch Discovery

Run a broad multi-platform job search and return a scored batch of up to 50 fresh postings for candidate review. No applications are submitted. This is a discovery-only step.

---

## Step 1 — Load candidate context

Read the following files before running any searches:
- `config/profile.yml` — name, location, visa, salary, target roles
- `cv.md` — experience, skills, proof points

Extract:
- **Target roles** (in priority order): UX Researcher → Data Scientist/NLP → Data Analyst
- **Location**: Philadelphia PA + Remote preferred
- **Visa**: US authorized, no sponsorship needed
- **Salary floor**: $100K
- **Must-have**: posted in 2026 (last 30 days from today's date)

---

## Step 2 — Run search queries in parallel

Launch as Agent (subagent) so searches run in parallel. Pass the full candidate context above into the subagent prompt.

**GROUP A — UX Researcher (primary role)**
1. `site:indeed.com "UX Researcher" OR "Senior UX Researcher" OR "User Researcher" (Philadelphia OR remote) 2026`
2. `site:wellfound.com "UX Researcher" OR "User Researcher" remote 2026`
3. `site:glassdoor.com "UX Researcher" OR "Senior UX Researcher" Philadelphia OR remote 2026`
4. `site:ziprecruiter.com "UX Researcher" OR "Senior UX Researcher" (Philadelphia OR remote) 2026`
5. `site:jobs.ashbyhq.com "UX Researcher" OR "User Researcher" remote 2026`
6. `site:job-boards.greenhouse.io "Senior UX Researcher" OR "UX Researcher" remote 2026`
7. `site:jobs.lever.co "UX Researcher" OR "Senior User Researcher" remote 2026`

**GROUP B — Data Analyst (tertiary role)**
8. `site:indeed.com "Data Analyst" (Philadelphia OR remote) healthcare OR technology 2026`
9. `site:glassdoor.com "Data Analyst" OR "Product Analyst" OR "Research Analyst" Philadelphia 2026`
10. `site:ziprecruiter.com "Data Analyst" OR "Analytics Analyst" (Philadelphia OR remote) 2026`
11. `site:wellfound.com "Data Analyst" OR "Product Analyst" remote 2026`
12. `site:job-boards.greenhouse.io "Data Analyst" OR "Product Analyst" OR "Research Analyst" remote 2026`
13. `site:jobs.ashbyhq.com "Data Analyst" OR "Product Analyst" remote 2026`

**GROUP C — Data Scientist / NLP (secondary role)**
14. `site:indeed.com "Data Scientist" OR "NLP" OR "Research Scientist" (Philadelphia OR remote) 2026`
15. `site:wellfound.com "Data Scientist" OR "NLP" OR "Machine Learning" remote 2026`
16. `site:glassdoor.com "Data Scientist" Philadelphia OR remote 2026`
17. `site:jobs.ashbyhq.com "Data Scientist" remote 2026`
18. `site:job-boards.greenhouse.io "Data Scientist" OR "Research Scientist" remote 2026`

**GROUP D — Philadelphia Healthcare & Fortune 500**
19. `site:careers.chop.edu "Data Analyst" OR "Research Analyst" OR "UX" 2026`
20. `site:jobs.pennmedicine.org "Data Analyst" OR "Research Analyst" OR "Data Scientist" 2026`
21. `site:careers.jeffersonhealth.org "Data Analyst" OR "UX Researcher" OR "Research Analyst" 2026`
22. `site:careers.comcast.com "UX Researcher" OR "Data Analyst" OR "Data Scientist" 2026`
23. `site:jobs.cigna.com "UX Researcher" OR "Data Analyst" OR "Data Scientist" remote 2026`
24. `site:vanguardjobs.com "UX Researcher" OR "Data Analyst" OR "Product Analyst" 2026`
25. `"Data Analyst" OR "UX Researcher" "Penn Medicine" OR "Jefferson Health" OR "CHOP" Philadelphia 2026`

**GROUP E — Google Boolean broad discovery**
26. `"Senior UX Researcher" remote "full-time" 2026 -site:linkedin.com -site:glassdoor.com`
27. `"UX Researcher" "healthcare" OR "health system" remote 2026 -site:linkedin.com`
28. `"Data Analyst" "healthcare" Philadelphia PA 2026 -site:linkedin.com`
29. `"Product Analyst" OR "Research Analyst" "AI" OR "machine learning" remote 2026 -site:linkedin.com`
30. `"Data Scientist" "NLP" OR "natural language" remote 2026 "apply" -site:linkedin.com`

---

## Step 3 — Filter rules (apply strictly)

Discard any result that:
- Was posted before 2026 (date visible in URL or snippet)
- Is a Junior, Intern, or entry-level role
- Requires visa sponsorship and candidate needs sponsorship (she does NOT — discard only if company explicitly won't sponsor, since she doesn't need it)
- Is outside US (unless remote-first with US-based team)
- Is a duplicate of a company+role already in `data/applications.md`

Retain if:
- Posted date is in 2026 OR posting date is unknown (keep with a note)
- Role matches at least one of the 3 target role families
- Location is Remote, Philadelphia PA, or hybrid within commuting distance

---

## Step 4 — Score each result (1–5)

Score based on fit to candidate profile:

| Score | Criteria |
|-------|----------|
| 5 | Perfect: UXR or Data Science + AI/healthcare + remote + senior level |
| 4 | Strong: good role fit, minor gap (domain, level, or slight location issue) |
| 3 | Decent: adjacent role (Data Analyst, ResearchOps) or some gap |
| 2 | Weak: significant mismatch, borderline worth applying |
| 1 | Poor: keep only if explicitly requested |

Show only scores 3+ in the final table. Discard scores 1–2.

---

## Step 5 — Output format

Return a markdown table sorted by Score (desc), then Company (alpha):

```
| # | Company | Role | Source | URL | Posted | Score | Notes |
|---|---------|------|--------|-----|--------|-------|-------|
```

- **#** — sequential number starting at 1
- **Company** — short name
- **Role** — exact job title
- **Source** — Indeed / Wellfound / Glassdoor / ZipRecruiter / Greenhouse / Ashby / Lever / Company Site
- **URL** — direct link to job posting
- **Posted** — date if known, else "~2026"
- **Score** — X/5
- **Notes** — 1-line reason for fit or flag (e.g., "healthcare AI + Philly", "Data Analyst at CHOP, clinical analytics", "no salary posted")

After the table, show:
```
Total found: XX | After dedup/filter: XX | By source: Indeed(X) Wellfound(X) Glassdoor(X) ZipRecruiter(X) Greenhouse(X) Ashby(X) Lever(X) Other(X)
```

---

## Step 6 — Prompt for next action

After showing the list, ask:

> "Here are today's {N} matches. Pick any # and I'll pull the full JD, score it in detail, generate a tailored CV + cover letter, and give you form answers ready to paste. Just say the number or company name."

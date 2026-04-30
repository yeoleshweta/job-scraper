# Job Application Form — Fill Instructions

## Identity

| Field           | Value                                      |
| --------------- | ------------------------------------------ |
| Name            | Shweta Sharma                              |
| Email           | shwetayeole09@gmail.com                    |
| Phone           | +1 947-466-5006                            |
| LinkedIn        | linkedin.com/in/sharmashweta08             |
| Portfolio       | shwetasharma.tech                          |
| Location        | Philadelphia, PA 19104                     |
| Current company | American Board of Internal Medicine (ABIM) |
| Current title   | UX Researcher (Co-op)                      |

## Visa / Work Authorization

- Authorized to work in the US: **Yes** (F-1 OPT)
- Requires sponsorship now or in future: **No**
- Open to relocate: **Yes**

## Education

**Graduate:** Drexel University — MS, Artificial Intelligence & Machine Learning, 2025
**Undergraduate:** University of Pune — BS, Computer Science

## Experience (if manual entry required)

1. American Board of Internal Medicine (ABIM) — UX Researcher — 2024–2025 — Philadelphia, PA
2. John Deere — UX Researcher — 2021–2023
3. Capita (Arcadia Group) — UX Analyst — 2018–2020

## Pause and Ask Me

- Salary expectations
- Start date / availability
- "How did you hear about this role?" (unless LinkedIn → say LinkedIn)
- Resume file to upload (role-specific versions exist)
- Cover letter file to upload
- Portfolio file upload (use shwetasharma.tech for URL fields)

## EEO / Demographic Questions

Decline to self-identify on all (gender, race, veteran, disability) unless told otherwise.

## Screening Questions

| Question                      | Answer        |
| ----------------------------- | ------------- |
| Authorized to work in the US? | Yes           |
| Require sponsorship?          | No            |
| 18 or older?                  | Yes           |
| Everything else ambiguous     | Pause and ask |

## Dedup Check (MANDATORY — run before every application)

Before opening any application form, check `data/applied-jobs.md`:

```
grep -i "COMPANY_NAME" data/applied-jobs.md
```

- **Match found with status `Applied`/`Interview`/`Offer`** \u2192 do NOT apply again. Tell the user and suggest the next role.
- **Match found with status `Closed`/`Rejected`** \u2192 flag it and ask if they want to try a different role at the same company.
- **No match** \u2192 proceed.

## Post-Apply Logging (MANDATORY — run after every confirmed submission)

After the user confirms they clicked Submit, append a row to `data/applied-jobs.md`:

```
| {next #} | {YYYY-MM-DD} | {Company} | {Role} | {ATS} | {URL} | {resume PDF} | Applied | {brief note} |
```

Then update `data/applications.md` status to `Applied` if an entry exists there.

---

## Platform Notes

- **LinkedIn Easy Apply:** Fill all steps, pause on final submit screen
- **Greenhouse / Lever:** ❌ **EXCLUDED — do not auto-fill.** Greenhouse and Lever applications must be submitted manually via the company's own careers page. If a URL is on `greenhouse.io`, flag it to the user and stop.
- **Ashby:** Single-page or multi-section forms; use combobox pattern for location; single full-name field
- **Workable:** Standard multi-field form; first/last name split
- **Workday / SuccessFactors / Taleo:** Multi-page, fill page by page; stop at login/account walls
- **Company career pages:** Fill what you can, flag anything unusual

### Custom Dropdowns (React-Select / Combobox)

Many ATS forms use custom dropdowns (`role="combobox"`) instead of native `<select>` elements. The Playwright "Select option" action will **fail** on these. Use this 3-step pattern instead:

1. `browser_click` the combobox input to open it
2. `browser_snapshot` to confirm the options list appeared
3. `browser_click` the target option text in the listbox

This applies to any dropdown where Playwright reports: *"Element is not a `<select>` element"*

## Rules

1. NEVER click Submit / Apply / Send — always pause before final action
2. NEVER guess on ambiguous questions — ask
3. NEVER enter salary, start date, or relocation without asking
4. Always flag sponsorship questions even after filling them

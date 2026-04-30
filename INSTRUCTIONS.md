# Career-Ops — What You Can Do

> An AI-powered job search pipeline built on Claude Code.

---

## 🚀 Core Commands

Run any of these inside Claude Code after opening this directory:

| Command                               | What it does                                                  |
| ------------------------------------- | ------------------------------------------------------------- |
| `/career-ops`                         | Show all available commands                                   |
| `/career-ops {paste a job URL or JD}` | Full pipeline — evaluate + generate PDF + log to tracker      |
| `/career-ops scan`                    | Scan 45+ pre-configured company portals for new openings      |
| `/career-ops pdf`                     | Generate an ATS-optimized, tailored CV as a PDF               |
| `/career-ops batch`                   | Evaluate 10+ job offers in parallel using sub-agents          |
| `/career-ops tracker`                 | View the status of all your applications                      |
| `/career-ops apply`                   | Fill out application forms with AI assistance                 |
| `/career-ops pipeline`                | Process a queue of pending job URLs                           |
| `/career-ops contacto`                | Draft a LinkedIn outreach message for a role                  |
| `/career-ops deep`                    | Run deep research on a specific company                       |
| `/career-ops training`                | Evaluate whether a course or certification is worth your time |
| `/career-ops project`                 | Evaluate a portfolio project for relevance to a role          |

---

## 📋 npm Scripts (run in terminal)

| Script                 | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `npm run doctor`       | Validate that all prerequisites are correctly installed |
| `npm run verify`       | Check pipeline integrity                                |
| `npm run normalize`    | Clean up inconsistent application statuses              |
| `npm run dedup`        | Remove duplicate tracker entries                        |
| `npm run merge`        | Merge tracker files into one source of truth            |
| `npm run pdf`          | Generate a PDF directly from the command line           |
| `npm run sync-check`   | Check that your CV and profile are in sync              |
| `npm run liveness`     | Ping all configured portals to check they're alive      |
| `npm run update:check` | Check if a system update is available                   |
| `npm run update`       | Apply a system update                                   |
| `npm run rollback`     | Roll back the last update                               |

---

## 📁 Key Files to Customize

| File                 | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `cv.md`              | Your CV in markdown — the system reads this for every evaluation        |
| `config/profile.yml` | Your preferences, target roles, compensation expectations, values       |
| `portals.yml`        | Companies and job boards to scan                                        |
| `modes/_shared.md`   | Shared context injected into every mode — customize scoring, tone, etc. |

---

## 🖥️ Dashboard (Terminal UI)

Browse your entire pipeline visually:

```bash
cd dashboard
go build -o career-dashboard .      # Build the binary (one-time)
./career-dashboard --path ..         # Run it — the --path flag points to the career-ops root
```

> **Note:** Always use `./career-dashboard` (with `./`). The `--path ..` flag is required because the binary looks for your data files relative to the path you give it — defaulting to `.` would be the `dashboard/` subfolder, not your data.

Features: filter by status, sort by score/date, preview reports inline, update statuses.

---

## 💡 Tips

- **Just paste a job URL** — career-ops auto-detects it and runs the full pipeline without any command.
- **Ask Claude to customize the system** — change archetypes, scoring weights, negotiation scripts, or translate modes just by asking in plain English.
- **The system never submits applications** — you always review and decide before anything is sent.
- **Feed it context** — the more Claude knows about you (proof points, preferences, career story), the better the evaluations get.

---

## 📂 Where Your Data Lives

| Folder     | Contents                                 |
| ---------- | ---------------------------------------- |
| `data/`    | Tracker TSV files (gitignored)           |
| `reports/` | Evaluation reports per role (gitignored) |
| `output/`  | Generated PDF CVs (gitignored)           |

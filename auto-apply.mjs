#!/usr/bin/env node
/**
 * auto-apply.mjs — One-command full pipeline (resilient + halt-on-blocker)
 *
 * Usage:
 *   node auto-apply.mjs                     # discover up to 5 jobs, auto-apply
 *   node auto-apply.mjs --jobs 10           # discover & apply to 10 jobs
 *   node auto-apply.mjs --jobs 10 --dry-run # discover only, don't apply
 *   node auto-apply.mjs --jobs 5 --min-score 4
 *   node auto-apply.mjs --auto-signin       # try auto sign-in (OFF by default — risky)
 *   node auto-apply.mjs --no-pause          # don't pause on errors (silent skip)
 *   node auto-apply.mjs --cooldown-days 14  # re-try discovered/flagged after 14d
 *
 * Behaviour highlights:
 *   - Dedups against the FULL scan history. Anything tried within `cooldown-days`
 *     (default 7) is skipped. URLs marked `applied`/`skipped_*` are skipped forever.
 *   - On CAPTCHA, account wall, validation error, or browser crash → emits a
 *     blocking native macOS alert dialog + sound, brings the terminal to the
 *     foreground, and halts on a readline prompt. The next job only starts
 *     after the user presses Enter (or types `skip` / `quit`).
 *   - Every job outcome is appended to data/scan-history.tsv with a typed
 *     status (applied | flagged_captcha | flagged_account_wall |
 *     flagged_submit_missing | flagged_ambiguous | error_browser |
 *     skipped_expired | skipped_greenhouse), so future runs don't repeat them.
 *   - Flagged/failed jobs are appended to data/manual-apply-queue.md.
 *   - The persistent context is recreated whenever a job fails with a
 *     protocol/disconnect error, so one bad page can't poison the rest.
 */

import { chromium }    from 'playwright';
import { readFileSync, appendFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { parse }       from 'yaml';
import { exec, execSync } from 'child_process';
import * as readline   from 'readline';

// ── CLI args ──────────────────────────────────────────────────────────────────
const args         = process.argv.slice(2);
const getArg       = (flag, def) => { const i = args.indexOf(flag); return i !== -1 ? args[i+1] : def; };
const MAX_JOBS     = parseInt(getArg('--jobs', '5'));
const MIN_SCORE    = parseFloat(getArg('--min-score', '2'));
const DRY_RUN      = args.includes('--dry-run');
const PAUSE_ON_ERR = !args.includes('--no-pause');                 // ON by default — halt for human
const COOLDOWN     = parseInt(getArg('--cooldown-days', '7'));     // re-try discovered/flagged after N days
const SIZE_ARG     = getArg('--size', null);

// ── Config ────────────────────────────────────────────────────────────────────
const portals  = parse(readFileSync('portals.yml',          'utf8'));
const cfg      = parse(readFileSync('config/answers.yml',   'utf8'));

// AUTO_SIGNIN can be enabled either via the CLI flag or via
// `account.auto_signin: true` in config/answers.yml. The persistent browser
// profile already remembers logins, so this is safe to leave on by default
// for users who've opted in.
const AUTO_SIGNIN  = args.includes('--auto-signin') || cfg.account?.auto_signin === true;

const _rawSizeFilter = portals.company_size_filter?.include || ['startup', 'mid', 'large'];
const ALLOWED_SIZES  = new Set(
  SIZE_ARG
    ? SIZE_ARG.split(',').map(s => s.trim().toLowerCase())
    : _rawSizeFilter.map(s => String(s).toLowerCase())
);

const COMPANIES    = (portals.tracked_companies || [])
  .filter(c => c.enabled !== false)
  .filter(c => {
    if (!c.size) return true;
    return ALLOWED_SIZES.has(c.size.toLowerCase());
  });
const TITLE_FILTER = portals.title_filter || { positive: [], negative: [], seniority_boost: [] };
const id  = cfg.identity;
const loc = cfg.location;
const lnk = cfg.links;
const cmp = cfg.compensation;
const aut = cfg.authorization;
const avl = cfg.availability;
const eeo = cfg.eeo;
const ans = cfg.standard_answers;
const res = cfg.resumes;

const C = {
  firstName: id.first_name, lastName: id.last_name, name: id.full_name,
  email: id.email, password: id.password, phone: id.phone,
  location: loc.full, city: loc.city, state: loc.state, zip: loc.zip, country: loc.country,
  linkedin: lnk.linkedin, portfolio: lnk.portfolio,
  salary: cmp.target, salaryRange: cmp.range,
  workAuth: aut.authorized_answer, visaNeeded: aut.sponsorship_answer,
  citizenship: aut.citizenship_answer, startDate: avl.start_date,
  experience: avl.years_of_experience, source: cfg.source?.default || 'Job Board',
  gender: eeo.gender, race: eeo.race, veteran: eeo.veteran, disability: eeo.disability,
  about: ans.about, cover: ans.why_ux_research, additional: ans.additional_info,
};

const BROWSER_PROFILE = cfg.account?.browser_profile || '/Users/shwetasharma/.career-ops-browser-profile';
const _knownPath = '/Users/shwetasharma/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const CHROMIUM_PATH = existsSync(_knownPath) ? _knownPath : undefined;

const HISTORY_PATH      = 'data/scan-history.tsv';
const APPLIED_PATH      = 'data/applied-jobs.md';
const MANUAL_QUEUE_PATH = 'data/manual-apply-queue.md';

// ── Helpers ───────────────────────────────────────────────────────────────────
const log = (...a) => console.log(...a);

// Notification: silent toast in the corner. Use for non-critical updates.
const notify = (title, msg) => {
  const safeTitle = String(title).replace(/"/g, '\\"');
  const safeMsg   = String(msg  ).replace(/"/g, '\\"');
  exec(`osascript -e 'display notification "${safeMsg}" with title "${safeTitle}" sound name "Glass"'`);
};

// Bring the terminal window to the front so the readline prompt is visible.
function activateTerminal() {
  const apps = ['Cursor', 'iTerm', 'Terminal', 'Warp', 'Hyper'];
  for (const app of apps) {
    try { execSync(`osascript -e 'tell application "${app}" to activate' 2>/dev/null`, { timeout: 1500 }); return; } catch {}
  }
}

// MODAL alert: blocks until the user clicks. Use for things that need attention NOW.
// We fire it async (don't await) so it overlays the browser; the readline prompt is the real gate.
function modalAlert(title, message) {
  const safeTitle = String(title).replace(/"/g, '\\"').replace(/'/g, "\\'");
  const safeMsg   = String(message).replace(/"/g, '\\"').replace(/'/g, "\\'");
  // `display dialog` with a single button — user MUST acknowledge.
  // We pipe to /dev/null and add `&` so it doesn't block this process; the blocking happens via readline below.
  const script = `display dialog "${safeMsg}" with title "${safeTitle}" buttons {"OK"} default button "OK" with icon caution`;
  exec(`osascript -e '${script}' >/dev/null 2>&1 &`);
  exec(`afplay /System/Library/Sounds/Sosumi.aiff >/dev/null 2>&1 &`);
}

/**
 * waitForUserInput — blocks the pipeline until the user presses Enter.
 * Returns one of: 'continue' (Enter), 'skip' (typed 'skip'), 'quit' (typed 'quit').
 */
async function waitForUserInput(prompt) {
  activateTerminal();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(prompt, (a) => {
    rl.close();
    const t = (a || '').trim().toLowerCase();
    if (t === 'q' || t === 'quit' || t === 'exit') return resolve('quit');
    if (t === 's' || t === 'skip')                 return resolve('skip');
    resolve('continue');
  }));
}

function detectATS(url) {
  if (/ashbyhq\.com/i.test(url))   return 'ashby';
  if (/greenhouse\.io/i.test(url)) return 'greenhouse';
  if (/lever\.co/i.test(url))      return 'lever';
  if (/workable\.com/i.test(url))  return 'workable';
  if (/bamboohr\.com/i.test(url))  return 'bamboohr';
  return 'generic';
}

function pickResume(title) {
  const t = title.toLowerCase();
  if (/data analyst/i.test(t))                      return res.data_analyst;
  if (/data scientist/i.test(t))                    return res.data_scientist;
  if (/ai researcher|applied researcher/i.test(t))  return res.ai_researcher;
  if (/abridge|clinical|health/i.test(t))           return res.healthcare;
  return res.ux_researcher;
}

function scoreTitle(title) {
  const t = title.toLowerCase();
  if (TITLE_FILTER.negative?.some(k => t.includes(k.toLowerCase()))) return -1;
  if (!TITLE_FILTER.positive?.some(k => t.toLowerCase().includes(k.toLowerCase()))) return 0;
  let score = 2;
  if (TITLE_FILTER.seniority_boost?.some(k => t.includes(k.toLowerCase()))) score += 1;
  if (/ux research|user research/i.test(t)) score += 1;
  return score;
}

function isAlreadyApplied(company, title) {
  try {
    const tracker = readFileSync(APPLIED_PATH, 'utf8');
    const co      = company.toLowerCase();
    const ro      = title.toLowerCase().slice(0, 20);
    return tracker.toLowerCase().includes(co) && tracker.toLowerCase().includes(ro);
  } catch { return false; }
}

// Statuses that mean "never re-process this URL" (job is gone or already applied).
const PERMANENT_SKIP = new Set([
  'applied',
  'skipped_greenhouse',
  'skipped_expired',
]);

/**
 * Returns the most recent (date, status) pair for a URL from scan-history.tsv,
 * or null if no record exists.
 */
function getMostRecentHistory(url) {
  try {
    // Walk the file in reverse — last row written wins, even when dates tie.
    // (Within a single day a URL might be recorded as `discovered` then later
    // as `flagged_*`/`applied`; we want the terminal status, not the initial one.)
    const lines = readFileSync(HISTORY_PATH, 'utf8').split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (!line) continue;
      const cols = line.split('\t');
      if (cols[0] !== url) continue;
      // [url, date, source, title, company, status]
      return { date: cols[1], status: cols[5] };
    }
    return null;
  } catch { return null; }
}

/**
 * Should we skip this URL during discovery?
 *   - PERMANENT_SKIP statuses (applied, skipped_*) → always skip
 *   - 'discovered' (never actually attempted) → DON'T skip; always retry
 *   - 'flagged_*' / 'error_*' (was attempted) → skip for COOLDOWN days
 *
 * The "discovered but never attempted" carve-out is essential: when the
 * pipeline crashes mid-run (or the user hits Ctrl-C), URLs that were queued
 * but never tried still need to be re-attempted on the next run.
 */
function shouldSkipUrl(url) {
  const h = getMostRecentHistory(url);
  if (!h) return false;
  if (PERMANENT_SKIP.has(h.status)) return true;
  if (h.status === 'discovered') return false; // never tried → always retry
  const days = (Date.now() - new Date(h.date).getTime()) / 86_400_000;
  return days < COOLDOWN;
}

function recordHistory(url, company, title, status) {
  if (DRY_RUN) return;
  const date  = new Date().toISOString().slice(0, 10);
  // Sanitize tab characters out of free-text fields
  const t     = (title   || '').replace(/\t|\n|\r/g, ' ').slice(0, 240);
  const co    = (company || '').replace(/\t|\n|\r/g, ' ').slice(0, 80);
  appendFileSync(HISTORY_PATH, `${url}\t${date}\tauto-apply\t${t}\t${co}\t${status}\n`);
}

function logApplication(company, title, ats, url, resume) {
  const date    = new Date().toISOString().slice(0, 10);
  const content = readFileSync(APPLIED_PATH, 'utf8');
  const nums    = [...content.matchAll(/^\| (\d+) \|/gm)].map(m => parseInt(m[1]));
  const next    = nums.length ? Math.max(...nums) + 1 : 1;
  appendFileSync(APPLIED_PATH, `| ${next} | ${date} | ${company} | ${title} | ${ats.toUpperCase()} | ${url} | ${resume} | Applied | Auto-applied via auto-apply.mjs |\n`);
  return next;
}

// ── Manual-apply queue ────────────────────────────────────────────────────────
function ensureManualQueueHeader() {
  if (existsSync(MANUAL_QUEUE_PATH)) return;
  const header = `# Manual-Apply Queue

> Jobs that auto-apply.mjs flagged for human follow-up (CAPTCHA, account wall,
> submit button missing, browser crash, ambiguous result, etc.).
>
> Work top-down. After applying manually, move the row to \`data/applied-jobs.md\`
> and delete it from here (or leave a strikethrough).

| Date | Company | Role | Reason | URL |
|------|---------|------|--------|-----|
`;
  mkdirSync('data', { recursive: true });
  writeFileSync(MANUAL_QUEUE_PATH, header);
}

function queueForManual(job, reason) {
  if (DRY_RUN) return;
  ensureManualQueueHeader();
  const date = new Date().toISOString().slice(0, 10);
  const company = (job.company || '').replace(/\|/g, '/');
  const title   = (job.title   || '').replace(/\|/g, '/');
  const r       = (reason      || '').replace(/\|/g, '/');
  appendFileSync(MANUAL_QUEUE_PATH, `| ${date} | ${company} | ${title} | ${r} | ${job.url} |\n`);
}

// ── Form fillers ──────────────────────────────────────────────────────────────
async function fill(page, selectors, value) {
  if (!value) return;
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 600 })) {
        await el.fill('');
        await el.pressSequentially(String(value), { delay: 30 });
        return;
      }
    } catch {}
  }
}

async function comboSelect(page, sel, typedText, optionMatch) {
  try {
    const el = page.locator(sel).first();
    if (!await el.isVisible({ timeout: 600 })) return;
    await el.click();
    await el.pressSequentially(typedText, { delay: 40 });
    await page.waitForTimeout(600);
    const opt = page.locator(`[role="option"]`).filter({ hasText: new RegExp(optionMatch, 'i') }).first();
    if (await opt.isVisible({ timeout: 1000 })) await opt.click();
  } catch {}
}

async function fillForm(page, company, title) {
  const cover = `I'm excited to apply for the ${title} role at ${company}. ${C.cover}`;

  await fill(page, ['input[data-field="name"]', 'input[name*="full" i]'], C.name);
  await fill(page, ['input[name="first_name"]', 'input[id*="first" i]', 'input[placeholder*="First" i]'], C.firstName);
  await fill(page, ['input[name="last_name"]',  'input[id*="last" i]',  'input[placeholder*="Last" i]'],  C.lastName);
  await fill(page, ['input[type="email"]', 'input[name="email"]', 'input[id*="email" i]'], C.email);
  await fill(page, ['input[type="tel"]', 'input[name="phone"]', 'input[id*="phone" i]'], C.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'], C.linkedin);
  await fill(page, ['input[name*="website" i]', 'input[name*="portfolio" i]', 'input[placeholder*="Portfolio" i]'], C.portfolio);
  await fill(page, ['input[name*="location" i]', 'input[placeholder*="City" i]', 'input[placeholder*="Location" i]'], C.location);
  await fill(page, ['input[name*="salary" i]', 'textarea[name*="salary" i]'], C.salary);
  await fill(page, ['textarea[name*="cover" i]', 'textarea[name*="letter" i]', 'textarea[name*="about" i]',
                    'textarea[name*="why" i]', 'textarea[id*="cover" i]', 'textarea[placeholder*="cover" i]'], cover);
  await fill(page, ['textarea[name*="additional" i]', 'textarea[placeholder*="additional" i]'], C.additional);

  await comboSelect(page, 'select[name*="author" i], [role="combobox"][id*="author" i]', C.workAuth,    C.workAuth);
  await comboSelect(page, 'select[name*="sponsor" i],[role="combobox"][id*="sponsor" i]', C.visaNeeded, C.visaNeeded);
  await comboSelect(page, 'select[name*="gender" i], [role="combobox"][id*="gender" i]', C.gender,     C.gender);
  await comboSelect(page, 'select[name*="race" i],   [role="combobox"][id*="race" i]',   C.race,       C.race);
  await comboSelect(page, 'select[name*="veteran" i],[role="combobox"][id*="veteran" i]','I am not',    'not a protected');
  await comboSelect(page, 'select[name*="disab" i],  [role="combobox"][id*="disab" i]',  'No, I do not','No, I do not');
}

// ── Account wall: detect-only by default; auto-fill only if --auto-signin ────
//
// We have to be careful here. Most modern ATS application pages (Ashby, Lever,
// Workable, etc.) include BOTH:
//   - an `<input type="email">` for the applicant
//   - small auth-y text like "Sign in to your account" or "Continue with email"
//     for returning applicants who already have a profile
// That used to trigger a false positive that paused the whole pipeline. The
// rule below only treats the page as an account wall when there is real
// evidence of a sign-in gate (visible password field, or a hard "you must
// sign in to apply" message AND no actual application form on the page).
async function detectAccountWall(page) {
  try {
    // Strongest signal: a visible password input ⇒ this is a sign-in form.
    const hasPwField = await page.locator('input[type="password"]')
      .first().isVisible({ timeout: 600 }).catch(() => false);
    if (hasPwField) return true;

    // Inspect the form. If the page already shows a real application form
    // (multiple visible fields + resume upload, or name+phone fields), we are
    // past any wall — even if the page also offers a sign-in shortcut.
    const formInfo = await page.evaluate(() => {
      let visibleFormFields = 0;
      let hasResumeUpload   = false;
      let hasNameField      = false;
      let hasPhoneField     = false;

      const inputs = document.querySelectorAll(
        'input, textarea, select, [role="combobox"]'
      );
      for (const el of inputs) {
        if (!el.offsetParent) continue;        // not visible
        if (el.type === 'hidden') continue;
        visibleFormFields++;

        const id   = (el.id || '').toLowerCase();
        const name = (el.name || '').toLowerCase();
        const ph   = (el.placeholder || '').toLowerCase();
        const lbl  = (el.getAttribute('aria-label') || '').toLowerCase();
        const all  = `${id} ${name} ${ph} ${lbl}`;

        if (el.type === 'file' || /resume|cv|attachment/.test(all)) hasResumeUpload = true;
        if (/(^|[^a-z])(name|first|last|full)([^a-z]|$)/.test(all)) hasNameField = true;
        if (el.type === 'tel' || /phone|mobile/.test(all))          hasPhoneField = true;
      }
      return { visibleFormFields, hasResumeUpload, hasNameField, hasPhoneField };
    });

    const isApplicationForm =
      formInfo.visibleFormFields >= 4 &&
      (formInfo.hasResumeUpload || (formInfo.hasNameField && formInfo.hasPhoneField));
    if (isApplicationForm) return false;

    // Last resort: only treat as a wall if the page text says so explicitly.
    // We require strong phrases — vague keywords like "continue with email"
    // are too noisy because every application form has them.
    const txt = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
    const strongAuthGate = /(please sign in to (apply|continue)|sign in to your account to apply|you must (sign in|log in|create an account) to apply|sign up to apply|create an account to apply)/i.test(txt);
    return strongAuthGate;
  } catch { return false; }
}

async function tryAutoSignin(page) {
  if (!AUTO_SIGNIN) return;
  log('  🔐 Account wall — attempting auto sign-in (--auto-signin)...');
  try {
    const em = page.locator('input[type="email"],input[name="email"]').first();
    if (await em.isVisible({ timeout: 1500 })) {
      await em.fill(C.email);
      const pw = page.locator('input[type="password"]').first();
      if (await pw.isVisible({ timeout: 1500 })) {
        await pw.fill(C.password);
        const btn = page.locator('button[type="submit"],button:has-text("Sign in"),button:has-text("Continue"),button:has-text("Log in")').first();
        if (await btn.isVisible({ timeout: 1500 })) {
          await Promise.race([
            btn.click(),
            page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {}),
          ]);
          await page.waitForTimeout(2500);
        }
      }
    }
  } catch (e) {
    log(`  ⚠️ Auto sign-in error (continuing): ${e.message.slice(0, 80)}`);
  }
}

// ── Blocker detection (CAPTCHA in all flavors, validation errors) ────────────
async function detectBlockers(page) {
  const issues = [];

  // Broad CAPTCHA / human-verification detection.
  //
  // IMPORTANT: lots of modern application forms (Ashby, Lever, Greenhouse,
  // Workable, etc.) load INVISIBLE reCAPTCHA v3 in the background to score
  // user behavior. The recaptcha iframe is present but 0x0 / off-screen and
  // requires zero human interaction. The old detector flagged any
  // `iframe[src*="recaptcha"]` — that produced a constant false positive.
  // We now only flag CAPTCHAs that are actually visible and interactive.
  const captchaInfo = await page.evaluate(() => {
    const isInteractive = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      if (r.width < 30 || r.height < 30) return false;        // 0x0 / 1x1 ⇒ invisible v3
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      if (parseFloat(style.opacity || '1') < 0.1) return false;
      // Off-screen positioning (common for invisible widgets)
      if (r.bottom < 0 || r.right < 0) return false;
      if (r.top > window.innerHeight + 200 || r.left > window.innerWidth + 200) return false;
      return true;
    };

    // Cloudflare Turnstile — even "managed" mode shows a visible widget when
    // it actually fires. Invisible Turnstile renders 0x0, so isInteractive
    // filters it correctly.
    for (const f of document.querySelectorAll('iframe[src*="challenges.cloudflare.com"], iframe[src*="turnstile"]')) {
      if (isInteractive(f)) return 'turnstile (visible)';
    }
    for (const w of document.querySelectorAll('.cf-turnstile')) {
      if (isInteractive(w)) return 'turnstile widget (visible)';
    }

    // hCaptcha — invisible mode is opted in via data-size="invisible"
    for (const f of document.querySelectorAll('iframe[src*="hcaptcha"]')) {
      if (isInteractive(f)) return 'hcaptcha (visible)';
    }
    for (const w of document.querySelectorAll('.h-captcha')) {
      if (w.dataset.size === 'invisible') continue;
      if (isInteractive(w)) return 'hcaptcha widget (visible)';
    }

    // reCAPTCHA — skip invisible v3 explicitly, then check visibility
    for (const f of document.querySelectorAll('iframe[src*="recaptcha"]')) {
      if (/size=invisible/.test(f.src || '')) continue;
      if (isInteractive(f)) return 'recaptcha (visible)';
    }
    for (const w of document.querySelectorAll('.g-recaptcha')) {
      if (w.dataset.size === 'invisible') continue;
      if (isInteractive(w)) return 'recaptcha widget (visible)';
    }

    // The "Select all squares with…" image challenge popup — only present
    // after a low-score event, always interactive when shown.
    for (const c of document.querySelectorAll('div[id^="rc-imageselect"], iframe[title*="recaptcha challenge" i], iframe[title*="captcha" i]')) {
      if (isInteractive(c)) return 'recaptcha challenge popup';
    }

    // Strong text gates only — vague stuff like "security check" or
    // "i'm not a robot" (which lives inside the iframe anyway) is too noisy.
    const txt = (document.body?.innerText || '').toLowerCase();
    const phrases = [
      'verify you are human',
      "verify you're human",
      'verify you’re human',
      'verify you are a human',
      'please complete the captcha',
      'prove you are not a robot',
      'complete the security challenge',
    ];
    for (const p of phrases) if (txt.includes(p)) return `text:${p}`;
    return null;
  });
  if (captchaInfo) issues.push({ type: 'CAPTCHA', detail: captchaInfo });

  // Empty required fields
  const empties = await page.evaluate(() => {
    const e = [];
    document.querySelectorAll('input[required],textarea[required],[aria-required="true"]').forEach(el => {
      if (el.offsetParent && !el.value?.trim())
        e.push(el.getAttribute('aria-label') || el.placeholder || el.name || '?');
    });
    return e;
  });
  if (empties.length) issues.push({ type: 'EMPTY_REQUIRED', detail: empties.slice(0, 3).join(', ') });

  // Visible validation errors
  const hasErrors = await page.evaluate(() =>
    !![...document.querySelectorAll('[class*="error"]:not(:empty),[role="alert"]:not(:empty)')]
      .find(el => el.offsetParent && el.innerText?.trim()));
  if (hasErrors) issues.push({ type: 'VALIDATION', detail: 'Validation errors on page' });

  return issues;
}

async function navigateToSubmit(page) {
  const nextSel   = 'button:has-text("Next"),button:has-text("Continue"),button:has-text("Next Step")';
  const submitSel = 'button[type="submit"],button:has-text("Submit Application"),button:has-text("Submit"),input[type="submit"]';
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    const sub = page.locator(submitSel).first();
    if (await sub.isVisible({ timeout: 1200 }).catch(() => false)) return sub;
    const nxt = page.locator(nextSel).first();
    if (await nxt.isVisible({ timeout: 1200 }).catch(() => false)) {
      log(`  → clicking Next (page ${i+1})...`);
      await nxt.click(); await page.waitForTimeout(2000);
    } else break;
  }
  return null;
}

async function isConfirmed(page) {
  const txt = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
  return ['application submitted','application received','thank you for applying',
    'thanks for applying','successfully submitted','we\'ll be in touch',
    'your application is complete'].some(p => txt.includes(p));
}

// ── Halt the pipeline and ask the human ───────────────────────────────────────
/**
 * pauseForHuman — modal alert + sound + readline gate.
 * Returns 'continue' | 'skip' | 'quit'.
 */
async function pauseForHuman({ company, title, url, reason, instruction }) {
  log(`\n  🛑  ${reason}`);
  log(`      ${company} — ${title}`);
  log(`      ${url}`);
  if (instruction) log(`      → ${instruction}`);

  modalAlert(
    `career-ops 🛑 ${reason}`,
    `${company} — ${title}\n\n${instruction || 'Switch to the browser to fix, then return to the terminal and press Enter.'}`
  );
  notify(`career-ops 🛑 ${reason}`, `${company}: ${title}`);

  const choice = await waitForUserInput(
    `\n  ⏎  Press ENTER to resume this job, type "skip" to move on, or "quit" to stop the run: `
  );
  return choice;
}

// ── Top-level crash guard (Playwright protocol errors, etc.) ─────────────────
let unhandledMsgs = [];
process.on('unhandledRejection', (reason) => {
  const msg = reason?.message || String(reason);
  unhandledMsgs.push(msg);
  console.error('\n🔴  Unhandled rejection (non-fatal):', msg);
});

function isContextDeadError(err) {
  const m = (err?.message || String(err)).toLowerCase();
  return m.includes('was not bound')
      || m.includes('target page, context or browser has been closed')
      || m.includes('browser has been closed')
      || m.includes('browser has disconnected')
      || m.includes('browser closed')
      || m.includes('protocol error')
      || m.includes('execution context was destroyed')
      || m.includes('connection closed');
}

// ── STEP 1: Discover jobs via Playwright ─────────────────────────────────────
async function discoverJobs() {
  log('\n🔍  Step 1 — Discovering jobs from tracked companies...\n');
  const context = await chromium.launchPersistentContext(BROWSER_PROFILE, {
    headless: true,
    ...(CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {}),
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const discovered = [];
  let cooldownSkips = 0;
  let alreadyAppliedSkips = 0;

  for (const company of COMPANIES) {
    if (!company.careers_url) continue;
    log(`  Scanning ${company.name}...`);
    try {
      const page = await context.newPage();
      await page.goto(company.careers_url, { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(3000);
      try {
        await page.waitForSelector(
          'a[href*="ashbyhq.com"], a[href*="lever.co"], a[href*="workable.com"], a[href*="/jobs/"], a[href*="/careers/"], a[href*="/positions/"]',
          { timeout: 5000 }
        );
      } catch {}

      const jobs = await page.evaluate(() => {
        const links = [];
        const seen  = new Set();
        document.querySelectorAll('a[href]').forEach(a => {
          const text = (a.innerText || a.textContent)?.trim().replace(/\s+/g, ' ');
          const href = a.href;
          if (!text || text.length < 3 || text.length > 200) return;
          if (seen.has(href)) return;
          const isAtsUrl = /\/(jobs|careers|positions|openings|apply)\//i.test(href)
            || /ashbyhq\.com\/[^/]+\/[^/]+/i.test(href)
            || /lever\.co\/[^/]+\/[^/]+/i.test(href)
            || /workable\.com\/[^/]+\/j\//i.test(href)
            || /greenhouse\.io\/[^/]+\/jobs\/\d/i.test(href);
          if (!isAtsUrl) return;
          // Drop common navigation links and obvious non-job pages
          if (/^(home|about|blog|press|privacy|terms|contact|login|sign.?in|team|culture|benefits|faq|support|insights|news|stories|life|values|mission|diversity|perks|locations|hiring|talent.network|join.us|see.all|view.all|all.jobs|browse|search)$/i.test(text)) return;
          // A real job title almost always has 2+ words. One-word "titles" are usually nav.
          if (text.split(/\s+/).length < 2) return;
          seen.add(href);
          links.push({ title: text, url: href });
        });
        return links;
      });
      log(`    → ${jobs.length} raw links found`);

      let matched = 0;
      for (const job of jobs) {
        const score = scoreTitle(job.title);
        if (score < 1) continue;
        if (shouldSkipUrl(job.url)) { cooldownSkips++; continue; }
        if (isAlreadyApplied(company.name, job.title)) { alreadyAppliedSkips++; continue; }
        if (detectATS(job.url) === 'greenhouse') {
          recordHistory(job.url, company.name, job.title, 'skipped_greenhouse');
          continue;
        }
        matched++;
        discovered.push({ company: company.name, title: job.title, url: job.url, score });
        recordHistory(job.url, company.name, job.title, 'discovered');
      }
      if (matched > 0) log(`    ✓ ${matched} qualifying job(s) at ${company.name}`);
      await page.close();
    } catch (e) {
      log(`  ⚠️  ${company.name}: ${e.message.slice(0, 60)}`);
    }
  }

  await context.close();
  log(`\n  Dedup skipped: ${cooldownSkips} (cooldown ${COOLDOWN}d), ${alreadyAppliedSkips} already-applied\n`);

  const seen = new Set();
  return discovered
    .filter(j => { if (seen.has(j.url)) return false; seen.add(j.url); return true; })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_JOBS * 3);
}

// ── Context lifecycle helpers ─────────────────────────────────────────────────
async function createApplyContext() {
  return await chromium.launchPersistentContext(BROWSER_PROFILE, {
    headless: false,
    slowMo: 50,
    ...(CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {}),
    args: ['--disable-blink-features=AutomationControlled'],
    ignoreDefaultArgs: ['--enable-automation'],
  });
}

async function safeClose(target) {
  try { if (target) await target.close(); } catch {}
}

// ── STEP 2: Apply to discovered jobs ─────────────────────────────────────────
async function applyToJobs(jobs) {
  const toApply = jobs.filter(j => j.score >= MIN_SCORE).slice(0, MAX_JOBS);
  if (toApply.length === 0) {
    log('\n⚠️  No jobs passed the score threshold. Try lowering --min-score.\n');
    return { applied: [], flagged: [], failed: [] };
  }
  log(`\n🚀  Step 2 — Applying to ${toApply.length} jobs...\n`);
  log(`    Pause-on-blocker: ${PAUSE_ON_ERR ? 'ON' : 'off'}   Auto-signin: ${AUTO_SIGNIN ? 'ON' : 'off'}\n`);

  let context = await createApplyContext();
  const results = { applied: [], flagged: [], failed: [] };

  for (let i = 0; i < toApply.length; i++) {
    const job = toApply[i];
    log(`\n────────── [${i+1}/${toApply.length}] ────────────────────────`);
    log(`📋  ${job.company} — ${job.title}`);
    log(`    ${job.url}`);

    let page = null;
    let outcome = null;   // { kind: 'applied'|'flagged'|'failed', reason, status }

    try {
      // Recover from a dead context before opening the next page
      if (!context) {
        log('  ↻  Recreating browser context...');
        context = await createApplyContext();
      }

      page = await context.newPage();
      page.on('crash', () => log('  💥 page crashed'));
      await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(2000);

      // Cookie banner
      try {
        const cb = page.locator('button:has-text("Accept"),button:has-text("Accept all"),button:has-text("I agree")').first();
        if (await cb.isVisible({ timeout: 800 })) await cb.click();
      } catch {}

      // Closed job?
      const txt = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
      const closed = ['job not found','no longer accepting','position has been filled',
        'job has been closed','page not found'].some(p => txt.includes(p));
      if (closed) {
        log('  ⛔ Job closed — skipping');
        outcome = { kind: 'failed', reason: 'Job closed', status: 'skipped_expired' };
      }

      // Account wall — detect first; pause for human OR try auto sign-in
      if (!outcome && await detectAccountWall(page)) {
        if (AUTO_SIGNIN) {
          await tryAutoSignin(page);
          if (await detectAccountWall(page)) {
            if (PAUSE_ON_ERR) {
              const ch = await pauseForHuman({
                ...job,
                reason: 'Account wall (auto sign-in failed)',
                instruction: 'Sign in to the portal in the open browser window, then return here.',
              });
              if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
              if (ch === 'skip') outcome = { kind: 'flagged', reason: 'Account wall (skipped)', status: 'flagged_account_wall' };
            } else {
              outcome = { kind: 'flagged', reason: 'Account wall', status: 'flagged_account_wall' };
            }
          }
        } else if (PAUSE_ON_ERR) {
          const ch = await pauseForHuman({
            ...job,
            reason: 'Account wall — please sign in',
            instruction: 'Sign in to the portal in the open browser window, then return here. Auto sign-in is disabled (use --auto-signin to enable).',
          });
          if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
          if (ch === 'skip') outcome = { kind: 'flagged', reason: 'Account wall (skipped)', status: 'flagged_account_wall' };
        } else {
          outcome = { kind: 'flagged', reason: 'Account wall', status: 'flagged_account_wall' };
        }
      }

      // Click Apply if on JD page
      if (!outcome) {
        try {
          const ab = page.locator('a:has-text("Apply"),button:has-text("Apply"),a:has-text("Apply Now"),button:has-text("Apply Now")').first();
          if (await ab.isVisible({ timeout: 1500 })) {
            await ab.click(); await page.waitForTimeout(2000);
            // Re-check for an account wall AFTER clicking Apply. This used to
            // false-positive on Ashby/Lever/Workable forms because the form
            // contains an email field + "sign in for returning applicants"
            // text. detectAccountWall is now strict enough that this should
            // only fire on a real wall, but if it does, try auto sign-in
            // first (when enabled) before bothering the user.
            if (await detectAccountWall(page)) {
              if (AUTO_SIGNIN) {
                await tryAutoSignin(page);
              }
              if (await detectAccountWall(page) && PAUSE_ON_ERR) {
                const ch = await pauseForHuman({
                  ...job,
                  reason: 'Sign-in required to continue application',
                  instruction: AUTO_SIGNIN
                    ? 'Auto sign-in did not complete (likely 2FA, captcha, or unfamiliar form). Finish signing in in the browser, then press Enter.'
                    : 'Sign in in the browser, then press Enter. (Tip: set account.auto_signin: true in config/answers.yml to skip this prompt.)',
                });
                if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
                if (ch === 'skip') outcome = { kind: 'flagged', reason: 'Account wall mid-flow', status: 'flagged_account_wall' };
              }
            }
          }
        } catch {}
      }

      // Pre-fill blocker check (CAPTCHA)
      if (!outcome) {
        const flags = await detectBlockers(page);
        const captcha = flags.find(f => f.type === 'CAPTCHA');
        if (captcha) {
          if (PAUSE_ON_ERR) {
            const ch = await pauseForHuman({
              ...job,
              reason: `CAPTCHA detected (${captcha.detail})`,
              instruction: 'Solve the CAPTCHA in the browser, then press Enter to resume.',
            });
            if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
            if (ch === 'skip') outcome = { kind: 'flagged', reason: 'CAPTCHA (skipped)', status: 'flagged_captcha' };
            else {
              const after = await detectBlockers(page);
              if (after.find(f => f.type === 'CAPTCHA'))
                outcome = { kind: 'flagged', reason: 'CAPTCHA still present after pause', status: 'flagged_captcha' };
              else log('  ✅  CAPTCHA cleared — resuming automation...');
            }
          } else {
            outcome = { kind: 'flagged', reason: 'CAPTCHA detected', status: 'flagged_captcha' };
          }
        }
      }

      // Fill + scroll + navigate to submit
      if (!outcome) {
        log('  ✏️  Filling form...');
        await fillForm(page, job.company, job.title);
        await page.waitForTimeout(800);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(800);

        const submitBtn = await navigateToSubmit(page);
        if (!submitBtn) {
          if (PAUSE_ON_ERR) {
            const ch = await pauseForHuman({
              ...job,
              reason: 'Submit button not found',
              instruction: 'Inspect the form in the browser, manually navigate to the Submit step (or fill missing fields), then press Enter to retry — or "skip" to move on.',
            });
            if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
            if (ch === 'skip') outcome = { kind: 'flagged', reason: 'Submit not found (skipped)', status: 'flagged_submit_missing' };
            else {
              const retry = await navigateToSubmit(page);
              if (!retry) outcome = { kind: 'flagged', reason: 'Submit still not found', status: 'flagged_submit_missing' };
              else {
                await retry.click();
                await page.waitForTimeout(3000);
                if (await isConfirmed(page)) {
                  outcome = { kind: 'applied' };
                } else {
                  outcome = { kind: 'flagged', reason: 'Ambiguous after manual submit', status: 'flagged_ambiguous' };
                }
              }
            }
          } else {
            outcome = { kind: 'flagged', reason: 'Submit not found', status: 'flagged_submit_missing' };
          }
        } else {
          // Final blocker check before clicking Submit
          let flags = await detectBlockers(page);
          if (flags.length && PAUSE_ON_ERR) {
            const summary = flags.map(f => `${f.type}: ${f.detail}`).join(' | ');
            const ch = await pauseForHuman({
              ...job,
              reason: `Issues before submit (${flags[0].type})`,
              instruction: `Fix in browser then press Enter. Details: ${summary}`,
            });
            if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
            if (ch === 'skip') outcome = { kind: 'flagged', reason: `Pre-submit ${flags[0].type}`, status: `flagged_${flags[0].type.toLowerCase()}` };
            else flags = await detectBlockers(page);
          }

          if (!outcome) {
            if (flags.find(f => f.type === 'CAPTCHA')) {
              outcome = { kind: 'flagged', reason: 'CAPTCHA still present at submit', status: 'flagged_captcha' };
            } else {
              log('  🖱  Submitting...');
              await submitBtn.click();
              await page.waitForTimeout(3000);

              if (await isConfirmed(page)) {
                outcome = { kind: 'applied' };
              } else {
                const after = await detectBlockers(page);
                if (after.length && PAUSE_ON_ERR) {
                  const summary = after.map(f => `${f.type}: ${f.detail}`).join(' | ');
                  const ch = await pauseForHuman({
                    ...job,
                    reason: `Submit rejected (${after[0].type})`,
                    instruction: `The form is open in the browser. Fix the ${after[0].type.toLowerCase()} (e.g. missing fields, CAPTCHA, validation), click Submit yourself, then press Enter when you see a confirmation. Type "skip" to flag and move on. Details: ${summary}`,
                  });
                  if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
                  if (ch === 'skip') {
                    outcome = { kind: 'flagged', reason: `Submit failed: ${after[0].type} (skipped)`, status: `flagged_${after[0].type.toLowerCase()}` };
                  } else {
                    // Re-check after manual fix-up
                    if (await isConfirmed(page)) {
                      outcome = { kind: 'applied' };
                    } else {
                      const final = await detectBlockers(page);
                      outcome = final.length
                        ? { kind: 'flagged', reason: `Submit still failing: ${final[0].type}`, status: `flagged_${final[0].type.toLowerCase()}` }
                        : { kind: 'flagged', reason: 'Submission ambiguous after manual retry', status: 'flagged_ambiguous' };
                    }
                  }
                } else if (after.length) {
                  const r = `Submit failed: ${after[0].type}`;
                  outcome = { kind: 'flagged', reason: r, status: `flagged_${after[0].type.toLowerCase()}` };
                } else if (PAUSE_ON_ERR) {
                  // No explicit blocker but no confirmation either — show user, ask
                  const ch = await pauseForHuman({
                    ...job,
                    reason: 'Submission result unclear',
                    instruction: 'No confirmation message detected. Check the browser: did the application go through? Press Enter if YES (will be marked Applied), type "skip" if NO/unclear.',
                  });
                  if (ch === 'quit') { outcome = { kind: 'failed', reason: 'User quit run', status: 'error_user_quit' }; break; }
                  outcome = ch === 'continue'
                    ? { kind: 'applied' }
                    : { kind: 'flagged', reason: 'Ambiguous result (skipped)', status: 'flagged_ambiguous' };
                } else {
                  outcome = { kind: 'flagged', reason: 'Submission ambiguous', status: 'flagged_ambiguous' };
                }
              }
            }
          }
        }
      }

    } catch (e) {
      const msg = (e?.message || String(e)).slice(0, 200);
      log(`  ❌ Error: ${msg}`);
      outcome = { kind: 'failed', reason: msg, status: 'error_browser' };

      if (isContextDeadError(e)) {
        log('  💥 Context appears dead — recreating before next job...');
        await safeClose(context);
        context = null;
        if (PAUSE_ON_ERR) {
          const ch = await pauseForHuman({
            ...job,
            reason: 'Browser crashed — context being rebuilt',
            instruction: 'The next job will open in a fresh browser window. Press Enter to continue, or "quit" to stop.',
          });
          if (ch === 'quit') break;
        }
      } else if (PAUSE_ON_ERR) {
        const ch = await pauseForHuman({
          ...job,
          reason: 'Unexpected error — review or skip',
          instruction: `Error: ${msg}\nPress Enter to continue with the next job, or "quit" to stop.`,
        });
        if (ch === 'quit') break;
      }
    } finally {
      try { if (page && !page.isClosed()) await page.close(); } catch {}
      // Pace ourselves
      await new Promise(r => setTimeout(r, 1500));
    }

    // Record outcome to history + tracker / queue
    if (outcome?.kind === 'applied') {
      const resume = pickResume(job.title);
      const rowNum = logApplication(job.company, job.title, detectATS(job.url), job.url, resume);
      log(`  ✅ APPLIED! Logged as row #${rowNum}`);
      notify('career-ops ✅ Applied!', `${job.company} — ${job.title}`);
      recordHistory(job.url, job.company, job.title, 'applied');
      results.applied.push(job);
    } else if (outcome?.kind === 'flagged') {
      log(`  🚩 Flagged: ${outcome.reason}`);
      recordHistory(job.url, job.company, job.title, outcome.status || 'flagged_other');
      queueForManual(job, outcome.reason);
      results.flagged.push({ ...job, reason: outcome.reason });
    } else {
      log(`  ❌ Failed: ${outcome?.reason || 'unknown'}`);
      recordHistory(job.url, job.company, job.title, outcome?.status || 'error_unknown');
      // Closed jobs don't go in the manual queue (they're gone), but everything else does
      if (outcome?.status !== 'skipped_expired' && outcome?.status !== 'error_user_quit') {
        queueForManual(job, outcome?.reason || 'Failed');
      }
      results.failed.push({ ...job, reason: outcome?.reason || 'unknown' });
      if (outcome?.status === 'error_user_quit') break;
    }
  }

  await safeClose(context);
  return results;
}

// ── STEP 3: Summary ───────────────────────────────────────────────────────────
function printSummary(discovered, results) {
  log('\n══════════════════════════════════════════════');
  log('📊  AUTO-APPLY SUMMARY');
  log('══════════════════════════════════════════════');
  log(`  Discovered:  ${discovered.length} jobs`);
  if (DRY_RUN) {
    log('\n  DRY RUN — top jobs found:\n');
    discovered.slice(0, MAX_JOBS).forEach((j, i) =>
      log(`  ${i+1}. [${j.score}★] ${j.company} — ${j.title}\n     ${j.url}`));
  } else {
    log(`  Applied:     ${results.applied.length}`);
    log(`  Flagged:     ${results.flagged.length} (need attention — see ${MANUAL_QUEUE_PATH})`);
    log(`  Failed:      ${results.failed.length}`);
    if (results.applied.length) {
      log('\n  ✅ Applied to:');
      results.applied.forEach(j => log(`     • ${j.company} — ${j.title}`));
    }
    if (results.flagged.length) {
      log('\n  🚩 Needs attention:');
      results.flagged.forEach(j => log(`     • ${j.company} — ${j.title}: ${j.reason}`));
    }
  }
  log('══════════════════════════════════════════════\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
const sizeLabel = [...ALLOWED_SIZES].join(', ');
log(`\n🤖  auto-apply.mjs — jobs: ${MAX_JOBS}, min-score: ${MIN_SCORE}, size: [${sizeLabel}]${DRY_RUN ? ', DRY RUN' : ''}`);
log(`    Cooldown: ${COOLDOWN}d   Pause-on-blocker: ${PAUSE_ON_ERR ? 'ON' : 'off'}   Auto-signin: ${AUTO_SIGNIN ? 'ON' : 'off'}`);
log(`    Scanning ${COMPANIES.length} companies\n`);

const discovered = await discoverJobs();
log(`\n  Found ${discovered.length} new qualifying jobs\n`);

if (DRY_RUN || discovered.length === 0) {
  printSummary(discovered, { applied: [], flagged: [], failed: [] });
  process.exit(0);
}

let results = { applied: [], flagged: [], failed: [] };
try {
  results = await applyToJobs(discovered);
} catch (e) {
  log(`\n🔴  Fatal error in apply pipeline: ${e.message}`);
  log('    Partial results shown below.');
}
printSummary(discovered, results);

notify('career-ops 🏁 Done', `Applied: ${results.applied.length} | Flagged: ${results.flagged.length}`);
process.exit(0);

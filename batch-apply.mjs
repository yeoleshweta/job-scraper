#!/usr/bin/env node
/**
 * batch-apply.mjs — Batch fill applications across Greenhouse/Lever/Ashby/Workable forms
 * Usage: node batch-apply.mjs
 * ATS is auto-detected from the URL. Opens each form in sequence, fills it,
 * and pauses for you to review + submit. Press Enter to move to the next.
 */

import { chromium } from 'playwright';
import * as readline from 'readline';

const CHROMIUM_PATH = '/Users/shwetasharma/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const CANDIDATE = {
  name:        'Shweta Sharma',
  firstName:   'Shweta',
  lastName:    'Sharma',
  email:       'shwetayeole09@gmail.com',
  phone:       '9474665006',
  location:    'Philadelphia, PA',
  linkedin:    'https://linkedin.com/in/sharmashweta08',
  portfolio:   'https://shwetasharma.tech',
  salary:      '$130,000 - $150,000',
  source:      'LinkedIn',
};

// ── Jobs to apply to — ATS is auto-detected from URL ─────────────────────────
// No need to set `type` manually any more; add URLs directly.
const JOBS = [
  { company: 'Doximity',    role: 'Data Analyst',           url: 'https://job-boards.greenhouse.io/doximity/jobs/6738818' },
  { company: 'Xapo Bank',   role: 'Data Analyst',           url: 'https://job-boards.greenhouse.io/xapo61/jobs/7616977003' },
  { company: 'Stripe',      role: 'Staff Data Analyst',     url: 'https://stripe.com/jobs/search?query=data+analyst' },
  { company: 'MongoDB',     role: 'Senior Data Analyst',    url: 'https://www.mongodb.com/company/careers/departments/data-analytics' },
  { company: 'Dropbox',     role: 'Data Analyst, TA',       url: 'https://jobs.dropbox.com/all-jobs' },
  { company: 'CrowdStrike', role: 'Data Protection Analyst',url: 'https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers' },
];

// ── ATS Detection ─────────────────────────────────────────────────────────────
function detectATS(url) {
  if (/ashbyhq\.com/i.test(url))    return 'ashby';
  if (/greenhouse\.io/i.test(url))  return 'greenhouse';
  if (/lever\.co/i.test(url))       return 'lever';
  if (/workable\.com/i.test(url))   return 'workable';
  return 'generic';
}

// Greenhouse is excluded from automated apply — must be submitted manually.
const GREENHOUSE_EXCLUDED = true;

// ── Helpers ──────────────────────────────────────────────────────────────────

async function fill(page, selectors, value) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.fill(value);
        return true;
      }
    } catch {}
  }
  return false;
}

async function comboSelect(page, comboSel, typed, optionContains) {
  try {
    const combo = page.locator(comboSel).first();
    if (!await combo.isVisible({ timeout: 1500 })) return false;
    await combo.click();
    await combo.pressSequentially(typed, { delay: 60 });
    await page.waitForTimeout(1200);
    const opt = page.locator(`[role="option"]:has-text("${optionContains}")`).first();
    if (await opt.isVisible({ timeout: 2000 })) { await opt.click(); return true; }
  } catch {}
  return false;
}

async function fillGreenhouseForm(page) {
  console.log('  [ATS: Greenhouse]');

  await fill(page, ['input[name="first_name"]', 'input[id*="first"]', '[data-field="first_name"] input'], CANDIDATE.firstName);
  await fill(page, ['input[name="last_name"]',  'input[id*="last"]',  '[data-field="last_name"] input'],  CANDIDATE.lastName);
  await fill(page, ['input[name="email"]', 'input[type="email"]'], CANDIDATE.email);
  await fill(page, ['input[name="phone"]', 'input[type="tel"]'],   CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[id*="linkedin" i]', 'input[placeholder*="LinkedIn"]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="salary" i]', 'input[placeholder*="salary" i]', 'input[name*="comp" i]'], CANDIDATE.salary);
  await fill(page, ['input[name*="source" i]', 'input[placeholder*="hear" i]'], CANDIDATE.source);

  await comboSelect(page, 'input[role="combobox"][id*="country" i]', 'United States', 'United States');
  await comboSelect(page, 'input[role="combobox"][id*="location" i], input[role="combobox"][id*="city" i]', 'Philadelphia', 'Philadelphia, Pennsylvania');
  await comboSelect(page, 'input[role="combobox"][id*="sponsor" i]', 'No', 'No');

  // EEO — decline to self-identify
  try {
    await comboSelect(page, 'input[role="combobox"][id*="gender" i]',  'Decline',       'Decline');
    await comboSelect(page, 'input[role="combobox"][id*="race" i]',    'Decline',       'Decline');
    await comboSelect(page, 'input[role="combobox"][id*="veteran" i]', 'I am not',      'not a protected');
    await comboSelect(page, 'input[role="combobox"][id*="disab" i]',   'No, I do not',  'No, I do not');
  } catch {}

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

async function fillAshbyForm(page) {
  console.log('  [ATS: Ashby]');

  const nameFilled = await fill(page, [
    'input[name="_systemfield_name"]',
    'input[placeholder*="Full name" i]',
    'input[placeholder*="Your name" i]',
  ], CANDIDATE.name);
  if (!nameFilled) {
    await fill(page, ['input[name="first_name"]', 'input[placeholder*="First" i]'], CANDIDATE.firstName);
    await fill(page, ['input[name="last_name"]',  'input[placeholder*="Last" i]'],  CANDIDATE.lastName);
  }

  await fill(page, ['input[type="email"]', 'input[name*="email" i]'], CANDIDATE.email);
  await fill(page, ['input[type="tel"]',   'input[name*="phone" i]'], CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="website" i]', 'input[placeholder*="Portfolio" i]', 'input[placeholder*="Website" i]'], CANDIDATE.portfolio);

  const locFilled = await comboSelect(
    page,
    'input[role="combobox"][placeholder*="type" i], input[role="combobox"][placeholder*="location" i], input[role="combobox"][placeholder*="city" i]',
    'Philadelphia', 'Philadelphia'
  );
  if (!locFilled) await fill(page, ['input[name*="location" i]', 'input[placeholder*="City" i]'], CANDIDATE.location);

  await fill(page, ['input[name*="salary" i]', 'input[placeholder*="salary" i]'], CANDIDATE.salary);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

async function fillLeverForm(page) {
  console.log('  [ATS: Lever]');

  await fill(page, ['input[name="name"]', 'input[placeholder*="Full name" i]'], CANDIDATE.name);
  await fill(page, ['input[name="email"]', 'input[placeholder*="Email" i]'],    CANDIDATE.email);
  await fill(page, ['input[name="phone"]', 'input[placeholder*="Phone" i]'],    CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="urls" i]', 'input[placeholder*="Portfolio" i]', 'input[placeholder*="Website" i]'], CANDIDATE.portfolio);
  await fill(page, ['input[name*="location" i]', 'input[placeholder*="Location" i]', 'input[placeholder*="City" i]'], CANDIDATE.location);
  await fill(page, ['input[name*="salary" i]', 'textarea[name*="salary" i]'], CANDIDATE.salary);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

async function fillWorkableForm(page) {
  console.log('  [ATS: Workable]');

  await fill(page, ['input[name="firstname"]', 'input[id*="first" i]', 'input[placeholder*="First" i]'], CANDIDATE.firstName);
  await fill(page, ['input[name="lastname"]',  'input[id*="last" i]',  'input[placeholder*="Last" i]'],  CANDIDATE.lastName);
  await fill(page, ['input[name="email"]', 'input[type="email"]'],  CANDIDATE.email);
  await fill(page, ['input[name="phone"]', 'input[type="tel"]'],    CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[id*="linkedin" i]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="website" i]', 'input[name*="portfolio" i]', 'input[placeholder*="Portfolio" i]'], CANDIDATE.portfolio);
  await fill(page, ['input[name*="location" i]', 'input[placeholder*="City" i]'], CANDIDATE.location);
  await fill(page, ['input[name*="salary" i]', 'textarea[name*="salary" i]'], CANDIDATE.salary);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

async function fillGenericForm(page) {
  console.log('  [ATS: generic/unknown — best-effort fill]');

  const nameFilled = await fill(page, [
    'input[name="name"]', 'input[placeholder*="Full name" i]',
    'input[name="_systemfield_name"]',
  ], CANDIDATE.name);
  if (!nameFilled) {
    await fill(page, ['input[name="first_name"]', 'input[id*="first"]', 'input[placeholder*="First"]'], CANDIDATE.firstName);
    await fill(page, ['input[name="last_name"]',  'input[id*="last"]',  'input[placeholder*="Last"]'],  CANDIDATE.lastName);
  }
  await fill(page, ['input[type="email"]', 'input[name*="email" i]'], CANDIDATE.email);
  await fill(page, ['input[type="tel"]',   'input[name*="phone" i]'], CANDIDATE.phone);
  await fill(page, ['input[name*="linkedin" i]', 'input[placeholder*="LinkedIn" i]'], CANDIDATE.linkedin);
  await fill(page, ['input[name*="website" i]', 'input[placeholder*="Portfolio" i]', 'input[placeholder*="Website" i]'], CANDIDATE.portfolio);
  await fill(page, ['input[name*="location" i]', 'input[placeholder*="City" i]'], CANDIDATE.location);
  await fill(page, ['input[name*="salary" i]', 'textarea[name*="salary" i]'], CANDIDATE.salary);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

// ── Main ─────────────────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const waitForEnter = () => new Promise(resolve => rl.question('\n  Press Enter to continue to next job (or type "quit" to stop)... ', answer => {
  if (answer.trim().toLowerCase() === 'quit') { rl.close(); process.exit(0); }
  resolve();
}));

const browser = await chromium.launch({ headless: false, slowMo: 80, executablePath: CHROMIUM_PATH });
const context = await browser.newContext();
const page = await context.newPage();

for (const job of JOBS) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🚀  ${job.company} — ${job.role}`);
  console.log(`    ${job.url}`);
  console.log('═'.repeat(60));

  try {
    await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);

    // Check if job is dead
    const bodyText = await page.evaluate(() => document.body?.innerText?.toLowerCase() || '');
    const dead = ['page not found', '404', 'no longer', 'not found', 'position has been filled', 'job has been closed'].some(p => bodyText.includes(p));

    if (dead || page.url().includes('error=true')) {
      console.log('  ❌ JOB CLOSED — skipping');
      continue;
    }

    // Auto-detect ATS from the live URL (may differ from original if redirected)
    const ats = detectATS(page.url()) !== 'generic' ? detectATS(page.url()) : detectATS(job.url);
    console.log(`  ATS detected: ${ats}`);

    // Skip Greenhouse — must be submitted manually
    if (GREENHOUSE_EXCLUDED && ats === 'greenhouse') {
      console.log(`  🚧 GREENHOUSE EXCLUDED — apply manually at the company's careers page.`);
      await page.close();
      continue;
    }

    switch (ats) {
      case 'ashby':      await fillAshbyForm(page);      break;
      case 'greenhouse': await fillGreenhouseForm(page);  break;
      case 'lever':      await fillLeverForm(page);       break;
      case 'workable':   await fillWorkableForm(page);    break;
      default:           await fillGenericForm(page);
    }

    console.log('\n  ✅ Form filled. Review in browser, then Submit manually.');
    console.log('  ⚠️  Check: resume uploaded, all dropdowns selected, no missing fields.');

  } catch (err) {
    console.log(`  ❌ Error: ${err.message.substring(0, 100)}`);
  }

  await waitForEnter();
}

console.log('\n🎉 Batch complete!\n');
rl.close();
await browser.close();

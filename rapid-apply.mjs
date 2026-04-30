#!/usr/bin/env node
/**
 * rapid-apply.mjs — Rapid-fire check and fill multiple job forms
 * Opens each URL, checks if live, fills if possible, moves to next.
 * Browser stays open at the end for manual review/submit of any filled forms.
 */

import { chromium } from 'playwright';

const CHROMIUM_PATH = '/Users/shwetasharma/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const CANDIDATE = {
  name: 'Shweta Sharma', firstName: 'Shweta', lastName: 'Sharma',
  email: 'shwetayeole09@gmail.com', phone: '9474665006',
  location: 'Philadelphia, PA', linkedin: 'https://linkedin.com/in/sharmashweta08',
  portfolio: 'https://shwetasharma.tech', salary: '$130,000 - $150,000',
};

const RESUME = '/Users/shwetasharma/Documents/career-ops/output/resume-descript-lead-ux-researcher.pdf';

const JOBS = [
  { slug: 'betterup', url: 'https://jobs.ashbyhq.com/betterup/85ef9c10-2c33-41a8-b035-eff8dfce6165' },
  { slug: 'growtherapy', url: 'https://boards.greenhouse.io/growtherapy/jobs/4349772005' },
  { slug: 'youdotcom', url: 'https://jobs.ashbyhq.com/youdotcom/fdc3b84d-2b16-4379-8b24-8f99907a6e0b' },
  { slug: 'multiverse', url: 'https://apply.workable.com/multiverse/j/55217FE7F0/' },
  { slug: 'feeld', url: 'https://apply.workable.com/feeldco/j/834B977B48' },
  { slug: 'innovaccer', url: 'https://job-boards.greenhouse.io/innovaccer/jobs/7895797002' },
  { slug: 'smartsheet', url: 'https://boards.greenhouse.io/smartsheet/jobs/4820321' },
  { slug: 'intercom', url: 'https://job-boards.greenhouse.io/intercom/jobs/7431143' },
  { slug: 'aurorasolar', url: 'https://jobs.ashbyhq.com/aurorasolar/957c76bb-16f2-4cfc-a468-c350bdc65d9a' },
  { slug: 'skylight', url: 'https://apply.workable.com/skylight/j/681D1CD9D5/' },
  { slug: 'abridge', url: 'https://jobs.ashbyhq.com/abridge/d9234ea7-6052-42e7-b9f3-ed2c35085639' },
  // New direct URLs from research
  { slug: 'mongodb', url: 'https://www.mongodb.com/careers/jobs/7696633' },
  { slug: 'stripe', url: 'https://stripe.com/jobs/listing/data-analyst/5601881' },
  { slug: 'dropbox', url: 'https://www.dropbox.jobs/en/jobs/7536371/people-team-data-analyst-talent-acquisition/' },
  { slug: 'doximity2', url: 'https://job-boards.greenhouse.io/doximity/jobs/6738818' },
];

const browser = await chromium.launch({ headless: false, slowMo: 60, executablePath: CHROMIUM_PATH });
const context = await browser.newContext();

const DEAD_PHRASES = ['job not found', 'page not found', '404', 'no longer', 'position has been filled', 'job has been closed', 'not found'];

const results = { live: [], dead: [] };

for (const job of JOBS) {
  const page = await context.newPage();
  console.log(`\n── ${job.slug} ──`);
  console.log(`   ${job.url}`);

  try {
    await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body?.innerText?.toLowerCase().substring(0, 2000) || '');
    const isDead = DEAD_PHRASES.some(p => bodyText.includes(p)) || page.url().includes('error=true');

    if (isDead) {
      console.log(`   ❌ CLOSED`);
      results.dead.push(job.slug);
      await page.close();
      continue;
    }

    // Check if it redirected to a careers listing page (not a specific job)
    const hasApply = bodyText.includes('apply') || bodyText.includes('submit');
    const hasJobTitle = bodyText.includes('researcher') || bodyText.includes('analyst') || bodyText.includes('designer');

    if (!hasApply && !hasJobTitle) {
      console.log(`   ⚠️  Might be redirected/dead — check manually`);
      results.dead.push(job.slug + '?');
      await page.close();
      continue;
    }

    console.log(`   ✅ LIVE`);
    results.live.push(job.slug);

    // Try to fill common fields
    const fill = async (sels, val) => {
      for (const s of sels) {
        try {
          const el = page.locator(s).first();
          if (await el.isVisible({ timeout: 800 })) { await el.fill(val); return true; }
        } catch {}
      }
      return false;
    };

    // Cookie consent
    try {
      const cookieBtn = page.locator('button:has-text("Accept"), button:has-text("Accept all")').first();
      if (await cookieBtn.isVisible({ timeout: 1000 })) await cookieBtn.click();
    } catch {}

    await page.waitForTimeout(500);

    // Click "Apply" button if we're on a JD page (not yet on form)
    try {
      const applyBtn = page.locator('button:has-text("Apply for this job"), button:has-text("Apply"), a:has-text("Apply for this job")').first();
      if (await applyBtn.isVisible({ timeout: 1500 })) {
        await applyBtn.click();
        await page.waitForTimeout(2000);
        console.log(`   → Clicked Apply`);
      }
    } catch {}

    // Generic fill
    // Name (single field - Ashby/Workable)
    await fill(['input[name="_systemfield_name"]', 'input[placeholder*="name" i]:not([type="email"])'], CANDIDATE.name);
    // First/Last (Greenhouse)
    await fill(['input[name="first_name"]', 'input[id*="first"]', 'input[placeholder*="First"]'], CANDIDATE.firstName);
    await fill(['input[name="last_name"]', 'input[id*="last"]', 'input[placeholder*="Last"]'], CANDIDATE.lastName);
    // Email
    await fill(['input[type="email"]', 'input[name="email"]', 'input[id*="email"]'], CANDIDATE.email);
    // Phone
    await fill(['input[type="tel"]', 'input[name="phone"]', 'input[id*="phone"]'], CANDIDATE.phone);
    // LinkedIn
    await fill(['input[name*="linkedin" i]', 'input[id*="linkedin" i]', 'input[placeholder*="LinkedIn"]'], CANDIDATE.linkedin);
    // Portfolio
    await fill(['input[name*="website" i]', 'input[placeholder*="Portfolio" i]', 'input[placeholder*="Website" i]'], CANDIDATE.portfolio);
    // Location
    await fill(['input[name*="location" i]', 'input[placeholder*="City" i]', 'input[placeholder*="Location" i]'], CANDIDATE.location);
    // Salary
    await fill(['input[name*="salary" i]', 'input[placeholder*="salary" i]', 'textarea[name*="salary" i]', 'input[name*="comp" i]'], CANDIDATE.salary);
    // Source
    await fill(['input[name*="source" i]', 'input[placeholder*="hear" i]'], 'LinkedIn');

    // Resume upload
    try {
      const uploadBtn = page.locator('button:has-text("Upload"), button:has-text("Attach"), button:has-text("Choose file")').first();
      if (await uploadBtn.isVisible({ timeout: 1500 })) {
        const [fc] = await Promise.all([
          page.waitForEvent('filechooser', { timeout: 5000 }),
          uploadBtn.click()
        ]);
        await fc.setFiles(RESUME);
        console.log(`   📎 Resume uploaded`);
        await page.waitForTimeout(1500);
      }
    } catch {}

    console.log(`   ✓ Form partially filled — review in browser tab`);
    // Keep the tab open for manual review

  } catch (err) {
    console.log(`   ❌ Error: ${err.message.substring(0, 80)}`);
    results.dead.push(job.slug);
    await page.close();
  }
}

console.log(`\n${'═'.repeat(60)}`);
console.log(`RESULTS:`);
console.log(`  ✅ Live: ${results.live.join(', ') || 'none'}`);
console.log(`  ❌ Dead: ${results.dead.join(', ') || 'none'}`);
console.log(`${'═'.repeat(60)}`);
console.log(`\nBrowser open with ${results.live.length} tabs. Review and Submit each one.`);
console.log(`Press Ctrl+C when done.\n`);

await new Promise(() => {});

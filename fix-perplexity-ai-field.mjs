#!/usr/bin/env node
/**
 * fix-perplexity-ai-field.mjs — Fix only the "How do you use AI" field
 * Opens the already-filled form and fills just the missing textarea.
 */

import { chromium } from 'playwright';

const CHROMIUM_PATH = '/Users/shwetasharma/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const browser = await chromium.launch({ headless: false, slowMo: 120, executablePath: CHROMIUM_PATH });
const context = await browser.newContext();
const page = await context.newPage();

console.log('\n🚀 Opening Perplexity application to fix AI field...\n');
await page.goto('https://jobs.ashbyhq.com/Perplexity/adf189e8-5802-4077-aa1f-3668206aacbb/application', {
  waitUntil: 'networkidle', timeout: 30000
});
await page.waitForTimeout(3000);

// ── Fill ALL fields fresh since it's a new browser session ───────────────────

// Name
try {
  const nameField = page.locator('input[name="_systemfield_name"]').first();
  if (await nameField.isVisible({ timeout: 2000 })) {
    await nameField.fill('Shweta Sharma');
    console.log('  ✓ Name');
  }
} catch { console.log('  ⚠ Name'); }

// Email
try {
  const emailField = page.locator('input[type="email"]').first();
  if (await emailField.isVisible({ timeout: 2000 })) {
    await emailField.fill('shwetayeole09@gmail.com');
    console.log('  ✓ Email');
  }
} catch { console.log('  ⚠ Email'); }

// Phone
try {
  const phoneField = page.locator('input[type="tel"]').first();
  if (await phoneField.isVisible({ timeout: 2000 })) {
    await phoneField.fill('9474665006');
    console.log('  ✓ Phone');
  }
} catch { console.log('  ⚠ Phone'); }

// Resume upload
try {
  const uploadBtn = page.locator('button:has-text("Upload File"), button:has-text("Upload file")').first();
  if (await uploadBtn.isVisible({ timeout: 2000 })) {
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 5000 }),
      uploadBtn.click()
    ]);
    await fileChooser.setFiles('/Users/shwetasharma/Documents/career-ops/output/resume-descript-lead-ux-researcher.pdf');
    console.log('  ✓ Resume uploaded');
    await page.waitForTimeout(2000);
  }
} catch { console.log('  ⚠ Resume — do manually'); }

// Location combobox
try {
  const combo = page.locator('input[role="combobox"][placeholder="Start typing..."]').first();
  if (await combo.isVisible({ timeout: 2000 })) {
    await combo.click();
    await page.waitForTimeout(500);
    await combo.pressSequentially('Philadelphia', { delay: 80 });
    await page.waitForTimeout(2000);
    const option = page.locator('[role="option"]:has-text("Philadelphia, Pennsylvania")').first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      console.log('  ✓ Location');
    }
  }
} catch { console.log('  ⚠ Location — fill manually'); }

// Sponsorship: Yes (first Yes button)
await page.waitForTimeout(500);
try {
  const yesButtons = page.locator('button:has-text("Yes")');
  if ((await yesButtons.count()) >= 1) {
    await yesButtons.nth(0).click();
    console.log('  ✓ Sponsorship: Yes');
  }
} catch { console.log('  ⚠ Sponsorship'); }

// In-office: Yes (second Yes button)
await page.waitForTimeout(500);
try {
  const yesButtons = page.locator('button:has-text("Yes")');
  if ((await yesButtons.count()) >= 2) {
    await yesButtons.nth(1).click();
    console.log('  ✓ In-office: Yes');
  }
} catch { console.log('  ⚠ In-office'); }

// ── Now fill BOTH textareas by targeting them specifically ────────────────────
await page.waitForTimeout(500);

// The form has: field #1 (input, name), field #6 (textarea, why excited), field #7 (textarea, how AI)
// Target textareas specifically, NOT inputs
const textareas = page.locator('textarea[placeholder="Type here..."]');
const taCount = await textareas.count();
console.log(`  Found ${taCount} textareas`);

const answers = [
  "I'm most excited about Perplexity's approach to making AI-powered search genuinely useful and trustworthy. As a UX researcher with 7+ years of experience, I'm drawn to the challenge of understanding how people form trust in AI-generated answers and how to design research frameworks that improve answer quality. I'd love to bring my mixed-methods expertise to study how users interact with Perplexity's products across different knowledge domains and use cases.",
  "I use AI daily across my research workflow — Perplexity for rapid literature reviews and competitive analysis, Claude for synthesizing interview transcripts and identifying thematic patterns, and GPT for drafting discussion guides and survey instruments. The underappreciated benefit is how AI accelerates the 'sensemaking' phase of research — turning messy qualitative data into structured insights. The main pain point is confidence calibration: AI tools present uncertain information with the same confidence as well-established facts, which creates trust issues for researchers who need to verify everything."
];

for (let i = 0; i < Math.min(taCount, answers.length); i++) {
  try {
    const ta = textareas.nth(i);
    if (await ta.isVisible({ timeout: 1500 })) {
      await ta.fill(answers[i]);
      console.log(`  ✓ Textarea ${i + 1} filled`);
    }
  } catch (e) {
    console.log(`  ⚠ Textarea ${i + 1} failed`);
  }
}

// Perplexity Exercise URL
try {
  const urlField = page.locator('input[type="url"]').first();
  if (await urlField.isVisible({ timeout: 2000 })) {
    await urlField.fill('https://www.perplexity.ai/search/have-perplexity-explain-why-yo-qq420_wGTsWyj61jq3PMyg');
    console.log('  ✓ Perplexity exercise URL');
  }
} catch { console.log('  ⚠ URL field'); }

// Consent checkbox
try {
  const cb = page.locator('input[type="checkbox"][name="I agree"]').first();
  if (await cb.isVisible({ timeout: 2000 })) {
    if (!(await cb.isChecked())) {
      await cb.locator('..').click();
      console.log('  ✓ Consent checkbox');
    }
  }
} catch { console.log('  ⚠ Consent — check manually'); }

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

console.log('\n──────────────────────────────────────────────');
console.log('✅  All fields filled including AI question!');
console.log('');
console.log('⚠️   Review everything, then click Submit yourself.');
console.log('──────────────────────────────────────────────\n');

await new Promise(() => {});

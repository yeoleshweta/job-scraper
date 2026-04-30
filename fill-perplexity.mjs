#!/usr/bin/env node
/**
 * fill-perplexity.mjs — Fill the Perplexity Research Resident application (v2)
 * Usage: node fill-perplexity.mjs
 * Fills all fields and STOPS before submitting. You review and click Submit.
 */

import { chromium } from 'playwright';

const CHROMIUM_PATH = '/Users/shwetasharma/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const browser = await chromium.launch({ headless: false, slowMo: 120, executablePath: CHROMIUM_PATH });
const context = await browser.newContext();
const page = await context.newPage();

console.log('\n🚀 Opening Perplexity Research Resident application...\n');
await page.goto('https://jobs.ashbyhq.com/Perplexity/adf189e8-5802-4077-aa1f-3668206aacbb/application', {
  waitUntil: 'networkidle', timeout: 30000
});
await page.waitForTimeout(3000);

// ── Debug: dump all input fields ─────────────────────────────────────────────
const fields = await page.evaluate(() => {
  const inputs = document.querySelectorAll('input, textarea, select, [role="combobox"]');
  return Array.from(inputs).map(el => ({
    tag: el.tagName,
    type: el.type,
    name: el.name,
    id: el.id,
    placeholder: el.placeholder,
    ariaLabel: el.getAttribute('aria-label'),
    role: el.getAttribute('role'),
    visible: el.offsetParent !== null,
    value: el.value,
  })).filter(f => f.visible);
});
console.log('Found fields:');
fields.forEach((f, i) => console.log(`  [${i}] ${f.tag} type=${f.type} name="${f.name}" placeholder="${f.placeholder}" role=${f.role} value="${f.value?.substring(0,30)}"`));

// ── Name field (Ashby uses a single name input) ─────────────────────────────
// Try multiple strategies
let nameFilled = false;
// Strategy 1: look for input with placeholder containing "name"
for (const sel of [
  'input[placeholder*="name" i]',
  'input[placeholder*="Name"]',
  'input[aria-label*="Name"]',
  'input[name*="name" i]',
]) {
  try {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 1000 })) {
      const val = await el.inputValue();
      if (!val || val.trim() === '') {
        await el.fill('Shweta Sharma');
        console.log(`  ✓ Name (via ${sel})`);
        nameFilled = true;
        break;
      }
    }
  } catch {}
}
// Strategy 2: find by label text
if (!nameFilled) {
  try {
    const nameLabel = page.locator('text=Name').first();
    const nameInput = nameLabel.locator('..').locator('input').first();
    if (await nameInput.isVisible({ timeout: 1500 })) {
      await nameInput.fill('Shweta Sharma');
      console.log('  ✓ Name (via label)');
      nameFilled = true;
    }
  } catch {}
}
// Strategy 3: just fill the first visible text input that's empty
if (!nameFilled) {
  try {
    const allInputs = page.locator('input[type="text"], input:not([type])');
    const count = await allInputs.count();
    for (let i = 0; i < count; i++) {
      const inp = allInputs.nth(i);
      if (await inp.isVisible({ timeout: 500 })) {
        const val = await inp.inputValue();
        if (!val || val.trim() === '') {
          await inp.fill('Shweta Sharma');
          console.log(`  ✓ Name (via first empty input #${i})`);
          nameFilled = true;
          break;
        }
      }
    }
  } catch {}
}
if (!nameFilled) console.log('  ⚠ Name — could not fill, please fill manually');

// ── Email ────────────────────────────────────────────────────────────────────
let emailFilled = false;
for (const sel of [
  'input[type="email"]',
  'input[placeholder*="email" i]',
  'input[name*="email" i]',
  'input[aria-label*="email" i]',
]) {
  try {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 1000 })) {
      await el.fill('shwetayeole09@gmail.com');
      console.log(`  ✓ Email`);
      emailFilled = true;
      break;
    }
  } catch {}
}
if (!emailFilled) console.log('  ⚠ Email — could not fill');

// ── Phone ────────────────────────────────────────────────────────────────────
let phoneFilled = false;
for (const sel of [
  'input[type="tel"]',
  'input[placeholder*="phone" i]',
  'input[name*="phone" i]',
  'input[aria-label*="phone" i]',
]) {
  try {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 1000 })) {
      await el.fill('9474665006');
      console.log(`  ✓ Phone`);
      phoneFilled = true;
      break;
    }
  } catch {}
}
if (!phoneFilled) console.log('  ⚠ Phone — could not fill');

// ── Resume upload ────────────────────────────────────────────────────────────
try {
  // Ashby uses a button with text "Upload File"
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
} catch (e) {
  console.log('  ⚠ Resume upload — do manually');
}

// ── Location (Ashby combobox) ────────────────────────────────────────────────
try {
  // Find the combobox with "Start typing..." placeholder
  const combo = page.locator('input[role="combobox"][placeholder="Start typing..."]').first();
  if (await combo.isVisible({ timeout: 2000 })) {
    await combo.click();
    await page.waitForTimeout(500);
    await combo.pressSequentially('Philadelphia', { delay: 80 });
    await page.waitForTimeout(2000);
    // Click the first option that contains "Philadelphia, Pennsylvania"
    const option = page.locator('[role="option"]:has-text("Philadelphia, Pennsylvania")').first();
    if (await option.isVisible({ timeout: 3000 })) {
      await option.click();
      console.log('  ✓ Location: Philadelphia, PA');
    } else {
      console.log('  ⚠ Location dropdown option not found — fill manually');
    }
  } else {
    console.log('  ⚠ Location combobox not found');
  }
} catch (e) {
  console.log('  ⚠ Location failed — fill manually');
}

// ── Sponsorship: Yes ─────────────────────────────────────────────────────────
await page.waitForTimeout(500);
try {
  // Ashby Yes/No buttons are in a container after the question text
  // Find all button groups and click Yes on the first one (sponsorship)
  const buttons = page.locator('button:has-text("Yes")');
  const count = await buttons.count();
  console.log(`  Found ${count} "Yes" buttons`);
  if (count >= 1) {
    // Check if first Yes is already selected (has aria-pressed or similar)
    const first = buttons.nth(0);
    const classes = await first.getAttribute('class') || '';
    if (!classes.includes('selected') && !classes.includes('active')) {
      await first.click();
      console.log('  ✓ Sponsorship: Yes');
    } else {
      console.log('  ✓ Sponsorship: Yes (already selected)');
    }
  }
} catch (e) {
  console.log('  ⚠ Sponsorship — click manually');
}

// ── In-office 4 days: Yes ────────────────────────────────────────────────────
await page.waitForTimeout(500);
try {
  const buttons = page.locator('button:has-text("Yes")');
  const count = await buttons.count();
  if (count >= 2) {
    await buttons.nth(1).click();
    console.log('  ✓ In-office: Yes');
  }
} catch (e) {
  console.log('  ⚠ In-office — click manually');
}

// ── Text fields (Why excited, How use AI) ────────────────────────────────────
await page.waitForTimeout(500);
try {
  // Ashby uses input[placeholder="Type here..."] for text fields
  const textFields = page.locator('input[placeholder="Type here..."], textarea[placeholder="Type here..."]');
  const tfCount = await textFields.count();
  console.log(`  Found ${tfCount} "Type here..." fields`);

  const answers = [
    "I'm most excited about Perplexity's approach to making AI-powered search genuinely useful and trustworthy. As a UX researcher with 7+ years of experience, I'm drawn to the challenge of understanding how people form trust in AI-generated answers and how to design research frameworks that improve answer quality. I'd love to bring my mixed-methods expertise to study how users interact with Perplexity's products across different knowledge domains and use cases.",
    "I use AI daily across my research workflow — Perplexity for rapid literature reviews and competitive analysis, Claude for synthesizing interview transcripts and identifying thematic patterns, and GPT for drafting discussion guides and survey instruments. The underappreciated benefit is how AI accelerates the 'sensemaking' phase of research — turning messy qualitative data into structured insights. The main pain point is confidence calibration: AI tools present uncertain information with the same confidence as well-established facts, which creates trust issues for researchers who need to verify everything."
  ];

  for (let i = 0; i < Math.min(tfCount, answers.length); i++) {
    const field = textFields.nth(i);
    if (await field.isVisible({ timeout: 1000 })) {
      await field.fill(answers[i]);
      console.log(`  ✓ Text field ${i + 1}`);
    }
  }
} catch (e) {
  console.log('  ⚠ Text fields — fill manually');
}

// ── Perplexity Exercise URL ──────────────────────────────────────────────────
try {
  const urlField = page.locator('input[placeholder*="https://example.com"], input[placeholder*="https://"]').first();
  if (await urlField.isVisible({ timeout: 2000 })) {
    await urlField.fill('https://www.perplexity.ai/search/have-perplexity-explain-why-yo-qq420_wGTsWyj61jq3PMyg');
    console.log('  ✓ Perplexity exercise URL');
  } else {
    console.log('  ⚠ URL field not found — fill manually');
  }
} catch {
  console.log('  ⚠ URL field — fill manually');
}

// ── Consent checkbox ─────────────────────────────────────────────────────────
try {
  const checkbox = page.locator('input[type="checkbox"]').first();
  if (await checkbox.isVisible({ timeout: 2000 })) {
    if (!(await checkbox.isChecked())) {
      // Click the parent container since Ashby checkboxes may be custom
      const parent = checkbox.locator('..');
      await parent.click();
      console.log('  ✓ Consent checkbox');
    } else {
      console.log('  ✓ Consent checkbox (already checked)');
    }
  }
} catch {
  console.log('  ⚠ Consent — check manually');
}

// ── Scroll to bottom ─────────────────────────────────────────────────────────
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);

console.log('\n──────────────────────────────────────────────');
console.log('✅  Perplexity form filled (v2)!');
console.log('');
console.log('⚠️   Review everything, then click Submit yourself.');
console.log('──────────────────────────────────────────────\n');

// Keep browser open
await new Promise(() => {});

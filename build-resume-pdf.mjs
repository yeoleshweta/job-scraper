#!/usr/bin/env node
/**
 * build-resume-pdf.mjs — Fill deedy-ats.html from a markdown resume and emit PDF
 * Usage: node build-resume-pdf.mjs <input.md> <output-slug>
 * Produces: output/<slug>.html, output/<slug>.pdf
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

const esc = s => s
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function parseMarkdown(md) {
  const lines = md.split('\n');
  const data = { experience: [], projects: [], education: [], certifications: '', skills: [] };
  let section = null;

  // Line 1: # Name
  const nameMatch = md.match(/^#\s+(.+)$/m);
  data.name = nameMatch ? nameMatch[1].trim() : '';

  // Line 2 (bold tagline + contact): **Role** | email | portfolio | linkedin | phone | city
  const contactLine = lines.find(l => /\*\*.+\*\*\s*\|/.test(l)) || '';
  const parts = contactLine.split('|').map(s => s.trim());
  data.tagline = (parts[0] || '').replace(/\*\*/g,'');
  data.contacts = parts.slice(1);

  // Parse sections
  let currentExp = null;
  let currentProj = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) { section = h2[1].toLowerCase().trim(); continue; }
    const h3 = line.match(/^###\s+(.+)$/);
    if (section === 'summary' && line && !line.startsWith('#') && !line.startsWith('---')) {
      data.summary = (data.summary || '') + ' ' + line.trim();
    }
    if (section === 'core competencies' && line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      data.competencies = (data.competencies || '') + ' ' + line.trim();
    }
    if (section === 'experience') {
      if (h3) {
        if (currentExp) data.experience.push(currentExp);
        const title = h3[1];
        const [company, role] = title.split('|').map(s => s.trim());
        currentExp = { company: company || title, role: role || '', date: '', location: '', bullets: [] };
      } else if (/^\*.+\*$/.test(line.trim()) && currentExp) {
        const dl = line.trim().replace(/\*/g,'');
        const [date, location] = dl.split('|').map(s => s.trim());
        currentExp.date = date || '';
        currentExp.location = location || '';
      } else if (/^-\s+/.test(line) && currentExp) {
        currentExp.bullets.push(line.replace(/^-\s+/,'').trim());
      }
    }
    if (section === 'projects') {
      const projHdr = line.match(/^\*\*([^*]+)\*\*\s*\|\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (projHdr) {
        if (currentProj) data.projects.push(currentProj);
        currentProj = { name: projHdr[1], url: projHdr[3], urlDisplay: projHdr[2], desc: '' };
      } else if (currentProj && line.trim() && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('**')) {
        currentProj.desc = (currentProj.desc || '') + ' ' + line.trim();
      }
    }
    if (section === 'education' && line.trim().startsWith('**')) {
      const m = line.match(/^\*\*([^*]+)\*\*\s*(?:—|-)\s*(.+?)(?:\s*\|\s*(.+))?$/);
      if (m) data.education.push({ degree: m[1], school: m[2], date: m[3] || '' });
    }
    if (section === 'certifications' && line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      data.certifications = (data.certifications || '') + ' ' + line.trim();
    }
    if (section === 'skills' && line.trim().startsWith('**')) {
      const m = line.match(/^\*\*([^*]+):\*\*\s*(.+)$/);
      if (m) data.skills.push({ label: m[1], values: m[2] });
    }
  }
  if (currentExp) data.experience.push(currentExp);
  if (currentProj) data.projects.push(currentProj);
  return data;
}

function renderExperience(exps) {
  return exps.map(e => `
    <div class="exp-entry">
      <div class="exp-header">
        <span class="exp-company">${esc(e.company)}</span>
        <span class="exp-date">${esc(e.date)}</span>
      </div>
      <div class="exp-role-line">
        <span class="exp-role">${esc(e.role)}</span>
        <span class="exp-location">${esc(e.location)}</span>
      </div>
      <ul class="exp-bullets">
        ${e.bullets.map(b => `<li>${esc(b)}</li>`).join('\n        ')}
      </ul>
    </div>`).join('\n');
}

function renderProjects(projs) {
  return projs.map(p => `
    <div class="project-entry">
      <div class="project-header">
        <span class="project-name">${esc(p.name)}</span>
        <a class="project-tech" href="${esc(p.url)}">${esc(p.urlDisplay)}</a>
      </div>
      <div class="project-desc">${esc(p.desc.trim())}</div>
    </div>`).join('\n');
}

function renderEducation(edus) {
  return edus.map(e => `
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-school">${esc(e.school)}</div>
        <div class="edu-degree">${esc(e.degree)}</div>
      </div>
      <div class="edu-right">${esc(e.date)}</div>
    </div>`).join('\n');
}

function renderSkills(skills) {
  return `<div class="skills-block">
    ${skills.map(s => `<div class="skill-row"><span class="skill-label">${esc(s.label)}</span><span class="skill-values">${esc(s.values)}</span></div>`).join('\n    ')}
  </div>`;
}

async function main() {
  const [mdPath, slug] = process.argv.slice(2);
  if (!mdPath || !slug) { console.error('Usage: node build-resume-pdf.mjs <input.md> <slug>'); process.exit(1); }

  const md = await readFile(resolve(mdPath), 'utf-8');
  const tpl = await readFile(resolve(__dirname, 'templates/deedy-ats.html'), 'utf-8');
  const data = parseMarkdown(md);

  // Extract contacts: email, portfolio-display, linkedin-display, phone, city
  const email = data.contacts[0] || '';
  const portfolio = data.contacts[1] || '';
  const linkedin = data.contacts[2] || '';
  const phone = data.contacts[3] || '';
  const city = data.contacts[4] || '';

  const portMatch = portfolio.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const liMatch = linkedin.match(/\[([^\]]+)\]\(([^)]+)\)/);

  const summaryText = (data.summary || '').trim();

  const html = tpl
    .replace(/\{\{CANDIDATE_NAME\}\}/g, esc(data.name))
    .replace(/\{\{EMAIL\}\}/g, esc(email))
    .replace(/\{\{PHONE\}\}/g, esc(phone))
    .replace(/\{\{LOCATION\}\}/g, esc(city))
    .replace(/\{\{LINKEDIN_URL\}\}/g, esc(liMatch ? `https://${liMatch[2]}` : '#'))
    .replace(/\{\{LINKEDIN_DISPLAY\}\}/g, esc(liMatch ? liMatch[1] : linkedin))
    .replace(/\{\{PORTFOLIO_URL\}\}/g, esc(portMatch ? `https://${portMatch[2]}` : '#'))
    .replace(/\{\{PORTFOLIO_DISPLAY\}\}/g, esc(portMatch ? portMatch[1] : portfolio))
    .replace(/\{\{SUMMARY\}\}/g, esc(summaryText))
    .replace(/\{\{EXPERIENCE\}\}/g, renderExperience(data.experience))
    .replace(/\{\{PROJECTS\}\}/g, renderProjects(data.projects))
    .replace(/\{\{EDUCATION\}\}/g, renderEducation(data.education))
    .replace(/\{\{SKILLS\}\}/g, renderSkills(data.skills));

  const htmlPath = resolve(__dirname, `output/${slug}.html`);
  const pdfPath = resolve(__dirname, `output/${slug}.pdf`);
  await writeFile(htmlPath, html, 'utf-8');
  console.log(`📝 HTML: ${htmlPath}`);

  const CHROME = `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
  execSync(`"${CHROME}" --headless --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "file://${htmlPath}"`, { stdio: 'inherit' });
  console.log(`✅ PDF: ${pdfPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });

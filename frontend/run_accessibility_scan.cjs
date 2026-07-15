const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const PAGES = [
  { name: 'Command Center Dashboard', url: 'http://localhost:5173/' },
  { name: 'War Room Panel', url: 'http://localhost:5173/war-room' },
  { name: 'Analytics Page', url: 'http://localhost:5173/analytics' },
  { name: 'Playbook Page', url: 'http://localhost:5173/playbook' },
  { name: 'Settings Page', url: 'http://localhost:5173/settings' },
  { name: 'Signal Submit Page', url: 'http://localhost:5173/signals' },
  { name: 'Fan Twins Chat Page', url: 'http://localhost:5173/fan-twins' },
  { name: 'Fan Accessibility Settings', url: 'http://localhost:5173/accessibility' }
];

async function runScan() {
  console.log('--- STARTING ACCESSIBILITY SCAN ---');
  
  const systemChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: fs.existsSync(systemChromePath) ? systemChromePath : undefined,
      headless: true
    });
  } catch (err) {
    console.log('Using default bundled chromium...');
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext();
  const page = await context.newPage();
  
  const allReports = {};
  let totalViolationsCount = 0;

  for (const target of PAGES) {
    console.log(`Scanning ${target.name} at ${target.url}...`);
    try {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 15000 });
      // Allow extra time for any animations or asynchronous data fetching
      await page.waitForTimeout(3000);
      
      const results = await new AxeBuilder({ page }).analyze();
      
      allReports[target.name] = {
        url: target.url,
        violations: results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.map(n => ({
            target: n.target,
            html: n.html,
            failureSummary: n.failureSummary
          }))
        }))
      };
      
      const count = results.violations.length;
      totalViolationsCount += count;
      console.log(`[✓] Scanned ${target.name}. Found ${count} accessibility violations.`);
    } catch (err) {
      console.error(`[✗] Failed to scan ${target.name}:`, err.message);
      allReports[target.name] = {
        url: target.url,
        error: err.message,
        violations: []
      };
    }
  }

  await browser.close();

  // Save detailed JSON report
  fs.writeFileSync(
    path.join(__dirname, 'accessibility_report.json'),
    JSON.stringify(allReports, null, 2),
    'utf-8'
  );
  console.log('Detailed JSON report written to accessibility_report.json');

  // Generate markdown report
  let markdown = `# Accessibility Audit Report\n\n`;
  markdown += `**Scan Date:** ${new Date().toISOString()}\n`;
  markdown += `**Total Violations Detected:** ${totalViolationsCount}\n\n`;
  markdown += `## Summary of Violations by Page\n\n`;
  
  markdown += `| Page Name | URL | Violations Count | Status |\n`;
  markdown += `| --- | --- | --- | --- |\n`;
  for (const [name, report] of Object.entries(allReports)) {
    if (report.error) {
      markdown += `| ${name} | ${report.url} | - | 🔴 Error: ${report.error} |\n`;
    } else {
      const icon = report.violations.length > 0 ? '⚠️ Action Needed' : '✅ Passed';
      markdown += `| ${name} | ${report.url} | ${report.violations.length} | ${icon} |\n`;
    }
  }
  markdown += `\n---\n\n## Detailed Violations Report\n\n`;

  for (const [name, report] of Object.entries(allReports)) {
    if (report.error || report.violations.length === 0) continue;
    
    markdown += `### ${name}\n`;
    markdown += `*URL:* [${report.url}](${report.url})\n\n`;
    
    report.violations.forEach((v, index) => {
      markdown += `#### ${index + 1}. [${v.impact.toUpperCase()}] ${v.help} (${v.id})\n`;
      markdown += `*Description:* ${v.description}\n`;
      markdown += `*More info:* [${v.helpUrl}](${v.helpUrl})\n\n`;
      markdown += `*Affected Elements:* ${v.nodes.length}\n`;
      
      markdown += `| Target Selector | Code HTML | Failure Summary |\n`;
      markdown += `| --- | --- | --- |\n`;
      v.nodes.forEach(n => {
        const selector = n.target.join(' > ').replace(/\|/g, '\\|');
        const escapedHtml = n.html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|');
        const summary = n.failureSummary ? n.failureSummary.replace(/\n/g, '<br>').replace(/\|/g, '\\|') : '';
        markdown += `| \`${selector}\` | \`${escapedHtml}\` | ${summary} |\n`;
      });
      markdown += `\n`;
    });
    markdown += `---\n\n`;
  }

  fs.writeFileSync(
    path.join(__dirname, 'accessibility_report.md'),
    markdown,
    'utf-8'
  );
  console.log('Markdown report written to accessibility_report.md');
  console.log('--- ACCESSIBILITY SCAN COMPLETED ---');
}

runScan();

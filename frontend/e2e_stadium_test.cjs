const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runE2ETest() {
  console.log('--- STARTING END-TO-END STADIUM TEST ---');

  // 1. Submit batch of signals using run_demo_scenario.py
  console.log('Step 1: Running run_demo_scenario.py to ingest signals...');
  try {
    const pythonPath = path.resolve(__dirname, '..', 'backend', '.venv', 'Scripts', 'python.exe');
    const demoScriptPath = path.resolve(__dirname, '..', 'mock-data', 'run_demo_scenario.py');
    
    console.log(`Executing: "${pythonPath}" "${demoScriptPath}" --auto --speedup 20000 --max-sleep 0.001`);
    
    const output = execSync(`"${pythonPath}" "${demoScriptPath}" --auto --speedup 20000 --max-sleep 0.001`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log('Demo scenario ingestion completed successfully.');
  } catch (error) {
    console.error('Error executing demo scenario script:', error.message);
    if (error.stdout) console.log('Script stdout:', error.stdout);
    if (error.stderr) console.error('Script stderr:', error.stderr);
    console.log('\n[E2E RESULT] FAILED: Could not ingest signals via run_demo_scenario.py.');
    process.exit(1);
  }

  // 2. Launch browser using system Chrome
  console.log('\nStep 2: Launching Playwright browser...');
  const systemChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: systemChromePath,
      headless: true
    });
  } catch (err) {
    console.error('Failed to launch system Chrome:', err.message);
    console.log('Attempting launch with default chromium...');
    try {
      browser = await chromium.launch({ headless: true });
    } catch (defaultLaunchErr) {
      console.error('Failed to launch default chromium:', defaultLaunchErr.message);
      console.log('\n[E2E RESULT] FAILED: Could not start browser. Make sure Playwright/Chrome is installed.');
      process.exit(1);
    }
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  // 3. Open Command Center dashboard
  const url = 'http://localhost:5173/';
  console.log(`Step 3: Navigating to CommandCenter dashboard at ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (err) {
    console.error(`Failed to navigate to ${url}:`, err.message);
    console.log('\n[E2E RESULT] FAILED: Dashboard server is offline. Please make sure "npm run dev" is running.');
    await browser.close();
    process.exit(1);
  }

  // 4. Assert active cluster appears in the UI
  console.log('Step 4: Checking for active spike cluster in Stadium Pulse panel...');
  try {
    // Wait for the active signals or list to load
    await page.waitForTimeout(3000); // Wait for uvicorn request/poll
    
    // Look for any cluster text containing restroom, leak, flooding, or water
    const clusterLocator = page.locator('text=/restroom|leak|flood|water/i');
    const count = await clusterLocator.count();
    
    if (count === 0) {
      // Let's capture a screenshot to diagnose
      const screenshotPath = path.join(__dirname, 'e2e-failure-no-cluster.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved to ${screenshotPath}`);
      throw new Error('No active restroom/leak/flooding cluster found in the UI. The cluster list is empty.');
    }
    
    console.log(`Found ${count} matching cluster elements. Selecting the first one.`);
    const firstCluster = clusterLocator.first();
    const clusterText = await firstCluster.innerText();
    console.log(`Selected Cluster content:\n"${clusterText.trim()}"`);

    // 5. Click the cluster and assert Consensus is displayed in the War Room panel
    console.log('\nStep 5: Clicking the cluster to trigger multi-agent negotiation consensus...');
    await firstCluster.click();

    // Wait for consensus panel loading
    console.log('Waiting for Consensus panel to fetch and load...');
    await page.waitForTimeout(3000); // Wait for API fetch and CSS transition

    // Assert consensus card is displayed
    const consensusHeaderLocator = page.locator('text=/Consensus Action Reached/i');
    const isConsensusHeaderVisible = await consensusHeaderLocator.isVisible();
    
    if (!isConsensusHeaderVisible) {
      const screenshotPath = path.join(__dirname, 'e2e-failure-no-consensus.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved to ${screenshotPath}`);
      throw new Error('War Room panel did not display "Consensus Action Reached" card after clicking the cluster.');
    }

    console.log('[✓] Consensus Action Reached card is visible in the War Room.');
    
    // Output the final action text
    const consensusCardText = await page.locator('.bg-accent-purple\\/10').innerText();
    console.log(`\nConsensus details from UI:\n${consensusCardText.trim()}`);
    
    console.log('\n[E2E RESULT] SUCCESS: Full pipeline (Ingestion -> Clustering -> Negotiation -> UI update) verified!');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('\n[E2E RESULT] FAILED during assertions:', err.message);
    
    // Log active page content snippet to assist debugging
    const bodyText = await page.innerText('body');
    console.log('\n--- PAGE BODY TEXT SNAPSHOT ---');
    console.log(bodyText.substring(0, 1000) + '\n...');
    
    await browser.close();
    process.exit(1);
  }
}

runE2ETest();

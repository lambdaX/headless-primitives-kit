
import { test, expect, Page } from '@playwright/test';

test.describe('ESM Button Example Page', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = []; // Reset errors for each test
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`CONSOLE ERROR: ${msg.text()}`);
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (exception) => {
      console.log(`PAGE ERROR: ${exception.message}`);
      consoleErrors.push(exception.message);
    });
  });

  test('should load without console errors and display the button', async ({ page }) => {
    await page.goto('/public/esm-button-example.html?local=true', { waitUntil: 'networkidle' });

    // Check for the main button container or a specific element
    const button = page.locator('button:has-text("My Styled Button")');
    await expect(button).toBeVisible({ timeout: 10000 }); // Increased timeout for slower loads

    // Assert that no console errors were captured
    expect(consoleErrors).toEqual([]);

    // Optional: Click the button and check for a state change or console log
    const consoleLogs: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('Button clicked!')) {
            consoleLogs.push(msg.text());
        }
    });
    await button.click();
    await page.waitForTimeout(100); // Give time for console log
    expect(consoleLogs.some(log => log.includes('Button clicked!'))).toBe(true);

  });

  test('should load dependencies correctly', async ({ page }) => {
    const expectedModules = [
      'ReactModule loaded',
      'ReactDOMModule loaded',
      'HeadlessComponent loaded',
      'HeadlessButton loaded',
      'useHeadlessComponent loaded'
    ];
    const loadedMessages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'log') {
        if (expectedModules.some(keyword => msg.text().startsWith(keyword))) {
          loadedMessages.push(msg.text().split(':')[0].trim()); // Get only the "Module loaded" part
        }
      }
    });

    await page.goto('/public/esm-button-example.html?local=true', { waitUntil: 'networkidle' });
    
    // Wait for a specific log that indicates full load or just a timeout
    await page.waitForFunction(() => 
        (window as any).headlessButtonInstance && (window as any).useHeadlessComponentModule,
        null,
        { timeout: 15000 }
    );

    for (const mod of expectedModules) {
        expect(loadedMessages.find(m => m === mod.split(' ')[0] + " " + mod.split(' ')[1] )).toBeTruthy(`Expected module "${mod}" to be loaded`);
    }
    expect(consoleErrors).toEqual([]);
  });

});


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
        if (msg.type() === 'log' && msg.text().includes('Button clicked event via subscription!')) {
            consoleLogs.push(msg.text());
        }
    });
    await button.click();
    await page.waitForTimeout(200); // Give time for console log
    expect(consoleLogs.some(log => log.includes('Button clicked event via subscription!'))).toBe(true);

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
          // Get only the "Module loaded" part, handling potential colons in the message
          const messageParts = msg.text().split(':');
          loadedMessages.push(messageParts[0].trim());
        }
      }
    });

    await page.goto('/public/esm-button-example.html?local=true', { waitUntil: 'networkidle' });
    
    // Wait for a specific log that indicates full load or just a timeout
    await page.waitForFunction(() => 
        (window as any).headlessButtonInstance && (window as any).useHeadlessComponentModule && (window as any).HeadlessComponent,
        null,
        { timeout: 15000 } // Increased timeout
    );
    
    // Give a little extra time for all console logs to register
    await page.waitForTimeout(500);


    for (const mod of expectedModules) {
        expect(loadedMessages.find(m => m === mod)).toBeTruthy(`Expected module "${mod}" to be loaded. Found: ${loadedMessages.join(', ')}`);
    }
    expect(consoleErrors).toEqual([]);
  });

});

    
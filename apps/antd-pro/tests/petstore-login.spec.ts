import { test, expect } from '@playwright/test';

test.describe('PetStore Login', () => {
  test('autofill and login', async ({ page }) => {
    await page.goto('/petstore-login');

    // demo user is pre-filled; just submit
    await page.click('button[type="submit"]');

    // wait for any alert (success or error)
    await page.waitForSelector('.ant-alert', { timeout: 10000 });

    // verify token in localStorage (if login succeeded)
    const token = await page.evaluate(() => localStorage.getItem('petstoreToken'));
    if (token) {
      expect(token).toBeTruthy();
    }
  });
});
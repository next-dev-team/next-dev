import { test, expect } from '@playwright/test';

test.describe('PetStore CRUD', () => {
  test('read your pets', async ({ page }) => {
    // login first
    await page.goto('/petstore-login');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-alert', { timeout: 10000 });

    // navigate to pets page (assuming /pets route exists)
    await page.goto('/pets');

    // expect pets list visible
    await expect(page.locator('text=/pet|dog|cat/i')).toBeVisible({ timeout: 10000 });
  });

  test('write: add pet', async ({ page }) => {
    // login first
    await page.goto('/petstore-login');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-alert', { timeout: 10000 });

    // navigate to add pet page (assuming /pets/add route exists)
    await page.goto('/pets/add');

    // fill pet form
    await page.fill('input[name="name"]', 'Fluffy');
    await page.selectOption('select[name="status"]', 'available');

    // submit form
    await page.click('button[type="submit"]');

    // expect success message
    await expect(page.locator('.ant-alert-success')).toContainText(/added|success/i, { timeout: 10000 });
  });

  test('modify pet in your account', async ({ page }) => {
    // login first
    await page.goto('/petstore-login');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-alert', { timeout: 10000 });

    // navigate to your pets page (assuming /my-pets route exists)
    await page.goto('/my-pets');

    // click edit on first pet
    await page.click('button:has-text("Edit")');

    // modify pet name
    await page.fill('input[name="name"]', 'Fluffy Updated');

    // save changes
    await page.click('button[type="submit"]');

    // expect success message
    await expect(page.locator('.ant-alert-success')).toContainText(/updated|success/i, { timeout: 10000 });
  });
});
import { test, expect } from '@playwright/test';

test('create user via form', async ({ page }) => {
  await page.goto('http://localhost:8001/user-create');
  await page.route('**/v2/user', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '' });
  });
  await page.waitForSelector('form.ant-form', { timeout: 30000 });
  await page.getByPlaceholder('Username').fill('demo-user');
  await page.getByPlaceholder('First Name').fill('Demo');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Email').fill('demo@example.com');
  await page.getByPlaceholder('Password').fill('secret');
  await page.getByPlaceholder('Phone').fill('123456');
  await page.getByRole('button', { name: 'Create User' }).click();
  await expect(page.getByText('User created')).toBeVisible({ timeout: 30000 });
});
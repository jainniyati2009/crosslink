import { test, expect } from '@playwright/test';
test.use({ storageState: process.env.E2E_ADMIN_STATE ?? 'tests/e2e/.auth/admin.json' });
test('admin publishes a notice and reaches timetable and moderation controls', async ({page}) => {
  await page.goto('/admin/announcements');
  const title=`Browser notice ${Date.now()}`;
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Notice').fill('Demonstration notice from an admin browser check.');
  await page.getByRole('button',{name:'Save draft'}).click();
  await page.getByRole('button',{name:new RegExp(title)}).click();
  await page.getByRole('button',{name:'Publish'}).click();
  await page.goto('/announcements');
  await expect(page.getByRole('heading',{name:title})).toBeVisible();
  await page.goto('/admin/timetables');
  await expect(page.getByRole('heading',{name:'Timetables'})).toBeVisible();
  await page.goto('/admin/moderation');
  await expect(page.getByLabel('Moderation reason')).toBeVisible();
});

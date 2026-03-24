import { test, expect } from '@playwright/test';

test('register -> onboard creator -> create live', async ({ request }) => {
  const email = `e2e+${Date.now()}@example.com`;
  const password = 'Password123!';

  const register = await request.post('/auth/register', {
    data: { email, password, displayName: 'E2E User' },
  });
  expect(register.ok()).toBeTruthy();
  const registerBody = await register.json();
  const accessToken = registerBody.accessToken as string;
  expect(accessToken).toBeTruthy();

  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const onboard = await request.post('/creators/onboard', {
    data: { username: `creator_${Date.now()}`, subscriptionPrice: 499 },
    headers: authHeaders,
  });
  expect(onboard.ok()).toBeTruthy();

  const live = await request.post('/live/sessions', {
    data: { title: 'E2E Live', accessRule: 'FREE' },
    headers: authHeaders,
  });
  expect(live.ok()).toBeTruthy();

  const feed = await request.get('/feed');
  expect(feed.ok()).toBeTruthy();
});

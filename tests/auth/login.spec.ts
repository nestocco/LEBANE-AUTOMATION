import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { credentials } from '../../utils/test-data';

test.describe('TC-01 — Autenticación', () => {
  test('login exitoso con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL(/sign-in/);

    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('login fallido con contraseña incorrecta', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, 'wrong-password-123');
    await loginPage.expectLoginErrors();
  });

  test('login fallido con email incorrecto', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrong-email@example.com', credentials.password);
    await loginPage.expectLoginErrors();
  });

  test('login fallido con email y contraseña incorrectos', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrong-email@example.com', 'wrong-password-123');
    await loginPage.expectLoginErrors();
  });
});

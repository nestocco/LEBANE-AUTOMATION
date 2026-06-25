import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: /ingresar/i });
    this.errorMessage = page.locator('[class*="error"], [role="alert"]');
  }

  async goto() {
    await this.page.goto('/sign-in');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectSuccessfulLogin() {
    await expect(this.page.locator('.Toast_message__6ft-Z')).toHaveText('Sesión iniciada correctamente!');
    await this.page.locator('[data-testid="CloseIcon"]').first().click();
  }

  async expectLoginErrors() {
    const errors = this.page.locator('p.Mui-error');
    await expect(errors.filter({ hasText: 'Por favor, asegurate que el correo electrónico es correcto.' })).toBeVisible();
    await expect(errors.filter({ hasText: 'Por favor, asegurate que la contraseña es correcta.' })).toBeVisible();
  }
}

import { Page, Locator, expect } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;
  readonly addProjectButton: Locator;
  readonly projectList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addProjectButton = page.locator('span', { hasText: 'Agregar proyecto' });
    this.projectList = page.locator('[data-testid="project-list"], .project-list');
  }

  async openAddProject() {
    await this.page.locator('button.muiltr-79on53').first().click();
    await this.addProjectButton.click();
  }

  async goToProjectsList() {
    await this.page.locator('button.muiltr-79on53').first().click();
  }

  async selectProject(name: string) {
    await this.page.locator('span', { hasText: name }).first().click();
  }

  async navigateToComercial() {
    await this.page.locator('[data-cy="sidebar-comercial"]').click();
  }

  async navigateToUnidades() {
    await this.page.locator('span', { hasText: 'Unidades' }).nth(1).click();
  }

  async expectProjectVisible(name: string) {
    await expect(this.page.getByText(name, { exact: false }).first()).toBeVisible();
  }
}

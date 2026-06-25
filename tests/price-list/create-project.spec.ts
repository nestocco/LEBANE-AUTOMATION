import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { CreateProjectPage } from '../../pages/CreateProjectPage';
import { credentials, projectData } from '../../utils/test-data';

test.describe('TC-02 / TC-03 — Crear proyecto con lista de precios', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('TC-02 — Crear proyecto especificando nombre de lista de precios', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    const createPage = new CreateProjectPage(page);

    const projectName = `TC02 - ${Date.now()}`;

    await projectsPage.openAddProject();
    await createPage.fillForm({
      name: projectName,
      currency: projectData.currency,
      country: projectData.country,
      state: projectData.state,
      city: projectData.city,
      address: projectData.address,
      number: projectData.number,
      endDate: projectData.endDate,
      constructionType: projectData.constructionType,
      adjustmentModality: projectData.adjustmentModality,
      legalName: projectData.legalName,
    });
    await createPage.submit();
    await createPage.expectProjectCreated();

    await projectsPage.goToProjectsList();
    await projectsPage.selectProject(projectName);
    await projectsPage.navigateToComercial();
    await projectsPage.navigateToUnidades();

    await expect(page.locator('p', { hasText: 'Actualizar datos del proyecto' })).toBeVisible({ timeout: 10_000 });

    console.log(`Se ha creado el proyecto con el nombre "${projectName}" y está listo para realizar la carga de datos en Comercial - Unidades.`);
  });
});

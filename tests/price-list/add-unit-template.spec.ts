import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { UnitsPage } from '../../pages/UnitsPage';
import { credentials, existingProject, unitsTemplatePath } from '../../utils/test-data';

test.describe('TC-06 — Cargar template de unidades', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('TC-06 — Cargar template y verificar cantidad de unidades en la grilla', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    const unitsPage = new UnitsPage(page);

    await projectsPage.goToProjectsList();
    await projectsPage.selectProject(existingProject.name);
    await projectsPage.navigateToComercial();
    await projectsPage.navigateToUnidades();
    await unitsPage.goToUnidadesTab();

    await unitsPage.openTemplatesMenu();
    await unitsPage.clickCargarTemplateUnidades();
    await unitsPage.uploadUnitsTemplate(unitsTemplatePath);
    await unitsPage.confirmUpload();
    await unitsPage.expectUploadSuccess();
    await unitsPage.page.getByRole('button', { name: /cerrar/i }).click();
    await unitsPage.page.waitForLoadState('networkidle');

    await unitsPage.expectUnitCount(1);
  });
});

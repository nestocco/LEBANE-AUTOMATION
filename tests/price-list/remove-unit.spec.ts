import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { UnitsPage } from '../../pages/UnitsPage';
import { credentials, existingProject, unitsTemplatePath } from '../../utils/test-data';

test.describe('TC-07 — Eliminar unidad de lista de precios', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const projectsPage = new ProjectsPage(page);
    const unitsPage = new UnitsPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();

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
  });

  test('TC-07 — Eliminar la única unidad del TPL y verificar que la grilla queda vacía', async ({ page }) => {
    const unitsPage = new UnitsPage(page);

    const countBefore = await unitsPage.countUnits();
    console.log(`[TC-07] Unidades cargadas desde TPL: ${countBefore}`);

    await unitsPage.deleteFirstUnit();
    await unitsPage.expectLastUnitWarning();
    await unitsPage.confirmDelete();
    console.log(`[TC-07] Unidad eliminada, esperando grilla vacía`);

    await unitsPage.expectEmptyTable();
    console.log(`[TC-07] Grilla vacía confirmada — lista de precios eliminada correctamente`);
  });
});

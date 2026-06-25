import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { UnitsPage } from '../../pages/UnitsPage';
import { credentials, existingProject, priceModification, unitsTemplatePath } from '../../utils/test-data';

test.describe('TC-05 — Modificar precio de unidad', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('TC-05 — Modificar precio de unidad y verificar el nuevo valor en la grilla', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    const unitsPage = new UnitsPage(page);

    await projectsPage.goToProjectsList();
    await projectsPage.selectProject(existingProject.name);
    await projectsPage.navigateToComercial();
    await projectsPage.navigateToUnidades();
    await unitsPage.goToUnidadesTab();

    // Si no existe la unidad con el precio original, se carga el TPL que la contiene
    const exists = await unitsPage.inputWithValueExists(priceModification.originalPrice);
    if (!exists) {
      await unitsPage.openTemplatesMenu();
      await unitsPage.clickCargarTemplateUnidades();
      await unitsPage.uploadUnitsTemplate(unitsTemplatePath);
      await unitsPage.confirmUpload();
      await unitsPage.expectUploadSuccess();
      await unitsPage.page.getByRole('button', { name: /cerrar/i }).click();
      await unitsPage.page.waitForLoadState('networkidle');
    }

    // Verificar que el input con el precio original está presente
    await unitsPage.expectInputWithValue(priceModification.originalPrice);

    // Modificar el precio
    await unitsPage.clickAndModifyPrice(priceModification.originalPrice, priceModification.newPrice);

    // Confirmar que el nuevo precio quedó guardado en la grilla (con formato de miles)
    await unitsPage.expectInputWithValue(priceModification.newPriceFormatted);
    console.log(`[TC-05] Precio modificado correctamente en el proyecto "${existingProject.name}": ${priceModification.originalPrice} → ${priceModification.newPriceFormatted}`);
  });
});

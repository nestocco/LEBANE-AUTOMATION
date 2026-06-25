import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { UnitsPage } from '../../pages/UnitsPage';
import { credentials, existingProject, unitsConfig } from '../../utils/test-data';

test.describe('TC-04 — Agregar unidades manualmente con ajustes General', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('TC-04 — Configurar unidades y verificar cantidad en la grilla', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    const unitsPage = new UnitsPage(page);

    await projectsPage.goToProjectsList();
    await projectsPage.selectProject(existingProject.name);
    await projectsPage.navigateToComercial();
    await projectsPage.navigateToUnidades();
    const precargado = await unitsPage.enableUnitsForm();
    if (!precargado) {
      await unitsPage.fillUnitsConfig(unitsConfig);
      await unitsPage.saveUnitsForm();
    }

    await unitsPage.goToUnidadesTab();
    await unitsPage.expectUnitCount(1);
    const totalUnidades = await unitsPage.countUnits();
    console.log(`Se verifica que se ha aplicado el ajuste de General de las unidades. Se cuentan un total de ${totalUnidades} unidades tras la aplicación de dicho ajuste precargado sobre el proyecto preexistente ${existingProject.name}`);
  });
});

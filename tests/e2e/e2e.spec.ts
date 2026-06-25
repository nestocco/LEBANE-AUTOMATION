import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProjectsPage } from '../../pages/ProjectsPage';
import { CreateProjectPage } from '../../pages/CreateProjectPage';
import { UnitsPage } from '../../pages/UnitsPage';
import { credentials, projectData, unitsConfig } from '../../utils/test-data';

test.describe('E2E — Ciclo completo de proyecto y unidades', () => {
  test('Crear proyecto → configurar unidades → eliminar unidad → grilla vacía', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const projectsPage = new ProjectsPage(page);
    const createPage = new CreateProjectPage(page);
    const unitsPage = new UnitsPage(page);

    const projectName = `E2E - ${Date.now()}`;

    // 1. Login
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSuccessfulLogin();
    console.log(`[E2E] Sesión iniciada con el usuario: ${credentials.email}`);

    // 2. Crear proyecto
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
    console.log(`[E2E] Proyecto creado: "${projectName}"`);

    // 3. Navegar al proyecto → comercial → unidades y verificar estado inicial
    await projectsPage.goToProjectsList();
    await projectsPage.selectProject(projectName);
    await projectsPage.navigateToComercial();
    await projectsPage.navigateToUnidades();
    await expect(page.locator('p', { hasText: 'Actualizar datos del proyecto' })).toBeVisible({ timeout: 10_000 });
    console.log(`[E2E] Proyecto "${projectName}" listo para carga de datos en Comercial - Unidades`);

    // 4. Configuración General de unidades
    await unitsPage.fillUnitsConfig(unitsConfig);
    await unitsPage.saveUnitsForm();
    console.log(`[E2E] Configuración General de unidades guardada`);

    // 5. Ir a la solapa Unidades y verificar grilla
    await unitsPage.goToUnidadesTab();
    await page.waitForLoadState('networkidle');
    const countBefore = await unitsPage.countUnits();
    console.log(`[E2E] Unidades en grilla: ${countBefore}`);

    // 6. Eliminar la primera unidad y verificar grilla vacía
    await unitsPage.deleteFirstUnit();
    await unitsPage.expectLastUnitWarning();
    await unitsPage.confirmDelete();
    console.log(`[E2E] Unidad eliminada, esperando grilla vacía`);

    await unitsPage.expectEmptyTable();
    console.log(`[E2E] Grilla vacía confirmada — ciclo completo finalizado en el proyecto "${projectName}"`);
  });
});

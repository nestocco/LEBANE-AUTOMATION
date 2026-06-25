import { Page, Locator, expect } from '@playwright/test';
import * as path from 'path';

export interface UnitData {
  floor?: string;
  typology?: string;
  orientation?: string;
  coveredM2?: string;
  semiCoveredM2?: string;
  uncoveredM2?: string;
  price?: string;
}

export class UnitsPage {
  readonly page: Page;
  readonly addUnitButton: Locator;
  readonly templatesMenu: Locator;
  readonly uploadTemplateOption: Locator;
  readonly priceListSelector: Locator;
  readonly unitsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addUnitButton = page.getByRole('button', { name: /adicionar unidad/i });
    this.templatesMenu = page.getByRole('button', { name: /templates/i });
    this.uploadTemplateOption = page.getByRole('menuitem', { name: /cargar template/i });
    this.priceListSelector = page.getByRole('button', { name: /lista.*precio/i });
    this.unitsTable = page.locator('table, [role="grid"]').first();
  }

  async enableUnitsForm(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const editarButton = this.page.locator('button').filter({ has: this.page.locator('span', { hasText: 'Editar' }) });
    const exists = await editarButton.count() > 0;
    console.log(`[enableUnitsForm] button "Editar" existe en DOM: ${exists}`);
    if (exists) {
      await editarButton.scrollIntoViewIfNeeded();
      await editarButton.click();
      console.log(`[enableUnitsForm] click en "Editar" → guardando datos precargados`);
      await this.saveUnitsForm();
      return true;
    }
    console.log(`[enableUnitsForm] formulario disponible directamente`);
    return false;
  }

  async fillUnitsConfig(values: { pricePerM2: string; floors: string; typologies: string[]; unitsPerFloor: string }) {
    await this.page.locator('[name="precioListaMetroCuadrado"]').fill(values.pricePerM2);
    await this.page.locator('[name="pisos"]').fill(values.floors);

    await this.page.locator('[data-cy="new-renderer-field-tipologias"]').click();
    for (const typology of values.typologies) {
      await this.page.getByText(typology, { exact: true }).click();
    }

    await this.page.locator('[name="unidadesPorPiso"]').fill(values.unitsPerFloor);
  }

  async saveUnitsForm() {
    await this.page.locator('span', { hasText: 'Guardar' }).click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('.Toast_message__6ft-Z')).toHaveText('Areas del proyecto creadas', { timeout: 10_000 });
    await this.page.locator('[data-testid="CloseIcon"]').first().click();
  }

  async goToUnidadesTab() {
    await this.page.getByRole('tab', { name: /unidades/i }).click();
  }

  async openTemplatesMenu() {
    await this.page.locator('span', { hasText: 'Templates' }).click();
  }

  async clickCargarTemplateUnidades() {
    await this.page.locator('button', { hasText: 'Cargar Template de Unidades' }).nth(1).click();
  }

  async uploadUnitsTemplate(filePath: string) {
    await this.page.locator('label[for="upload-template"]').click();
    await this.page.locator('input#upload-template').setInputFiles(path.resolve(filePath));
  }

  async confirmUpload() {
    await this.page.locator('span', { hasText: 'Cargar' }).click();
  }

  async expectUploadSuccess() {
    await expect(this.page.locator('.Toast_message__6ft-Z')).toHaveText('Archivo subido exitosamente', { timeout: 15_000 });
    await this.page.locator('[data-testid="CloseIcon"]').first().click();
  }

  async expectUnitCount(count: number) {
    for (let i = 0; i < count; i++) {
      await expect(this.page.locator(`tr.MuiTableRow-root[data-index="${i}"]`)).toBeVisible();
    }
  }

  async countUnits(): Promise<number> {
    await this.page.locator('tr.MuiTableRow-root[data-index="0"]').waitFor({ state: 'visible', timeout: 10_000 });
    return await this.page.locator('tr.MuiTableRow-root[data-index]').count();
  }

  async deleteFirstUnit() {
    await this.page.locator('[aria-label="Eliminar"]').first().click();
  }

  async confirmDelete() {
    await this.page.getByRole('button', { name: /confirmar/i }).click();
  }

  async expectDeleteToast() {
    await expect(this.page.locator('.Toast_message__6ft-Z')).toHaveText('Unidad eliminada de la lista de precios', { timeout: 10_000 });
    await this.page.locator('[data-testid="CloseIcon"]').first().click();
  }

  async expectLastUnitWarning() {
    await expect(this.page.locator('p', { hasText: 'Al quitar esta unidad, la lista de precios quedará vacia y será eliminada.' })).toBeVisible();
  }

  async expectEmptyTable() {
    await expect(this.page.locator('tr.MuiTableRow-root[data-index]')).toHaveCount(0, { timeout: 15_000 });
    await expect(this.page.locator('tbody p', { hasText: 'No hay registros para mostrar' })).toBeVisible({ timeout: 15_000 });
  }

  async inputWithValueExists(value: string): Promise<boolean> {
    await this.page.locator('th[data-column-id="precio"]').scrollIntoViewIfNeeded();
    return await this.page.locator('[class*="!block"][class*="truncate"]', { hasText: value }).count() > 0;
  }

  async expectInputWithValue(value: string) {
    await this.page.locator('th[data-column-id="precio"]').scrollIntoViewIfNeeded();
    await expect(this.page.locator('[class*="!block"][class*="truncate"]', { hasText: value }).first()).toBeAttached({ timeout: 10_000 });
  }

  async clickAndModifyPrice(originalValue: string, newValue: string) {
    await this.page.locator('th[data-column-id="precio"]').scrollIntoViewIfNeeded();
    await this.page.locator('[class*="!block"][class*="truncate"]', { hasText: originalValue }).first().click();
    const input = this.page.locator(`input[value="${originalValue}"]`).first();
    await expect(input).toBeAttached({ timeout: 5_000 });
    await input.fill(newValue);
    await this.page.keyboard.press('Enter');
  }

  async waitForUnitCount(expected: number) {
    await expect(this.page.locator('tr.MuiTableRow-root[data-index]')).toHaveCount(expected, { timeout: 10_000 });
  }

  async navigateToUnits() {
    await this.page.getByText(/comercial/i).click();
    await this.page.getByRole('link', { name: /unidades/i }).click();
  }

  async addUnitManual(data: UnitData = {}) {
    await this.addUnitButton.click();
    const row = this.page.locator('tr, [role="row"]').last();

    if (data.floor) await row.getByPlaceholder(/piso/i).fill(data.floor);
    if (data.typology) {
      await row.locator('[placeholder*="tipolog"], [aria-label*="tipolog"]').click();
      await this.page.getByRole('option', { name: data.typology }).click();
    }
    if (data.orientation) {
      await row.locator('[placeholder*="orient"], [aria-label*="orient"]').click();
      await this.page.getByRole('option', { name: data.orientation }).click();
    }
    if (data.coveredM2) await row.locator('input[name*="cubierto"], input[placeholder*="cubierto"]').first().fill(data.coveredM2);
    if (data.price) await row.locator('input[name*="precio"], input[placeholder*="precio"]').fill(data.price);

    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async editUnitPrice(unitName: string, newPrice: string) {
    const row = this.page.locator('tr, [role="row"]').filter({ hasText: unitName });
    const priceCell = row.locator('input[name*="precio"], td').last();
    await priceCell.click();
    await priceCell.fill(newPrice);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
  }

  async uploadTemplate(filePath: string) {
    await this.templatesMenu.click();
    await this.uploadTemplateOption.click();

    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.resolve(filePath));

    await this.page.getByRole('button', { name: /^cargar$/i }).click();
    await this.page.waitForTimeout(2_000);
  }

  async deleteUnit(unitName: string) {
    const row = this.page.locator('tr, [role="row"]').filter({ hasText: unitName });
    // Red trash icon
    await row.locator('button[aria-label*="elimin"], button[aria-label*="borrar"], button.delete, [class*="delete"]').click();
    // Confirm dialog if present
    const confirmBtn = this.page.getByRole('button', { name: /confirmar|aceptar|sí/i });
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await this.page.waitForTimeout(500);
  }

  async getPriceListName(): Promise<string> {
    return (await this.priceListSelector.textContent()) ?? '';
  }

  async getPriceListCount(): Promise<number> {
    const options = await this.priceListSelector.locator('option, [role="option"]').count();
    return options;
  }

  async expectUnitVisible(unitName: string) {
    await expect(this.page.getByText(unitName, { exact: false })).toBeVisible();
  }

  async expectUnitNotVisible(unitName: string) {
    await expect(this.page.getByText(unitName, { exact: false })).not.toBeVisible();
  }

  async expectPriceListExists(listName?: string) {
    if (listName) {
      await expect(this.page.getByText(listName, { exact: false })).toBeVisible();
    } else {
      await expect(this.priceListSelector).toBeVisible();
    }
  }

  async expectNoPriceList() {
    await expect(this.priceListSelector).not.toBeVisible({ timeout: 5_000 });
  }
}

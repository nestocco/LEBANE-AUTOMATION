import { Page, Locator, expect } from '@playwright/test';

export interface ProjectFormData {
  name: string;
  currency?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  constructionType?: string;
  adjustmentModality?: string;
  legalName?: string;
  priceListName?: string;
}

export class CreateProjectPage {
  readonly page: Page;
  readonly projectNameInput: Locator;
  readonly currencySelect: Locator;
  readonly countrySelect: Locator;
  readonly stateSelect: Locator;
  readonly citySelect: Locator;
  readonly addressInput: Locator;
  readonly numberInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly constructionTypeSelect: Locator;
  readonly adjustmentModalitySelect: Locator;
  readonly legalNameInput: Locator;
  readonly priceListNameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectNameInput = page.locator('[data-cy="new-renderer-field-nombreProyecto"]');
    this.currencySelect = page.locator('[data-cy="new-renderer-field-moneda"]');
    this.countrySelect = page.locator('[data-cy="new-renderer-field-pais"]');
    this.stateSelect = page.locator('[data-cy="new-renderer-field-estado"]');
    this.citySelect = page.locator('[data-cy="new-renderer-field-ciudad"]');
    this.addressInput = page.locator('[data-cy="new-renderer-field-calle"]');
    this.numberInput = page.locator('[data-cy="new-renderer-field-numeroPuerta"]');
    this.startDateInput = page.getByLabel(/fecha de inicio/i);
    this.endDateInput = page.locator('[data-cy="new-renderer-field-fechaFin"]');
    this.constructionTypeSelect = page.locator('[data-cy="new-renderer-field-tipoConstruccion"]');
    this.adjustmentModalitySelect = page.locator('[data-cy="new-renderer-field-modalidadAjuste"]');
    this.legalNameInput = page.getByPlaceholder('Escribí para buscar o crear');
    this.priceListNameInput = page.getByLabel(/nombre.*lista/i);
    this.submitButton = page.getByRole('button', { name: /registrar/i });
  }

  async fillForm(data: ProjectFormData) {
    await this.projectNameInput.fill(data.name);

    if (data.currency) {
      await this.currencySelect.click();
      await this.page.getByRole('option', { name: data.currency }).click();
    }
    if (data.country) {
      await this.countrySelect.click();
      await this.page.getByRole('option', { name: data.country }).click();
    }
    if (data.state) {
      await this.stateSelect.click();
      await this.page.getByRole('option', { name: data.state }).click();
    }
    if (data.city) {
      await this.citySelect.click();
      await this.page.getByRole('option', { name: data.city }).click();
    }
    if (data.address) await this.addressInput.fill(data.address);
    if (data.number) await this.numberInput.fill(data.number);
    if (data.startDate) await this.startDateInput.fill(data.startDate);
    if (data.endDate) await this.endDateInput.fill(data.endDate);
    if (data.constructionType) {
      await this.constructionTypeSelect.click();
      await this.page.getByRole('option', { name: data.constructionType }).click();
    }
    if (data.adjustmentModality) {
      await this.adjustmentModalitySelect.click();
      await this.page.getByRole('option', { name: data.adjustmentModality }).click();
    }
    if (data.legalName) {
      await this.legalNameInput.fill(data.legalName);
      await this.legalNameInput.press('Enter');
    }
    if (data.priceListName) await this.priceListNameInput.fill(data.priceListName);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectProjectCreated() {
    await expect(this.page.locator('.Toast_message__6ft-Z')).toHaveText('Creación exitosa', { timeout: 15_000 });
    await this.page.locator('[data-testid="CloseIcon"]').first().click();
  }
}

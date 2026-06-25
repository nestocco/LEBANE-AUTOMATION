import * as dotenv from 'dotenv';
dotenv.config();

export const credentials = {
  email: process.env.TEST_EMAIL || '',
  password: process.env.TEST_PASSWORD || '',
};

export const existingProject = {
  name: 'TC02 - 1782356610144',
};

export const projectData = {
  name: `Test Project ${Date.now()}`,
  currency: 'ARS',
  country: 'Argentina',
  state: 'Capital Federal',
  city: 'Recoleta',
  address: 'Av. Cordoba',
  number: '3357',
  startDate: '01/01/2025',
  endDate: '24/06/2029',
  constructionType: 'Arquitectura',
  adjustmentModality: 'Provisorio',
  legalName: 'QAPruebaTec SA',
  priceListName: 'Lista Test Automatización',
};

export const unitData = {
  floor: '1',
  typology: 'Monoambiente',
  orientation: 'Norte',
  coveredM2: '45',
  semiCoveredM2: '10',
  uncoveredM2: '5',
  price: '150000',
};

export const unitsConfig = {
  pricePerM2: '2500',
  floors: '1',
  typologies: ['Baulera', 'Cochera'],
  unitsPerFloor: '1',
};

export const priceModification = {
  originalPrice: '25.000.000',
  newPrice: '82199300',
  newPriceFormatted: '82.199.300',
};

export const templateFixturePath = './fixtures/units-template.xlsx';
export const unitsTemplatePath = './fixtures/template_unidades_24-06-2026-23_56.xlsx';

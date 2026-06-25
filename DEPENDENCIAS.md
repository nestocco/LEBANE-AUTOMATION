# Dependencias del Proyecto — Lebane QA Automation

## Requisitos del Sistema

| Herramienta | Versión mínima recomendada | Notas |
|-------------|---------------------------|-------|
| Node.js     | v18.x o superior           | Probado con v22.22.2 |
| npm         | v9.x o superior            | Probado con v10.9.7 |
| Git         | Cualquier versión reciente  | Para clonar el repositorio |
| SO          | macOS, Windows, Linux       | Sin restricciones |

---

## Dependencias de Desarrollo (package.json)

| Paquete           | Versión  | Descripción |
|-------------------|----------|-------------|
| `@playwright/test` | ^1.44.0  | Framework principal de automatización E2E |
| `@types/node`      | ^20.0.0  | Tipos TypeScript para Node.js |
| `typescript`       | ^5.0.0   | Lenguaje de programación tipado |
| `dotenv`           | ^16.0.0  | Carga de variables de entorno desde `.env` |

---

## Browsers Requeridos

El proyecto ejecuta los tests sobre **Chromium** (Chrome de escritorio) configurado en `playwright.config.ts`.

Los browsers los gestiona Playwright internamente. Se instalan con:

```bash
npx playwright install
```

Para instalar solo Chromium:

```bash
npx playwright install chromium
```

---

## Variables de Entorno

El proyecto utiliza `dotenv` para leer un archivo `.env` en la raíz del proyecto.

| Variable   | Valor por defecto             | Descripción |
|------------|-------------------------------|-------------|
| `BASE_URL` | `https://tst.lebane.app`       | URL base del entorno de pruebas |

Crear el archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
BASE_URL=https://tst.lebane.app
```

---

## Instalación Completa (pasos en orden)

```bash
# 1. Instalar dependencias de Node
npm install

# 2. Instalar browsers de Playwright
npx playwright install

# 3. (Opcional) Instalar dependencias del sistema operativo requeridas por Playwright
npx playwright install-deps
```

---

## Comandos Disponibles

| Comando               | Descripción |
|-----------------------|-------------|
| `npm test`            | Ejecuta todos los tests en modo headless |
| `npm run test:headed` | Ejecuta los tests con browser visible |
| `npm run test:ui`     | Abre la interfaz gráfica interactiva de Playwright |
| `npm run test:report` | Abre el reporte HTML del último run |
| `npm run test:auth`   | Ejecuta solo los tests de autenticación |
| `npm run test:price-list` | Ejecuta solo los tests de lista de precios |

---

## Configuración del Proyecto

| Parámetro         | Valor configurado |
|-------------------|-------------------|
| Directorio tests  | `./tests` |
| Browser           | Chromium (Desktop Chrome) |
| Paralelismo       | Desactivado (`fullyParallel: false`) |
| Reintentos en CI  | 1 reintento |
| Timeout de acción | 15 segundos |
| Timeout de navegación | 30 segundos |
| Reporte           | HTML (`playwright-report/`) |
| Artefactos        | `test-results/` |
| Screenshots       | Solo en fallo |
| Video             | Solo en primer reintento |
| Trace             | Solo en primer reintento |

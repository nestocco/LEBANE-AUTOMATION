# Lebane QA Automation

Suite de automatización de pruebas para la funcionalidad de **lista de precios de unidades** de la plataforma [Lebane](https://tst.lebane.app), desarrollada con Playwright + TypeScript siguiendo el patrón Page Object Model (POM).

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| [Node.js](https://nodejs.org/) | 20.x |
| npm | 9.x |
| Git | cualquiera |

Verificá tu versión con `node -v` y `npm -v`.

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/nestocco/LEBANE-AUTOMATION.git
cd LEBANE-AUTOMATION
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar el navegador de Playwright

```bash
npx playwright install chromium
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Editá el archivo `.env` con las credenciales del ambiente de testing:

```env
BASE_URL=https://tst.lebane.app
TEST_EMAIL=tu-email@lebane.app
TEST_PASSWORD=tu-contraseña
```

> **Importante:** nunca subas el archivo `.env` al repositorio. Ya está incluido en `.gitignore`.

---

## Configuración adicional — proyecto preexistente

Los tests **TC-04, TC-05, TC-06 y TC-07** operan sobre un **proyecto ya existente** en la plataforma (con la configuración General de unidades ya cargada). Antes de correr esos tests, actualizá el nombre del proyecto en [`utils/test-data.ts`](utils/test-data.ts):

```ts
export const existingProject = {
  name: 'NOMBRE-EXACTO-DEL-PROYECTO',
};
```

---

## Ejecución

```bash
# Todos los tests (headless)
npm test

# Con navegador visible
npm run test:headed

# Interfaz interactiva de Playwright
npm run test:ui

# Solo tests de autenticación
npm run test:auth

# Solo tests de lista de precios
npm run test:price-list

# Solo test E2E
npm run test:e2e

# Ver reporte HTML después de correr
npm run test:report
```

---

## Casos de prueba

| ID | Archivo | Descripción |
|----|---------|-------------|
| TC-01 | `tests/auth/login.spec.ts` | Login exitoso y validación de errores de credenciales |
| TC-02 | `tests/price-list/create-project.spec.ts` | Crear un nuevo proyecto y verificar navegación a Comercial - Unidades |
| TC-04 | `tests/price-list/add-unit-manual.spec.ts` | Configurar unidades con ajuste General y verificar grilla |
| TC-05 | `tests/price-list/modify-unit-price.spec.ts` | Modificar el precio de una unidad y verificar el nuevo valor en la grilla |
| TC-06 | `tests/price-list/add-unit-template.spec.ts` | Cargar template `.xlsx` de unidades y verificar cantidad en la grilla |
| TC-07 | `tests/price-list/remove-unit.spec.ts` | Eliminar la única unidad vía TPL y verificar que la grilla queda vacía |
| E2E | `tests/e2e/e2e.spec.ts` | Flujo completo: crear proyecto → configurar unidades → eliminar → grilla vacía |

### Detalle TC-01 — Escenarios de login

| Escenario | Resultado esperado |
|-----------|-------------------|
| Credenciales válidas | Toast "Sesión iniciada correctamente!" |
| Password incorrecta | Mensaje de error en el campo password |
| Email incorrecto | Mensaje de error en el campo email |
| Ambas credenciales incorrectas | Mensajes de error en ambos campos |

---

## Estructura del proyecto

```
├── tests/
│   ├── auth/
│   │   └── login.spec.ts              # TC-01
│   ├── price-list/
│   │   ├── create-project.spec.ts     # TC-02
│   │   ├── add-unit-manual.spec.ts    # TC-04
│   │   ├── modify-unit-price.spec.ts  # TC-05
│   │   ├── add-unit-template.spec.ts  # TC-06
│   │   └── remove-unit.spec.ts        # TC-07
│   └── e2e/
│       └── e2e.spec.ts                # Flujo completo
├── pages/                             # Page Object Model
│   ├── LoginPage.ts
│   ├── ProjectsPage.ts
│   ├── CreateProjectPage.ts
│   └── UnitsPage.ts
├── fixtures/                          # Archivos de datos para tests
│   └── template_unidades_*.xlsx       # Template de carga de unidades
├── utils/
│   └── test-data.ts                   # Datos de prueba centralizados
├── .github/
│   └── workflows/
│       └── playwright.yml             # CI con GitHub Actions
├── playwright.config.ts
├── .env.example                       # Plantilla de variables de entorno
└── package.json
```

---

## Configuración de Playwright

| Parámetro | Valor |
|-----------|-------|
| Navegador | Chromium |
| Ejecución | Secuencial (1 worker) |
| Reintentos en CI | 1 |
| Screenshot | Solo en falla |
| Video | Solo en falla (primer reintento) |
| Trace | Solo en falla (primer reintento) |
| Timeout por acción | 15 s |
| Timeout de navegación | 30 s |

---

## CI / GitHub Actions

Los tests corren automáticamente en cada push y pull request a `main` o `master`.

### Configurar secretos en GitHub

1. Ir a **Settings → Secrets and variables → Actions**
2. Agregar los siguientes secrets:

| Secret | Descripción |
|--------|-------------|
| `BASE_URL` | URL del ambiente de testing (`https://tst.lebane.app`) |
| `TEST_EMAIL` | Email del usuario de prueba |
| `TEST_PASSWORD` | Contraseña del usuario de prueba |

### Artefactos generados

Después de cada ejecución quedan disponibles como artifacts en GitHub Actions:

- **playwright-report** — reporte HTML completo (disponible por 14 días)
- **test-results** — screenshots y videos de los tests fallidos (7 días)

---

## Tecnologías

- [Playwright](https://playwright.dev/) v1.44+
- [TypeScript](https://www.typescriptlang.org/) v5+
- [Node.js](https://nodejs.org/) v20
- [dotenv](https://github.com/motdotla/dotenv) — gestión de variables de entorno
- GitHub Actions — integración continua

---

## Enunciado original

Ver [ENUNCIADO.md](./ENUNCIADO.md) para la descripción completa del ejercicio.

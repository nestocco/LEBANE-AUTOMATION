# Ejercicio QA Automation — Lebane (2026)

## 1. Enunciado

Se solicita al equipo de QA Automation que cree los casos automatizados de pruebas para la funcionalidad de **lista de precios de unidades para desarrolladoras**.

### Descripción de la funcionalidad

- Al crear un nuevo proyecto, se debe crear una **lista de precio inicial**; dicha lista de precios puede o no especificar el nombre de la lista de precios.
- Una vez creado el proyecto, se pueden **crear unidades manualmente** o **cargando un template**.
  - Si se modifica el precio de una unidad en una lista de precios dada, entonces **se modifica la lista de precios**.
  - Al cargar un template se **crea una nueva lista de precios**.
- Para **remover una unidad** de una lista de precios se debe presionar el icono de borrado (tacho rojo).
  - Si la lista de precios queda **vacía** al quitar la unidad → **la lista se elimina**.
  - Si la unidad queda **sin lista de precios** → **se elimina la unidad**.

---

## 1.1 Requerimientos

- Crear un **repositorio en GitHub**
- Crear un **proyecto de QA Automation** en la tecnología de preferencia
- Establecer el repositorio como **Público**

---

## 1.2 Configuraciones

| Parámetro  | Valor                       |
|------------|-----------------------------|
| Ambiente   | Testing                     |
| URL        | https://tst.lebane.app      |
| Usuario    | Enviado por mail            |

---

## 2. Entrega

Compartir el link del repositorio por correo para poder evaluarlo.

---

## Happy Path — Flujo de pantallas

### Figura 1 — Login
Pantalla de ingreso a Lebane. Campos: **Correo electrónico** y **Contraseña**. Botón **Ingresar**.
- URL: `https://tst.lebane.app/sign-in`
- Credenciales de prueba provistas por mail.

### Figura 2 — Selector de proyectos
Sidebar izquierdo con listado de proyectos bajo la sección **PROYECTOS**. Opción **"Agregar proyecto"** al pie.

### Figura 3 — Formulario de creación de proyecto
Formulario con los campos:
- Logo del proyecto (upload)
- Nombre del proyecto *
- Moneda * / Tipo de cambio *
- País * / Estado * / Ciudad *
- Dirección * / Número *
- Fecha de inicio * / Fecha de finalización *
- Tipo de construcción *

### Figura 4 — Menú del proyecto — sección Unidades
Sidebar del proyecto con la sección **Comercial** expandida, subítem **Unidades** seleccionado.

### Figura 5 — Modal: Cargar Template de Unidades
Modal con zona de drag & drop para subir archivo `.xlsx` (máx. 50 MB). Opción de descargar el template de ejemplo.

### Figura 6 — Vista de Unidades con Lista de precios
Tabla de unidades con columnas: Unidad, Piso, Tipología, Orientación, M² Cubiertos, M² Semi cubiertos, M² Descubiertos. Header con selector de **Lista de precios** y botón **+ Adicionar unidad**. Ícono rojo de borrado por fila.

---

## Casos de prueba identificados

| ID     | Caso                                                      | Tipo        |
|--------|-----------------------------------------------------------|-------------|
| TC-01  | Login exitoso con credenciales válidas                    | Happy path  |
| TC-02  | Crear proyecto con nombre de lista de precios             | Happy path  |
| TC-03  | Crear proyecto sin nombre de lista de precios             | Happy path  |
| TC-04  | Agregar unidad manualmente                                | Happy path  |
| TC-05  | Modificar precio de unidad modifica la lista              | Happy path  |
| TC-06  | Cargar template crea nueva lista de precios               | Happy path  |
| TC-07  | Eliminar unidad cuando la lista tiene más unidades        | Edge case   |
| TC-08  | Eliminar última unidad de lista → lista se elimina        | Edge case   |
| TC-09  | Unidad sin lista de precios → unidad se elimina           | Edge case   |

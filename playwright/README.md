# Pruebas de extremo a extremo con Playwright

Conjunto de pruebas automatizadas para Fitofilia, desarrollado para la Actividad 5 de Gestión del desarrollo de software (UTN FRA). Verifica desde el navegador los tres flujos críticos de la aplicación: inicio de sesión, creación de una publicación y creación de un comentario.

La especificación completa (contexto, flujos, criterios de aceptación y restricciones técnicas) está en [este archivo](docs/especificacionPruebas.md).

## Requisitos técnicos

- Node.js, versión LTS reciente.
- Frontend y backend de Fitofilia levantados en local (ver el README principal del repositorio):
    - Frontend: `http://localhost:4200`
    - Backend: `http://localhost:3000`
- Usuario de prueba creado previamente en la base de datos:
    - Correo: `playwright@gmail.com`
    - Contraseña: `Playwright2026`
## Instalación

Desde la raíz del repositorio:

```bash
cd playwright
npm install
npx playwright install chromium
```

## Ejecución

Con el frontend y el backend en funcionamiento:

```bash
npx playwright test                                     # Todas las pruebas, sin navegador
npx playwright test --headed --workers=1                # Con el navegador visible y de a una prueba
npx playwright test --ui                                # Ejecución manual de las pruebas a través de una interfaz
npx playwright test --repeat-each=3                     # Repite cada prueba tres veces
npx playwright test pruebas/01-autenticacion.spec.ts    # Un solo archivo de pruebas
```

## Reportes y evidencia

La configuración registra el trace y el video de cada prueba.

```bash
npx playwright show-report                                  # Reporte HTML
npx playwright show-trace test-results/<carpeta>/trace.zip  # Trace viewer
```

Los videos quedan en `test-results/<carpeta>/video.webm`.

## Estructura

```
playwright/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── datos/
│   └── imagen-prueba.jpg
├── docs/
│   └── especificacionPruebas.md
├── fixtures/
│   └── prueba.ts
├── paginas/
│   ├── pagina-inicio-sesion.ts
│   ├── pagina-muro-publicaciones.ts
│   ├── pagina-crear-publicacion.ts
│   └── pagina-publicacion.ts
└── pruebas/
    ├── F1-autenticacion.spec.ts
    ├── F2-publicacion.spec.ts
    └── F3-comentario.spec.ts
```

- **paginas/**: Page Object Model. Una clase por pantalla, con sus locators y acciones.
- **fixtures/**: fixtures propias que entregan las páginas ya instanciadas. Inician sesión cuando hace falta y borran las publicaciones creadas al terminar cada prueba.
- **pruebas/**: un archivo por flujo.
## Casos de prueba

| Caso | Flujo            | Descripción                        |
|------|------------------|------------------------------------|
| CP1  | Inicio de sesión | Credenciales válidas               |
| CP2  | Inicio de sesión | Credenciales inválidas             |
| CP3  | Publicación      | Creación de una publicación válida |
| CP4  | Publicación      | Validación del formulario          |
| CP5  | Comentario       | Creación de un comentario válido   |
| CP6  | Comentario       | Validación del formulario          |

## Datos de prueba y limpieza

- Cada prueba que crea una publicación guarda su identificador y la elimina al finalizar mediante el endpoint `DELETE /publicaciones/:id` del backend, por lo que las ejecuciones repetidas no acumulan datos.
- Las pruebas son independientes entre sí: las de comentarios crean su propia publicación antes de ejecutarse.
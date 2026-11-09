# Fitofilia - Segundo Parcial Programación IV

Single Page Application desarrollada con Angular y NestJS como proyecto académico para el segundo parcial de la materia Programación IV en la UTN FRA.

## Descripción

Fitofilia es una red social temática sobre plantas. Permite crear publicaciones con imagenes, comentar y dar corazones. También incluye un panel de control con gestión de usuarios y estadísticas.

## Tecnologías

- Angular 22
- TypeScript
- LESS
- NestJS 12
- MongoDB y Mongoose
- Chart.js
- Cloudinary
- JWT
- PWA con Angular Service Worker
- RxJS
- Font Awesome y Google Fonts
- Vercel (frontend) y Render (backend)

## Estructura del proyecto

- `frontend/src/app/`: código fuente principal de la aplicación Angular
  - `componentes/`: páginas y componentes reutilizables
  - `servicios/`: comunicación con la API y lógica de la aplicación
  - `interfaces/`: contratos de datos utilizados por el frontend
  - `guardias/`: protección de rutas
  - `directivas/`: directivas personalizadas
  - `tuberias/`: tuberías personalizadas
  - `interceptores/`: interceptores HTTP
  - `app.config.ts` y `app.routes.ts`: configuración de proveedores y rutas
- `frontend/public/`: recursos estáticos, manifiesto e íconos de la PWA
- `backend/src/`: código fuente de la API NestJS
  - `modulos/usuarios/`: gestión de usuarios
  - `modulos/autenticacion/`: registro, inicio de sesión y tokens
  - `modulos/publicaciones/`: publicaciones, comentarios y estadísticas
  - `guardias/`: protección de endpoints
- `frontend/angular.json` y `backend/nest-cli.json`: configuración de compilación de cada aplicación

## Ejecución

### 1. Clonar el repositorio

Cloná el repositorio y posicionate en el directorio raíz:

```bash
git clone https://github.com/SantiagoTrillo/fitofilia-fullstack.git
cd fitofilia-fullstack
```

### 2. Configurar e iniciar el backend

En una terminal, instalá sus dependencias y creá el archivo local de variables de entorno a partir del ejemplo:

```bash
cd backend
npm install
cp .env.example .env
```

Completá en `backend/.env` la conexión a MongoDB, el secreto JWT y las credenciales de Cloudinary. Luego iniciá NestJS:

```bash
npm run start:dev
```

El backend quedará escuchando en `http://localhost:3000`.

### 3. Instalar e iniciar el frontend

En otra terminal, desde el directorio raíz del repositorio:

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200/` y se conectará al backend local.

## Despliegue

- Frontend: [https://fitofilia.vercel.app](https://fitofilia.vercel.app)
- Backend: [https://fitofilia-backend.onrender.com](https://fitofilia-backend.onrender.com)
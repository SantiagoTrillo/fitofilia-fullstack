# Especificación de pruebas

## 1. Contexto de la aplicación

Fitofilia es una red social temática sobre plantas. Permite crear publicaciones con imágenes, comentar y dar corazones, e incluye un panel de control con gestión de usuarios y estadísticas.

Es una **Single Page Application (SPA)** con:

- **Frontend:** Angular, con rutas del lado del cliente y guardias de protección de rutas.
- **Backend:** NestJS con MongoDB (Mongoose), autenticación con JWT y subida de imágenes a Cloudinary.

**Entorno de pruebas:** local (`http://localhost:4200` para el frontend y `http://localhost:3000` para el backend).

## 2. Flujos críticos a cubrir

| Nº | Flujo                       | Motivo                                                                                     |
|----|-----------------------------|--------------------------------------------------------------------------------------------|
| 1  | Inicio de sesión            | Casi todas las funciones de la página requieren autenticación del usuario.                 |
| 2  | Creación de una publicación | Es la función central de la red social e involucra envío de formulario y subida de imagen. |
| 3  | Creación de un comentario   | Interacción principal entre usuarios que actualiza la interfaz de forma dinámica.          |

## 3. Casos de prueba y criterios de aceptación

### Flujo 1: Inicio de sesión

**CP1 - Inicio de sesión con credenciales válidas**

- Precondición: existe el usuario de prueba.
- Pasos:
  1. Ir a la pantalla de inicio de sesión (/inicio-sesión).
  2. Ingresar el correo y contraseña del usuario de prueba.
  3. Presionar el botón "Iniciar sesión"
- Criterios de aceptación:
  - La aplicación redirige al usuario a la página de carga (/cargando), mostrando un spinner de carga con el texto "Validando token..." antes de poder realizar cualquier acción.
  - Al finalizar la validación del token, la aplicación redirige al usuario al muro de publicaciones (/).
  - Se guarda la sesión (token) en el session storage, y al recargar la página el usuario sigue autenticado.

**CP2 - Inicio de sesión con credenciales inválidas**

- Precondición: ninguna
- Pasos:
  1. Ir a la pantalla de inicio de sesión (/inicio-sesión).
  2. Ingresar el correo "inexistente@gmail.com" y la contraseña "Inexistente2026".
  3. Presionar el botón "Iniciar sesión"
- Criterios de aceptación:
  - Se muestra un toast de error con el mensaje "Error al procesar la solicitud: credenciales inválidas".
  - El usuario permanece en la pantalla de inicio de sesión.
  - No se guarda ninguna sesión.

### Flujo 2: Creación de una publicación

**CP3 - Creación de una publicación válida**

- Precondición: existe un usuario autenticado.
- Pasos:
  1. Presionar el botón "Crear publicación".
  2. Ingresar el título y cuerpo de la publicación.
  3. Presionar el botón "Seleccionar archivo" y luego subir una imagen para la publicación.
  4. Presionar el botón "Publicar".
- Criterios de aceptación:
  - La aplicación redirige al usuario al muro de publicaciones (/).
  - La publicación aparece en el listado sin recargar la página, con su título, cuerpo, imagen y autor.
  - Se muestra un toast de éxito con el mensaje "Publicación creada correctamente".

**CP4 - Validación del formulario de publicación**

- Precondición: existe un usuario autenticado.
- Pasos:
  1. Presionar el botón "Crear publicación".
  2. Dejar los campos "Título" y "Cuerpo" vacíos.
  3. Presionar el botón "Publicar".
  4. Completar los campos "Título" y "Cuerpo" con menos de 3 caracteres.
  5. Repetir el paso 3.
- Criterios de aceptación:
  - No se crea la publicación.
  - Se muestra un toast de error con el mensaje "Campos del formulario inválidos".

### Flujo 3: Creación de un comentario

**CP5 - Creación de un comentario válido**

- Precondición: existe un usuario autenticado y una publicación disponible.
- Pasos:
  1. Presionar el cuerpo de una publicación o su botón de comentarios.
  2. Desplazarse hasta encontrar la sección y caja de comentarios.
  3. Presionar la caja de comentarios y escribir un comentario.
  4. Presionar el botón "Publicar".
- Criterios de aceptación:
  - El comentario aparece en el listado sin recargar la página, con su texto y autor.
  - El contador del botón de comentarios se actualiza.
  - Se muestra un toast de éxito con el mensaje "Comentario publicado correctamente".

**CP6 - Validación del formulario de comentario**

- Precondición: existe un usuario autenticado y una publicación disponible.
- Pasos:
  1. Presionar el cuerpo de una publicación o su botón de comentarios.
  2. Desplazarse hasta encontrar la sección y caja de comentarios.
  3. Dejar la caja de comentarios vacía.
  4. Presionar el botón "Publicar".
  5. Presionar la caja de comentarios e ingresar un texto de menos de 3 caracteres.
  6. Repetir el paso 4.
- Criterios de aceptación:
  - No se crea el comentario.
  - Se muestra un toast de error con el mensaje "Comentario inválido".

## 4. Restricciones técnicas

| Aspecto         | Definición                                                                                               |
|-----------------|----------------------------------------------------------------------------------------------------------|
| Herramienta     | Playwright con TypeScript                                                                                |
| Navegador       | Chromium                                                                                                 |
| Viewport        | 1280 × 720                                                                                               |
| Entorno         | Local, con frontend y backend levantados antes de correr las pruebas                                     |
| Datos de prueba | Usuario fijo de prueba (correo: playwright@gmail.com, contraseña: Playwright2026) y una imagen de prueba |
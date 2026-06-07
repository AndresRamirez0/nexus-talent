# Implementation Plan: Sprint 2 - Portafolio Digital

Este plan detalla el diseño técnico para implementar el Sprint 2 del proyecto Nexus Talent, que comprende la creación y gestión del portafolio digital, publicación de proyectos con imágenes mediante Cloudinary, y la visualización pública del portafolio.

## User Review Required

> [!IMPORTANT]
> **Integración con Cloudinary**: El módulo requiere el uso de Cloudinary para almacenar imágenes. Deberás crear una cuenta gratuita en [Cloudinary](https://cloudinary.com/) (si aún no la tienes) y agregar las siguientes variables a tu archivo `backend/.env`:
> - `CLOUDINARY_CLOUD_NAME`
> - `CLOUDINARY_API_KEY`
> - `CLOUDINARY_API_SECRET`
> 
> Te pediré que configures estas variables durante la ejecución.

## Open Questions

> [!NOTE]
> 1. Para la URL pública del portafolio (HU03), ¿prefieres que la ruta se base en el ID del usuario (`/portfolio/:userId`) o deberíamos agregar un nombre de usuario único (`/portfolio/:username`)? *Por defecto, propondré `/portfolio/:userId` para alinearnos con la base de datos actual.*
> 2. ¿Deseas que añada las credenciales de prueba de Cloudinary temporales si no tienes unas a la mano para validar el sprint, o prefieres usar las tuyas desde el principio?

## Proposed Changes

---

### Backend: Dependencias y Base de Datos

Se instalarán las dependencias necesarias para la carga de archivos multimedia y su envío a Cloudinary.

#### [MODIFY] [backend/package.json](file:///c:/proyectos/nexus-talent/backend/package.json)
- Instalar dependencias `cloudinary` y `multer`.

#### [NEW] [backend/src/models/portfolioModel.js](file:///c:/proyectos/nexus-talent/backend/src/models/portfolioModel.js)
- Definir y crear las tablas `portafolios` y `proyectos` en PostgreSQL con integridad referencial hacia la tabla `usuarios`.
- Implementar consultas SQL para crear, leer, actualizar y eliminar (CRUD) proyectos, y consultar el portafolio público.

#### [MODIFY] [backend/index.js](file:///c:/proyectos/nexus-talent/backend/index.js)
- Importar y ejecutar la creación de tablas de `portafolios` y `proyectos` al iniciar el servidor para garantizar la base de datos completa.

---

### Backend: Lógica de Negocio y API

#### [NEW] [backend/src/config/cloudinary.js](file:///c:/proyectos/nexus-talent/backend/src/config/cloudinary.js)
- Configurar y exportar el SDK de Cloudinary v2 usando las variables de entorno.

#### [NEW] [backend/src/middlewares/uploadMiddleware.js](file:///c:/proyectos/nexus-talent/backend/src/middlewares/uploadMiddleware.js)
- Configurar `multer` con `memoryStorage` para procesar y validar las imágenes enviadas desde el frontend antes de subirlas a Cloudinary.

#### [NEW] [backend/src/controllers/portfolioController.js](file:///c:/proyectos/nexus-talent/backend/src/controllers/portfolioController.js)
- **POST /api/portfolio/projects**: Lógica para subir la imagen a Cloudinary y guardar los datos del proyecto en la base de datos.
- **PUT /api/portfolio/projects/:id**: Actualizar un proyecto (opcionalmente la imagen).
- **DELETE /api/portfolio/projects/:id**: Eliminar un proyecto.
- **GET /api/portfolio/:userId**: Obtener los datos públicos del usuario y todos sus proyectos.

#### [NEW] [backend/src/routes/portfolioRoutes.js](file:///c:/proyectos/nexus-talent/backend/src/routes/portfolioRoutes.js)
- Definición de rutas mencionadas y su correspondiente documentación en formato Swagger.

#### [MODIFY] [backend/src/app.js](file:///c:/proyectos/nexus-talent/backend/src/app.js)
- Registrar `portfolioRoutes` en la aplicación Express bajo el path `/api/portfolio`.

---

### Frontend: UI y Consumo de API

#### [NEW] [frontend/src/components/Portfolio/ProjectForm.js](file:///c:/proyectos/nexus-talent/frontend/src/components/Portfolio/ProjectForm.js)
- Formulario para crear o editar un proyecto.
- Validación de campos: título, descripción, tecnologías (máximo 5) e imagen requerida.

#### [NEW] [frontend/src/components/Portfolio/ProjectList.js](file:///c:/proyectos/nexus-talent/frontend/src/components/Portfolio/ProjectList.js)
- Componente que muestra los proyectos del usuario autenticado en su perfil privado.
- Permite acciones de editar y eliminar proyectos.

#### [MODIFY] [frontend/src/components/Profile/Profile.js](file:///c:/proyectos/nexus-talent/frontend/src/components/Profile/Profile.js)
- Integrar `ProjectList` y un botón para abrir el `ProjectForm` en un modal o sección para gestionar los proyectos personales.

#### [NEW] [frontend/src/pages/PublicPortfolio.js](file:///c:/proyectos/nexus-talent/frontend/src/pages/PublicPortfolio.js)
- Página de visualización pública. Carga los datos del perfil y proyectos de un usuario sin necesidad de autenticación, según la HU03.

#### [MODIFY] [frontend/src/App.js](file:///c:/proyectos/nexus-talent/frontend/src/App.js)
- Agregar ruta pública `/portfolio/:id` mapeada a `PublicPortfolio`.

## Verification Plan

### Automated Tests
- Validar mediante el Swagger UI que los endpoints REST de Portafolio funcionen correctamente (crear, actualizar, borrar y obtener portafolio público).
- El proyecto actualmente no especifica una suite de testing automático en el frontend/backend más allá del uso de herramientas como ESLint o Jest (por defecto en React), sin embargo, usaré logs para validaciones internas.

### Manual Verification
1. Ingresar con una cuenta de usuario existente.
2. Navegar al perfil y crear un proyecto adjuntando una imagen y múltiples tecnologías.
3. Verificar que la imagen aparezca correctamente desde Cloudinary y los datos se guarden en PostgreSQL.
4. Editar y eliminar un proyecto y asegurar que se refleje.
5. Acceder a la URL pública de ese portafolio en una ventana de incógnito para validar la visibilidad pública sin autenticación.

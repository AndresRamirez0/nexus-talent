# Nexus Talent

Plataforma Web de Portafolios Digitales con Sistema de Mentoría y Retroalimentación entre Pares.

## Descripción del Proyecto

Nexus Talent es una solución integral diseñada para estudiantes y profesionales jóvenes del ecosistema digital colombiano. Permite visibilizar su trabajo a través de portafolios digitales, recibir mentoría estructurada y obtener retroalimentación colaborativa. La plataforma consolida las funcionalidades que normalmente se encuentran dispersas en múltiples herramientas (como LinkedIn, GitHub y Behance).

## Arquitectura del Sistema

El proyecto sigue una arquitectura **Cliente-Servidor (C4)**:
- **Frontend (SPA)**: React.js (React Router, Axios).
- **Backend (API REST)**: Node.js, Express.
- **Base de Datos**: PostgreSQL (relacional).
- **Almacenamiento Multimedia**: Cloudinary.
- **Autenticación**: JSON Web Tokens (JWT) y cifrado con Bcrypt.

## Tecnologías Utilizadas

- **Frontend**: React 18, React Router DOM, Axios, Playwright (E2E Testing).
- **Backend**: Node.js 20 LTS, Express 5, `pg` (PostgreSQL driver), JWT, Multer, Jest & Supertest (Testing).
- **Infraestructura**: Docker, Docker Compose, GitHub Actions (CI/CD).
- **Servicios Externos**: Cloudinary API.

## Guía de Instalación y Ejecución Local

Para ejecutar el proyecto en tu entorno local, cuentas con dos opciones: mediante Docker (recomendado) o de manera manual.

### Opción 1: Usando Docker (Recomendado)

Requisitos: Tener instalado [Docker](https://www.docker.com/) y Docker Compose.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AndresRamirez0/nexus-talent.git
   cd nexus-talent
   ```

2. Configura las variables de entorno:
   - Crea un archivo `.env` dentro de la carpeta `backend/` basado en el `.env.example` (o utiliza tus propias credenciales de Cloudinary y JWT).

3. Levanta los servicios con Docker Compose:
   ```bash
   docker-compose up --build
   ```
   
Esto iniciará:
- **Base de Datos (PostgreSQL)** en el puerto `5432`.
- **Backend API** en `http://localhost:3001` (incluye Swagger en `/api/docs`).
- **Frontend React** en `http://localhost:3000`.

### Opción 2: Instalación Manual

Requisitos: Node.js (v18 o superior) y PostgreSQL local.

1. **Configurar Base de Datos:**
   Crea una base de datos local llamada `nexustalent` en PostgreSQL.

2. **Configurar y ejecutar el Backend:**
   ```bash
   cd backend
   npm install
   # Crea tu archivo .env con tus credenciales locales de BD y Cloudinary
   npm run dev
   ```

3. **Configurar y ejecutar el Frontend:**
   En otra terminal:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Documentación de la API

La API cuenta con documentación interactiva generada con **Swagger UI**. 
Una vez que el backend esté corriendo, puedes acceder a la documentación en:
👉 `http://localhost:3001/api/docs`

## Pruebas de Software

El proyecto cuenta con pruebas de integración en el backend y pruebas E2E en el frontend.
Para ejecutarlas:

**Backend (Jest + Supertest):**
```bash
cd backend
npm test
```

**Frontend (Playwright):**
```bash
cd frontend
npx playwright test
```
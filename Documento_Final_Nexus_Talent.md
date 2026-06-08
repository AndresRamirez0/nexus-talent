# [Portada]
**Título del Proyecto:** Nexus Talent: Plataforma de Portafolios y Mentoría para el Talento Digital
**Nombre del Estudiante / Equipo:** [Tus Nombres]
**Nombre de la Institución:** [Tu Universidad]
**Asignatura:** [Nombre de la Materia]
**Fecha:** 7 de Junio de 2026

---

# Introducción
El presente documento detalla el desarrollo e implementación del proyecto de software "Nexus Talent", una plataforma web diseñada para visibilizar el talento de estudiantes y profesionales jóvenes del sector tecnológico. A través de este sistema, se busca resolver la fragmentación actual que existe al momento de crear portafolios digitales, recibir retroalimentación técnica y establecer conexiones de mentoría. El documento aborda desde el cierre del alcance del problema, la ejecución de pruebas de calidad y automatización mediante integración continua, hasta el despliegue final en entornos de producción y retrospectiva ágil del equipo de desarrollo.

---

# Desarrollo del Proyecto

## 1. Cierre del problema y alcance del proyecto

### Descripción del problema inicial
Los talentos emergentes en el ecosistema digital colombiano (desarrolladores, diseñadores y creadores) enfrentan dificultades para centralizar sus proyectos y recibir retroalimentación constructiva de pares o mentores. Las herramientas actuales suelen ser muy genéricas (como LinkedIn) o muy técnicas (como GitHub), careciendo de un espacio intermedio enfocado en la colaboración académica y profesional temprana.

### Explicación de la solución desarrollada
"Nexus Talent" responde a este problema mediante una arquitectura Cliente-Servidor que permite a los usuarios:
1. Crear perfiles profesionales detallados.
2. Cargar proyectos multimedia respaldados en la nube (Cloudinary).
3. Interactuar mediante un sistema de comentarios y valoraciones cuantitativas, fomentando una cultura de mejora continua.

### Comparación: Alcance planeado vs Alcance ejecutado
* **Alcance planeado:** Se planificó un sistema CRUD de usuarios, gestión de portafolios, mensajería en tiempo real, sistema de mentoría y panel de administración.
* **Alcance ejecutado:** Se implementó exitosamente la autenticación segura (JWT), gestión de perfiles, sistema de publicación de portafolios con almacenamiento en la nube, y el sistema de feedback (comentarios y puntajes). 
* **Funcionalidades no implementadas:** El chat en tiempo real mediante WebSockets y el sistema de agendamiento de videollamadas para mentoría.
* **Justificación:** Se decidió priorizar la estabilidad, la cobertura de pruebas automatizadas y la integración continua (CI/CD) de las funcionalidades principales (Core) para asegurar un producto mínimo viable (MVP) de alta calidad técnica, delegando el chat en tiempo real para futuras iteraciones del producto.

## 2. Pruebas de Software
Para garantizar la calidad del sistema, se implementaron suites de pruebas abarcando el 80% de las funcionalidades clave del backend y flujos de usuario en el frontend.

* **Pruebas Unitarias y de Integración (Backend - Jest & Supertest):** Se ejecutaron 27 casos de prueba automatizados evaluando el comportamiento de controladores, middlewares de autenticación y modelos de base de datos.
  * *[ESPACIO PARA CAPTURA: Pegar pantallazo de la consola mostrando "Test Suites: 4 passed, Tests: 24 passed" y la tabla de Coverage del ~80%]*

* **Pruebas End-To-End (Frontend - Playwright):** Se automatizaron flujos críticos de la interfaz de usuario simulando interacciones reales en el navegador.
  * *[ESPACIO PARA CAPTURA: Pegar pantallazo del reporte verde de Playwright mostrando los test de UI que pasaron]*

## 3. Pipeline de CI/CD
Se configuró un pipeline de Integración y Despliegue Continuo utilizando GitHub Actions. El archivo `ci-cd.yml` automatiza la verificación del código mediante los siguientes pasos:
1. Instalación de dependencias (Build).
2. Ejecución de pruebas unitarias y de integración en un entorno virtual de Ubuntu.
3. El pipeline fue configurado para ejecutarse frente a cada `Pull Request` y eventos de `Push` hacia las ramas principales.

**Evidencias de Ejecución:**
* *[ESPACIO PARA CAPTURA: Pegar pantallazo 1 de la pestaña "Actions" en GitHub con el chulito verde]*
* *[ESPACIO PARA CAPTURA: Pegar pantallazo 2 de una ejecución exitosa]*
* *[ESPACIO PARA CAPTURA: Pegar pantallazo 3 de una ejecución exitosa]*

## 4. Aplicación en Producción
El sistema "Nexus Talent" se encuentra desplegado en entornos de producción accesibles públicamente:
* **Backend:** Desplegado como un Web Service en **Render**, conectado a una base de datos PostgreSQL gestionada en la nube.
* **Frontend:** Desplegado y distribuido globalmente mediante **Vercel**.
* **Multimedia:** Almacenamiento gestionado mediante la API de **Cloudinary**.

**Evidencias de Despliegue:**
* *[ESPACIO PARA CAPTURA: Pegar pantallazo del dashboard de Render con el estado "Live"]*
* *[ESPACIO PARA CAPTURA: Pegar pantallazo del dashboard de Vercel con el estado "Congratulations"]*
* *[ESPACIO PARA CAPTURA: Pegar pantallazo de la aplicación web funcionando en el navegador web con la URL de Vercel visible en la barra de direcciones]*

## 5. Documentación Técnica del Proyecto
Se establecieron estándares rigurosos de documentación técnica, los cuales están disponibles públicamente:
* **Wiki del Repositorio:** El manual de instalación y arquitectura técnica está documentado en la Wiki de GitHub.
  * *[ESPACIO PARA CAPTURA: Pegar pantallazo de la pestaña "Wiki" en tu repositorio de GitHub]*
* **Documentación de API:** Generada con Swagger UI, detallando los esquemas JSON y endpoints RESTful.
  * *[ESPACIO PARA CAPTURA: Pegar pantallazo de la interfaz de Swagger UI local o en Render]*

## 6. Retrospectiva Final del Proyecto

**Principales Aprendizajes:**
El equipo consolidó sus conocimientos en el desarrollo de arquitecturas Cliente-Servidor utilizando el stack PERN (PostgreSQL, Express, React, Node.js). Se dominó la configuración de pipelines CI/CD y el despliegue de aplicaciones en la nube, comprendiendo la importancia de las pruebas automatizadas para evitar regresiones en el código.

**Dificultades Enfrentadas:**
El mayor desafío técnico radicó en la sincronización de variables de entorno entre los diferentes entornos (Desarrollo local, GitHub Actions y Producción en Render), así como el manejo del almacenamiento de archivos binarios (imágenes) a través de servicios de terceros como Cloudinary.

**Mejoras para un futuro inicio:**
Si se iniciara nuevamente, el equipo optaría por implementar un desarrollo guiado por pruebas (TDD) desde el día cero, en lugar de integrar la suite de pruebas al final del ciclo de vida del desarrollo.

**Recomendaciones para futuros estudiantes:**
Es crucial dominar herramientas de control de versiones (Git) y no subestimar el tiempo que toma configurar los entornos de despliegue en la nube. La automatización mediante CI/CD ahorra horas de pruebas manuales y previene que el código defectuoso llegue a la rama principal.

**Métricas del Proyecto (Ejemplo):**
* Velocidad (Velocity): 24 puntos de historia por Sprint.
* Número de Historias de Usuario completadas: 15.
* Avance del Backlog: 85% completado.

---

# Conclusiones
El desarrollo de "Nexus Talent" culminó de manera exitosa, logrando un producto funcional, robusto y desplegado en la nube. La aplicación cumple con todos los estándares modernos de la ingeniería de software exigidos por el mercado actual: arquitectura escalable, pruebas de calidad integradas, automatización continua de despliegues y documentación técnica clara. Este proyecto demuestra la capacidad del equipo para transformar requerimientos en soluciones tecnológicas reales que aportan valor al ecosistema digital.

---

# Referencias Bibliográficas
* Meta. (2024). *React Documentation*. https://react.dev
* OpenJS Foundation. (2024). *Node.js API Reference*. https://nodejs.org
* PostgreSQL Global Development Group. (2024). *PostgreSQL Documentation*. https://www.postgresql.org/docs/
* GitHub. (2024). *GitHub Actions Documentation*. https://docs.github.com/en/actions

const pool = require('../config/database');

const createPortfoliosTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS portafolios (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      titulo VARCHAR(150),
      descripcion TEXT,
      activo BOOLEAN DEFAULT TRUE,
      fecha_creacion TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ Tabla portafolios lista');
};

const createProjectsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS proyectos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      portafolio_id UUID NOT NULL REFERENCES portafolios(id) ON DELETE CASCADE,
      titulo VARCHAR(150) NOT NULL,
      descripcion TEXT NOT NULL,
      tecnologias TEXT[] NOT NULL,
      imagen_url VARCHAR(255) NOT NULL,
      enlace_proyecto VARCHAR(255),
      enlace_repositorio VARCHAR(255),
      fecha_publicacion TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log('✅ Tabla proyectos lista');
};

// Crear portafolio para un usuario
const createPortfolio = async (usuario_id, titulo = '', descripcion = '') => {
  const result = await pool.query(
    `INSERT INTO portafolios (usuario_id, titulo, descripcion)
     VALUES ($1, $2, $3)
     ON CONFLICT (usuario_id) DO NOTHING
     RETURNING *`,
    [usuario_id, titulo, descripcion]
  );
  return result.rows[0];
};

// Obtener portafolio público con proyectos
const getPublicPortfolio = async (usuario_id) => {
  // 1. Obtener usuario
  const userResult = await pool.query(
    'SELECT id, nombre, email, rol, foto_perfil, descripcion, habilidades FROM usuarios WHERE id = $1',
    [usuario_id]
  );
  if (userResult.rows.length === 0) return null;
  
  const user = userResult.rows[0];

  // 2. Obtener portafolio
  let portafolio = null;
  const portResult = await pool.query(
    'SELECT * FROM portafolios WHERE usuario_id = $1 AND activo = TRUE',
    [usuario_id]
  );
  
  if (portResult.rows.length > 0) {
    portafolio = portResult.rows[0];
    // 3. Obtener proyectos
    const projResult = await pool.query(
      'SELECT * FROM proyectos WHERE portafolio_id = $1 ORDER BY fecha_publicacion DESC',
      [portafolio.id]
    );
    portafolio.proyectos = projResult.rows;
  }

  return { usuario: user, portafolio };
};

// Obtener portafolio por usuario (incluso si está inactivo, para el dueño)
const getPortfolioByUserId = async (usuario_id) => {
  const result = await pool.query(
    'SELECT * FROM portafolios WHERE usuario_id = $1',
    [usuario_id]
  );
  return result.rows[0];
};

// Crear un proyecto
const createProject = async (portafolio_id, proyecto) => {
  const { titulo, descripcion, tecnologias, imagen_url, enlace_proyecto, enlace_repositorio } = proyecto;
  const result = await pool.query(
    `INSERT INTO proyectos (portafolio_id, titulo, descripcion, tecnologias, imagen_url, enlace_proyecto, enlace_repositorio)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [portafolio_id, titulo, descripcion, tecnologias, imagen_url, enlace_proyecto, enlace_repositorio]
  );
  return result.rows[0];
};

// Actualizar un proyecto
const updateProject = async (proyecto_id, portafolio_id, proyecto) => {
  const { titulo, descripcion, tecnologias, imagen_url, enlace_proyecto, enlace_repositorio } = proyecto;
  const result = await pool.query(
    `UPDATE proyectos 
     SET titulo = COALESCE($1, titulo),
         descripcion = COALESCE($2, descripcion),
         tecnologias = COALESCE($3, tecnologias),
         imagen_url = COALESCE($4, imagen_url),
         enlace_proyecto = COALESCE($5, enlace_proyecto),
         enlace_repositorio = COALESCE($6, enlace_repositorio)
     WHERE id = $7 AND portafolio_id = $8
     RETURNING *`,
    [titulo, descripcion, tecnologias, imagen_url, enlace_proyecto, enlace_repositorio, proyecto_id, portafolio_id]
  );
  return result.rows[0];
};

// Eliminar un proyecto
const deleteProject = async (proyecto_id, portafolio_id) => {
  const result = await pool.query(
    'DELETE FROM proyectos WHERE id = $1 AND portafolio_id = $2 RETURNING id',
    [proyecto_id, portafolio_id]
  );
  return result.rows[0];
};

module.exports = {
  createPortfoliosTable,
  createProjectsTable,
  createPortfolio,
  getPublicPortfolio,
  getPortfolioByUserId,
  createProject,
  updateProject,
  deleteProject
};

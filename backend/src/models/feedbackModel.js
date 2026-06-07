const pool = require('../config/database');

const createFeedbackTables = async () => {
  const queryComentarios = `
    CREATE TABLE IF NOT EXISTS comentarios (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      texto VARCHAR(500) NOT NULL,
      fecha TIMESTAMP DEFAULT NOW()
    );
  `;
  
  const queryValoraciones = `
    CREATE TABLE IF NOT EXISTS valoraciones (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      puntuacion INT CHECK (puntuacion >= 1 AND puntuacion <= 5) NOT NULL,
      fecha TIMESTAMP DEFAULT NOW(),
      UNIQUE(proyecto_id, usuario_id)
    );
  `;

  await pool.query(queryComentarios);
  await pool.query(queryValoraciones);
  console.log('✅ Tablas comentarios y valoraciones listas');
};

const createComment = async (proyecto_id, usuario_id, texto) => {
  const result = await pool.query(
    `INSERT INTO comentarios (proyecto_id, usuario_id, texto)
     VALUES ($1, $2, $3) RETURNING *`,
    [proyecto_id, usuario_id, texto]
  );
  return result.rows[0];
};

const createOrUpdateRating = async (proyecto_id, usuario_id, puntuacion) => {
  const result = await pool.query(
    `INSERT INTO valoraciones (proyecto_id, usuario_id, puntuacion)
     VALUES ($1, $2, $3)
     ON CONFLICT (proyecto_id, usuario_id) DO UPDATE SET puntuacion = EXCLUDED.puntuacion
     RETURNING *`,
    [proyecto_id, usuario_id, puntuacion]
  );
  return result.rows[0];
};

const getCommentsByProject = async (proyecto_id) => {
  const result = await pool.query(
    `SELECT c.*, u.nombre, u.foto_perfil 
     FROM comentarios c
     JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.proyecto_id = $1
     ORDER BY c.fecha DESC`,
    [proyecto_id]
  );
  return result.rows;
};

const getAverageRatingByProject = async (proyecto_id) => {
  const result = await pool.query(
    `SELECT ROUND(AVG(puntuacion), 1) as promedio, COUNT(id) as total
     FROM valoraciones
     WHERE proyecto_id = $1`,
    [proyecto_id]
  );
  return result.rows[0];
};

const deleteComment = async (comentario_id) => {
  const result = await pool.query(
    'DELETE FROM comentarios WHERE id = $1 RETURNING *',
    [comentario_id]
  );
  return result.rows[0];
};

const getCommentById = async (comentario_id) => {
  const result = await pool.query(
    'SELECT * FROM comentarios WHERE id = $1',
    [comentario_id]
  );
  return result.rows[0];
};

module.exports = {
  createFeedbackTables,
  createComment,
  createOrUpdateRating,
  getCommentsByProject,
  getAverageRatingByProject,
  deleteComment,
  getCommentById
};

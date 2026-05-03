const pool = require('../config/database');

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(20) CHECK (rol IN ('estudiante', 'mentor', 'administrador')) DEFAULT 'estudiante',
      foto_perfil VARCHAR(255),
      descripcion TEXT,
      habilidades TEXT[],
      fecha_registro TIMESTAMP DEFAULT NOW(),
      activo BOOLEAN DEFAULT TRUE
    );
  `;
  await pool.query(query);
  console.log('✅ Tabla usuarios lista');
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, nombre, email, rol, foto_perfil, descripcion, habilidades, fecha_registro FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const createUser = async ({ nombre, email, password, rol }) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, rol, fecha_registro`,
    [nombre, email, password, rol]
  );
  return result.rows[0];
};

const updateUser = async (id, { nombre, descripcion, habilidades, foto_perfil }) => {
  const result = await pool.query(
    `UPDATE usuarios 
     SET nombre = $1, descripcion = $2, habilidades = $3, foto_perfil = $4
     WHERE id = $5
     RETURNING id, nombre, email, rol, foto_perfil, descripcion, habilidades`,
    [nombre, descripcion, habilidades, foto_perfil, id]
  );
  return result.rows[0];
};

module.exports = { createUsersTable, findUserByEmail, findUserById, createUser, updateUser };
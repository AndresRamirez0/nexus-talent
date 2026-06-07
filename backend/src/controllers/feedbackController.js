const {
  createComment,
  createOrUpdateRating,
  getCommentsByProject,
  getAverageRatingByProject,
  deleteComment,
  getCommentById
} = require('../models/feedbackModel');
const pool = require('../config/database');

/**
 * Validar si un proyecto existe y verificar quién es su dueño
 */
const getProjectOwner = async (proyecto_id) => {
  const result = await pool.query(
    `SELECT p.id, port.usuario_id as owner_id
     FROM proyectos p
     JOIN portafolios port ON p.portafolio_id = port.id
     WHERE p.id = $1`,
    [proyecto_id]
  );
  return result.rows[0];
};

/**
 * Añadir comentario y/o valoración a un proyecto
 */
const addFeedback = async (req, res) => {
  try {
    const usuario_id = req.user.userId;
    const { projectId } = req.params;
    const { texto, puntuacion } = req.body;

    if (!texto && !puntuacion) {
      return res.status(400).json({ error: 'Debes proporcionar un comentario o una puntuación' });
    }

    const projectData = await getProjectOwner(projectId);
    if (!projectData) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    if (projectData.owner_id === usuario_id) {
      return res.status(403).json({ error: 'No puedes valorar o comentar tu propio proyecto' });
    }

    let comentario = null;
    let valoracion = null;

    if (texto) {
      if (texto.length > 500) {
        return res.status(400).json({ error: 'El comentario no puede exceder 500 caracteres' });
      }
      comentario = await createComment(projectId, usuario_id, texto);
    }

    if (puntuacion) {
      if (puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ error: 'La puntuación debe ser entre 1 y 5' });
      }
      valoracion = await createOrUpdateRating(projectId, usuario_id, puntuacion);
    }

    res.status(201).json({ message: 'Feedback guardado exitosamente', comentario, valoracion });
  } catch (error) {
    console.error('Error en addFeedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtener todos los comentarios y el promedio de valoraciones de un proyecto
 */
const getProjectFeedback = async (req, res) => {
  try {
    const { projectId } = req.params;

    const comentarios = await getCommentsByProject(projectId);
    const valoracionInfo = await getAverageRatingByProject(projectId);

    res.json({
      comentarios,
      valoracion: {
        promedio: parseFloat(valoracionInfo.promedio) || 0,
        total: parseInt(valoracionInfo.total) || 0
      }
    });
  } catch (error) {
    console.error('Error en getProjectFeedback:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Eliminar un comentario (solo el autor o el dueño del proyecto)
 */
const removeComment = async (req, res) => {
  try {
    const usuario_id = req.user.userId;
    const { commentId } = req.params;

    const comentario = await getCommentById(commentId);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const projectData = await getProjectOwner(comentario.proyecto_id);

    // Permitir borrar si es el autor del comentario o el dueño del proyecto
    if (comentario.usuario_id !== usuario_id && projectData.owner_id !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para borrar este comentario' });
    }

    await deleteComment(commentId);
    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error en removeComment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  addFeedback,
  getProjectFeedback,
  removeComment
};

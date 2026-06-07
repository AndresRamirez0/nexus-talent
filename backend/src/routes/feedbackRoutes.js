const express = require('express');
const router = express.Router();
const { addFeedback, getProjectFeedback, removeComment } = require('../controllers/feedbackController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/feedback/projects/{projectId}:
 *   get:
 *     summary: Obtener comentarios y valoraciones de un proyecto
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback obtenido exitosamente
 */
router.get('/projects/:projectId', getProjectFeedback);

/**
 * @swagger
 * /api/feedback/projects/{projectId}:
 *   post:
 *     summary: Añadir comentario o valoración a un proyecto
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *               puntuacion:
 *                 type: number
 *     responses:
 *       201:
 *         description: Feedback guardado exitosamente
 *       403:
 *         description: No puedes valorar tu propio proyecto
 */
router.post('/projects/:projectId', verifyToken, addFeedback);

/**
 * @swagger
 * /api/feedback/comments/{commentId}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado
 */
router.delete('/comments/:commentId', verifyToken, removeComment);

module.exports = router;

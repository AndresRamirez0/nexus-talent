const express = require('express');
const router = express.Router();
const { addProject, editProject, removeProject, getPublicUserPortfolio } = require('../controllers/portfolioController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * /api/portfolio/{userId}:
 *   get:
 *     summary: Obtener portafolio público de un usuario
 *     tags: [Portafolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Portafolio y proyectos obtenidos
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:userId', getPublicUserPortfolio);

/**
 * @swagger
 * /api/portfolio/projects:
 *   post:
 *     summary: Añadir un proyecto al portafolio
 *     tags: [Portafolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tecnologias:
 *                 type: string
 *                 description: "Coma separated list of technologies"
 *               enlace_proyecto:
 *                 type: string
 *               enlace_repositorio:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Proyecto añadido exitosamente
 */
router.post('/projects', verifyToken, upload.single('imagen'), addProject);

/**
 * @swagger
 * /api/portfolio/projects/{id}:
 *   put:
 *     summary: Editar un proyecto del portafolio
 *     tags: [Portafolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tecnologias:
 *                 type: string
 *               enlace_proyecto:
 *                 type: string
 *               enlace_repositorio:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 */
router.put('/projects/:id', verifyToken, upload.single('imagen'), editProject);

/**
 * @swagger
 * /api/portfolio/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto del portafolio
 *     tags: [Portafolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 */
router.delete('/projects/:id', verifyToken, removeProject);

module.exports = router;

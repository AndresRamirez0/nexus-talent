const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints de gestión de perfil de usuario
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *                     rol:
 *                       type: string
 *                     foto_perfil:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     habilidades:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/profile', verifyToken, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Nelson Andrés Ramírez
 *               descripcion:
 *                 type: string
 *                 example: Desarrollador de software apasionado por el backend
 *               habilidades:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [React, Node.js, PostgreSQL]
 *               foto_perfil:
 *                 type: string
 *                 example: https://ejemplo.com/foto.jpg
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: El nombre es obligatorio
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
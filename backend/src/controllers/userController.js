const { findUserById, updateUser } = require('../models/userModel');

const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nombre, descripcion, habilidades, foto_perfil } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const updatedUser = await updateUser(req.user.id, {
      nombre,
      descripcion,
      habilidades,
      foto_perfil
    });

    res.status(200).json({
      message: '✅ Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getProfile, updateProfile };
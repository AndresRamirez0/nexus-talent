const { 
  createPortfolio, 
  getPortfolioByUserId, 
  createProject, 
  updateProject, 
  deleteProject, 
  getPublicPortfolio 
} = require('../models/portfolioModel');
const cloudinary = require('../config/cloudinary');

/**
 * Obtener portafolio público de un usuario (para visitantes y reclutadores)
 */
const getPublicUserPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolioData = await getPublicPortfolio(userId);
    
    if (!portfolioData) {
      return res.status(404).json({ error: 'Usuario no encontrado o no tiene portafolio activo' });
    }

    res.json(portfolioData);
  } catch (error) {
    console.error('Error en getPublicUserPortfolio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Asegurar que el usuario autenticado tenga un portafolio creado
 */
const ensurePortfolio = async (usuario_id) => {
  let portafolio = await getPortfolioByUserId(usuario_id);
  if (!portafolio) {
    portafolio = await createPortfolio(usuario_id, 'Mi Portafolio', 'Portafolio profesional');
  }
  return portafolio;
};

/**
 * Subir imagen a Cloudinary desde un buffer en memoria
 */
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'nexus_talent_projects' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Añadir un proyecto al portafolio (requiere Auth + Imagen)
 */
const addProject = async (req, res) => {
  try {
    const usuario_id = req.user.userId; // Viene del authMiddleware
    const { titulo, descripcion, tecnologias, enlace_proyecto, enlace_repositorio } = req.body;
    
    if (!titulo || !descripcion || !tecnologias) {
      return res.status(400).json({ error: 'Título, descripción y tecnologías son obligatorios' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Debe adjuntar una imagen para el proyecto' });
    }

    // 1. Asegurar que existe el portafolio
    const portafolio = await ensurePortfolio(usuario_id);

    // 2. Subir imagen a Cloudinary
    let imagen_url = '';
    try {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imagen_url = uploadResult.secure_url;
    } catch (uploadError) {
      console.error('Error subiendo a Cloudinary:', uploadError);
      return res.status(500).json({ error: 'Error al subir la imagen' });
    }

    // 3. Parsear tecnologías (si vienen como string separado por comas)
    let techArray = [];
    if (typeof tecnologias === 'string') {
      techArray = tecnologias.split(',').map(t => t.trim()).filter(t => t);
    } else if (Array.isArray(tecnologias)) {
      techArray = tecnologias;
    }

    // 4. Guardar en base de datos
    const nuevoProyecto = await createProject(portafolio.id, {
      titulo,
      descripcion,
      tecnologias: techArray,
      imagen_url,
      enlace_proyecto,
      enlace_repositorio
    });

    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error('Error en addProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Actualizar un proyecto existente (requiere Auth)
 */
const editProject = async (req, res) => {
  try {
    const usuario_id = req.user.userId;
    const { id: proyecto_id } = req.params;
    const { titulo, descripcion, tecnologias, enlace_proyecto, enlace_repositorio } = req.body;

    const portafolio = await getPortfolioByUserId(usuario_id);
    if (!portafolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }

    let imagen_url = undefined;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imagen_url = uploadResult.secure_url;
    }

    let techArray = undefined;
    if (tecnologias) {
      if (typeof tecnologias === 'string') {
        techArray = tecnologias.split(',').map(t => t.trim()).filter(t => t);
      } else if (Array.isArray(tecnologias)) {
        techArray = tecnologias;
      }
    }

    const proyectoActualizado = await updateProject(proyecto_id, portafolio.id, {
      titulo,
      descripcion,
      tecnologias: techArray,
      imagen_url,
      enlace_proyecto,
      enlace_repositorio
    });

    if (!proyectoActualizado) {
      return res.status(404).json({ error: 'Proyecto no encontrado o no autorizado' });
    }

    res.json(proyectoActualizado);
  } catch (error) {
    console.error('Error en editProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Eliminar un proyecto (requiere Auth)
 */
const removeProject = async (req, res) => {
  try {
    const usuario_id = req.user.userId;
    const { id: proyecto_id } = req.params;

    const portafolio = await getPortfolioByUserId(usuario_id);
    if (!portafolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }

    const eliminado = await deleteProject(proyecto_id, portafolio.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Proyecto no encontrado o no autorizado' });
    }

    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error en removeProject:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getPublicUserPortfolio,
  addProject,
  editProject,
  removeProject
};

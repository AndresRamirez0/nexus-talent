const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database', () => ({
  query: jest.fn()
}));
jest.mock('../config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn((opts, cb) => {
      cb(null, { secure_url: 'http://cloudinary.com/test-image.jpg' });
      return { end: jest.fn() };
    })
  }
}));

describe('Portfolio Integration Tests', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: '123', rol: 'estudiante' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Creación de Proyectos en Portafolio: Confirma que se guarden imágenes en Cloudinary y el proyecto en DB', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'port-1' }] }); 
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1', titulo: 'Test Project', imagen_url: 'http://cloudinary.com/test-image.jpg' }] }); 

    const res = await request(app)
      .post('/api/portfolio/projects')
      .set('Authorization', `Bearer ${token}`)
      .field('titulo', 'Test Project')
      .field('descripcion', 'Descripción')
      .field('tecnologias', 'React,Node')
      .attach('imagen', Buffer.from('test-image-content'), 'test.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('titulo', 'Test Project');
  });

  it('Obtener Portafolio Publico: Exitoso', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123', nombre: 'Test' }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'port-1', titulo: 'Mi Portafolio' }] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/portfolio/123');
    expect(res.statusCode).toBe(200);
  });

  it('Obtener Portafolio Publico: No encontrado', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/portfolio/999');
    expect(res.statusCode).toBe(404);
  });

  it('Obtener Portafolio Publico: Error de servidor', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB Error'));
    const res = await request(app).get('/api/portfolio/123');
    expect(res.statusCode).toBe(500);
  });

  it('Eliminar Proyecto: Exitoso', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'port-1' }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1' }] });
    const res = await request(app).delete('/api/portfolio/projects/proj-1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('Eliminar Proyecto: No autorizado', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'port-1' }] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).delete('/api/portfolio/projects/proj-1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

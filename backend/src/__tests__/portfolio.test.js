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
    token = jwt.sign({ userId: '123', rol: 'estudiante' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Creación de Proyectos en Portafolio: Confirma que se guarden imágenes en Cloudinary y el proyecto en DB', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'port-1' }] }); // ensurePortfolio -> found
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1', titulo: 'Mi Proyecto', imagen_url: 'http://cloudinary.com/test-image.jpg' }] }); // insert project

    const res = await request(app)
      .post('/api/portfolio/projects')
      .set('Authorization', `Bearer ${token}`)
      .field('titulo', 'Mi Proyecto')
      .field('descripcion', 'Descripción')
      .field('tecnologias', 'React,Node')
      .attach('imagen', Buffer.from('test-image-content'), 'test.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('imagen_url', 'http://cloudinary.com/test-image.jpg');
  });
});

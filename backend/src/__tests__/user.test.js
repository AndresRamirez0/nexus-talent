const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('User Integration Tests', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: '123', rol: 'estudiante' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Obtener Perfil: Exitoso', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123', nombre: 'Test User' }] });

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('nombre', 'Test User');
  });

  it('Obtener Perfil: Usuario no encontrado', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it('Obtener Perfil: Error de servidor', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
  });

  it('Actualizar Perfil: Exitoso', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123', nombre: 'New Name' }] });

    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'New Name' });

    expect(res.statusCode).toBe(200);
  });

  it('Actualizar Perfil: Falta nombre', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ descripcion: 'Test' });

    expect(res.statusCode).toBe(400);
  });
  
  it('Actualizar Perfil: Error de servidor', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Valid Name' });

    expect(res.statusCode).toBe(500);
  });
});

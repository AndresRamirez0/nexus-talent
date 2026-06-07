const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');

jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Flujo de Autenticación: Registro exitoso', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // No email conflict
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123', nombre: 'Test User', email: 'test@test.com', rol: 'estudiante' }] }); // Insert

    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Test User', email: 'test@test.com', password: 'Password123!', rol: 'estudiante' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Flujo de Autenticación: Login exitoso', async () => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('Password123!', 10);
    
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123', nombre: 'Test User', email: 'test@test.com', password: hash, rol: 'estudiante' }] });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'Password123!' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

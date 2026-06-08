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

  it('Registro: Faltan campos', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('Registro: Email inválido', async () => {
    const res = await request(app).post('/api/auth/register').send({ nombre: 'T', email: 'inv', password: 'Password123!', rol: 'estudiante' });
    expect(res.statusCode).toBe(400);
  });

  it('Registro: Contraseña corta', async () => {
    const res = await request(app).post('/api/auth/register').send({ nombre: 'T', email: 't@t.com', password: '123', rol: 'estudiante' });
    expect(res.statusCode).toBe(400);
  });

  it('Registro: Email ya existe', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123' }] });
    const res = await request(app).post('/api/auth/register').send({ nombre: 'T', email: 'test@test.com', password: 'Password123!', rol: 'estudiante' });
    expect(res.statusCode).toBe(409);
  });

  it('Login: Faltan credenciales', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });

  it('Login: Usuario no encontrado', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).post('/api/auth/login').send({ email: 'n@n.com', password: 'Password123!' });
    expect(res.statusCode).toBe(401);
  });

  it('Login: Contraseña incorrecta', async () => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('OtherPass', 10);
    pool.query.mockResolvedValueOnce({ rows: [{ id: '123', password: hash }] });
    const res = await request(app).post('/api/auth/login').send({ email: 't@t.com', password: 'Password123!' });
    expect(res.statusCode).toBe(401);
  });
});

const request = require('supertest');
const app = require('../app');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('Feedback Integration Tests', () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ userId: '123', rol: 'estudiante' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Sistema de Retroalimentación: No permitir valorar propio proyecto', async () => {
    // getProjectOwner -> owner_id es 123
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1', owner_id: '123' }] }); 

    const res = await request(app)
      .post('/api/feedback/projects/proj-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ texto: 'Buen trabajo', puntuacion: 5 });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'No puedes valorar o comentar tu propio proyecto');
  });

  it('Sistema de Retroalimentación: Permitir valorar proyecto ajeno', async () => {
    // getProjectOwner -> owner_id es 999 (diferente a 123)
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1', owner_id: '999' }] }); 
    // createComment
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'comm-1', texto: 'Buen trabajo' }] }); 
    // createOrUpdateRating
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'rate-1', puntuacion: 5 }] }); 

    const res = await request(app)
      .post('/api/feedback/projects/proj-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ texto: 'Buen trabajo', puntuacion: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Feedback guardado exitosamente');
  });
});

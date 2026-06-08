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
    token = jwt.sign({ id: '123', rol: 'estudiante' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
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

  it('Obtener Feedback de Proyecto: Exitoso', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'comm-1', texto: 'Good' }] }); // getComments
    pool.query.mockResolvedValueOnce({ rows: [{ promedio: 4.5, total: 2 }] }); // getAverageRating
    const res = await request(app).get('/api/feedback/projects/proj-1');
    expect(res.statusCode).toBe(200);
    expect(res.body.valoracion.promedio).toBe(4.5);
  });

  it('Obtener Feedback de Proyecto: Error', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB Error'));
    const res = await request(app).get('/api/feedback/projects/proj-1');
    expect(res.statusCode).toBe(500);
  });

  it('Eliminar Comentario: Exitoso por autor', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'comm-1', usuario_id: '123', proyecto_id: 'proj-1' }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1', owner_id: '999' }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'comm-1' }] }); // delete
    const res = await request(app).delete('/api/feedback/comments/comm-1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('Eliminar Comentario: Prohibido', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'comm-1', usuario_id: '555', proyecto_id: 'proj-1' }] });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'proj-1', owner_id: '999' }] });
    const res = await request(app).delete('/api/feedback/comments/comm-1').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});

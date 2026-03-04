import request from 'supertest';
import app from '../api/app';

describe('API Endpoints', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'ok' });
  });

  it('GET /api/branches should return 200', async () => {
    const res = await request(app).get('/api/branches');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('API /api/games', () => {
  it('GET /api/games/new retourne une partie initiale pour la taille demandée', async () => {
    const res = await request(app).get('/api/games/new?size=6');
    expect(res.status).toBe(200);
    expect(res.body.size).toBe(6);
    expect(res.body.reserves['1'].stones).toBe(30);
  });

  it('GET /api/games/new rejette une taille invalide', async () => {
    const res = await request(app).get('/api/games/new?size=9');
    expect(res.status).toBe(400);
  });

  it('POST /api/games/replay rejoue une séquence de coups valide', async () => {
    const res = await request(app)
      .post('/api/games/replay')
      .send({ size: 5, moves: ['a1', 'a2', 'Cb1'] });

    expect(res.status).toBe(200);
    expect(res.body.history).toEqual(['a1', 'a2', 'Cb1']);
  });

  it('POST /api/games/replay rejette un coup illégal', async () => {
    const res = await request(app)
      .post('/api/games/replay')
      .send({ size: 5, moves: ['a1', 'a1'] });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/illégal/);
  });
});

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Game } from '../src/models/Game.js';

let mongod;
let app;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  mongod = await MongoMemoryServer.create({ binary: { version: '7.0.14', arch: 'x64' } });
  await mongoose.connect(mongod.getUri());
  app = createApp();
}, 180_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Game.deleteMany({});
});

async function registerUser(username) {
  const res = await request(app).post('/api/auth/register').send({
    username,
    email: `${username}@example.com`,
    password: 'password123',
  });
  return { token: res.body.token, user: res.body.user };
}

describe('API /api/games — parties persistées', () => {
  it('crée une partie publique, la liste, et permet à un second joueur de la rejoindre', async () => {
    const white = await registerUser('blanc');
    const black = await registerUser('noir');

    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'public' });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe('waiting');

    const list = await request(app).get('/api/games/public');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);

    const joined = await request(app)
      .post(`/api/games/${created.body._id}/join`)
      .set('Authorization', `Bearer ${black.token}`);
    expect(joined.status).toBe(200);
    expect(joined.body.status).toBe('ongoing');
    expect(joined.body.players.black).toBeTruthy();
  });

  it('refuse de rejoindre sa propre partie', async () => {
    const white = await registerUser('blanc');
    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'public' });

    const res = await request(app)
      .post(`/api/games/${created.body._id}/join`)
      .set('Authorization', `Bearer ${white.token}`);
    expect(res.status).toBe(400);
  });

  it('refuse de rejoindre une partie privée via /join (le code est obligatoire)', async () => {
    const white = await registerUser('blanc');
    const black = await registerUser('noir');

    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'private' });

    const res = await request(app)
      .post(`/api/games/${created.body._id}/join`)
      .set('Authorization', `Bearer ${black.token}`);
    expect(res.status).toBe(403);
  });

  it('crée une partie privée avec un code et permet de la rejoindre via ce code', async () => {
    const white = await registerUser('blanc');
    const black = await registerUser('noir');

    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'private' });
    expect(created.body.joinCode).toBeTruthy();

    // Une partie privée n'apparaît pas dans la liste publique.
    const list = await request(app).get('/api/games/public');
    expect(list.body).toHaveLength(0);

    const joined = await request(app)
      .post('/api/games/join-by-code')
      .set('Authorization', `Bearer ${black.token}`)
      .send({ joinCode: created.body.joinCode });
    expect(joined.status).toBe(200);
    expect(joined.body.status).toBe('ongoing');
  });

  it('joue des coups en alternance, refuse hors-tour, et persiste l\'état', async () => {
    const white = await registerUser('blanc');
    const black = await registerUser('noir');

    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'public' });
    const gameId = created.body._id;

    await request(app)
      .post(`/api/games/${gameId}/join`)
      .set('Authorization', `Bearer ${black.token}`);

    // Noir essaie de jouer alors que c'est au tour de Blanc.
    const outOfTurn = await request(app)
      .post(`/api/games/${gameId}/move`)
      .set('Authorization', `Bearer ${black.token}`)
      .send({ move: 'a1' });
    expect(outOfTurn.status).toBe(400);

    const move1 = await request(app)
      .post(`/api/games/${gameId}/move`)
      .set('Authorization', `Bearer ${white.token}`)
      .send({ move: 'a1' });
    expect(move1.status).toBe(200);
    expect(move1.body.state.history).toEqual(['a1']);

    const move2 = await request(app)
      .post(`/api/games/${gameId}/move`)
      .set('Authorization', `Bearer ${black.token}`)
      .send({ move: 'b1' });
    expect(move2.status).toBe(200);
    expect(move2.body.state.history).toEqual(['a1', 'b1']);

    // Spectateur anonyme : la partie reste consultable sans authentification.
    const spectate = await request(app).get(`/api/games/${gameId}`);
    expect(spectate.status).toBe(200);
    expect(spectate.body.state.history).toEqual(['a1', 'b1']);
  });

  it('GET /api/games/mine retourne les parties de l\'utilisateur connecté', async () => {
    const white = await registerUser('blanc');
    const black = await registerUser('noir');
    const outsider = await registerUser('curieux');

    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'public' });
    await request(app)
      .post(`/api/games/${created.body._id}/join`)
      .set('Authorization', `Bearer ${black.token}`);

    const mineWhite = await request(app).get('/api/games/mine').set('Authorization', `Bearer ${white.token}`);
    expect(mineWhite.body).toHaveLength(1);

    const mineOutsider = await request(app).get('/api/games/mine').set('Authorization', `Bearer ${outsider.token}`);
    expect(mineOutsider.body).toHaveLength(0);
  });
});

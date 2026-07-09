import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';

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
});

describe('API authentification', () => {
  it('inscrit un nouvel utilisateur et retourne un jeton', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'alioune',
      email: 'alioune@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.username).toBe('alioune');
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('refuse l\'inscription si username/email déjà utilisés', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'alioune',
      email: 'alioune@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      username: 'alioune',
      email: 'autre@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(409);
  });

  it('connecte un utilisateur avec les bons identifiants', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'alioune',
      email: 'alioune@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      username: 'alioune',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('refuse la connexion avec un mauvais mot de passe', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'alioune',
      email: 'alioune@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      username: 'alioune',
      password: 'mauvais-mot-de-passe',
    });

    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me retourne le profil avec un jeton valide, 401 sans jeton', async () => {
    const register = await request(app).post('/api/auth/register').send({
      username: 'alioune',
      email: 'alioune@example.com',
      password: 'password123',
    });
    const token = register.body.token;

    const ok = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(ok.status).toBe(200);
    expect(ok.body.user.username).toBe('alioune');

    const unauth = await request(app).get('/api/auth/me');
    expect(unauth.status).toBe(401);
  });
});

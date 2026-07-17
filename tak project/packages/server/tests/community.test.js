import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Game } from '../src/models/Game.js';
import { Post } from '../src/models/Post.js';
import { Group } from '../src/models/Group.js';
import { Message } from '../src/models/Message.js';
import { Puzzle } from '../src/models/Puzzle.js';

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
  await Promise.all([
    User.deleteMany({}),
    Game.deleteMany({}),
    Post.deleteMany({}),
    Group.deleteMany({}),
    Message.deleteMany({}),
    // On NE vide pas Puzzle entre les tests : la génération (seed) est coûteuse
    // et idempotente ; les puzzles ne dépendent pas des utilisateurs.
  ]);
});

async function registerUser(username) {
  const res = await request(app).post('/api/auth/register').send({
    username,
    email: `${username}@example.com`,
    password: 'password123',
  });
  return { token: res.body.token, user: res.body.user };
}

describe('Chat de partie', () => {
  it('permet de poster et lister des messages, refuse un post anonyme', async () => {
    const white = await registerUser('blanc');
    const created = await request(app)
      .post('/api/games')
      .set('Authorization', `Bearer ${white.token}`)
      .send({ size: 5, visibility: 'public' });
    const gameId = created.body._id;

    const anon = await request(app).post(`/api/games/${gameId}/messages`).send({ text: 'coucou' });
    expect(anon.status).toBe(401);

    const posted = await request(app)
      .post(`/api/games/${gameId}/messages`)
      .set('Authorization', `Bearer ${white.token}`)
      .send({ text: 'Bien joué !' });
    expect(posted.status).toBe(201);
    expect(posted.body.author.username).toBe('blanc');

    const list = await request(app).get(`/api/games/${gameId}/messages`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].text).toBe('Bien joué !');
  });
});

describe('Blogs', () => {
  it('publie un article, le liste, et accepte des commentaires', async () => {
    const author = await registerUser('auteur');

    const created = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${author.token}`)
      .send({ title: 'Ouverture au Tak', body: 'Quelques idées sur les ouvertures.' });
    expect(created.status).toBe(201);
    const postId = created.body._id;

    const list = await request(app).get('/api/blogs');
    expect(list.body).toHaveLength(1);
    expect(list.body[0].commentCount).toBe(0);

    const commented = await request(app)
      .post(`/api/blogs/${postId}/comments`)
      .set('Authorization', `Bearer ${author.token}`)
      .send({ text: 'Merci pour le partage !' });
    expect(commented.status).toBe(201);
    expect(commented.body.comments).toHaveLength(1);

    const detail = await request(app).get(`/api/blogs/${postId}`);
    expect(detail.body.comments[0].author.username).toBe('auteur');
  });

  it('refuse un article sans titre', async () => {
    const author = await registerUser('auteur');
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${author.token}`)
      .send({ body: 'sans titre' });
    expect(res.status).toBe(400);
  });
});

describe('Groupes', () => {
  it('crée un groupe, le rejoint, et empêche le propriétaire de le quitter', async () => {
    const owner = await registerUser('proprio');
    const member = await registerUser('membre');

    const created = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ name: 'Débutants', description: 'Groupe des débutants' });
    expect(created.status).toBe(201);
    expect(created.body.members).toHaveLength(1);
    const groupId = created.body._id;

    const joined = await request(app)
      .post(`/api/groups/${groupId}/join`)
      .set('Authorization', `Bearer ${member.token}`);
    expect(joined.status).toBe(200);
    expect(joined.body.members).toHaveLength(2);

    const ownerLeave = await request(app)
      .post(`/api/groups/${groupId}/leave`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(ownerLeave.status).toBe(400);

    const memberLeave = await request(app)
      .post(`/api/groups/${groupId}/leave`)
      .set('Authorization', `Bearer ${member.token}`);
    expect(memberLeave.status).toBe(200);
    expect(memberLeave.body.members).toHaveLength(1);
  });

  it('refuse un nom de groupe déjà pris', async () => {
    const alice = await registerUser('alice');
    const bob = await registerUser('bob');
    await request(app).post('/api/groups').set('Authorization', `Bearer ${alice.token}`).send({ name: 'Tactique' });
    const dup = await request(app).post('/api/groups').set('Authorization', `Bearer ${bob.token}`).send({ name: 'Tactique' });
    expect(dup.status).toBe(409);
  });
});

describe('Puzzles', () => {
  it('amorce la bibliothèque et sert des puzzles sans leur solution', async () => {
    const list = await request(app).get('/api/puzzles');
    expect(list.status).toBe(200);
    expect(list.body.length).toBeGreaterThan(0);
    expect(list.body[0]).not.toHaveProperty('solution');

    const detail = await request(app).get(`/api/puzzles/${list.body[0]._id}`);
    expect(detail.status).toBe(200);
    expect(detail.body).not.toHaveProperty('solution');
    expect(detail.body.position).toBeTruthy();
  });

  it('valide le bon coup et rejette un coup illégal', async () => {
    await request(app).get('/api/puzzles'); // garantit le seed
    const puzzle = await Puzzle.findOne();
    expect(puzzle).toBeTruthy();

    const good = await request(app)
      .post(`/api/puzzles/${puzzle._id}/attempt`)
      .send({ move: puzzle.solution[0] });
    expect(good.status).toBe(200);
    expect(good.body.correct).toBe(true);
    expect(good.body.solution[0]).toBe(puzzle.solution[0]);

    const bad = await request(app)
      .post(`/api/puzzles/${puzzle._id}/attempt`)
      .send({ move: 'zz9' });
    expect(bad.status).toBe(200);
    expect(bad.body.correct).toBe(false);
  });
});

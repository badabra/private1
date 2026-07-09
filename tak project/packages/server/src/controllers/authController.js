import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const SALT_ROUNDS = 10;
const TOKEN_TTL = '7d';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email et password sont requis.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return res.status(409).json({ error: 'Ce nom d\'utilisateur ou cet email est déjà utilisé.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ username, email, passwordHash });

  return res.status(201).json({ user, token: signToken(user) });
}

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username et password sont requis.' });
  }

  const user = await User.findOne({ $or: [{ username }, { email: username }] });
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Identifiants invalides.' });
  }

  return res.json({ user, token: signToken(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }
  return res.json({ user });
}

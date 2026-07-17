import { Game } from '../models/Game.js';
import { Message } from '../models/Message.js';

/** GET /api/games/:id/messages — chat d'une partie (public, comme la vue spectateur). */
export async function listMessages(req, res) {
  const game = await Game.findById(req.params.id).select('_id');
  if (!game) {
    return res.status(404).json({ error: 'Partie introuvable.' });
  }
  const messages = await Message.find({ game: game._id })
    .populate('author', 'username')
    .sort({ createdAt: 1 });
  return res.json(messages);
}

/** POST /api/games/:id/messages — poste un message dans le chat d'une partie. */
export async function postMessage(req, res) {
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
  }

  const game = await Game.findById(req.params.id).select('_id');
  if (!game) {
    return res.status(404).json({ error: 'Partie introuvable.' });
  }

  const message = await Message.create({
    game: game._id,
    author: req.userId,
    text: text.trim(),
  });
  await message.populate('author', 'username');
  return res.status(201).json(message);
}

import crypto from 'crypto';
import { TakGame, VALID_SIZES, RESULT, PLAYER_WHITE, PLAYER_BLACK } from '@takhub/tak-engine';
import { Game } from '../models/Game.js';
import { User } from '../models/User.js';
import { syncGameToFirestore } from '../config/firestore.js';

function generateJoinCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // ex. "A1B2C3"
}

/** POST /api/games — crée une partie publique ou privée, le créateur devient Blanc. */
export async function createGame(req, res) {
  const { size = 5, visibility = 'public' } = req.body || {};
  if (!VALID_SIZES.includes(size)) {
    return res.status(400).json({ error: `Taille invalide. Valeurs acceptées : ${VALID_SIZES.join(', ')}` });
  }
  if (!['public', 'private'].includes(visibility)) {
    return res.status(400).json({ error: 'Visibilité invalide (public ou private).' });
  }

  const game = await Game.create({
    size,
    visibility,
    joinCode: visibility === 'private' ? generateJoinCode() : undefined,
    players: { white: req.userId, black: null },
    state: new TakGame(size).getState(),
  });
  await syncGameToFirestore(game);

  return res.status(201).json(game);
}

/**
 * GET /api/games/public — parties publiques en attente (à rejoindre) et en
 * cours (à regarder en mode spectateur).
 */
export async function listPublicGames(req, res) {
  const games = await Game.find({ visibility: 'public', status: { $in: ['waiting', 'ongoing'] } })
    .populate('players.white players.black', 'username')
    .sort({ createdAt: -1 });
  return res.json(games);
}

/** GET /api/games/mine — historique des parties (en cours et terminées) de l'utilisateur connecté. */
export async function listMyGames(req, res) {
  const games = await Game.find({
    $or: [{ 'players.white': req.userId }, { 'players.black': req.userId }],
  })
    .populate('players.white players.black', 'username')
    .sort({ updatedAt: -1 });
  return res.json(games);
}

/** GET /api/games/:id — état d'une partie (sert aussi de vue spectateur en lecture seule). */
export async function getGame(req, res) {
  const game = await Game.findById(req.params.id).populate('players.white players.black', 'username');
  if (!game) {
    return res.status(404).json({ error: 'Partie introuvable.' });
  }
  return res.json(game);
}

/** POST /api/games/:id/join — rejoint une partie publique en attente comme joueur Noir. */
export async function joinGame(req, res) {
  const game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Partie introuvable.' });
  }
  if (game.status !== 'waiting') {
    return res.status(400).json({ error: 'Cette partie n\'est plus disponible.' });
  }
  if (game.visibility === 'private') {
    return res.status(403).json({ error: 'Cette partie est privée : utilisez le code de jonction.' });
  }
  if (String(game.players.white) === req.userId) {
    return res.status(400).json({ error: 'Vous ne pouvez pas rejoindre votre propre partie.' });
  }

  game.players.black = req.userId;
  game.status = 'ongoing';
  await game.save();
  await syncGameToFirestore(game);
  return res.json(game);
}

/** POST /api/games/join-by-code — rejoint une partie privée via son code. */
export async function joinByCode(req, res) {
  const { joinCode } = req.body || {};
  if (!joinCode) {
    return res.status(400).json({ error: 'Code de partie requis.' });
  }

  const game = await Game.findOne({ joinCode: joinCode.toUpperCase() });
  if (!game) {
    return res.status(404).json({ error: 'Aucune partie ne correspond à ce code.' });
  }
  if (game.status !== 'waiting') {
    return res.status(400).json({ error: 'Cette partie n\'est plus disponible.' });
  }
  if (String(game.players.white) === req.userId) {
    return res.status(400).json({ error: 'Vous ne pouvez pas rejoindre votre propre partie.' });
  }

  game.players.black = req.userId;
  game.status = 'ongoing';
  await game.save();
  await syncGameToFirestore(game);
  return res.json(game);
}

/** POST /api/games/:id/move — joue un coup (notation PTN) et persiste le nouvel état. */
export async function playMove(req, res) {
  const { move } = req.body || {};
  const game = await Game.findById(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Partie introuvable.' });
  }
  if (game.status !== 'ongoing') {
    return res.status(400).json({ error: 'La partie n\'est pas en cours.' });
  }

  const isWhite = String(game.players.white) === req.userId;
  const isBlack = String(game.players.black) === req.userId;
  if (!isWhite && !isBlack) {
    return res.status(403).json({ error: 'Vous ne participez pas à cette partie.' });
  }
  const expectedPlayer = isWhite ? PLAYER_WHITE : PLAYER_BLACK;
  if (game.state.turn !== expectedPlayer) {
    return res.status(400).json({ error: 'Ce n\'est pas votre tour.' });
  }

  const engine = TakGame.fromState(game.state);
  try {
    engine.play(move);
  } catch (err) {
    return res.status(400).json({ error: `Coup illégal "${move}" : ${err.message}` });
  }

  game.state = engine.getState();
  game.result = engine.getResult();
  if (game.result !== RESULT.ONGOING) {
    game.status = 'finished';
    await applyGameResult(game);
  }
  await game.save();
  await syncGameToFirestore(game);

  return res.json(game);
}

/** Met à jour les statistiques (wins/losses/draws) des deux joueurs en fin de partie. */
async function applyGameResult(game) {
  const { white, black } = game.players;
  if (!white || !black) return;

  if (game.result === RESULT.DRAW) {
    await User.updateMany({ _id: { $in: [white, black] } }, { $inc: { 'stats.draws': 1 } });
    return;
  }

  const whiteWins = game.result === RESULT.ROAD_WHITE || game.result === RESULT.FLAT_WHITE;
  const winner = whiteWins ? white : black;
  const loser = whiteWins ? black : white;
  await User.findByIdAndUpdate(winner, { $inc: { 'stats.wins': 1 } });
  await User.findByIdAndUpdate(loser, { $inc: { 'stats.losses': 1 } });
}

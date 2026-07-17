import { Router } from 'express';
import { TakGame, VALID_SIZES } from '@takhub/tak-engine';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createGame,
  listPublicGames,
  listMyGames,
  getGame,
  joinGame,
  joinByCode,
  playMove,
} from '../controllers/gamesController.js';
import { listMessages, postMessage } from '../controllers/chatController.js';

export const gamesRouter = Router();

/**
 * GET /api/games/new?size=5
 * Retourne l'état initial d'une partie Tak pour la taille demandée, sans
 * persistance — sert de bac à sable pour valider le moteur via l'API.
 */
gamesRouter.get('/new', (req, res) => {
  const size = Number(req.query.size || 5);
  if (!VALID_SIZES.includes(size)) {
    return res.status(400).json({ error: `Taille invalide. Valeurs acceptées : ${VALID_SIZES.join(', ')}` });
  }
  const game = new TakGame(size);
  return res.json(game.getState());
});

/**
 * POST /api/games/replay
 * Body: { size, moves: ["a1", "a2", ...] }
 * Rejoue une séquence de coups depuis une partie vierge et retourne l'état
 * résultant (ou une erreur 400 si un coup est illégal). Sans persistance.
 */
gamesRouter.post('/replay', (req, res) => {
  const { size = 5, moves = [] } = req.body || {};
  if (!VALID_SIZES.includes(size)) {
    return res.status(400).json({ error: `Taille invalide. Valeurs acceptées : ${VALID_SIZES.join(', ')}` });
  }

  const game = new TakGame(size);
  for (const move of moves) {
    try {
      game.play(move);
    } catch (err) {
      return res.status(400).json({ error: `Coup illégal "${move}" : ${err.message}` });
    }
  }

  return res.json(game.getState());
});

// Parties persistées (Sprint 2) : création, liste publique, jonction, coups, et
// consultation (sert aussi de vue spectateur en lecture seule, sans authentification).
// Les routes statiques ('/public', '/new', '/replay', '/join-by-code') doivent être
// déclarées avant '/:id' pour ne pas être interceptées par le paramètre dynamique.
gamesRouter.post('/', requireAuth, asyncHandler(createGame));
gamesRouter.get('/public', asyncHandler(listPublicGames));
gamesRouter.get('/mine', requireAuth, asyncHandler(listMyGames));
gamesRouter.post('/join-by-code', requireAuth, asyncHandler(joinByCode));
gamesRouter.get('/:id', asyncHandler(getGame));
gamesRouter.post('/:id/join', requireAuth, asyncHandler(joinGame));
gamesRouter.post('/:id/move', requireAuth, asyncHandler(playMove));

// Chat de partie (Sprint 3) : lecture publique (comme la vue spectateur),
// écriture réservée aux utilisateurs connectés.
gamesRouter.get('/:id/messages', asyncHandler(listMessages));
gamesRouter.post('/:id/messages', requireAuth, asyncHandler(postMessage));

import { RESULT, PLAYER_WHITE, PLAYER_BLACK } from '@takhub/tak-engine';

const DEFAULT_NODE_BUDGET = 50000;

function resultFavors(result, mover) {
  if (mover === PLAYER_WHITE) return result === RESULT.ROAD_WHITE || result === RESULT.FLAT_WHITE;
  if (mover === PLAYER_BLACK) return result === RESULT.ROAD_BLACK || result === RESULT.FLAT_BLACK;
  return false;
}

/**
 * Recherche booléenne (pas d'évaluation heuristique) : le joueur au trait
 * force-t-il un gain en au plus `maxMoverMoves` coups à lui, quelle que
 * soit la défense adverse ? Retourne la ligne gagnante en notation PTN
 * (coups alternés : moteur, adversaire, moteur, ...) ou `null`.
 *
 * Un budget de nœuds visités protège contre l'explosion combinatoire d'une
 * position avec de grandes piles (beaucoup de compositions d'étalement).
 */
export function findForcedWin(game, maxMoverMoves, options = {}) {
  const budget = { remaining: options.nodeBudget ?? DEFAULT_NODE_BUDGET };
  return search(game, maxMoverMoves, budget);
}

/**
 * Vérifie si UN coup précis (déjà connu, ex. pour compter les alternatives
 * gagnantes d'une position) force un gain en au plus `maxMoverMoves` coups.
 * Retourne la ligne gagnante ou `null`.
 */
export function isWinningMove(game, move, maxMoverMoves, options = {}) {
  const budget = { remaining: options.nodeBudget ?? DEFAULT_NODE_BUDGET };
  return evaluateMove(game, move, maxMoverMoves, budget);
}

/** Cœur de la recherche : ce coup `move` force-t-il un gain pour `mover` ? */
function evaluateMove(game, move, movesLeft, budget) {
  if (movesLeft <= 0) return null;
  const mover = game.getState().turn;

  if (budget.remaining-- <= 0) return null;

  const afterMover = game.clone();
  afterMover.play(move);

  if (afterMover.isGameOver()) {
    return resultFavors(afterMover.getResult(), mover) ? [move] : null;
  }

  if (movesLeft === 1) return null; // pas de budget pour forcer depuis une position non terminale

  const replies = afterMover.getLegalMoves();
  if (replies.length === 0) return null;

  let continuation = null;

  for (const reply of replies) {
    if (budget.remaining-- <= 0) return null;

    const afterReply = afterMover.clone();
    afterReply.play(reply);

    if (afterReply.isGameOver()) {
      if (!resultFavors(afterReply.getResult(), mover)) return null;
      continuation = continuation ?? [reply];
      continue;
    }

    const sub = search(afterReply, movesLeft - 1, budget);
    if (!sub) return null;
    continuation = continuation ?? [reply, ...sub];
  }

  return [move, ...continuation];
}

function search(game, movesLeft, budget) {
  if (movesLeft <= 0) return null;
  for (const move of game.getLegalMoves()) {
    if (budget.remaining <= 0) return null;
    const line = evaluateMove(game, move, movesLeft, budget);
    if (line) return line;
  }
  return null;
}

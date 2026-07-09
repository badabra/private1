import { TakGame } from '@takhub/tak-engine';
import { findForcedWin, isWinningMove } from './solver.js';

const DEFAULT_MAX_MATE_IN = 2;
const DEFAULT_MAX_ALTERNATIVES = 3; // au-delà, on considère le gain "trivial" (trop de coups gagnants)

/**
 * Rejoue une partie ingérée coup par coup et, à chaque position (hors les
 * deux demi-coups d'ouverture de la règle d'échange), cherche un gain forcé
 * pour le joueur au trait. Les positions retenues passent un filtre de
 * qualité : le coup gagnant trouvé doit être rare parmi les coups légaux
 * (sinon la position est "trivialement gagnante", pas un vrai puzzle).
 */
export function extractPuzzlesFromGame({ file, headers, game }, options = {}) {
  const maxMateIn = options.maxMateIn ?? DEFAULT_MAX_MATE_IN;
  const maxAlternatives = options.maxAlternatives ?? DEFAULT_MAX_ALTERNATIVES;
  const nodeBudget = options.nodeBudget;

  const history = game.getState().history;
  const puzzles = [];

  // `ply` va de 0 à history.length INCLUS : la borne haute correspond à la
  // position obtenue après avoir rejoué tout l'historique (aucun coup
  // suivant enregistré) — c'est justement là que peut se trouver un gain
  // forcé que les joueurs n'ont pas exploité.
  const replay = new TakGame(game.getState().size);
  for (let ply = 0; ply <= history.length; ply++) {
    if (ply >= 2) {
      const position = replay.getState();
      if (position.result === 'ONGOING') {
        const hit = evaluatePosition(replay, maxMateIn, maxAlternatives, nodeBudget);
        if (hit) {
          puzzles.push(buildPuzzleRecord({ file, headers, replay, ply, hit }));
        }
      }
    }
    if (ply < history.length) replay.play(history[ply]);
  }

  return puzzles;
}

function evaluatePosition(game, maxMateIn, maxAlternatives, nodeBudget) {
  const line = findForcedWin(game, maxMateIn, { nodeBudget });
  if (!line) return null;
  const mateIn = Math.ceil(line.length / 2);

  // Filtre de qualité : compter combien de coups légaux différents forcent
  // eux aussi un gain à la MÊME profondeur que la ligne trouvée (pas la
  // profondeur maximale de recherche — sinon un mat en 1 est presque
  // toujours "noyé" par des coups qui ne gagnent qu'en s'autorisant un
  // budget de 2 coups, ce qui fausserait la comparaison). Si trop de
  // coups gagnent à cette même profondeur, la position n'a rien d'un
  // puzzle (n'importe quel coup gagne) ; on arrête dès que le seuil est
  // dépassé pour ne pas re-chercher inutilement tous les coups restants.
  const legalMoves = game.getLegalMoves();
  let winningAlternatives = 0;
  for (const move of legalMoves) {
    if (isWinningMove(game, move, mateIn, { nodeBudget })) {
      winningAlternatives += 1;
      if (winningAlternatives > maxAlternatives) return null;
    }
  }

  return { line, mateIn, winningAlternatives };
}

function buildPuzzleRecord({ file, headers, replay, ply, hit }) {
  const position = replay.getState();
  return {
    id: `${baseName(file)}-p${ply}`,
    size: position.size,
    toMove: position.turn,
    mateIn: hit.mateIn,
    position,
    solution: hit.line,
    source: {
      file,
      white: headers.Player1 ?? headers.White ?? null,
      black: headers.Player2 ?? headers.Black ?? null,
      gameResult: headers.Result ?? null,
      ply,
    },
  };
}

function baseName(file) {
  return file.replace(/\.ptn$/i, '');
}

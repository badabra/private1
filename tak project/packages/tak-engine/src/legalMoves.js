import { FLAT, WALL, CAP, DIRECTIONS, PLAYER_WHITE, PLAYER_BLACK, RESULT } from './constants.js';
import { coordsToSquare } from './coords.js';
import { applyMove, stringifyMove } from './moves.js';

/** Toutes les compositions (séquences ordonnées de parts positives) de n. */
function compositions(n) {
  if (n === 1) return [[1]];
  const result = [];
  for (let first = 1; first <= n; first++) {
    if (first === n) {
      result.push([n]);
      continue;
    }
    for (const rest of compositions(n - first)) {
      result.push([first, ...rest]);
    }
  }
  return result;
}

/**
 * Énumère tous les coups légaux (placements + déplacements) pour le joueur
 * dont c'est le tour. Utile pour l'UI (mise en surbrillance) et les tests.
 */
export function getLegalMoves(state) {
  if (state.result !== RESULT.ONGOING) return [];

  const moves = [];
  const { size, board } = state;
  const isOpening = state.moveNumber === 1 || state.moveNumber === 2;
  const colorToPlace = isOpening
    ? state.turn === PLAYER_WHITE
      ? PLAYER_BLACK
      : PLAYER_WHITE
    : state.turn;
  const reserve = state.reserves[colorToPlace];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const stack = board[row][col];
      const square = coordsToSquare({ col, row });

      if (stack.length === 0) {
        const types = [];
        if (isOpening) {
          types.push(FLAT);
        } else {
          if (reserve.stones > 0) types.push(FLAT, WALL);
          if (reserve.capstones > 0) types.push(CAP);
        }
        for (const pieceType of types) {
          moves.push(stringifyMove({ kind: 'place', pieceType, square }));
        }
        continue;
      }

      const top = stack[stack.length - 1];
      if (top.color !== state.turn) continue;

      const maxCount = Math.min(size, stack.length);
      for (let count = 1; count <= maxCount; count++) {
        for (const direction of Object.keys(DIRECTIONS)) {
          const maxSteps = stepsToEdge({ col, row }, direction, size);
          for (const drops of compositions(count)) {
            if (drops.length > maxSteps) continue;
            const move = { kind: 'spread', square, direction, count, drops, crush: false };
            try {
              applyMove(state, move);
              moves.push(stringifyMove(move));
            } catch {
              // Coup illégal (mur/capstone bloquant, etc.) : on l'ignore.
            }
          }
        }
      }
    }
  }

  return moves;
}

function stepsToEdge({ col, row }, direction, size) {
  const { dCol, dRow } = DIRECTIONS[direction];
  if (dCol === 1) return size - 1 - col;
  if (dCol === -1) return col;
  if (dRow === 1) return size - 1 - row;
  return row;
}

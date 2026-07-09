import {
  FLAT,
  PLAYER_WHITE,
  PLAYER_BLACK,
  BOARD_CONFIGS,
  RESULT,
} from './constants.js';
import { assertValidSize } from './coords.js';
import { applyMove, stringifyMove } from './moves.js';
import { hasRoad } from './roads.js';
import { getLegalMoves } from './legalMoves.js';

/**
 * TakGame — implémentation de référence de l'interface "IGame" mentionnée
 * dans le cahier des charges (section 4.2) : un moteur de jeu autonome,
 * indépendant du serveur et du client, exposant un état sérialisable et
 * une méthode `play(moveNotation)` pour appliquer un coup en notation PTN.
 *
 * Toute autre implémentation de jeu pourra suivre la même forme :
 *   - constructeur(size)
 *   - play(moveStr) -> applique un coup, met à jour l'état et le résultat
 *   - getState() -> état sérialisable (board, turn, reserves, result, history)
 *   - isGameOver() / getResult()
 *   - getLegalMoves()
 */
export class TakGame {
  constructor(size = 5) {
    assertValidSize(size);
    const config = BOARD_CONFIGS[size];

    this.state = {
      size,
      board: Array.from({ length: size }, () =>
        Array.from({ length: size }, () => [])
      ),
      turn: PLAYER_WHITE,
      moveNumber: 1,
      reserves: {
        [PLAYER_WHITE]: { stones: config.stones, capstones: config.capstones },
        [PLAYER_BLACK]: { stones: config.stones, capstones: config.capstones },
      },
      result: RESULT.ONGOING,
      history: [],
    };
  }

  get size() {
    return this.state.size;
  }

  get turn() {
    return this.state.turn;
  }

  get result() {
    return this.state.result;
  }

  isGameOver() {
    return this.state.result !== RESULT.ONGOING;
  }

  getResult() {
    return this.state.result;
  }

  getState() {
    return structuredClone(this.state);
  }

  /** Charge un état précédemment obtenu via getState(). */
  static fromState(state) {
    const game = new TakGame(state.size);
    game.state = structuredClone(state);
    return game;
  }

  clone() {
    return TakGame.fromState(this.state);
  }

  /** Joue un coup en notation PTN (ex. "c3", "Sc3", "Cc3", "3c3>21"). */
  play(moveStr) {
    if (this.isGameOver()) {
      throw new Error('La partie est terminée, aucun coup supplémentaire n\'est possible.');
    }
    this.state = applyMove(this.state, moveStr);
    this.state.result = evaluateResult(this.state);
    return this.state;
  }

  /** Raccourci pour placer une pièce (par défaut un pion plat). */
  placeStone(square, pieceType = FLAT) {
    return this.play(stringifyMove({ kind: 'place', pieceType, square }));
  }

  /** Raccourci pour déplacer une pile : drops est un tableau, ex. [2, 1]. */
  moveStack(square, direction, drops) {
    const count = drops.reduce((a, b) => a + b, 0);
    return this.play(stringifyMove({ kind: 'spread', square, direction, count, drops, crush: false }));
  }

  getLegalMoves() {
    return getLegalMoves(this.state);
  }
}

/**
 * Détermine le résultat de la partie après le dernier coup joué.
 * `state.turn` correspond déjà au joueur SUIVANT (le coup vient d'être appliqué).
 */
function evaluateResult(state) {
  const mover = state.turn === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE;
  const opponent = state.turn;

  if (hasRoad(state, mover)) {
    return mover === PLAYER_WHITE ? RESULT.ROAD_WHITE : RESULT.ROAD_BLACK;
  }
  if (hasRoad(state, opponent)) {
    return opponent === PLAYER_WHITE ? RESULT.ROAD_WHITE : RESULT.ROAD_BLACK;
  }

  const reserveEmpty = (player) =>
    state.reserves[player].stones === 0 && state.reserves[player].capstones === 0;
  const boardFull = state.board.every((rowCells) => rowCells.every((stack) => stack.length > 0));

  if (boardFull || reserveEmpty(PLAYER_WHITE) || reserveEmpty(PLAYER_BLACK)) {
    return flatWinResult(state);
  }

  return RESULT.ONGOING;
}

/** Compte les pions plats visibles (sommet de pile) pour déterminer la victoire aux plats. */
function flatWinResult(state) {
  let white = 0;
  let black = 0;

  for (const rowCells of state.board) {
    for (const stack of rowCells) {
      if (stack.length === 0) continue;
      const top = stack[stack.length - 1];
      if (top.type !== FLAT) continue;
      if (top.color === PLAYER_WHITE) white += 1;
      else black += 1;
    }
  }

  if (white > black) return RESULT.FLAT_WHITE;
  if (black > white) return RESULT.FLAT_BLACK;
  return RESULT.DRAW;
}

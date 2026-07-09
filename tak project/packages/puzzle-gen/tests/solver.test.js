import { describe, it, expect } from 'vitest';
import {
  TakGame,
  FLAT,
  PLAYER_WHITE,
  PLAYER_BLACK,
  RESULT,
} from '@takhub/tak-engine';
import { findForcedWin } from '../src/solver.js';

function emptyBoard(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => []));
}

function W(type = FLAT) {
  return { color: PLAYER_WHITE, type };
}

function place(board, square, piece) {
  const col = square.charCodeAt(0) - 97;
  const row = Number(square.slice(1)) - 1;
  board[row][col] = Array.isArray(piece) ? piece : [piece];
}

function reservesOf(stones, capstones) {
  return { stones, capstones };
}

/** Rejoue une ligne gagnante et vérifie qu'elle se termine bien en victoire du joueur au trait. */
function assertLineWins(game, line) {
  const mover = game.getState().turn;
  const replay = game.clone();
  for (const move of line) replay.play(move);
  expect(replay.isGameOver()).toBe(true);
  const favorable =
    mover === PLAYER_WHITE
      ? [RESULT.ROAD_WHITE, RESULT.FLAT_WHITE]
      : [RESULT.ROAD_BLACK, RESULT.FLAT_BLACK];
  expect(favorable).toContain(replay.getResult());
}

describe('findForcedWin', () => {
  it('trouve un gain immédiat (mat en 1)', () => {
    // Plateau 4x4, rangée 0 : a1,b1,c1 = Blanc, d1 vide -> compléter la route.
    const size = 4;
    const board = emptyBoard(size);
    place(board, 'a1', W());
    place(board, 'b1', W());
    place(board, 'c1', W());
    const game = TakGame.fromState({
      size,
      board,
      turn: PLAYER_WHITE,
      moveNumber: 5,
      reserves: {
        [PLAYER_WHITE]: reservesOf(10, 0),
        [PLAYER_BLACK]: reservesOf(10, 0),
      },
      result: RESULT.ONGOING,
      history: [],
    });

    const line = findForcedWin(game, 1);
    expect(line).toEqual(['d1']);
    assertLineWins(game, line);
  });

  it('trouve une fourchette forcée en 2 coups quand aucun gain immédiat n\'existe', () => {
    // Plateau 5x5 : Blanc menace simultanément la rangée 0 (a1,b1,e1 posés,
    // manque c1 et d1) et la colonne c (c2,c3,c4 posés, manque c1 et c5).
    // Poser c1 réduit les deux lignes à une seule case manquante chacune
    // (d1 et c5) : Noir ne peut en bloquer qu'une seule par coup.
    const size = 5;
    const board = emptyBoard(size);
    place(board, 'a1', W());
    place(board, 'b1', W());
    place(board, 'e1', W());
    place(board, 'c2', W());
    place(board, 'c3', W());
    place(board, 'c4', W());
    const game = TakGame.fromState({
      size,
      board,
      turn: PLAYER_WHITE,
      moveNumber: 7,
      reserves: {
        [PLAYER_WHITE]: reservesOf(15, 1),
        [PLAYER_BLACK]: reservesOf(15, 1),
      },
      result: RESULT.ONGOING,
      history: [],
    });

    expect(findForcedWin(game, 1)).toBeNull(); // pas de gain en un seul coup
    const line = findForcedWin(game, 2);
    expect(line).not.toBeNull();
    expect(line[0]).toBe('c1'); // le coup de mise en place de la fourchette
    assertLineWins(game, line);

    // La fourchette tient face aux deux défenses possibles de Noir.
    for (const blackReply of ['Sc5', 'Sd1']) {
      const afterSetup = game.clone();
      afterSetup.play('c1');
      afterSetup.play(blackReply);
      const followUp = findForcedWin(afterSetup, 1);
      expect(followUp).not.toBeNull();
      assertLineWins(afterSetup, followUp);
    }
  });

  it('retourne null quand aucun gain forcé n\'existe (position sans issue forcée)', () => {
    // Trois pions Blancs alignés + une pile de 2 semblent proches de gagner,
    // mais aucune suite ne force la victoire : Noir peut toujours défendre.
    const size = 5;
    const board = emptyBoard(size);
    place(board, 'a1', W());
    place(board, 'b1', W());
    place(board, 'c1', [W(), W()]);
    const game = TakGame.fromState({
      size,
      board,
      turn: PLAYER_WHITE,
      moveNumber: 5,
      reserves: {
        [PLAYER_WHITE]: reservesOf(15, 1),
        [PLAYER_BLACK]: reservesOf(15, 1),
      },
      result: RESULT.ONGOING,
      history: [],
    });

    expect(findForcedWin(game, 1)).toBeNull();
    expect(findForcedWin(game, 2)).toBeNull();
  });

  it('respecte le budget de nœuds pour éviter une explosion combinatoire', () => {
    const game = new TakGame(6);
    const line = findForcedWin(game, 2, { nodeBudget: 5 });
    expect(line).toBeNull();
  });
});

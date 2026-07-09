import { describe, it, expect } from 'vitest';
import { applyMove, PLAYER_WHITE, PLAYER_BLACK, FLAT, RESULT } from '../index.js';

function emptyBoard(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => []));
}

function makeState(size, board, overrides = {}) {
  return {
    size,
    board,
    turn: PLAYER_WHITE,
    moveNumber: 5,
    reserves: {
      [PLAYER_WHITE]: { stones: 100, capstones: 10 },
      [PLAYER_BLACK]: { stones: 100, capstones: 10 },
    },
    result: RESULT.ONGOING,
    history: [],
    ...overrides,
  };
}

describe('déplacements (spreads)', () => {
  it('déplace une seule pièce vers la case adjacente (compte/dépôt implicites)', () => {
    const board = emptyBoard(5);
    board[0][0] = [{ color: PLAYER_WHITE, type: FLAT }]; // a1

    const next = applyMove(makeState(5, board), 'a1>');

    expect(next.board[0][0]).toEqual([]);
    expect(next.board[0][1]).toEqual([{ color: PLAYER_WHITE, type: FLAT }]); // b1
    expect(next.turn).toBe(PLAYER_BLACK);
  });

  it('répartit correctement une pile sur plusieurs cases (3c3>21)', () => {
    const board = emptyBoard(5);
    // c3 = col 2, row 2 (0-indexée) -> pile de 3, bas vers haut : N1, N2, N3
    board[2][2] = [
      { color: PLAYER_WHITE, type: FLAT, label: 'bottom' },
      { color: PLAYER_WHITE, type: FLAT, label: 'middle' },
      { color: PLAYER_WHITE, type: FLAT, label: 'top' },
    ];

    const next = applyMove(makeState(5, board), '3c3>21');

    expect(next.board[2][2]).toEqual([]); // c3 vidée
    // d3 reçoit les 2 pièces du bas de la sous-pile transportée
    expect(next.board[2][3].map((p) => p.label)).toEqual(['bottom', 'middle']);
    // e3 reçoit la dernière pièce (celle qui était au sommet de c3)
    expect(next.board[2][4].map((p) => p.label)).toEqual(['top']);
  });

  it('refuse un nombre de pièces transportées supérieur à la taille du plateau', () => {
    const board = emptyBoard(3);
    board[0][0] = [
      { color: PLAYER_WHITE, type: FLAT },
      { color: PLAYER_WHITE, type: FLAT },
      { color: PLAYER_WHITE, type: FLAT },
      { color: PLAYER_WHITE, type: FLAT },
    ];
    expect(() => applyMove(makeState(3, board), '4a1>4')).toThrow(/invalide/);
  });

  it('refuse de déplacer une pile dont le sommet appartient à l\'adversaire', () => {
    const board = emptyBoard(5);
    board[0][0] = [{ color: PLAYER_BLACK, type: FLAT }];
    expect(() => applyMove(makeState(5, board), 'a1>')).toThrow(/contrôlez/);
  });

  it('permet de se déplacer sur un pion plat adverse (empilement)', () => {
    const board = emptyBoard(5);
    board[0][0] = [{ color: PLAYER_WHITE, type: FLAT }];
    board[0][1] = [{ color: PLAYER_BLACK, type: FLAT }];

    const next = applyMove(makeState(5, board), 'a1>');
    expect(next.board[0][1].map((p) => p.color)).toEqual([PLAYER_BLACK, PLAYER_WHITE]);
  });

  it('refuse une sortie de plateau', () => {
    const board = emptyBoard(5);
    board[0][4] = [{ color: PLAYER_WHITE, type: FLAT }]; // e1, bord droit
    expect(() => applyMove(makeState(5, board), 'e1>')).toThrow(/sortirait/);
  });
});

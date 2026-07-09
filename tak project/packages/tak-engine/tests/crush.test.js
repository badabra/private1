import { describe, it, expect } from 'vitest';
import { applyMove, PLAYER_WHITE, PLAYER_BLACK, FLAT, WALL, CAP, RESULT } from '../index.js';

function emptyBoard(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => []));
}

function makeState(size, board) {
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
  };
}

describe('règle du capstone et des murs (crush)', () => {
  it('un capstone seul aplatit un mur adverse en dernière case', () => {
    const board = emptyBoard(5);
    board[0][0] = [{ color: PLAYER_WHITE, type: CAP }]; // a1
    board[0][1] = [{ color: PLAYER_BLACK, type: WALL }]; // b1

    const next = applyMove(makeState(5, board), 'a1>');

    expect(next.board[0][0]).toEqual([]);
    expect(next.board[0][1]).toEqual([
      { color: PLAYER_BLACK, type: FLAT }, // mur aplati
      { color: PLAYER_WHITE, type: CAP },
    ]);
  });

  it('refuse de se déplacer sur un mur sans capstone', () => {
    const board = emptyBoard(5);
    board[0][0] = [{ color: PLAYER_WHITE, type: FLAT }];
    board[0][1] = [{ color: PLAYER_BLACK, type: WALL }];
    expect(() => applyMove(makeState(5, board), 'a1>')).toThrow(/mur/);
  });

  it('refuse l\'aplatissement si le capstone n\'est pas seul dans le dépôt final', () => {
    const board = emptyBoard(5);
    board[0][0] = [
      { color: PLAYER_WHITE, type: FLAT },
      { color: PLAYER_WHITE, type: CAP },
    ];
    board[0][1] = [{ color: PLAYER_BLACK, type: WALL }];
    // 2a1>2 : dépose les 2 pièces (flat+capstone) ensemble sur b1 -> pas un crush valide
    expect(() => applyMove(makeState(5, board), '2a1>2')).toThrow(/mur/);
  });

  it('refuse toujours de se déplacer sur un capstone', () => {
    const board = emptyBoard(5);
    board[0][0] = [{ color: PLAYER_WHITE, type: CAP }];
    board[0][1] = [{ color: PLAYER_BLACK, type: CAP }];
    expect(() => applyMove(makeState(5, board), 'a1>')).toThrow(/capstone/);
  });
});

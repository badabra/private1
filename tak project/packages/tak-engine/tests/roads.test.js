import { describe, it, expect } from 'vitest';
import { hasRoad, VALID_SIZES, PLAYER_WHITE, PLAYER_BLACK, FLAT, WALL, CAP } from '../index.js';

function emptyBoard(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => []));
}

describe('détection de route', () => {
  it.each(VALID_SIZES)('détecte une route horizontale et verticale sur un plateau %ix%i', (size) => {
    const horizontalBoard = emptyBoard(size);
    for (let col = 0; col < size; col++) {
      horizontalBoard[0][col] = [{ color: PLAYER_WHITE, type: FLAT }];
    }
    const horizontalState = { size, board: horizontalBoard };
    expect(hasRoad(horizontalState, PLAYER_WHITE)).toBe(true);
    expect(hasRoad(horizontalState, PLAYER_BLACK)).toBe(false);

    const verticalBoard = emptyBoard(size);
    for (let row = 0; row < size; row++) {
      verticalBoard[row][0] = [{ color: PLAYER_BLACK, type: FLAT }];
    }
    const verticalState = { size, board: verticalBoard };
    expect(hasRoad(verticalState, PLAYER_BLACK)).toBe(true);
  });

  it('aucune route sur un plateau vide', () => {
    const size = 5;
    const state = { size, board: emptyBoard(size) };
    expect(hasRoad(state, PLAYER_WHITE)).toBe(false);
    expect(hasRoad(state, PLAYER_BLACK)).toBe(false);
  });

  it('un mur ne compte pas pour la route', () => {
    const size = 5;
    const board = emptyBoard(size);
    for (let col = 0; col < size; col++) {
      board[0][col] = [{ color: PLAYER_WHITE, type: FLAT }];
    }
    board[0][2] = [{ color: PLAYER_WHITE, type: WALL }]; // brise la route
    expect(hasRoad({ size, board }, PLAYER_WHITE)).toBe(false);
  });

  it('un capstone compte pour la route', () => {
    const size = 5;
    const board = emptyBoard(size);
    for (let col = 0; col < size; col++) {
      board[0][col] = [{ color: PLAYER_WHITE, type: FLAT }];
    }
    board[0][2] = [{ color: PLAYER_WHITE, type: CAP }];
    expect(hasRoad({ size, board }, PLAYER_WHITE)).toBe(true);
  });

  it('une route peut suivre un chemin non rectiligne', () => {
    const size = 5;
    const board = emptyBoard(size);
    // Diagonale en escalier de a1 à e5 via connexions 4-adjacentes
    const path = ['a1', 'a2', 'b2', 'b3', 'c3', 'c4', 'd4', 'd5', 'e5'];
    const coords = {
      a1: [0, 0], a2: [1, 0], b2: [1, 1], b3: [2, 1], c3: [2, 2],
      c4: [3, 2], d4: [3, 3], d5: [4, 3], e5: [4, 4],
    };
    for (const sq of path) {
      const [row, col] = coords[sq];
      board[row][col] = [{ color: PLAYER_WHITE, type: FLAT }];
    }
    expect(hasRoad({ size, board }, PLAYER_WHITE)).toBe(true);
  });
});

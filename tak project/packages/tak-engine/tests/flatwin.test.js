import { describe, it, expect } from 'vitest';
import { TakGame, PLAYER_WHITE, PLAYER_BLACK, FLAT, WALL, RESULT, squareToCoords } from '../index.js';

function setCell(game, square, color, type = FLAT) {
  const { col, row } = squareToCoords(square);
  game.state.board[row][col] = [{ color, type }];
}

describe('victoire aux plats / fin de partie', () => {
  it('victoire aux plats quand le plateau 3x3 est plein, sans route', () => {
    const game = new TakGame(3);

    // Damier sans route, 8 cases remplies, (2,2)=c3 vide
    setCell(game, 'a1', PLAYER_WHITE, FLAT); // (0,0)
    setCell(game, 'b1', PLAYER_BLACK, FLAT); // (0,1)
    setCell(game, 'c1', PLAYER_WHITE, FLAT); // (0,2)
    setCell(game, 'a2', PLAYER_BLACK, FLAT); // (1,0)
    setCell(game, 'b2', PLAYER_WHITE, FLAT); // (1,1)
    setCell(game, 'c2', PLAYER_BLACK, FLAT); // (1,2)
    setCell(game, 'a3', PLAYER_WHITE, FLAT); // (2,0)
    setCell(game, 'b3', PLAYER_BLACK, FLAT); // (2,1)

    game.state.turn = PLAYER_WHITE;
    game.state.moveNumber = 10;

    game.placeStone('c3', FLAT); // (2,2) -> plateau plein, blanc = 5 plats, noir = 4

    expect(game.isGameOver()).toBe(true);
    expect(game.getResult()).toBe(RESULT.FLAT_WHITE);
  });

  it('match nul quand le compte de plats est égal', () => {
    const game = new TakGame(3);

    setCell(game, 'a1', PLAYER_WHITE, FLAT); // (0,0)
    setCell(game, 'b1', PLAYER_BLACK, FLAT); // (0,1)
    setCell(game, 'c1', PLAYER_WHITE, FLAT); // (0,2)
    setCell(game, 'a2', PLAYER_BLACK, FLAT); // (1,0)
    setCell(game, 'b2', PLAYER_WHITE, WALL); // (1,1) - mur, ne compte pas
    setCell(game, 'c2', PLAYER_BLACK, FLAT); // (1,2)
    setCell(game, 'a3', PLAYER_WHITE, FLAT); // (2,0)
    setCell(game, 'b3', PLAYER_BLACK, FLAT); // (2,1)

    game.state.turn = PLAYER_WHITE;
    game.state.moveNumber = 10;

    game.placeStone('c3', FLAT); // (2,2) -> 4 plats blancs, 4 plats noirs, 1 mur

    expect(game.isGameOver()).toBe(true);
    expect(game.getResult()).toBe(RESULT.DRAW);
  });

  it('victoire par route avant la fin de partie aux plats', () => {
    const game = new TakGame(3);

    setCell(game, 'a1', PLAYER_WHITE, FLAT); // (0,0)
    setCell(game, 'b1', PLAYER_WHITE, FLAT); // (0,1)

    game.state.turn = PLAYER_WHITE;
    game.state.moveNumber = 10;

    game.placeStone('c1', FLAT); // (0,2) -> route horizontale complète pour blanc

    expect(game.isGameOver()).toBe(true);
    expect(game.getResult()).toBe(RESULT.ROAD_WHITE);
  });
});

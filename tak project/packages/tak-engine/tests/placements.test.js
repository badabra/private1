import { describe, it, expect } from 'vitest';
import { TakGame, PLAYER_WHITE, PLAYER_BLACK, FLAT, CAP } from '../index.js';

describe('placements', () => {
  it('applique la règle d\'échange du premier coup (chacun place un pion adverse)', () => {
    const game = new TakGame(5);

    game.play('a1');
    let state = game.getState();
    expect(state.board[0][0][0]).toEqual({ color: PLAYER_BLACK, type: FLAT });
    expect(state.reserves[PLAYER_BLACK].stones).toBe(20);
    expect(state.turn).toBe(PLAYER_BLACK);

    game.play('a2');
    state = game.getState();
    expect(state.board[1][0][0]).toEqual({ color: PLAYER_WHITE, type: FLAT });
    expect(state.reserves[PLAYER_WHITE].stones).toBe(20);
    expect(state.turn).toBe(PLAYER_WHITE);
  });

  it('refuse un mur ou un capstone lors des deux premiers coups', () => {
    const game = new TakGame(5);
    expect(() => game.play('Sa1')).toThrow(/pion plat/);
    expect(() => game.play('Ca1')).toThrow(/pion plat/);
  });

  it('place normalement F/S/C après l\'ouverture et décrémente les réserves', () => {
    const game = new TakGame(5);
    game.play('a1'); // ouverture: place noir
    game.play('a2'); // ouverture: place blanc
    // tour 3 : blanc joue normalement
    game.play('Cb1');
    const state = game.getState();
    expect(state.board[0][1][0]).toEqual({ color: PLAYER_WHITE, type: CAP });
    expect(state.reserves[PLAYER_WHITE].capstones).toBe(0);
  });

  it('refuse de placer sur une case occupée', () => {
    const game = new TakGame(5);
    game.play('a1');
    game.play('a2');
    expect(() => game.play('a1')).toThrow(/occupée/);
  });

  it('refuse un placement quand la réserve correspondante est vide', () => {
    const game = new TakGame(5);
    game.play('a1');
    game.play('a2');
    game.state.reserves[PLAYER_WHITE].capstones = 0;
    expect(() => game.play('Cb1')).toThrow(/capstone/);
  });
});

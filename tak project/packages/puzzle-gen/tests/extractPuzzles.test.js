import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TakGame, RESULT, PLAYER_WHITE } from '@takhub/tak-engine';
import { ingestDirectory } from '../src/ingest.js';
import { extractPuzzlesFromGame } from '../src/extractPuzzles.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(here, '..', 'fixtures', 'sample-games');

describe('extractPuzzlesFromGame', () => {
  it('extrait au moins un puzzle de la partie d\'exemple et il se résout réellement', () => {
    const games = ingestDirectory(fixturesDir);
    expect(games.length).toBeGreaterThan(0);

    const allPuzzles = games.flatMap((g) => extractPuzzlesFromGame(g));
    expect(allPuzzles.length).toBeGreaterThan(0);

    const puzzle = allPuzzles[0];
    expect(puzzle.solution.length).toBeGreaterThan(0);
    expect(puzzle.position.result).toBe('ONGOING');

    // La solution enregistrée doit réellement mener à une victoire du
    // joueur au trait quand on la rejoue depuis la position sauvegardée.
    const replay = TakGame.fromState(puzzle.position);
    const mover = puzzle.toMove;
    for (const move of puzzle.solution) replay.play(move);
    expect(replay.isGameOver()).toBe(true);
    const favorable =
      mover === PLAYER_WHITE
        ? [RESULT.ROAD_WHITE, RESULT.FLAT_WHITE]
        : [RESULT.ROAD_BLACK, RESULT.FLAT_BLACK];
    expect(favorable).toContain(replay.getResult());
  });

  it('ignore les deux demi-coups d\'ouverture (règle d\'échange)', () => {
    const games = ingestDirectory(fixturesDir);
    const allPuzzles = games.flatMap((g) => extractPuzzlesFromGame(g));
    for (const puzzle of allPuzzles) {
      expect(puzzle.source.ply).toBeGreaterThanOrEqual(2);
    }
  });
});

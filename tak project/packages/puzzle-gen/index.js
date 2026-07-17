import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ingestDirectory } from './src/ingest.js';
import { extractPuzzlesFromGame } from './src/extractPuzzles.js';
import { findForcedWin, isWinningMove } from './src/solver.js';

export { ingestDirectory, extractPuzzlesFromGame, findForcedWin, isWinningMove };

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Répertoire des parties d'exemple embarquées avec le paquet. */
export const SAMPLE_GAMES_DIR = join(__dirname, 'fixtures', 'sample-games');

/**
 * Génère des puzzles à partir d'un répertoire de fichiers `.ptn`.
 * Utilitaire de bibliothèque partagé par la CLI et par le serveur (seed
 * de la collection de puzzles — voir `packages/server`).
 */
export function generatePuzzlesFromDirectory(dirPath, options = {}) {
  const games = ingestDirectory(dirPath);
  return games.flatMap((g) => extractPuzzlesFromGame(g, options));
}

/**
 * Génère les puzzles issus des parties d'exemple embarquées. Permet au
 * serveur d'amorcer sa bibliothèque de puzzles sans dépendre d'un fichier
 * externe ni d'une exécution préalable de la CLI.
 */
export function generateSamplePuzzles(options = {}) {
  return generatePuzzlesFromDirectory(SAMPLE_GAMES_DIR, options);
}

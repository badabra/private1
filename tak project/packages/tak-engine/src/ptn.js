import { RESULT } from './constants.js';
import { TakGame } from './TakGame.js';

const HEADER_RE = /^\[(\w+)\s+"(.*)"\]$/;
const RESULT_TOKENS = new Set([
  RESULT.ROAD_WHITE,
  RESULT.ROAD_BLACK,
  RESULT.FLAT_WHITE,
  RESULT.FLAT_BLACK,
  RESULT.DRAW,
  '*',
]);

/**
 * Analyse une partie complète en notation PTN : en-têtes `[Clé "Valeur"]`
 * suivis de la liste de coups numérotée (ex. "1. a1 a2 2. Cc3 d4 ...").
 * Retourne `{ headers, moves }`. Voir aussi `gameFromPTN` pour rejouer la partie.
 */
export function parsePTN(ptnText) {
  const headers = {};
  const moveLines = [];

  for (const rawLine of ptnText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === '') continue;
    const headerMatch = HEADER_RE.exec(line);
    if (headerMatch) {
      headers[headerMatch[1]] = headerMatch[2];
    } else {
      moveLines.push(line);
    }
  }

  const tokens = moveLines.join(' ').split(/\s+/).filter(Boolean);
  const moves = [];
  for (const token of tokens) {
    if (/^\d+\.{1,3}$/.test(token)) continue; // numéro de coup, ex. "1." ou "12..."
    if (RESULT_TOKENS.has(token)) continue; // marqueur de résultat final
    moves.push(token);
  }

  return { headers, moves };
}

/**
 * Reconstruit une partie (TakGame) à partir d'un texte PTN, en rejouant
 * chaque coup. La taille du plateau est lue depuis l'en-tête `[Size "n"]`
 * (par défaut 5).
 */
export function gameFromPTN(ptnText) {
  const { headers, moves } = parsePTN(ptnText);
  const size = headers.Size ? Number(headers.Size) : 5;
  const game = new TakGame(size);
  for (const move of moves) {
    game.play(move);
  }
  return { game, headers };
}

/**
 * Sérialise une partie (TakGame) et des en-têtes optionnels en texte PTN.
 */
export function gameToPTN(game, extraHeaders = {}) {
  const headers = {
    Size: String(game.size),
    ...extraHeaders,
  };
  if (game.isGameOver() && headers.Result === undefined) {
    headers.Result = game.getResult();
  } else if (headers.Result === undefined) {
    headers.Result = '*';
  }

  const headerLines = Object.entries(headers).map(([key, value]) => `[${key} "${value}"]`);

  const moveLines = [];
  const history = game.getState().history;
  for (let i = 0; i < history.length; i += 2) {
    const moveNumber = i / 2 + 1;
    const white = history[i];
    const black = history[i + 1];
    moveLines.push(black ? `${moveNumber}. ${white} ${black}` : `${moveNumber}. ${white}`);
  }

  const resultLine = headers.Result;
  const body = [...moveLines, resultLine].join(' ');

  return `${headerLines.join('\n')}\n\n${body}`;
}

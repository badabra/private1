import { VALID_SIZES } from './constants.js';

const FILES = 'abcdefgh';

/**
 * Convertit une case en notation PTN ("c3") en coordonnées internes {col, row},
 * 0-indexées, où col=0 correspond au fichier 'a' et row=0 à la rangée 1.
 */
export function squareToCoords(square) {
  const match = /^([a-h])([1-8])$/.exec(square);
  if (!match) {
    throw new Error(`Case invalide : "${square}"`);
  }
  const col = FILES.indexOf(match[1]);
  const row = Number(match[2]) - 1;
  return { col, row };
}

/** Convertit des coordonnées internes {col, row} en notation PTN ("c3"). */
export function coordsToSquare({ col, row }) {
  return `${FILES[col]}${row + 1}`;
}

/** Vérifie que des coordonnées sont à l'intérieur d'un plateau de la taille donnée. */
export function isOnBoard({ col, row }, size) {
  return col >= 0 && col < size && row >= 0 && row < size;
}

export function assertValidSize(size) {
  if (!VALID_SIZES.includes(size)) {
    throw new Error(`Taille de plateau invalide : ${size}. Valeurs acceptées : ${VALID_SIZES.join(', ')}`);
  }
}

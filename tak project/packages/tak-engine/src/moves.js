import { FLAT, WALL, CAP, DIRECTIONS, PLAYER_WHITE, PLAYER_BLACK } from './constants.js';
import { squareToCoords, isOnBoard } from './coords.js';

const PLACEMENT_RE = /^([FSC]?)([a-h][1-8])$/;
const SPREAD_RE = /^([1-8]?)([a-h][1-8])([<>+-])([1-8]*)(\*?)$/;

/**
 * Analyse une notation PTN de coup (placement ou déplacement/spread)
 * et retourne une description structurée du coup.
 */
export function parseMove(moveStr) {
  if (typeof moveStr !== 'string') {
    throw new Error('Le coup doit être une chaîne de caractères.');
  }

  let m = PLACEMENT_RE.exec(moveStr);
  if (m) {
    return { kind: 'place', pieceType: m[1] || FLAT, square: m[2] };
  }

  m = SPREAD_RE.exec(moveStr);
  if (m) {
    const count = m[1] ? Number(m[1]) : 1;
    const square = m[2];
    const direction = m[3];
    const drops = m[4] ? m[4].split('').map(Number) : [count];
    const crush = m[5] === '*';
    return { kind: 'spread', square, direction, count, drops, crush };
  }

  throw new Error(`Coup illisible : "${moveStr}"`);
}

/**
 * Applique un coup (déjà analysé ou en notation PTN) à un état de jeu et
 * retourne le nouvel état (sans muter `state`). Lève une erreur si le coup
 * est illégal.
 */
export function applyMove(state, moveStr) {
  const move = typeof moveStr === 'string' ? parseMove(moveStr) : moveStr;
  const next = structuredClone(state);

  if (move.kind === 'place') {
    applyPlacement(next, move);
  } else if (move.kind === 'spread') {
    applySpread(next, move);
  } else {
    throw new Error(`Type de coup inconnu : "${move.kind}"`);
  }

  next.history.push(typeof moveStr === 'string' ? moveStr : stringifyMove(move));
  return next;
}

export function stringifyMove(move) {
  if (move.kind === 'place') {
    return `${move.pieceType === FLAT ? '' : move.pieceType}${move.square}`;
  }
  const countStr = move.count > 1 ? String(move.count) : '';
  const isDefaultDrop = move.drops.length === 1 && move.drops[0] === move.count;
  const dropsStr = isDefaultDrop ? '' : move.drops.join('');
  const crushStr = move.crush ? '*' : '';
  return `${countStr}${move.square}${move.direction}${dropsStr}${crushStr}`;
}

function applyPlacement(state, move) {
  const { col, row } = squareToCoords(move.square);
  if (!isOnBoard({ col, row }, state.size)) {
    throw new Error(`La case "${move.square}" est hors du plateau ${state.size}x${state.size}.`);
  }

  const stack = state.board[row][col];
  if (stack.length > 0) {
    throw new Error(`La case ${move.square} est déjà occupée.`);
  }

  const isOpeningPly = state.moveNumber === 1 || state.moveNumber === 2;
  let color = state.turn;
  if (isOpeningPly) {
    if (move.pieceType !== FLAT) {
      throw new Error('Le premier coup de chaque joueur doit être un pion plat (règle d\'échange).');
    }
    // Règle d'échange : chaque joueur place un pion de la couleur adverse.
    color = state.turn === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE;
  }

  const reserve = state.reserves[color];
  if (move.pieceType === CAP) {
    if (reserve.capstones <= 0) {
      throw new Error('Plus aucun capstone disponible dans la réserve.');
    }
    reserve.capstones -= 1;
  } else {
    if (reserve.stones <= 0) {
      throw new Error('Plus aucun pion disponible dans la réserve.');
    }
    reserve.stones -= 1;
  }

  stack.push({ color, type: move.pieceType });
  state.turn = state.turn === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE;
  state.moveNumber += 1;
}

function applySpread(state, move) {
  const { square, direction, count, drops } = move;

  if (count < 1 || count > state.size) {
    throw new Error(`Nombre de pièces ramassées invalide : ${count} (max ${state.size}).`);
  }
  const sum = drops.reduce((a, b) => a + b, 0);
  if (sum !== count) {
    throw new Error('La somme des dépôts doit être égale au nombre de pièces ramassées.');
  }
  for (const d of drops) {
    if (d < 1) throw new Error('Chaque dépôt doit contenir au moins une pièce.');
  }

  const origin = squareToCoords(square);
  if (!isOnBoard(origin, state.size)) {
    throw new Error(`La case "${square}" est hors du plateau ${state.size}x${state.size}.`);
  }

  const originStack = state.board[origin.row][origin.col];
  if (originStack.length === 0) {
    throw new Error(`La case ${square} est vide, impossible de déplacer une pile.`);
  }
  const topPiece = originStack[originStack.length - 1];
  if (topPiece.color !== state.turn) {
    throw new Error(`Vous ne contrôlez pas le sommet de la pile en ${square}.`);
  }
  if (count > originStack.length) {
    throw new Error(`La pile en ${square} ne contient que ${originStack.length} pièce(s).`);
  }

  // Pièces transportées, dans l'ordre bas -> haut de la sous-pile.
  const carried = originStack.splice(originStack.length - count, count);

  const { dCol, dRow } = DIRECTIONS[direction];
  let { col, row } = origin;
  let carriedIndex = 0;

  for (let i = 0; i < drops.length; i++) {
    col += dCol;
    row += dRow;
    if (!isOnBoard({ col, row }, state.size)) {
      throw new Error('La pile sortirait du plateau.');
    }

    const destStack = state.board[row][col];
    const isLast = i === drops.length - 1;
    const dropCount = drops[i];
    const piecesToDrop = carried.slice(carriedIndex, carriedIndex + dropCount);

    if (destStack.length > 0) {
      const destTop = destStack[destStack.length - 1];
      if (destTop.type === CAP) {
        throw new Error('Impossible de déplacer une pile sur un capstone.');
      }
      if (destTop.type === WALL) {
        const isCrush = isLast && dropCount === 1 && piecesToDrop[0].type === CAP;
        if (!isCrush) {
          throw new Error('Impossible de déplacer une pile sur un mur, sauf aplatissement par un capstone seul, en dernière case.');
        }
        // Le capstone aplatit le mur en pion plat avant de s'y déposer.
        destStack[destStack.length - 1] = { ...destTop, type: FLAT };
      }
    }

    for (const piece of piecesToDrop) destStack.push(piece);
    carriedIndex += dropCount;
  }

  state.turn = state.turn === PLAYER_WHITE ? PLAYER_BLACK : PLAYER_WHITE;
  state.moveNumber += 1;
}

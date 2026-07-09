import { useMemo, useState } from 'react';
import {
  FLAT,
  DIRECTIONS,
  squareToCoords,
  coordsToSquare,
  isOnBoard,
  stringifyMove,
} from '@takhub/tak-engine';

function dirEntryFor(from, to) {
  return Object.entries(DIRECTIONS).find(
    ([, d]) => d.dCol === to.col - from.col && d.dRow === to.row - from.row
  );
}

/**
 * Machine à états partagée de l'interaction "coup" du plateau Tak, commune au
 * jeu local (PlayPage) et en ligne (GamePage). Le mode est déduit de la case
 * cliquée (case vide -> placement, pile contrôlée -> déplacement) ; un
 * déplacement suit le modèle "prise puis dépôts" avec la bulle sur le plateau.
 *
 * Ce hook ne connaît ni le moteur local ni le réseau : il construit une chaîne
 * de coup en notation PTN et la transmet à `commitMove`. C'est l'appelant qui
 * décide comment l'appliquer (jouer sur le TakGame local, ou POST au serveur).
 *
 * @param {object}   args
 * @param {object}   args.state       état de partie sérialisable (board, size, turn, result)
 * @param {boolean}  args.canAct      le joueur courant peut-il agir maintenant ?
 * @param {Function} args.commitMove  (moveStr) => void | Promise, applique le coup
 */
export function useTakMove({ state, canAct, commitMove }) {
  const [placeType, setPlaceType] = useState(FLAT);
  const [selected, setSelected] = useState(null);
  // Pièces en main (prise déclarée, décrémentée par les dépôts). null = pas encore pris.
  const [hand, setHand] = useState(null);
  // Dépôts confirmés : { direction, path: [square...], drops: [n...] } ou null.
  const [spread, setSpread] = useState(null);
  // Bulle ouverte sur le plateau : { type: 'pickup'|'drop', cell, max } ou null.
  const [pending, setPending] = useState(null);

  function clearSelection() {
    setSelected(null);
    setHand(null);
    setSpread(null);
    setPending(null);
  }

  function selectStack(square, stack) {
    const carryMax = Math.min(state.size, stack.length);
    setSelected(square);
    setSpread(null);
    if (carryMax <= 1) {
      setHand(1);
      setPending(null);
    } else {
      setHand(null);
      setPending({ type: 'pickup', cell: square, max: carryMax });
    }
  }

  function execMove(moveStr) {
    commitMove(moveStr);
    clearSelection();
  }

  function handleSquareClick(square) {
    if (!canAct) return;

    // Une bulle est ouverte : on y répond d'abord (dans le panneau/le plateau).
    if (pending) return;

    const { col, row } = squareToCoords(square);
    const clickedStack = state.board[row][col];

    if (selected) {
      // Un déplacement est en cours : router le clic dedans.

      // Main déclarée, aucun dépôt : la première destination fige la direction.
      if (!spread) {
        if (square === selected) {
          clearSelection();
          return;
        }
        const de = dirEntryFor(squareToCoords(selected), squareToCoords(square));
        if (de && hand != null) {
          if (hand === 1) {
            execMove(spreadMove(selected, de[0], [1]));
            return;
          }
          setSpread({ direction: de[0], path: [], drops: [] });
          setPending({ type: 'drop', cell: square, max: hand });
          return;
        }
        // Clic sur une autre pile contrôlée : on redémarre la sélection dessus.
        if (clickedStack.length > 0 && clickedStack[clickedStack.length - 1].color === state.turn) {
          selectStack(square, clickedStack);
        }
        return;
      }

      // Étalement en cours : seule la case suivante en ligne le prolonge.
      const dir = DIRECTIONS[spread.direction];
      const frontier = spread.path.length ? spread.path[spread.path.length - 1] : selected;
      const fc = squareToCoords(frontier);
      const nextCoords = { col: fc.col + dir.dCol, row: fc.row + dir.dRow };
      if (!isOnBoard(nextCoords, state.size)) return;
      if (square !== coordsToSquare(nextCoords)) return;

      if (hand === 1) {
        // Dernière pièce : aucun choix à faire, on dépose et on joue le coup.
        execMove(spreadMove(selected, spread.direction, [...spread.drops, 1]));
        return;
      }
      setPending({ type: 'drop', cell: square, max: hand });
      return;
    }

    // Rien de sélectionné : on déduit du contenu de la case cliquée.
    if (clickedStack.length === 0) {
      execMove(stringifyMove({ kind: 'place', pieceType: placeType, square }));
      return;
    }

    // Case occupée : seule une pile que l'on contrôle est actionnable.
    if (clickedStack[clickedStack.length - 1].color === state.turn) {
      selectStack(square, clickedStack);
    }
  }

  function handlePickCount(n) {
    if (!pending) return;
    const count = Math.min(Math.max(1, n), pending.max);

    if (pending.type === 'pickup') {
      setHand(count);
      setPending(null);
      return;
    }

    // type === 'drop'
    const drops = [...spread.drops, count];
    const path = [...spread.path, pending.cell];
    const rest = hand - count;
    setPending(null);
    if (rest <= 0) {
      execMove(spreadMove(selected, spread.direction, drops));
    } else {
      setSpread({ direction: spread.direction, path, drops });
      setHand(rest);
    }
  }

  function handleCancelPicker() {
    if (pending?.type === 'pickup') {
      clearSelection();
      return;
    }
    setPending(null);
    if (spread && spread.drops.length === 0) setSpread(null);
  }

  const legalTargets = useMemo(() => {
    if (!selected) return [];
    if (pending) return [pending.cell];

    if (spread) {
      const dir = DIRECTIONS[spread.direction];
      const frontier = spread.path.length ? spread.path[spread.path.length - 1] : selected;
      const fc = squareToCoords(frontier);
      const next = { col: fc.col + dir.dCol, row: fc.row + dir.dRow };
      return isOnBoard(next, state.size) ? [coordsToSquare(next)] : [];
    }

    if (hand != null) {
      const { col, row } = squareToCoords(selected);
      const targets = [];
      for (const dir of Object.values(DIRECTIONS)) {
        const next = { col: col + dir.dCol, row: row + dir.dRow };
        if (isOnBoard(next, state.size)) targets.push(coordsToSquare(next));
      }
      return targets;
    }

    return [];
  }, [selected, hand, spread, pending, state]);

  return {
    placeType,
    setPlaceType,
    selected,
    hand,
    spread,
    pending,
    legalTargets,
    handleSquareClick,
    handlePickCount,
    handleCancelPicker,
    clearSelection,
  };
}

function spreadMove(square, direction, drops) {
  const count = drops.reduce((a, b) => a + b, 0);
  return stringifyMove({ kind: 'spread', square, direction, count, drops, crush: false });
}

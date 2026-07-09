import { WALL } from './constants.js';

/**
 * Détermine si `player` possède une route reliant deux bords opposés du plateau.
 * Une case appartient à la route si sa pièce du dessus est de la couleur du joueur
 * et n'est pas un mur (les murs ne comptent pas pour les routes, les capstones oui).
 */
export function hasRoad(state, player) {
  const { size, board } = state;

  const ownsSquare = (row, col) => {
    const stack = board[row][col];
    if (stack.length === 0) return false;
    const top = stack[stack.length - 1];
    return top.color === player && top.type !== WALL;
  };

  return (
    connects(size, ownsSquare, 'horizontal') || connects(size, ownsSquare, 'vertical')
  );
}

/**
 * BFS depuis toutes les cases du bord de départ vers le bord opposé,
 * en suivant les cases possédées (4-connexité).
 */
function connects(size, ownsSquare, orientation) {
  const visited = Array.from({ length: size }, () => new Array(size).fill(false));
  const queue = [];

  for (let i = 0; i < size; i++) {
    const [row, col] = orientation === 'horizontal' ? [i, 0] : [0, i];
    if (ownsSquare(row, col) && !visited[row][col]) {
      visited[row][col] = true;
      queue.push([row, col]);
    }
  }

  const reachesOpposite = ([row, col]) =>
    orientation === 'horizontal' ? col === size - 1 : row === size - 1;

  while (queue.length > 0) {
    const current = queue.shift();
    if (reachesOpposite(current)) return true;

    const [row, col] = current;
    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];
    for (const [nRow, nCol] of neighbors) {
      if (nRow < 0 || nRow >= size || nCol < 0 || nCol >= size) continue;
      if (visited[nRow][nCol]) continue;
      if (!ownsSquare(nRow, nCol)) continue;
      visited[nRow][nCol] = true;
      queue.push([nRow, nCol]);
    }
  }

  return false;
}

// Types de pièces (notation PTN : F = flat, S = standing/wall, C = capstone)
export const FLAT = 'F';
export const WALL = 'S';
export const CAP = 'C';

export const PIECE_TYPES = [FLAT, WALL, CAP];

// Réserves officielles par joueur, selon la taille du plateau.
// Source : règles officielles de Tak (ustak.org).
export const BOARD_CONFIGS = {
  3: { stones: 10, capstones: 0 },
  4: { stones: 15, capstones: 0 },
  5: { stones: 21, capstones: 1 },
  6: { stones: 30, capstones: 1 },
  7: { stones: 40, capstones: 2 },
  8: { stones: 50, capstones: 2 },
};

export const VALID_SIZES = Object.keys(BOARD_CONFIGS).map(Number);

export const PLAYER_WHITE = 1;
export const PLAYER_BLACK = 2;

// Directions de déplacement en notation PTN.
// '>' : vers la colonne suivante (loin de la colonne 'a')
// '<' : vers la colonne précédente (vers la colonne 'a')
// '+' : vers la rangée suivante (rang plus élevé)
// '-' : vers la rangée précédente (rang plus faible)
export const DIRECTIONS = {
  '>': { dCol: 1, dRow: 0 },
  '<': { dCol: -1, dRow: 0 },
  '+': { dCol: 0, dRow: 1 },
  '-': { dCol: 0, dRow: -1 },
};

export const RESULT = {
  ONGOING: 'ONGOING',
  ROAD_WHITE: 'R-0', // route blanche, blanc gagne
  ROAD_BLACK: '0-R', // route noire, noir gagne
  FLAT_WHITE: 'F-0',
  FLAT_BLACK: '0-F',
  DRAW: '1/2-1/2',
};

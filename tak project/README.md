# TakHub

Plateforme communautaire de jeux vidéo, débutant avec le jeu de **Tak** (jeu de stratégie abstrait à 2 joueurs).
Inspirée de lichess.org / chess.com : moteur de jeu, multijoueur en temps réel, communauté (blogs, groupes, chat) et puzzles.

Projet de session — DEC Informatique, Programmation Web et Applications (Alioune Badara Thioune, supervisé par Sameh Chaieb).

## Structure du monorepo

```
packages/
  tak-engine/   Moteur de jeu Tak (JS pur, indépendant) — règles, piles, routes, PTN
  puzzle-gen/   Générateur de puzzles — solveur de gains forcés, extraction depuis PTN
  server/       API Express (auth JWT/bcrypt, MongoDB Atlas) — parties, chat, blogs, groupes, puzzles
  client/       Application React + Vite + TailwindCSS
docs/
  PROJECT_BREAKDOWN.md   Découpage du projet par sprint
  suivi/                 Rapports de suivi bihebdomadaire
```

## Démarrage

```bash
npm install

# Moteur Tak — tests
npm run test:engine

# Serveur API
cp packages/server/.env.example packages/server/.env   # puis renseigner MONGODB_URI / JWT_SECRET
npm run dev:server
npm run test:server

# Client
cp packages/client/.env.example packages/client/.env   # optionnel : clés Firebase (sync temps réel)
npm run dev:client
```

### Multijoueur (Sprint 2)

- `MONGODB_URI` (dans `packages/server/.env`) doit pointer vers un vrai cluster MongoDB
  Atlas (gratuit) pour que les parties persistent au-delà du redémarrage du serveur.
- Les variables `FIREBASE_*` (serveur) et `VITE_FIREBASE_*` (client) sont **optionnelles** :
  sans elles, l'application fonctionne quand même via un rafraîchissement périodique
  (polling) de l'API REST. Avec elles, les coups se synchronisent instantanément entre
  les deux joueurs et les spectateurs via Firestore.

## Sprints (voir docs/PROJECT_BREAKDOWN.md)

- **Sprint 1 — Fondations** : moteur Tak, authentification, UI de plateau locale (6 formats)
- **Sprint 2 — Multijoueur** : synchronisation temps réel (Firebase Firestore), persistance des parties, spectateurs, profils
- **Sprint 3 — Communauté** : chat de partie, blogs + commentaires, groupes thématiques, puzzles (générés par `puzzle-gen`, validés par le moteur)

### Puzzles (Sprint 3)

Le paquet `puzzle-gen` extrait des positions à gain forcé depuis des parties
PTN. Le serveur amorce automatiquement sa bibliothèque au premier appel de
`GET /api/puzzles` ; pour amorcer une base MongoDB réelle :

```bash
npm run seed:puzzles --workspace=@takhub/server
```

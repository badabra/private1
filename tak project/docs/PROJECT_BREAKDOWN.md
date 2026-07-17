# TakHub — Découpage du projet

Ce document mappe chaque fonctionnalité décrite dans le cahier des charges
(section 3.1 et suivantes) à un sprint, un module/package du monorepo, et
son statut actuel. Il sert de feuille de route pour le suivi de stage et la
présentation finale.

Stack technique : JavaScript (ESM) pur, monorepo npm workspaces
(`packages/tak-engine`, `packages/server`, `packages/client`), React +
TailwindCSS, Express + Mongoose (MongoDB Atlas), Firebase Firestore
(temps réel — Sprint 2), Vitest/Supertest pour les tests.

---

## Sprint 1 — Fondations (2 juin – 23 juin) — ✅ Terminé (cette session)

| Fonctionnalité (CDC) | Module / package | Statut |
|---|---|---|
| Moteur de jeu Tak indépendant ("app JS indépendant", interface IGame) | `packages/tak-engine` | ✅ Fait |
| Plateaux 3x3 à 8x8 avec réserves officielles par taille | `tak-engine/src/constants.js` | ✅ Fait |
| Pièces Plate (F), Mur (S), Capstone (C) | `tak-engine/src/moves.js` | ✅ Fait |
| Placements (incl. règle d'échange du premier coup) | `tak-engine/src/moves.js` | ✅ Fait |
| Déplacements/spreads, limite de portée, drops | `tak-engine/src/moves.js` | ✅ Fait |
| Règle du "crush" (capstone aplatit un mur) | `tak-engine/src/moves.js` | ✅ Fait |
| Détection de route (BFS, 6 tailles) | `tak-engine/src/roads.js` | ✅ Fait |
| Victoire aux plats / match nul | `tak-engine/src/TakGame.js` | ✅ Fait |
| Import/export PTN (coups + en-têtes de partie) | `tak-engine/src/ptn.js` | ✅ Fait |
| Suite de tests du moteur (31 tests) | `tak-engine/tests/*` | ✅ Fait |
| Authentification (inscription/connexion, JWT + bcrypt) | `packages/server` (`authController`, `authRoutes`, `User` model) | ✅ Fait |
| Tests d'intégration auth (mongodb-memory-server) | `server/tests/auth.test.js` | ✅ Fait |
| Endpoint API `/games` branché sur le moteur (validation monorepo) | `server/src/routes/gamesRoutes.js` | ✅ Fait |
| Client React + Vite + Tailwind, routage (react-router) | `packages/client` (`App.jsx`, `src/pages/*`) | ✅ Fait |
| Plateau SVG jouable en local (hot-seat), 6 tailles | `client/src/components/board/{Board,Square,Controls}.jsx`, `pages/PlayPage.jsx` | ✅ Fait |
| Pages Connexion / Inscription branchées sur l'API | `client/src/pages/{Login,Register}Page.jsx`, `services/api.js` | ✅ Fait |
| Placeholders Profil / Puzzles / Blog / Groupes | `client/src/pages/*Page.jsx` | ✅ Fait (squelettes) |

---

## Sprint 2 — Multijoueur (23 juin – 14 juillet) — ✅ Terminé (cette session)

| Fonctionnalité (CDC) | Module / package | Statut |
|---|---|---|
| Persistance des parties (MongoDB Atlas) | `server/src/models/Game.js`, `server/src/controllers/gamesController.js` | ✅ Fait |
| Création de parties publiques / privées (code de jonction) | `gamesController.createGame/joinByCode`, `client/src/pages/LobbyPage.jsx` | ✅ Fait |
| Coups joués et validés côté serveur (tour, légalité, fin de partie) | `gamesController.playMove`, `client/src/pages/GamePage.jsx` | ✅ Fait |
| Synchronisation temps réel des coups (Firebase Firestore) | `server/src/config/firestore.js`, `client/src/services/firebase.js` | ✅ Fait (optionnelle — repli sur polling REST sans clés Firebase) |
| Mode spectateur | `GET /api/games/:id` public, `client/src/pages/GamePage.jsx` (lecture seule si non-participant) | ✅ Fait |
| Profils joueurs (historique, statistiques W/L/D) | `User.stats`, `GET /api/games/mine`, `client/src/pages/ProfilePage.jsx` | ✅ Fait |
| Tests d'intégration (création, jonction, coups, tour, historique) | `server/tests/gamesPersistence.test.js` | ✅ Fait |

Pré-requis côté utilisateur (en attente) : créer un cluster MongoDB Atlas
réel et un projet Firebase, puis renseigner les variables d'environnement
(`packages/server/.env` et `packages/client/.env`, voir les `.env.example`
correspondants) pour activer la persistance réelle et la synchronisation
temps réel en conditions de production. Sans ces clés, l'application
fonctionne déjà en local avec MongoDB en mémoire (tests) et un
rafraîchissement périodique côté client.

---

## Sprint 3 — Communauté (14 juillet – 4 août) — ✅ Terminé (cette session)

| Fonctionnalité (CDC) | Module / package | Statut |
|---|---|---|
| Chat de partie | `server/src/controllers/chatController.js` + routes `/games/:id/messages`, `client/src/components/GameChat.jsx` (intégré à `GamePage`) | ✅ Fait |
| Blogs + commentaires | `server/src/routes/blogsRoutes.js`, `server/src/models/Post.js`, `client/src/pages/BlogPage.jsx` | ✅ Fait |
| Groupes thématiques | `server/src/routes/groupsRoutes.js`, `server/src/models/Group.js`, `client/src/pages/GroupsPage.jsx` | ✅ Fait |
| Puzzles (bibliothèque + validation via le moteur) | `packages/puzzle-gen` (générateur), `server/src/routes/puzzlesRoutes.js`, `server/src/models/Puzzle.js`, `client/src/pages/PuzzlesPage.jsx` | ✅ Fait |
| Générateur de puzzles (solveur de gains forcés, extraction depuis PTN) | `packages/puzzle-gen/src/{solver,extractPuzzles,ingest,cli}.js` | ✅ Fait |
| Amorçage de la bibliothèque de puzzles (branché sur `puzzle-gen`) | `server/src/controllers/puzzlesController.js` (`seedPuzzlesIfEmpty`), `npm run seed:puzzles` | ✅ Fait |
| Tests d'intégration Communauté (chat, blogs, groupes, puzzles) | `server/tests/community.test.js` | ✅ Fait |

Le générateur `puzzle-gen` extrait les positions à gain forcé de vraies
parties (format PTN) et les exporte en JSONL (CLI) ou les fournit directement
au serveur en tant que bibliothèque (`generateSamplePuzzles`). Le serveur
amorce sa collection de puzzles au premier appel de `GET /api/puzzles` (ou via
`npm run seed:puzzles`) puis valide chaque tentative avec le moteur `tak-engine`.

---

## Phase de tests (4 août – 10 août) — 🔲 À venir

- Tests end-to-end du flux complet (auth → création de partie → coups
  temps réel → fin de partie → historique).
- Tests de charge légers sur l'API (parties simultanées).
- Vérification responsive (contrainte CDC 6.1) sur mobile/tablette/desktop.
- Revue finale de l'ensemble des suites Vitest/Supertest.

---

## Hors scope / à déterminer

- Hébergement de production (CDC : "à déterminer").
- Configuration Firebase réelle (dépend des identifiants fournis par
  l'étudiant).

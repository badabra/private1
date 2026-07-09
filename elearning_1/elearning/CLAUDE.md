# CLAUDE.md — Plateforme E-Learning (Sujet 13)

Projet scolaire (Teccart, cours 420-PW4-TT, prof Raoul Elouga). Plateforme e-learning
Laravel + Vue. Suivi hebdomadaire avec rapports, captures et vidéos de démo.

## État actuel : Semaines 1 et 2 TERMINÉES et livrées

Lire dans l'ordre pour le contexte complet :
1. `PLAN_PALIERS.md` — plan des 6 semaines, ce qui est fait (S1-S2 ✅), ce qui reste (S3-S6)
2. `TRAVAUX_REALISES.md` — détail de tout ce qui est implémenté + tableau "où regarder dans le code"
3. `CANEVAS_RAPPORT_FINAL.md` — structure du rapport final (semaine 6), exigée par le prof
4. `rapports/` — rapports hebdomadaires (S1-S2 rédigés, S3-S6 gabarits à remplir)

## Installation locale (machine de Badara)

- **Windows + Laragon Full** (PHP 8.3, MySQL, Composer, Node — tout via Laragon)
- **Backend** : `C:\Users\Alioune\Downloads\elearning1\elearning\backend\laravel\`
  (squelette Laravel 13 créé par composer, nos fichiers copiés par-dessus)
- **Frontend** : `C:\Users\Alioune\Downloads\elearning1\elearning\elearning-front\`
  (créé avec `npm create vue@latest` — Pinia coché, vue-router installé après coup via npm)
- **BD** : MySQL Laragon, base `elearning`, user `root`, pas de mot de passe
- **.env clés** : `DB_DATABASE=elearning`, `SESSION_DRIVER=file`
- Lancer : `php artisan serve` (port 8000) + `npm run dev` (port 5173)

⚠️ Ce repo (les dossiers `backend/` et `frontend/` ici) contient UNIQUEMENT les fichiers
personnalisés, pas le squelette Laravel/Vue complet. Sur la machine, le vrai projet
exécutable est aux chemins ci-dessus. Toute modification de code doit être faite (ou
recopiée) dans ces chemins-là pour être visible.

## Comptes de démo (seeder)

| Rôle | Email | Mot de passe | État |
|---|---|---|---|
| Admin | admin@elearning.test | Admin1234! | actif |
| Formateur | formateur@elearning.test | Form1234! | approuvé |
| Formateur | formateur2@elearning.test | Form1234! | EN ATTENTE |
| Étudiant | etudiant@elearning.test | Etud1234! | actif |

## Architecture et conventions (à respecter absolument)

- **Auth** : Sanctum jetons API (PAS mode SPA/cookies). Token en localStorage,
  intercepteur Axios requête (Bearer) + réponse (401 → /login, 403 → /dashboard).
- **Autorisation** : Gates centralisées dans `AppServiceProvider`
  (`acceder-espace-admin`, `acceder-espace-formateur`, `creer-contenu`) + middleware
  natif `can:` sur les routes. `UserPolicy` pour l'approbation. NE PAS réintroduire
  de vérification de rôle en dur dans les contrôleurs (remarque explicite du prof).
- **Rôles** : admin = approuve les formateurs + supervise (lecture/modération), ne crée
  PAS de contenu. Formateur approuvé = crée ses cours. `is_approved` sur users.
- **Style de code** : simple, niveau étudiant DEC. Pas d'abstractions inutiles, pas de
  repositories/services/interfaces. Contrôleurs directs, validation inline, commentaires
  en français. Le code doit ressembler à ce qu'un étudiant écrit, pas à du code d'agence.
- **Front** : Vue 3 Composition API (`<script setup>`), Pinia, CSS simple dans App.vue
  (pas de Tailwind, pas de librairie UI).
- **BD** : migrations avec `cascadeOnDelete`, relations Eloquent hasMany/belongsTo,
  chargement `with()` pour éviter le N+1.

## Prochaine étape : SEMAINE 3

Côté étudiant : catalogue des cours publiés (`publie = true` uniquement), inscription à
un cours (table `enrollments`, déjà migrée), consultation du contenu des leçons
(texte / vidéo / PDF), suivi de progression par leçon (nouvelle table `lesson_progress`).
Voir `rapports/rapport_semaine_3.md` pour les objectifs et la liste de tâches.

Livrables chaque semaine (demande du prof) : rapport rempli + captures d'écran +
courte vidéo de démonstration + code sur GitHub.

## Pièges déjà rencontrés (ne pas refaire)

- `composer create-project laravel/laravel .` sans dossier cible → crée un sous-dossier
  `laravel/` imbriqué. Toujours préciser la cible.
- `npm create vue@latest` : COCHER Router ET Pinia (sinon vue-router manque).
- Plusieurs dossiers frontend ont existé (frontend, frontend-app, elearning-front) —
  le seul actif est `elearning-front`. Vérifier `cd` avant de modifier un fichier.
- `SESSION_DRIVER=database` par défaut → erreur "table sessions doesn't exist".
  Garder `SESSION_DRIVER=file`.
- Visiter une route `/api/...` protégée dans le navigateur → "Route [login] not defined".
  Normal (Accept: text/html), pas un bug.
- Après modification de la table users → `php artisan migrate:fresh --seed` (pas juste migrate).

## Contraintes du cours

- Le prof interdit le contenu généré par IA dans certains livrables : les RAPPORTS
  doivent être réécrits/relus par Badara avant remise. Le code est du scaffolding à
  comprendre et s'approprier — il doit pouvoir l'expliquer en démo.
- Français simple niveau étudiant (B1) dans tous les documents. Pas de jargon inutile.
- Chaque fonctionnalité doit être démontrable en vidéo (parcours cliquable de bout en bout).

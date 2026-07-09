# Rapport de la semaine 1 — Palier 1
**Projet :** Plateforme d'apprentissage en ligne (Sujet 13) — Laravel + Vue.js
**Auteur :** Alioune Badara Thioune
**Période :** Semaine 1

## 1. Objectifs de la semaine
- Analyser le sujet et découper le projet en 6 paliers hebdomadaires.
- Concevoir le modèle de données (MCD/MLD) couvrant toutes les fonctionnalités demandées.
- Mettre en place l'environnement : Laravel 11 (API), Vue 3 (Vite, Pinia, Router), MySQL.
- Implémenter l'authentification complète avec gestion des rôles (étudiant, formateur, admin).

## 2. Travail réalisé
### 2.1 Conception
- Découpage en paliers documenté dans `PLAN_PALIERS.md`.
- Modèle de données : 10 tables (users, courses, modules, lessons, quizzes, questions, answers, enrollments, quiz_attempts, + tables prévues lesson_progress et comments pour les paliers 5-6).
- Hiérarchie pédagogique retenue : **Cours → Modules → Leçons → Quiz → Questions → Réponses**, conforme au sujet.

### 2.2 Back-end (Laravel)
- 6 fichiers de migration créés avec clés étrangères, contraintes `cascadeOnDelete` et contrainte d'unicité (user_id, course_id) sur les inscriptions.
- 9 modèles Eloquent avec toutes les relations (hasMany / belongsTo).
- Authentification par **Laravel Sanctum** (tokens API) : routes `/api/register`, `/api/login`, `/api/logout`, `/api/me`.
- Middleware personnalisé `EnsureRole` permettant `role:formateur,admin` sur les routes — la sécurité par rôle est en place dès la semaine 1.
- Seeder créant 3 comptes de démonstration (admin, formateur, étudiant). L'inscription publique n'autorise que les rôles étudiant/formateur (l'admin n'est créé que par seeder).

### 2.3 Front-end (Vue 3)
- Projet Vite avec Vue Router et Pinia.
- Store `auth` (Pinia) : login, register, logout, persistance du token en localStorage, intercepteur Axios injectant `Authorization: Bearer`.
- Vues : Connexion, Inscription (avec choix de rôle), Tableau de bord protégé par un garde de navigation.

## 3. Difficultés rencontrées et solutions
- **Choix Breeze vs Sanctum seul** : Breeze impose Blade ou Inertia ; comme le front est une SPA Vue séparée, Sanctum en mode tokens API est plus simple et plus propre. Décision validée.
- **Rôle admin à l'inscription** : risque de sécurité si n'importe qui peut s'inscrire admin → restriction de la validation à `etudiant|formateur`, admin créé uniquement via seeder.
- **CORS** entre localhost:5173 et 127.0.0.1:8000 : configuration de `config/cors.php`.

## 4. État d'avancement
| Tâche | État |
|---|---|
| Plan des paliers | ✅ Terminé |
| Modèle de données + migrations | ✅ Terminé |
| Modèles Eloquent + relations | ✅ Terminé |
| Auth Sanctum (register/login/logout/me) | ✅ Terminé |
| Middleware de rôles | ✅ Terminé |
| Front Vue : login/register/dashboard | ✅ Terminé |
| Tests Postman des routes auth | ✅ Terminé |

## 5. Améliorations apportées suite aux retours
Après remise, trois améliorations ont été intégrées en réponse aux remarques reçues
(détaillées dans le rapport de la semaine 2) :
- Remplacement du middleware de rôle codé en dur par des **Gates** Laravel centralisées.
- Ajout d'une **validation des comptes formateur par l'administrateur** (colonne `is_approved`).
- **Documentation du risque XSS** lié au stockage du jeton (voir `SECURITE.md`).

## 6. Prochaine semaine
Mise en place des premières routes CRUD sécurisées (création de cours par un formateur),
gestion des relations Eloquent (cours → modules → leçons) et gestion des erreurs API
401/403 côté Vue.js.

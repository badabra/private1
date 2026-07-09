# Travaux réalisés — résumé pour le suivi

Ce document récapitule tout ce qui a été construit, regroupé par thème. Il sert de
référence rapide (pour le suivi avec le professeur et pour la vidéo de démonstration).

## A. Fonctionnalités demandées par le professeur (propositions semaine 2)

### 1. CRUD sécurisé — création de cours par un formateur
- Contrôleurs `CourseController`, `ModuleController`, `LessonController` (API REST complète).
- Un formateur ne gère que ses propres cours ; l'admin gère tout.
- Interfaces Vue : « Mes cours » (liste/création/publication/suppression) et gestion du
  contenu (modules + leçons texte/vidéo/PDF).

### 2. Relations Eloquent (Cours → Modules → Leçons)
- `Course hasMany Module`, `Module hasMany Lesson` (et `belongsTo` en sens inverse).
- Chargement imbriqué `with('modules.lessons')`, suppression en cascade.

### 3. Gestion des erreurs API 401/403 côté Vue.js
- Intercepteur de réponse Axios (`frontend/src/api.js`) :
  - 401 → nettoyage du jeton et redirection vers la connexion.
  - 403 → redirection vers le tableau de bord.

## B. Améliorations de sécurité (suite aux questions sur la semaine 1)

### 4. Autorisation par Gates (au lieu de rôles codés en dur)
- Capacités définies dans `AppServiceProvider` : `acceder-espace-admin`,
  `acceder-espace-formateur`. Routes protégées par le middleware natif `can:`.
- `UserPolicy` pour l'action « approuver un formateur ».
- Ancien middleware `EnsureRole` conservé mais obsolète.

### 5. Validation des comptes formateur par l'administrateur
- Colonne `is_approved`. Formateur créé « en attente » à l'inscription.
- Écran admin `/admin/approbations` pour activer les comptes.
- La Gate `acceder-espace-formateur` exige un formateur approuvé (sinon 403).

### 6. Rôle de l'administrateur — clarification
L'admin a un rôle volontairement minimal : **approuver les comptes formateur**, et
**superviser** le contenu (lecture de tous les cours, modération via modification/
suppression si nécessaire). Il ne **crée pas** de cours, modules ou leçons à la place
d'un formateur — la Gate `creer-contenu` réserve la création au formateur approuvé
uniquement. Assigner un cours à un formateur ou inscrire des étudiants depuis l'admin
ne sont pas prévus dans le plan actuel (ni dans la demande du professeur) ; ce sont des
pistes d'extension possibles, à discuter avant d'être ajoutées.

### 6. Sécurité du jeton documentée
- Risque XSS du localStorage expliqué dans `SECURITE.md` + commentaire dans `api.js`.
- Piste cookies HttpOnly présentée comme amélioration future.

## D. Espace étudiant (semaine 3)

### 7. Catalogue des cours publiés
- `EtudiantController@catalogue` : liste uniquement les cours `publie = true`, avec le nom
  du formateur et le nombre de modules. Un booléen `est_inscrit` est calculé pour chaque
  cours (badge « Inscrit » côté Vue).
- Vue `CatalogueView` : liste des cours + bouton « S'inscrire » / lien « Continuer ».

### 8. Inscription à un cours
- `EtudiantController@inscrire` / `@desinscrire` : table `enrollments` (déjà migrée en S1).
  `firstOrCreate` + contrainte unique `(user_id, course_id)` empêchent les doublons.

### 9. Consultation du contenu des leçons
- `EtudiantController@contenu` : renvoie le cours avec `modules.lessons`. Réservé aux
  étudiants **inscrits** (sinon 403 via `verifierInscription`). Cours non publié → 404.
- Vue `ApprendreView` : affichage par module. Le média est **intégré dans la page** :
  texte affiché directement, vidéo YouTube dans un iframe, fichier vidéo dans un lecteur
  `<video>`, PDF dans un iframe (aperçu) + lien.
- **Téléversement de fichiers** (formateur) : `LessonController` accepte un `fichier`
  (PDF/mp4/webm) stocké dans `storage/app/public/lessons` via `store('lessons','public')` ;
  l'URL publique (`/storage/...`) est enregistrée dans `url_media`. Nécessite
  `php artisan storage:link`. Le formateur peut aussi coller une URL (YouTube, PDF en ligne).

### 10. Suivi de progression par leçon
- Nouvelle table `lesson_progress (user_id, lesson_id, complete)` + modèle `LessonProgress`.
- `EtudiantController@marquerProgression` : `updateOrCreate` sur (user, leçon).
- `@mesCours` : calcule `faites / total` par cours (barre de progression dans le catalogue).
- Autorisation : Gate `acceder-espace-etudiant` (rôle étudiant) sur toutes les routes.

### Données de démo
- Le seeder crée un cours publié « Introduction au web » (2 modules, 4 leçons) pour que
  le catalogue soit démontrable immédiatement après `migrate:fresh --seed`.

## C. Méthode
- Projet pensé selon le **modèle en V** (voir rapport semaine 2).
- Rapport final prévu selon le **canevas** fourni par le professeur.

## Où regarder dans le code
| Élément | Fichier |
|---|---|
| Gates | `backend/app/Providers/AppServiceProvider.php` |
| Policy d'approbation | `backend/app/Policies/UserPolicy.php` |
| Approbation formateur (API) | `backend/app/Http/Controllers/AdminController.php` |
| CRUD cours/modules/leçons | `backend/app/Http/Controllers/{Course,Module,Lesson}Controller.php` |
| Routes | `backend/routes/api.php` |
| Intercepteurs 401/403 | `frontend/src/api.js` |
| Écran d'approbation (admin) | `frontend/src/views/AdminApprovalsView.vue` |
| Gestion des cours (formateur) | `frontend/src/views/courses/` |
| Espace étudiant (API) | `backend/app/Http/Controllers/EtudiantController.php` |
| Table + modèle progression | `backend/database/migrations/2026_07_01_000001_create_lesson_progress_table.php`, `backend/app/Models/LessonProgress.php` |
| Catalogue + apprentissage (Vue) | `frontend/src/views/etudiant/` |
| Sécurité du jeton | `SECURITE.md` |

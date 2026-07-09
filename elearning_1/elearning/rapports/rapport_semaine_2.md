# Rapport de la semaine 2
**Projet :** Plateforme d'apprentissage en ligne (Sujet 13) — Laravel + Vue.js
**Auteur :** Alioune Badara Thioune
**Période :** Semaine 2

## 1. Objectifs de la semaine
D'après les propositions du professeur pour cette semaine :
- Mettre en place les premières **routes CRUD sécurisées** (ex : création d'un cours par un formateur).
- Gérer les **relations Eloquent** dans Laravel (un cours a plusieurs modules, qui ont plusieurs leçons).
- Gérer les **erreurs API côté Vue.js** (intercepteurs Axios pour rediriger l'utilisateur si le jeton expire ou s'il n'est pas autorisé — erreurs 401/403).
- Intégrer également les retours faits sur la semaine 1 (autorisation, validation des formateurs, sécurité du jeton).

## 2. Travail réalisé

### 2.1 CRUD sécurisé côté formateur (cours, modules, leçons)
- Trois contrôleurs API REST : `CourseController`, `ModuleController`, `LessonController`.
- Opérations complètes : création, lecture, mise à jour et suppression des cours, des modules et des leçons.
- Chaque cours appartient à son formateur : un formateur ne peut gérer que ses propres cours (vérification `formateur_id === id de l'utilisateur connecté`), l'administrateur a accès à tout.
- Interfaces Vue : une page « Mes cours » (liste, création, publication/dépublication, suppression) et une page de gestion d'un cours (ajout de modules, puis de leçons de type texte / vidéo / PDF dans chaque module).

### 2.2 Relations Eloquent (Cours → Modules → Leçons)
- Relations `hasMany` / `belongsTo` définies dans les modèles : un `Course` a plusieurs `Module`, un `Module` a plusieurs `Lesson`.
- Chargement imbriqué utilisé côté API (`Course::with('modules.lessons')`) pour renvoyer toute l'arborescence d'un cours en une seule requête.
- Suppression en cascade : supprimer un cours supprime automatiquement ses modules puis ses leçons (contraintes `cascadeOnDelete`).

### 2.3 Gestion des erreurs API 401/403 côté Vue.js
- Ajout d'un **intercepteur de réponse Axios** (`frontend/src/api.js`) qui réagit selon le code d'erreur renvoyé par l'API :
  - **401 (non authentifié)** : le jeton est expiré ou invalide → nettoyage du localStorage et redirection automatique vers la page de connexion.
  - **403 (non autorisé)** : l'utilisateur est connecté mais n'a pas les droits (mauvais rôle, ou formateur non approuvé) → redirection vers le tableau de bord.
- Cela évite à l'utilisateur de rester bloqué sur une page en erreur et centralise la gestion des accès au même endroit.

### 2.4 Renforcement de la sécurité (suite aux retours de la semaine 1)
- **Autorisation par Gates** plutôt que par rôles codés en dur : les capacités (`acceder-espace-admin`, `acceder-espace-formateur`) sont définies en un seul endroit (`AppServiceProvider`) et les routes utilisent le middleware natif `can:`. Une `UserPolicy` gère l'action « approuver un formateur ». L'ancien middleware `EnsureRole` est conservé mais n'est plus utilisé.
- **Validation des formateurs par l'administrateur** : nouvelle colonne `is_approved`. Un formateur s'inscrit « en attente » ; tant qu'il n'est pas approuvé, la Gate `acceder-espace-formateur` lui renvoie un 403 (d'où l'intérêt de la gestion 401/403 ci-dessus). L'admin dispose d'un écran d'approbation.
- **Sécurité du jeton documentée** : le risque XSS lié au stockage en localStorage est expliqué dans `SECURITE.md`, avec la piste des cookies HttpOnly comme amélioration future.

## 3. Cycle de vie du logiciel — modèle en V
Le projet est mené en gardant à l'esprit le modèle en V :
- **Branche descendante (analyse et conception)** : analyse des besoins (cahier des charges du Sujet 13) → conception architecturale (architecture découplée API Laravel / SPA Vue, modèle de données) → conception détaillée (modèles Eloquent, routes, composants Vue).
- **Pointe du V (réalisation)** : implémentation du CRUD, des relations et de l'authentification.
- **Branche montante (vérification et validation)** : tests des routes (Postman / curl) → tests d'intégration front-back (parcours complets) → recette avec démonstration au professeur.
Chaque niveau de conception est ainsi validé par un niveau de test correspondant.

## 4. Difficultés rencontrées et solutions
- **Lier l'autorisation par rôle et l'approbation des formateurs** : résolu en faisant porter l'accès à l'espace formateur par une seule Gate (`acceder-espace-formateur`) qui combine le rôle ET l'état `is_approved`. Un seul point de vérité.
- **Comportement quand un formateur non approuvé tente d'accéder à l'espace cours** : l'API renvoie 403 ; côté Vue, l'intercepteur Axios redirige proprement vers le tableau de bord plutôt que d'afficher une erreur brute.
- **Cohérence du chargement des données imbriquées** : utilisation de `with('modules.lessons')` pour éviter les requêtes multiples (problème N+1).

## 5. État d'avancement
| Tâche | État |
|---|---|
| CRUD cours (API + scoping formateur/admin) | ✅ Terminé |
| CRUD modules et leçons | ✅ Terminé |
| Relations Eloquent (cours → modules → leçons) | ✅ Terminé |
| Interfaces Vue (Mes cours, gestion du contenu) | ✅ Terminé |
| Intercepteurs Axios 401/403 | ✅ Terminé |
| Autorisation par Gates (remplace le rôle en dur) | ✅ Terminé |
| Validation des formateurs par l'admin (is_approved) | ✅ Terminé |
| Documentation sécurité du jeton (XSS) | ✅ Terminé |
| Tests manuels des parcours (admin / formateur / étudiant) | ✅ Terminé |

## 6. Prochaine semaine
Côté étudiant : catalogue des cours publiés, inscription à un cours, et consultation du contenu (texte, vidéo, PDF) des leçons des cours suivis.

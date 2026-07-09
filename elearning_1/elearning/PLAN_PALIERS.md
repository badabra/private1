# Plateforme E-Learning — Laravel + Vue.js
## Plan de réalisation en 6 étapes hebdomadaires (Sujet 13)

> Les étapes marquées ✅ sont réalisées. Le découpage suit les semaines de suivi et les propositions du professeur.
> Chaque semaine doit être accompagnée : d'un rapport hebdomadaire, de captures d'écran du travail effectué, et d'une courte vidéo de démonstration (demande du professeur, 22 juin).

| Semaine | Contenu | Livrables |
|---|---|---|
| S1 ✅ | Conception (MCD/MLD), setup Laravel + Vue, migrations BD (9 tables), authentification Sanctum + rôles (étudiant / formateur / admin). Améliorations après retours du prof : Gates Laravel, validation formateur (is_approved), documentation sécurité du jeton | Rapport S1, code sur GitHub, schéma BD |
| S2 ✅ | CRUD sécurisé formateur (cours / modules / leçons), relations Eloquent (cours → modules → leçons), gestion des erreurs API 401/403 côté Vue (intercepteurs Axios), séparation supervision admin / création formateur | Rapport S2, vidéo de démonstration, captures d'écran |
| S3 | Côté étudiant : catalogue des cours publiés, inscription à un cours, consultation du contenu des leçons (texte, vidéo, PDF), suivi de progression par leçon | Rapport S3, vidéo, captures |
| S4 | Module quiz : création de QCM par le formateur, passage du quiz par l'étudiant, correction automatique, enregistrement du score | Rapport S4, vidéo, captures |
| S5 | Tableaux de bord personnalisés : progression de l'étudiant, résultats et notes consultés par le formateur, vue d'ensemble pour l'admin | Rapport S5, vidéo, captures |
| S6 | Compléments : certificats PDF téléchargeables, commentaires sous les leçons. Finalisation : tests, corrections, documentation technique complète (selon le canevas du professeur), déploiement, présentation finale | Rapport final (25-30 pages, canevas prof), vidéo de présentation, code final sur GitHub |

## Contraintes de livraison (toutes les semaines)
- Rapport hebdomadaire (même format que S1 et S2)
- Captures d'écran des fonctionnalités développées dans la semaine
- Courte vidéo de démonstration du travail effectué
- Code poussé sur GitHub (branche par semaine ou par fonctionnalité)

## Architecture
- **Back-end** : Laravel 13 (API REST), Sanctum (auth par jetons), MySQL
- **Front-end** : Vue 3 (Composition API) + Vue Router + Pinia + Axios
- **Auth** : jetons Sanctum, Gates centralisées, Policies pour les actions sensibles

## Modèle de données (9 tables, conçu en S1)
```
users          (id, name, email, password, role, is_approved)
courses        (id, formateur_id→users, titre, description, publie)
modules        (id, course_id→courses, titre, ordre)
lessons        (id, module_id→modules, titre, contenu, type, url_media, ordre)
quizzes        (id, lesson_id→lessons, titre)
questions      (id, quiz_id→quizzes, enonce)
answers        (id, question_id→questions, texte, est_correcte)
enrollments    (id, user_id→users, course_id→courses)
quiz_attempts  (id, user_id→users, quiz_id→quizzes, score, total)
```
Tables prévues pour les semaines suivantes :
```
lesson_progress (id, user_id, lesson_id, complete)         — S3
comments        (id, user_id, lesson_id, contenu)          — S6
```

## Ce qui est implémenté à ce jour (S2)

### Authentification et autorisation (S1 + améliorations)
- Inscription / connexion / déconnexion par jeton Sanctum
- 3 rôles : étudiant, formateur, admin
- Formateur créé "en attente" (is_approved = false), activé par l'admin
- Gates centralisées : acceder-espace-admin, acceder-espace-formateur, creer-contenu
- UserPolicy pour l'action d'approbation
- Sécurité du jeton documentée (SECURITE.md)

### CRUD formateur (S2)
- CourseController : index, store, show, update, destroy
- ModuleController : store, update, destroy
- LessonController : store, update, destroy (types : texte / vidéo / PDF)
- Scoping : un formateur ne gère que ses propres cours
- Suppression en cascade : cours → modules → leçons

### Interfaces Vue (S1 + S2)
- Connexion, inscription, déconnexion
- Tableau de bord adapté au rôle
- Écran d'approbation des formateurs (admin)
- Liste des cours du formateur + création / publication / suppression
- Gestion du contenu d'un cours (modules + leçons)
- Intercepteurs Axios : redirection automatique sur 401 et 403

# Installation du back-end (Palier 1 — version améliorée)

## Prérequis
PHP >= 8.2, Composer, MySQL/MariaDB, Node 18+

## Étapes
```bash
# 1. Créer le projet Laravel
composer create-project laravel/laravel elearning-api
cd elearning-api

# 2. Installer Sanctum (API tokens)
php artisan install:api

# 3. Copier les fichiers de ce dossier backend/ dans le projet :
#    - database/migrations/*       (remplacer la migration users par défaut)
#    - app/Models/*
#    - app/Http/Controllers/AuthController.php
#    - app/Http/Controllers/AdminController.php
#    - app/Http/Controllers/CourseController.php
#    - app/Http/Controllers/ModuleController.php
#    - app/Http/Controllers/LessonController.php
#    - app/Http/Middleware/EnsureRole.php   (conservé mais obsolète, voir ci-dessous)
#    - app/Providers/AppServiceProvider.php  (définit les Gates)
#    - app/Policies/UserPolicy.php
#    - routes/api.php
#    - database/seeders/DatabaseSeeder.php

# 4. Autorisation : RIEN à enregistrer dans bootstrap/app.php.
#    L'autorisation passe désormais par des Gates (définies dans AppServiceProvider)
#    et le middleware natif "can:". L'ancien alias "role" => EnsureRole n'est PLUS
#    nécessaire (le middleware EnsureRole est conservé seulement pour référence).

# 5. Configurer .env
#    DB_CONNECTION=mysql
#    DB_DATABASE=elearning  DB_USERNAME=root  DB_PASSWORD=
#    SESSION_DRIVER=file

# 6. Base de données + comptes de démo
php artisan migrate:fresh --seed   # migrate:fresh car la table users a une nouvelle colonne

# 7. Lancer
php artisan serve   # http://127.0.0.1:8000
```

## Comptes de démonstration
| Rôle | Email | Mot de passe | État |
|---|---|---|---|
| Admin | admin@elearning.test | Admin1234! | actif |
| Formateur | formateur@elearning.test | Form1234! | approuvé |
| Formateur | formateur2@elearning.test | Form1234! | EN ATTENTE |
| Étudiant | etudiant@elearning.test | Etud1234! | actif |

## Tests rapides (curl)
```bash
# Connexion admin -> récupérer le token
curl -X POST http://127.0.0.1:8000/api/login -H "Content-Type: application/json" \
  -d '{"email":"admin@elearning.test","password":"Admin1234!"}'

# Lister les formateurs en attente (zone admin protégée par Gate)
curl http://127.0.0.1:8000/api/admin/formateurs-en-attente -H "Authorization: Bearer <TOKEN>"

# Approuver le formateur en attente (id 3 d'après le seeder)
curl -X POST http://127.0.0.1:8000/api/admin/formateurs/3/approuver -H "Authorization: Bearer <TOKEN>"
```

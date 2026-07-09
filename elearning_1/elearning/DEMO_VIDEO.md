# Script de démonstration vidéo

Ce script liste, dans l'ordre, quoi montrer à l'écran pour démontrer chaque point
demandé par le professeur. Chaque section dit quel compte utiliser et ce qu'on prouve.

**Avant de filmer :** lancer le back-end (`php artisan serve`) et le front
(`npm run dev`), et avoir fait `php artisan migrate:fresh --seed` au moins une fois.

Comptes de démonstration :
| Rôle | Email | Mot de passe | État |
|---|---|---|---|
| Admin | admin@elearning.test | Admin1234! | actif |
| Formateur | formateur@elearning.test | Form1234! | approuvé |
| Formateur | formateur2@elearning.test | Form1234! | EN ATTENTE |
| Étudiant | etudiant@elearning.test | Etud1234! | actif |

---

## 1. Authentification et rôles (rappel semaine 1)
1. Aller sur la page de connexion, se connecter en **étudiant** → on arrive sur le tableau de bord, le rôle affiché est « etudiant ».
2. Se déconnecter, se connecter en **formateur approuvé** → le tableau de bord affiche un lien « Gérer mes cours ».
> Prouve : connexion par jeton et affichage adapté au rôle.

## 2. CRUD sécurisé : création d'un cours par un formateur
*(Connecté en `formateur@elearning.test`)*
1. Cliquer sur « Mes cours ».
2. Créer un cours (titre + description) → il apparaît dans la liste, badge « Brouillon ».
3. Cliquer « Publier » → le badge passe à « Publié ».
4. Cliquer « Gérer le contenu ».
5. Ajouter un **module** (ex : « Introduction »).
6. Dans ce module, ajouter une **leçon** : choisir le type (Texte / Vidéo / PDF) dans le menu déroulant, saisir le titre, valider.
7. Ajouter une 2ᵉ leçon d'un autre type pour montrer la variété.
> Prouve : les premières routes CRUD sécurisées et la relation Cours → Modules → Leçons.

## 3. Relations Eloquent (Cours → Modules → Leçons)
1. Toujours sur la page du cours, montrer qu'un cours contient plusieurs modules, et qu'un module contient plusieurs leçons.
2. Supprimer un module → montrer que ses leçons disparaissent aussi (suppression en cascade).
> Prouve : les relations Eloquent et la cascade de suppression.

## 4. Validation des formateurs par l'administrateur
1. Se déconnecter, se connecter en **`formateur2@elearning.test`** (en attente).
2. Le tableau de bord affiche le message **« Compte en attente d'approbation »**, et il n'y a pas de lien « Mes cours ».
3. Se déconnecter, se connecter en **admin**.
4. Cliquer sur « Approbations » → la liste montre « Formateur En Attente ».
5. Cliquer **« Approuver »** → le formateur disparaît de la liste (il est maintenant actif).
6. Se reconnecter en `formateur2@elearning.test` → le message « en attente » a disparu, le lien « Mes cours » est apparu.
> Prouve : la validation/activation des comptes formateur par l'admin (colonne `is_approved`).

## 5. Gestion des erreurs API 401/403 côté Vue (intercepteurs Axios)
**Démonstration du 403 (non autorisé) — la plus simple à filmer :**
1. Se connecter en `formateur2@elearning.test` AVANT de l'approuver (ou recréer un formateur en attente).
2. Dans la barre d'adresse, taper manuellement l'URL `/cours`.
3. Comme ce formateur n'est pas approuvé, l'API renvoie 403 et **l'utilisateur est automatiquement redirigé vers le tableau de bord** (au lieu d'une page d'erreur).

**Démonstration du 401 (jeton invalide/expiré) :**
1. Être connecté (n'importe quel compte), ouvrir les outils de développement (F12) → onglet Application → Local Storage.
2. Modifier ou supprimer la valeur `token`.
3. Déclencher une action qui appelle l'API (ex : recharger « Mes cours ») → l'API renvoie 401 et **on est renvoyé vers la page de connexion**, le localStorage est nettoyé.
> Prouve : les intercepteurs Axios qui redirigent selon 401 / 403.

---

## Points à dire à l'oral pendant la vidéo
- Architecture **découplée** : API Laravel (port 8000) + SPA Vue (port 5173).
- **Autorisation par Gates** (et non des rôles codés en dur) : un seul endroit définit qui peut quoi.
- Le projet suit le **modèle en V** : à chaque niveau de conception correspond un niveau de test (voir rapport semaine 2).
- Le rapport final suivra le **canevas** fourni (sommaire : introduction, cahier des charges, présentation du cadre, etc.).

# Sécurité — Stockage du jeton d'authentification

Ce document répond à la remarque sur le stockage du jeton (token) Sanctum côté Vue.js.

## Où le jeton est-il stocké ?

À la connexion, l'API renvoie un jeton Sanctum. Côté front-end, ce jeton est conservé
dans le **localStorage** du navigateur, puis réinjecté automatiquement dans l'en-tête
`Authorization: Bearer <token>` de chaque requête, via un intercepteur Axios
(voir `frontend/src/api.js`).

## Limite connue : vulnérabilité au XSS

Le localStorage est accessible par n'importe quel code JavaScript exécuté sur la page.
En cas de faille **XSS** (injection de script malveillant), un attaquant pourrait lire
le jeton et usurper la session de l'utilisateur.

## Choix retenu pour ce projet

Le localStorage est conservé pour ce projet, pour les raisons suivantes :

- L'architecture est **découplée** : le front-end (Vue, port 5173) et le back-end
  (Laravel, port 8000) sont deux serveurs distincts. Le schéma par jeton est simple
  et adapté à ce cas.
- Dans un contexte de projet étudiant, c'est une approche courante et acceptée.
- Les bonnes pratiques de base limitent déjà le risque XSS : Vue échappe le contenu
  par défaut, et aucune donnée utilisateur n'est injectée en HTML brut.

## Alternative plus sûre (piste d'amélioration)

Pour une sécurité maximale, on utiliserait des **cookies HttpOnly** : le jeton est
alors stocké dans un cookie que JavaScript ne peut pas lire, ce qui neutralise le vol
de jeton par XSS. Cela implique en contrepartie une configuration plus lourde
(Sanctum en mode SPA, gestion du jeton CSRF, cookies de session), qui n'a pas été
retenue à ce stade mais reste envisageable pour une mise en production.

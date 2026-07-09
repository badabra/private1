# Notes brouillon — Semaine 3 (à RÉÉCRIRE avec mes propres mots)

> ⚠️ Ce fichier n'est PAS le rapport. Ce sont des notes pour m'aider à remplir
> `rapport_semaine_3.md`. Je dois tout reformuler avec mes mots (le prof interdit
> le contenu généré par IA dans les rapports). Supprimer ce fichier après.

## 2. Travail réalisé (idées à développer)
- J'ai construit le **côté étudiant** de la plateforme.
- **Catalogue** : une page qui montre seulement les cours **publiés** par les formateurs.
  Pour chaque cours : titre, description, nom du formateur, nombre de modules, et un
  bouton « S'inscrire ». Un badge « Inscrit » apparaît si je suis déjà inscrit.
- **Inscription** : quand l'étudiant clique « S'inscrire », on enregistre une ligne dans
  la table `enrollments` (le lien entre un étudiant et un cours). On empêche de s'inscrire
  deux fois au même cours.
- **Inscription libre** : l'étudiant s'inscrit tout seul à n'importe quel cours **publié**.
  Le seul « filtre », c'est le formateur qui décide de publier ou non son cours (les cours
  en brouillon n'apparaissent pas dans le catalogue). Ni le formateur ni l'admin ne valident
  les inscriptions (modèle ouvert, comme Udemy/Coursera).
- **Consultation des leçons** : une fois inscrit, l'étudiant ouvre le cours et voit les
  modules et leurs leçons. Le contenu s'affiche **directement dans la page** selon le
  **type** : le texte est affiché, la vidéo est jouée dans un lecteur intégré, et le PDF
  est affiché en aperçu (voir plus bas le détail sur les médias).
- **Suivi de progression** : chaque leçon a une **case à cocher**. Quand je coche, on
  enregistre l'état dans une **nouvelle table** `lesson_progress`. Une **barre de
  progression** montre combien de leçons sont terminées (par exemple 1 sur 4).
- **Sécurité** : j'ai ajouté une « Gate » `acceder-espace-etudiant` pour que seules les
  personnes ayant le rôle étudiant accèdent à ces pages. Le contenu d'un cours n'est
  visible que si on est **inscrit** (sinon le serveur répond une erreur 403).
- J'ai ajouté un **cours de démonstration** dans le seeder (« Introduction au web ») pour
  pouvoir tester tout de suite sans devoir tout créer à la main.
- **Affichage des médias dans la page** : au lieu d'un simple lien, la vidéo YouTube et le
  PDF s'affichent maintenant **directement** dans la leçon (lecteur vidéo intégré, aperçu
  du PDF). Le texte s'affiche aussi directement.
- **Téléversement de fichiers** : le formateur peut soit coller un lien (YouTube, PDF en
  ligne), soit **téléverser un fichier** (PDF ou vidéo) depuis son ordinateur. Le fichier
  est enregistré sur le serveur (dossier `storage`) et l'étudiant peut le voir dans la page.

## 3. Retour d'expérience (ce que j'ai appris)
- Comment relier deux tables avec une table de liaison (`enrollments`) et éviter les
  doublons grâce à une contrainte « unique ».
- Comment créer une nouvelle table avec une migration (`lesson_progress`) et l'utiliser
  avec `updateOrCreate` (crée la ligne la première fois, la met à jour ensuite).
- Mieux compris les **Gates** de Laravel pour gérer les permissions par rôle sans écrire
  le rôle « en dur » dans les contrôleurs (comme le prof l'avait demandé).
- Côté Vue, j'ai réutilisé ce que j'avais appris en semaine 2 : appels à l'API avec axios,
  affichage de listes avec `v-for`, et protection des pages selon le rôle.
- Comment **téléverser un fichier** vers le serveur (Laravel `store()` dans le dossier
  `storage`) et le rendre visible avec `php artisan storage:link`.
- La différence entre **afficher un lien** et **intégrer** un média dans la page (iframe
  pour YouTube et le PDF, balise `<video>` pour un fichier vidéo).

## 4. Difficultés rencontrées
- Le projet exécutable avait été supprimé, puis ré-extrait dans une **version plus
  ancienne** (avant les Gates). Le code n'était plus à jour.
- Un petit piège dans la configuration : `SESSION_DRIVER` mal écrit (`filet`) et la
  mauvaise base de données dans le fichier `.env`.
- Réfléchir à « qui a le droit de voir quoi » : un étudiant **non inscrit** ne doit pas
  pouvoir voir le contenu d'un cours.

## 5. Solutions apportées
- J'ai recopié tout le code à jour dans le projet exécutable et vérifié que les routes
  étaient bonnes avec `php artisan route:list`.
- J'ai corrigé le `.env` (`SESSION_DRIVER=file`, `DB_DATABASE=elearning`) puis relancé
  la base avec `php artisan migrate:fresh --seed`.
- J'ai ajouté une **vérification d'inscription côté serveur** (une petite fonction qui
  renvoie une erreur 403 si l'étudiant n'est pas inscrit).
- J'ai testé tout le parcours (inscription → leçons → progression) et aussi les cas
  d'erreur (403 quand on n'a pas le droit).
- Pour les médias, j'ai testé l'affichage intégré dans le navigateur (la vidéo YouTube se
  lit dans la page) et l'upload d'un fichier PDF (le fichier est bien enregistré et
  affiché à l'étudiant).

## 7. Captures d'écran à prendre
- Le **catalogue** avec le cours publié « Introduction au web » (+ badge « Inscrit »).
- La **page du cours** avec les modules, les leçons et les cases à cocher.
- La **vidéo intégrée** (lecteur YouTube) et l'**aperçu PDF** dans une leçon.
- Le **formulaire formateur** avec le champ pour téléverser un fichier (PDF / vidéo).
- La **barre de progression** (par exemple 1 / 4 leçons complétées).
- (optionnel) Ce qui se passe quand on n'est pas autorisé (redirection / message).

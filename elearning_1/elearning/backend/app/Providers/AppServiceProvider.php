<?php
namespace App\Providers;

use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // --- Amélioration Palier 1 : autorisation par Gates (au lieu de rôles codés en dur) ---
        //
        // Le professeur déconseillait de comparer les rôles directement dans le middleware
        // (ex: if ($user->role === 'admin')). On centralise donc ici, en un seul endroit,
        // la correspondance entre rôle et capacité. Les routes utilisent ensuite le
        // middleware natif "can:" de Laravel. Ajouter un rôle = modifier seulement ce fichier.

        // Accès à la zone d'administration (gestion des comptes, approbations, etc.)
        Gate::define('acceder-espace-admin', fn (User $u) => $u->role === 'admin');

        // Accès à la zone formateur : réservé aux formateurs APPROUVÉS (ou aux admins,
        // pour la supervision en lecture/modération).
        // Un formateur non approuvé est connecté mais n'a pas accès à ces fonctionnalités.
        Gate::define('acceder-espace-formateur', fn (User $u) =>
            $u->role === 'admin' || ($u->role === 'formateur' && $u->is_approved)
        );

        // Création de contenu pédagogique (cours, modules, leçons) : réservée au
        // formateur approuvé uniquement. L'admin supervise (lecture, modération),
        // mais ne crée pas de contenu à la place d'un formateur.
        Gate::define('creer-contenu', fn (User $u) =>
            $u->role === 'formateur' && $u->is_approved
        );

        // Accès à l'espace étudiant (semaine 3) : catalogue, inscription, suivi des
        // leçons. Réservé au rôle "etudiant". Les formateurs et admins ont leur propre
        // espace ; ils ne s'inscrivent pas aux cours.
        Gate::define('acceder-espace-etudiant', fn (User $u) => $u->role === 'etudiant');

        // Policy liée au modèle User : sert pour l'action concrète "approuver un formateur".
        Gate::policy(User::class, UserPolicy::class);
    }
}

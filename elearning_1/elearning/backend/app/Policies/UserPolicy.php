<?php
namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Seul un administrateur peut approuver un compte, et uniquement
     * s'il s'agit d'un compte formateur en attente.
     *
     * Démontre l'usage des Policies de Laravel (autorisation liée à un modèle),
     * comme suggéré par le professeur, en complément des Gates.
     */
    public function approve(User $auteur, User $cible): bool
    {
        return $auteur->role === 'admin'
            && $cible->role === 'formateur'
            && !$cible->is_approved;
    }
}

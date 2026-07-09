<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * OBSOLÈTE (Palier 1 — amélioration).
 *
 * Ce middleware comparait les rôles en dur (in_array($user->role, $roles)).
 * Suite à la remarque du professeur, il a été REMPLACÉ par des Gates Laravel
 * définies dans App\Providers\AppServiceProvider, utilisées via le middleware
 * natif "can:". Ce fichier est conservé à titre de référence mais n'est plus
 * branché sur aucune route.
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, $roles, true)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }
        return $next($request);
    }
}

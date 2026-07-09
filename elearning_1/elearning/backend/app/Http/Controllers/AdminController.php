<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    use AuthorizesRequests;

    // GET /api/admin/formateurs-en-attente
    // Liste les comptes formateur qui attendent l'approbation de l'admin.
    public function pending(Request $request)
    {
        $formateurs = User::where('role', 'formateur')
            ->where('is_approved', false)
            ->orderBy('created_at')
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json($formateurs);
    }

    // POST /api/admin/formateurs/{user}/approuver
    // Approuve un compte formateur. L'autorisation passe par la UserPolicy.
    public function approve(Request $request, User $user)
    {
        $this->authorize('approve', $user); // -> UserPolicy@approve

        $user->update(['is_approved' => true]);

        return response()->json([
            'message' => "Le compte de {$user->name} a été approuvé.",
            'user'    => $user->only(['id', 'name', 'email', 'is_approved']),
        ]);
    }
}

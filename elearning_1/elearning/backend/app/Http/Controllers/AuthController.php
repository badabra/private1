<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'sometimes|in:etudiant,formateur', // admin créé via seeder uniquement
        ]);

        $role = $data['role'] ?? 'etudiant';

        // Amélioration Palier 1 : un formateur doit être approuvé par un admin.
        // Les étudiants sont actifs immédiatement ; les formateurs démarrent "en attente".
        $isApproved = $role !== 'formateur';

        $user = User::create([
            'name'        => $data['name'],
            'email'       => $data['email'],
            'password'    => Hash::make($data['password']),
            'role'        => $role,
            'is_approved' => $isApproved,
        ]);

        $token = $user->createToken('auth')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        $token = $user->createToken('auth')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    // POST /api/logout (auth:sanctum)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }

    // GET /api/me (auth:sanctum)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

<?php
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use Illuminate\Support\Facades\Route;

// --- Routes publiques ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Routes authentifiées (jeton Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Zone admin : Gate "acceder-espace-admin" (middleware natif "can:").
    Route::middleware('can:acceder-espace-admin')->prefix('admin')->group(function () {
        Route::get('/formateurs-en-attente', [AdminController::class, 'pending']);
        Route::post('/formateurs/{user}/approuver', [AdminController::class, 'approve']);
    });

    // Zone formateur : Gate "acceder-espace-formateur" (formateur approuvé OU admin
    // pour la supervision en lecture/modération).
    Route::middleware('can:acceder-espace-formateur')->prefix('formateur')->group(function () {
        Route::get('/courses', [CourseController::class, 'index']);
        Route::get('/courses/{course}', [CourseController::class, 'show']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
        Route::put('/modules/{module}', [ModuleController::class, 'update']);
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);
        Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);

        // Création de contenu : Gate "creer-contenu" (formateur approuvé UNIQUEMENT,
        // l'admin ne crée pas de contenu à la place d'un formateur).
        Route::middleware('can:creer-contenu')->group(function () {
            Route::post('/courses', [CourseController::class, 'store']);
            Route::post('/courses/{course}/modules', [ModuleController::class, 'store']);
            Route::post('/modules/{module}/lessons', [LessonController::class, 'store']);
        });
    });

    // Zone étudiant (semaine 3) : Gate "acceder-espace-etudiant" (rôle étudiant).
    Route::middleware('can:acceder-espace-etudiant')->prefix('etudiant')->group(function () {
        Route::get('/courses', [EtudiantController::class, 'catalogue']);
        Route::get('/mes-cours', [EtudiantController::class, 'mesCours']);
        Route::get('/courses/{course}', [EtudiantController::class, 'contenu']);
        Route::post('/courses/{course}/inscription', [EtudiantController::class, 'inscrire']);
        Route::delete('/courses/{course}/inscription', [EtudiantController::class, 'desinscrire']);
        Route::post('/lessons/{lesson}/progression', [EtudiantController::class, 'marquerProgression']);
    });
});

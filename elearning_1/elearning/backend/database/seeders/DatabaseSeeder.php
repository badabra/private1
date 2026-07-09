<?php
namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@elearning.test'],
            ['name' => 'Admin', 'password' => Hash::make('Admin1234!'), 'role' => 'admin', 'is_approved' => true]
        );

        // Formateur déjà approuvé (pour tester la connexion formateur normale)
        $formateur = User::firstOrCreate(
            ['email' => 'formateur@elearning.test'],
            ['name' => 'Formateur Demo', 'password' => Hash::make('Form1234!'), 'role' => 'formateur', 'is_approved' => true]
        );

        // Formateur EN ATTENTE (pour démontrer l'approbation par l'admin)
        User::firstOrCreate(
            ['email' => 'formateur2@elearning.test'],
            ['name' => 'Formateur En Attente', 'password' => Hash::make('Form1234!'), 'role' => 'formateur', 'is_approved' => false]
        );

        User::firstOrCreate(
            ['email' => 'etudiant@elearning.test'],
            ['name' => 'Etudiant Demo', 'password' => Hash::make('Etud1234!'), 'role' => 'etudiant', 'is_approved' => true]
        );

        // --- Cours de démonstration PUBLIÉ (semaine 3) ---
        // Permet de montrer le catalogue étudiant, l'inscription et le suivi de leçons
        // sans avoir à tout recréer à la main avant chaque démo.
        if (Course::where('titre', 'Introduction au web')->doesntExist()) {
            $cours = Course::create([
                'formateur_id' => $formateur->id,
                'titre'        => 'Introduction au web',
                'description'  => 'Les bases du HTML, CSS et JavaScript pour débuter.',
                'publie'       => true,
            ]);

            $module1 = $cours->modules()->create(['titre' => 'HTML et CSS', 'ordre' => 1]);
            $module1->lessons()->create([
                'titre' => 'Structure d\'une page HTML', 'type' => 'texte', 'ordre' => 1,
                'contenu' => 'Une page HTML est composée de balises : <html>, <head> et <body>.',
            ]);
            $module1->lessons()->create([
                'titre' => 'Mettre en forme avec CSS', 'type' => 'texte', 'ordre' => 2,
                'contenu' => 'Le CSS sert à colorer, positionner et styliser les éléments HTML.',
            ]);

            $module2 = $cours->modules()->create(['titre' => 'JavaScript', 'ordre' => 2]);
            $module2->lessons()->create([
                'titre' => 'Les variables', 'type' => 'texte', 'ordre' => 1,
                'contenu' => 'On déclare une variable avec let ou const.',
            ]);
            $module2->lessons()->create([
                'titre' => 'Vidéo : premier script', 'type' => 'video', 'ordre' => 2,
                'contenu' => 'Une courte démonstration en vidéo.',
                'url_media' => 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            ]);
        }
    }
}

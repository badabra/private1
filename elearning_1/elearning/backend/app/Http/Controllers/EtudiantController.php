<?php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

// Espace étudiant (semaine 3) : catalogue des cours publiés, inscription,
// consultation des leçons et suivi de progression.
// Toutes ces routes passent par la Gate "acceder-espace-etudiant" (voir api.php).
class EtudiantController extends Controller
{
    // GET /api/etudiant/courses — catalogue : uniquement les cours publiés.
    public function catalogue(Request $request)
    {
        $user = $request->user();

        // Les cours déjà suivis par l'étudiant (pour afficher un badge "Inscrit").
        $inscrits = $user->enrollments()->pluck('course_id')->all();

        $courses = Course::where('publie', true)
            ->with('formateur:id,name')
            ->withCount('modules')
            ->latest()
            ->get();

        // On ajoute un booléen "est_inscrit" à chaque cours (calculé côté serveur).
        $courses->each(function ($course) use ($inscrits) {
            $course->est_inscrit = in_array($course->id, $inscrits);
        });

        return response()->json($courses);
    }

    // POST /api/etudiant/courses/{course}/inscription — s'inscrire à un cours publié.
    public function inscrire(Request $request, Course $course)
    {
        if (!$course->publie) {
            abort(404, "Ce cours n'est pas disponible.");
        }

        // firstOrCreate évite les doublons (la table a aussi une contrainte unique).
        Enrollment::firstOrCreate([
            'user_id'   => $request->user()->id,
            'course_id' => $course->id,
        ]);

        return response()->json(['message' => 'Inscription enregistrée.'], 201);
    }

    // DELETE /api/etudiant/courses/{course}/inscription — se désinscrire.
    public function desinscrire(Request $request, Course $course)
    {
        $request->user()->enrollments()->where('course_id', $course->id)->delete();
        return response()->json(['message' => 'Désinscription effectuée.']);
    }

    // GET /api/etudiant/mes-cours — cours suivis + progression (x/y leçons complétées).
    public function mesCours(Request $request)
    {
        $user = $request->user();

        $courses = Course::whereIn('id', $user->enrollments()->pluck('course_id'))
            ->with('modules.lessons')
            ->get();

        // Identifiants des leçons déjà marquées "complète" par cet étudiant.
        $lecons_faites = $user->lessonProgress()->where('complete', true)->pluck('lesson_id')->all();

        // Pour chaque cours : nombre de leçons totales et nombre de leçons complétées.
        $resultat = $courses->map(function ($course) use ($lecons_faites) {
            $total = 0;
            $faites = 0;
            foreach ($course->modules as $module) {
                foreach ($module->lessons as $lesson) {
                    $total++;
                    if (in_array($lesson->id, $lecons_faites)) $faites++;
                }
            }
            return [
                'id'          => $course->id,
                'titre'       => $course->titre,
                'description' => $course->description,
                'total'       => $total,
                'faites'      => $faites,
            ];
        });

        return response()->json($resultat);
    }

    // GET /api/etudiant/courses/{course} — contenu du cours (modules + leçons).
    // Réservé aux étudiants inscrits à ce cours.
    public function contenu(Request $request, Course $course)
    {
        if (!$course->publie) {
            abort(404, "Ce cours n'est pas disponible.");
        }
        $this->verifierInscription($request, $course);

        $course->load('modules.lessons', 'formateur:id,name');

        // Leçons déjà complétées : renvoyées comme simple liste d'identifiants,
        // le front coche les cases correspondantes.
        $lecons_faites = $request->user()->lessonProgress()
            ->where('complete', true)
            ->pluck('lesson_id');

        return response()->json([
            'course'        => $course,
            'lecons_faites' => $lecons_faites,
        ]);
    }

    // POST /api/etudiant/lessons/{lesson}/progression — marquer une leçon complétée ou non.
    public function marquerProgression(Request $request, Lesson $lesson)
    {
        $data = $request->validate([
            'complete' => 'required|boolean',
        ]);

        // La leçon appartient à un cours : l'étudiant doit y être inscrit.
        $course = $lesson->module->course;
        $this->verifierInscription($request, $course);

        // updateOrCreate : crée la ligne au premier clic, la met à jour ensuite.
        LessonProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'lesson_id' => $lesson->id],
            ['complete' => $data['complete']]
        );

        return response()->json(['message' => 'Progression enregistrée.']);
    }

    // Vérifie que l'étudiant connecté est bien inscrit au cours (sinon 403).
    private function verifierInscription(Request $request, Course $course): void
    {
        $inscrit = $request->user()->enrollments()->where('course_id', $course->id)->exists();
        if (!$inscrit) {
            abort(403, "Vous n'êtes pas inscrit à ce cours.");
        }
    }
}

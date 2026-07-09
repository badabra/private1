<?php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    // POST /api/formateur/modules/{module}/lessons
    public function store(Request $request, Module $module)
    {
        $this->authorizeModule($request, $module);

        $data = $request->validate([
            'titre'     => 'required|string|max:255',
            'contenu'   => 'nullable|string',
            'type'      => 'sometimes|in:texte,video,pdf',
            'url_media' => 'nullable|string|max:255',
            'ordre'     => 'sometimes|integer|min:0',
            // Fichier téléversé (optionnel) : PDF ou vidéo. Max 100 Mo.
            'fichier'   => 'nullable|file|mimes:pdf,mp4,webm,ogg|max:102400',
        ]);

        $lesson = $module->lessons()->create([
            'titre'     => $data['titre'],
            'contenu'   => $data['contenu'] ?? null,
            'type'      => $data['type'] ?? 'texte',
            // Si un fichier est envoyé, il est stocké et prioritaire sur l'URL.
            'url_media' => $this->resoudreMedia($request, $data['url_media'] ?? null),
            'ordre'     => $data['ordre'] ?? ((int) $module->lessons()->max('ordre') + 1),
        ]);

        return response()->json($lesson, 201);
    }

    // PUT /api/formateur/lessons/{lesson}
    public function update(Request $request, Lesson $lesson)
    {
        $this->authorizeModule($request, $lesson->module);

        $data = $request->validate([
            'titre'     => 'sometimes|string|max:255',
            'contenu'   => 'nullable|string',
            'type'      => 'sometimes|in:texte,video,pdf',
            'url_media' => 'nullable|string|max:255',
            'ordre'     => 'sometimes|integer|min:0',
            'fichier'   => 'nullable|file|mimes:pdf,mp4,webm,ogg|max:102400',
        ]);

        // Si un nouveau fichier est envoyé, il remplace l'URL existante.
        if ($request->hasFile('fichier')) {
            $data['url_media'] = $this->resoudreMedia($request, $data['url_media'] ?? null);
        }
        unset($data['fichier']); // "fichier" n'est pas une colonne de la table

        $lesson->update($data);
        return response()->json($lesson);
    }

    // DELETE /api/formateur/lessons/{lesson}
    public function destroy(Request $request, Lesson $lesson)
    {
        $this->authorizeModule($request, $lesson->module);
        $lesson->delete();
        return response()->json(['message' => 'Leçon supprimée.']);
    }

    private function authorizeModule(Request $request, Module $module): void
    {
        $user = $request->user();
        $course = $module->course;
        if ($user->role !== 'admin' && $course->formateur_id !== $user->id) {
            abort(403, "Vous ne gérez pas ce cours.");
        }
    }

    /**
     * Détermine l'URL du média d'une leçon.
     * - Si un fichier est téléversé : on le stocke dans storage/app/public/lessons
     *   et on renvoie son chemin public (ex: /storage/lessons/xxxx.pdf).
     * - Sinon : on garde l'URL fournie (lien YouTube, PDF en ligne, etc.).
     * Le fichier stocké est accessible grâce à "php artisan storage:link".
     */
    private function resoudreMedia(Request $request, ?string $url): ?string
    {
        if ($request->hasFile('fichier')) {
            $chemin = $request->file('fichier')->store('lessons', 'public');
            return '/storage/' . $chemin;
        }
        return $url;
    }
}

<?php
namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // GET /api/formateur/courses — mes cours (admin : tous les cours)
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Course::with('modules.lessons')->latest();
        if ($user->role !== 'admin') {
            $query->where('formateur_id', $user->id);
        }
        return response()->json($query->get());
    }

    // POST /api/formateur/courses
    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'publie'      => 'sometimes|boolean',
        ]);

        $course = Course::create([
            'formateur_id' => $request->user()->id,
            'titre'        => $data['titre'],
            'description'  => $data['description'] ?? null,
            'publie'       => $data['publie'] ?? false,
        ]);

        return response()->json($course, 201);
    }

    // GET /api/formateur/courses/{course}
    public function show(Request $request, Course $course)
    {
        $this->authorizeOwner($request, $course);
        return response()->json($course->load('modules.lessons'));
    }

    // PUT /api/formateur/courses/{course}
    public function update(Request $request, Course $course)
    {
        $this->authorizeOwner($request, $course);

        $data = $request->validate([
            'titre'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'publie'      => 'sometimes|boolean',
        ]);

        $course->update($data);
        return response()->json($course);
    }

    // DELETE /api/formateur/courses/{course}
    public function destroy(Request $request, Course $course)
    {
        $this->authorizeOwner($request, $course);
        $course->delete(); // cascade : modules + leçons supprimés (FK cascadeOnDelete)
        return response()->json(['message' => 'Cours supprimé.']);
    }

    /**
     * Un formateur ne gère que ses propres cours ; l'admin gère tout.
     */
    private function authorizeOwner(Request $request, Course $course): void
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $course->formateur_id !== $user->id) {
            abort(403, "Vous ne gérez pas ce cours.");
        }
    }
}

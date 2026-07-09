<?php
namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    // POST /api/formateur/courses/{course}/modules
    public function store(Request $request, Course $course)
    {
        $this->authorizeCourse($request, $course);

        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'ordre' => 'sometimes|integer|min:0',
        ]);

        $module = $course->modules()->create([
            'titre' => $data['titre'],
            'ordre' => $data['ordre'] ?? ((int) $course->modules()->max('ordre') + 1),
        ]);

        return response()->json($module, 201);
    }

    // PUT /api/formateur/modules/{module}
    public function update(Request $request, Module $module)
    {
        $this->authorizeCourse($request, $module->course);

        $data = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'ordre' => 'sometimes|integer|min:0',
        ]);

        $module->update($data);
        return response()->json($module);
    }

    // DELETE /api/formateur/modules/{module}
    public function destroy(Request $request, Module $module)
    {
        $this->authorizeCourse($request, $module->course);
        $module->delete(); // cascade : leçons supprimées
        return response()->json(['message' => 'Module supprimé.']);
    }

    private function authorizeCourse(Request $request, Course $course): void
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $course->formateur_id !== $user->id) {
            abort(403, "Vous ne gérez pas ce cours.");
        }
    }
}

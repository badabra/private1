<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Suivi de progression par leçon (semaine 3).
        // Une ligne par (étudiant, leçon). "complete" = leçon marquée terminée.
        Schema::create('lesson_progress', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $t->boolean('complete')->default(false);
            $t->timestamps();
            // Un étudiant ne peut avoir qu'une seule ligne de progression par leçon.
            $t->unique(['user_id', 'lesson_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('lesson_progress'); }
};

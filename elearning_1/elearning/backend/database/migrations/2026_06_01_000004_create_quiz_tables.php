<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quizzes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $t->string('titre');
            $t->timestamps();
        });
        Schema::create('questions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $t->text('enonce');
            $t->timestamps();
        });
        Schema::create('answers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('question_id')->constrained()->cascadeOnDelete();
            $t->string('texte');
            $t->boolean('est_correcte')->default(false);
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('answers');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('quizzes');
    }
};

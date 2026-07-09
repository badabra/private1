<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('enrollments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('course_id')->constrained()->cascadeOnDelete();
            $t->timestamps();
            $t->unique(['user_id', 'course_id']);
        });
        Schema::create('quiz_attempts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $t->unsignedInteger('score');
            $t->unsignedInteger('total');
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('enrollments');
    }
};

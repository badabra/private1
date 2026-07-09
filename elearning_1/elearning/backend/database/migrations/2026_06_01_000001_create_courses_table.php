<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('courses', function (Blueprint $t) {
            $t->id();
            $t->foreignId('formateur_id')->constrained('users')->cascadeOnDelete();
            $t->string('titre');
            $t->text('description')->nullable();
            $t->boolean('publie')->default(false);
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('courses'); }
};

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('modules', function (Blueprint $t) {
            $t->id();
            $t->foreignId('course_id')->constrained()->cascadeOnDelete();
            $t->string('titre');
            $t->unsignedInteger('ordre')->default(0);
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('modules'); }
};

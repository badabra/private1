<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lessons', function (Blueprint $t) {
            $t->id();
            $t->foreignId('module_id')->constrained()->cascadeOnDelete();
            $t->string('titre');
            $t->longText('contenu')->nullable();
            $t->enum('type', ['texte', 'video', 'pdf'])->default('texte');
            $t->string('url_media')->nullable();
            $t->unsignedInteger('ordre')->default(0);
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('lessons'); }
};

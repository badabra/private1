<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('email')->unique();
            $t->string('password');
            $t->enum('role', ['etudiant', 'formateur', 'admin'])->default('etudiant');
            // Palier 1 (amélioration) : validation des comptes formateur par l'admin.
            // Un formateur qui s'inscrit est "en attente" (false) ; étudiants/admins approuvés (true).
            $t->boolean('is_approved')->default(true);
            $t->rememberToken();
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};

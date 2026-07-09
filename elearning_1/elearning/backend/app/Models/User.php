<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'is_approved'];
    protected $hidden = ['password', 'remember_token'];
    protected $casts = ['password' => 'hashed', 'is_approved' => 'boolean'];

    public function courses() { return $this->hasMany(Course::class, 'formateur_id'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function quizAttempts() { return $this->hasMany(QuizAttempt::class); }
    public function lessonProgress() { return $this->hasMany(LessonProgress::class); }

    public function isFormateur(): bool { return $this->role === 'formateur'; }
    public function isAdmin(): bool { return $this->role === 'admin'; }

    // Un formateur n'est actif que s'il a été approuvé par un admin.
    public function isApproved(): bool { return (bool) $this->is_approved; }
}

<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonProgress extends Model
{
    // Le nom de table par défaut serait "lesson_progresses" : on force le vrai nom.
    protected $table = 'lesson_progress';

    protected $fillable = ['user_id', 'lesson_id', 'complete'];
    protected $casts = ['complete' => 'boolean'];

    public function user() { return $this->belongsTo(User::class); }
    public function lesson() { return $this->belongsTo(Lesson::class); }
}

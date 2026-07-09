<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['lesson_id', 'titre'];

    public function lesson() { return $this->belongsTo(Lesson::class); }
    public function questions() { return $this->hasMany(Question::class); }
    public function attempts() { return $this->hasMany(QuizAttempt::class); }
}

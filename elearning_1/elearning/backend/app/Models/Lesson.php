<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['module_id', 'titre', 'contenu', 'type', 'url_media', 'ordre'];

    public function module() { return $this->belongsTo(Module::class); }
    public function quizzes() { return $this->hasMany(Quiz::class); }
    public function progress() { return $this->hasMany(LessonProgress::class); }
}

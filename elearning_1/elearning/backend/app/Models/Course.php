<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['formateur_id', 'titre', 'description', 'publie'];
    protected $casts = ['publie' => 'boolean'];

    public function formateur() { return $this->belongsTo(User::class, 'formateur_id'); }
    public function modules() { return $this->hasMany(Module::class)->orderBy('ordre'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
}

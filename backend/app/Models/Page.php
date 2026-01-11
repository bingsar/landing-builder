<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'draft_json',
        'published_json',
    ];

    protected $casts = [
        'draft_json' => 'array',
        'published_json' => 'array',
    ];
}

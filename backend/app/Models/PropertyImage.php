<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'path',
        'thumbnail_path',
        'order',
        'alt',
        'size',
        'mime_type',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'size' => 'integer',
        ];
    }

    /**
     * Relations
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Scopes
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'slug',
        'parent_id',
        'latitude',
        'longitude',
        'properties_count',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'properties_count' => 'integer',
        ];
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($location) {
            if (empty($location->slug)) {
                $location->slug = Str::slug($location->name);
            }
        });
    }

    /**
     * Relations
     */
    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Scopes
     */
    public function scopeCities($query)
    {
        return $query->where('type', 'city');
    }

    public function scopeDistricts($query)
    {
        return $query->where('type', 'district');
    }

    public function scopeNeighborhoods($query)
    {
        return $query->where('type', 'neighborhood');
    }

    public function scopeByParent($query, ?int $parentId)
    {
        return $query->where('parent_id', $parentId);
    }
}

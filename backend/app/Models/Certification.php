<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'level',
        'points',
        'transactions_count',
        'average_rating',
        'phone_verified',
        'email_verified',
        'identity_verified',
        'title_verified',
        'response_time_minutes',
        'disputes_count',
        'verified_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'transactions_count' => 'integer',
            'average_rating' => 'decimal:2',
            'phone_verified' => 'boolean',
            'email_verified' => 'boolean',
            'identity_verified' => 'boolean',
            'title_verified' => 'boolean',
            'response_time_minutes' => 'integer',
            'disputes_count' => 'integer',
            'verified_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /**
     * Relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    public function scopeBronze($query)
    {
        return $query->where('level', 'bronze');
    }

    public function scopeSilver($query)
    {
        return $query->where('level', 'silver');
    }

    public function scopeGold($query)
    {
        return $query->where('level', 'gold');
    }

    public function scopeDiamond($query)
    {
        return $query->where('level', 'diamond');
    }

    /**
     * Helpers
     */
    public function calculateLevel(): string
    {
        // Logique de calcul du niveau basée sur les critères
        if ($this->transactions_count >= 20 
            && $this->average_rating >= 4.5 
            && $this->disputes_count === 0
            && $this->response_time_minutes <= 120) {
            return 'diamond';
        }
        
        if ($this->transactions_count >= 5 
            && $this->average_rating >= 4 
            && $this->identity_verified) {
            return 'gold';
        }
        
        if ($this->transactions_count >= 1 
            && $this->average_rating >= 3) {
            return 'silver';
        }
        
        return 'bronze';
    }
}


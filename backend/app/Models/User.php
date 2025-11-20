<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'avatar',
        'bio',
        'is_active',
        'is_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
        ];
    }

    /**
     * Relations
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoriteProperties()
    {
        return $this->belongsToMany(Property::class, 'favorites')
            ->withTimestamps();
    }

    public function savedSearches()
    {
        return $this->hasMany(SavedSearch::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function certification()
    {
        return $this->hasOne(Certification::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAgents($query)
    {
        return $query->where('role', 'agent');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Helpers
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    /**
     * Certification helpers
     */
    public function getCertificationLevelAttribute(): ?string
    {
        return $this->certification?->level ?? null;
    }

    public function hasCertification(): bool
    {
        return $this->certification !== null;
    }

    public function isCertified(): bool
    {
        return $this->hasCertification() && $this->certification->level !== 'bronze';
    }

    public function getCertificationBadgeAttribute(): ?array
    {
        if (!$this->certification) {
            return null;
        }

        $badges = [
            'bronze' => [
                'label' => 'Bronze',
                'icon' => '🥉',
                'color' => '#CD7F32',
                'description' => 'Nouveau membre',
            ],
            'silver' => [
                'label' => 'Argent',
                'icon' => '🥈',
                'color' => '#C0C0C0',
                'description' => 'Membre vérifié',
            ],
            'gold' => [
                'label' => 'Or',
                'icon' => '🥇',
                'color' => '#FFD700',
                'description' => 'Membre confirmé',
            ],
            'diamond' => [
                'label' => 'Diamant',
                'icon' => '💎',
                'color' => '#B9F2FF',
                'description' => 'Membre premium',
            ],
        ];

        return $badges[$this->certification->level] ?? null;
    }
}

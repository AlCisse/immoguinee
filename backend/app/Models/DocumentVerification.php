<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'document_type',
        'document_path',
        'document_number',
        'status',
        'verified_by',
        'verified_at',
        'rejection_reason',
        'notes',
        'verification_data',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'verification_data' => 'array',
        ];
    }

    /**
     * Relations
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'initiator_id',
        'other_party_id',
        'type',
        'reason',
        'description',
        'status',
        'resolution',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
        ];
    }

    /**
     * Relations
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function initiator()
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    public function otherParty()
    {
        return $this->belongsTo(User::class, 'other_party_id');
    }

    public function mediations()
    {
        return $this->hasMany(Mediation::class);
    }

    /**
     * Scopes
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }
}


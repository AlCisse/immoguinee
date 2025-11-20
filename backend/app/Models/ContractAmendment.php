<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractAmendment extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'proposed_by',
        'changes',
        'reason',
        'status',
        'responded_by',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'changes' => 'array',
            'responded_at' => 'datetime',
        ];
    }

    /**
     * Relations
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function proposer()
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }

    public function responder()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mediation extends Model
{
    use HasFactory;

    protected $fillable = [
        'dispute_id',
        'mediator_id',
        'status',
        'assigned_at',
        'started_at',
        'completed_at',
        'proposed_solution',
        'final_resolution',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'notes' => 'array',
        ];
    }

    /**
     * Relations
     */
    public function dispute()
    {
        return $this->belongsTo(Dispute::class);
    }

    public function mediator()
    {
        return $this->belongsTo(User::class, 'mediator_id');
    }
}


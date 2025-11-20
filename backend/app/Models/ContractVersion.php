<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'version_number',
        'content',
        'pdf_path',
        'changelog',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    /**
     * Relations
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}


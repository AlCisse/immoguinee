<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'user_id',
        'signature_type',
        'otp_code',
        'otp_sent_at',
        'otp_expires_at',
        'otp_verified',
        'signed_at',
        'ip_address',
        'user_agent',
        'hash',
        'signature_data',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'otp_sent_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'otp_verified' => 'boolean',
            'signed_at' => 'datetime',
        ];
    }

    /**
     * Relations
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSigned($query)
    {
        return $query->where('status', 'signed');
    }

    /**
     * Helpers
     */
    public function isExpired(): bool
    {
        return $this->otp_expires_at && now()->isAfter($this->otp_expires_at);
    }

    public function isValidOtp(string $code): bool
    {
        return $this->otp_code === $code 
            && !$this->isExpired()
            && $this->status === 'otp_sent';
    }
}


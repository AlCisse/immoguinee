<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'landlord_id',
        'tenant_id',
        'buyer_id',
        'type',
        'status',
        'template_data',
        'pdf_path',
        'signed_pdf_path',
        'sent_at',
        'signed_at',
        'retraction_deadline',
        'retraction_used',
        'version',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'template_data' => 'array',
            'sent_at' => 'datetime',
            'signed_at' => 'datetime',
            'retraction_deadline' => 'datetime',
            'retraction_used' => 'boolean',
            'version' => 'integer',
        ];
    }

    /**
     * Relations
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function signatures()
    {
        return $this->hasMany(Signature::class);
    }

    public function versions()
    {
        return $this->hasMany(ContractVersion::class);
    }

    public function amendments()
    {
        return $this->hasMany(ContractAmendment::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function disputes()
    {
        return $this->hasMany(Dispute::class);
    }

    /**
     * Scopes
     */
    public function scopeLocation($query)
    {
        return $query->where('type', 'location');
    }

    public function scopeSale($query)
    {
        return $query->whereIn('type', ['sale_land', 'sale_property']);
    }

    public function scopeSigned($query)
    {
        return $query->where('status', 'signed');
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', ['draft', 'sent', 'under_review']);
    }

    /**
     * Helpers
     */
    public function isSigned(): bool
    {
        return $this->status === 'signed';
    }

    public function canRetract(): bool
    {
        return !$this->retraction_used 
            && $this->retraction_deadline 
            && now()->isBefore($this->retraction_deadline);
    }

    public function isFullySigned(): bool
    {
        $requiredSignatures = $this->type === 'location' ? 2 : 2; // Propriétaire + Locataire/Acheteur
        return $this->signatures()->where('status', 'signed')->count() >= $requiredSignatures;
    }
}


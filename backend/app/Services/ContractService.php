<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Property;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Support\Str;

class ContractService
{
    /**
     * Générer un contrat de location
     */
    public function generateLocationContract(Property $property, User $landlord, User $tenant, array $data): Contract
    {
        $templateData = [
            'type' => 'location',
            'landlord' => [
                'name' => $landlord->name,
                'email' => $landlord->email,
                'phone' => $landlord->phone,
                'address' => $data['landlord_address'] ?? '',
            ],
            'tenant' => [
                'name' => $tenant->name,
                'email' => $tenant->email,
                'phone' => $tenant->phone,
                'address' => $data['tenant_address'] ?? '',
            ],
            'property' => [
                'title' => $property->title,
                'address' => $property->address,
                'type' => $property->type,
                'surface' => $property->surface,
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'features' => $property->features ?? [],
            ],
            'terms' => [
                'rent_amount' => $data['rent_amount'] ?? $property->price,
                'deposit' => $data['deposit'] ?? ($property->price * 2), // 2 mois par défaut
                'start_date' => $data['start_date'] ?? now()->format('Y-m-d'),
                'duration_months' => $data['duration_months'] ?? 12,
                'charges_included' => $data['charges_included'] ?? false,
                'payment_day' => $data['payment_day'] ?? 1,
                'renewal_type' => $data['renewal_type'] ?? 'tacite',
                'notice_period_months' => $data['notice_period_months'] ?? 3,
            ],
            'additional_terms' => $data['additional_terms'] ?? [],
        ];

        $contract = Contract::create([
            'property_id' => $property->id,
            'landlord_id' => $landlord->id,
            'tenant_id' => $tenant->id,
            'type' => 'location',
            'status' => 'draft',
            'template_data' => $templateData,
            'version' => 1,
        ]);

        // Générer le PDF
        $pdfPath = $this->generatePDF($contract);
        $contract->update(['pdf_path' => $pdfPath]);

        return $contract;
    }

    /**
     * Générer un contrat de vente terrain
     */
    public function generateSaleLandContract(Property $property, User $seller, User $buyer, array $data): Contract
    {
        $templateData = [
            'type' => 'sale_land',
            'seller' => [
                'name' => $seller->name,
                'email' => $seller->email,
                'phone' => $seller->phone,
            ],
            'buyer' => [
                'name' => $buyer->name,
                'email' => $buyer->email,
                'phone' => $buyer->phone,
            ],
            'property' => [
                'title' => $property->title,
                'address' => $property->address,
                'surface' => $property->surface,
            ],
            'terms' => [
                'sale_price' => $data['sale_price'] ?? $property->price,
                'deposit' => $data['deposit'] ?? 0,
                'payment_terms' => $data['payment_terms'] ?? 'cash',
                'title_deed_number' => $data['title_deed_number'] ?? '',
            ],
        ];

        $contract = Contract::create([
            'property_id' => $property->id,
            'landlord_id' => $seller->id,
            'buyer_id' => $buyer->id,
            'type' => 'sale_land',
            'status' => 'draft',
            'template_data' => $templateData,
            'version' => 1,
        ]);

        $pdfPath = $this->generatePDF($contract);
        $contract->update(['pdf_path' => $pdfPath]);

        return $contract;
    }

    /**
     * Générer un contrat de vente immobilière
     */
    public function generateSalePropertyContract(Property $property, User $seller, User $buyer, array $data): Contract
    {
        $templateData = [
            'type' => 'sale_property',
            'seller' => [
                'name' => $seller->name,
                'email' => $seller->email,
                'phone' => $seller->phone,
            ],
            'buyer' => [
                'name' => $buyer->name,
                'email' => $buyer->email,
                'phone' => $buyer->phone,
            ],
            'property' => [
                'title' => $property->title,
                'address' => $property->address,
                'type' => $property->type,
                'surface' => $property->surface,
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
            ],
            'terms' => [
                'sale_price' => $data['sale_price'] ?? $property->price,
                'deposit' => $data['deposit'] ?? 0,
                'payment_terms' => $data['payment_terms'] ?? 'cash',
            ],
        ];

        $contract = Contract::create([
            'property_id' => $property->id,
            'landlord_id' => $seller->id,
            'buyer_id' => $buyer->id,
            'type' => 'sale_property',
            'status' => 'draft',
            'template_data' => $templateData,
            'version' => 1,
        ]);

        $pdfPath = $this->generatePDF($contract);
        $contract->update(['pdf_path' => $pdfPath]);

        return $contract;
    }

    /**
     * Générer le PDF du contrat
     */
    private function generatePDF(Contract $contract): string
    {
        $template = match($contract->type) {
            'location' => 'contracts.location',
            'sale_land' => 'contracts.sale_land',
            'sale_property' => 'contracts.sale_property',
            default => 'contracts.location',
        };

        $pdf = PDF::loadView($template, [
            'contract' => $contract,
            'data' => $contract->template_data,
        ]);

        $filename = 'contract_' . $contract->id . '_v' . $contract->version . '_' . time() . '.pdf';
        $path = 'contracts/' . $contract->id . '/' . $filename;
        
        Storage::disk('public')->put($path, $pdf->output());

        return $path;
    }

    /**
     * Envoyer le contrat au locataire/acheteur
     */
    public function sendContract(Contract $contract): Contract
    {
        $contract->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        // TODO: Envoyer email + SMS avec lien

        return $contract;
    }

    /**
     * Créer une nouvelle version du contrat
     */
    public function createVersion(Contract $contract, array $changes): Contract
    {
        $newVersion = $contract->version + 1;
        
        // Sauvegarder l'ancienne version
        \App\Models\ContractVersion::create([
            'contract_id' => $contract->id,
            'version_number' => $contract->version,
            'content' => $contract->template_data,
            'pdf_path' => $contract->pdf_path,
            'changelog' => json_encode($changes),
        ]);

        // Mettre à jour le contrat
        $templateData = $contract->template_data;
        foreach ($changes as $key => $value) {
            data_set($templateData, $key, $value);
        }

        $contract->update([
            'template_data' => $templateData,
            'version' => $newVersion,
            'status' => 'under_review',
        ]);

        // Régénérer le PDF
        $pdfPath = $this->generatePDF($contract);
        $contract->update(['pdf_path' => $pdfPath]);

        return $contract;
    }

    /**
     * Finaliser le contrat après signatures
     */
    public function finalizeContract(Contract $contract): Contract
    {
        if (!$contract->isFullySigned()) {
            throw new \Exception('Le contrat doit être signé par toutes les parties');
        }

        // Générer le PDF final signé
        $signedPdfPath = $this->generateSignedPDF($contract);
        
        $contract->update([
            'status' => 'signed',
            'signed_at' => now(),
            'signed_pdf_path' => $signedPdfPath,
            'retraction_deadline' => now()->addHours(48), // 48h délai rétractation
        ]);

        // Créer les transactions de commission
        $this->createCommissionTransactions($contract);

        return $contract;
    }

    /**
     * Générer le PDF final signé
     */
    private function generateSignedPDF(Contract $contract): string
    {
        // Même logique que generatePDF mais avec mentions de signatures
        $template = match($contract->type) {
            'location' => 'contracts.location_signed',
            'sale_land' => 'contracts.sale_land_signed',
            'sale_property' => 'contracts.sale_property_signed',
            default => 'contracts.location_signed',
        };

        try {
            $pdf = PDF::loadView($template, [
                'contract' => $contract,
                'data' => $contract->template_data,
                'signatures' => $contract->signatures()->with('user')->get(),
            ]);

            $filename = 'contract_' . $contract->id . '_signed_' . time() . '.pdf';
            $path = 'contracts/' . $contract->id . '/signed/' . $filename;
            
            Storage::disk('public')->put($path, $pdf->output());

            return $path;
        } catch (\Exception $e) {
            \Log::error('Erreur génération PDF signé', [
                'contract_id' => $contract->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Créer les transactions de commission
     */
    private function createCommissionTransactions(Contract $contract): void
    {
        $amounts = $this->calculateCommissions($contract);

        foreach ($amounts as $partyType => $amount) {
            $userId = match($partyType) {
                'landlord' => $contract->landlord_id,
                'tenant' => $contract->tenant_id,
                'seller' => $contract->landlord_id,
                'buyer' => $contract->buyer_id,
                default => null,
            };

            if ($userId && $amount > 0) {
                \App\Models\Transaction::create([
                    'contract_id' => $contract->id,
                    'user_id' => $userId,
                    'type' => $this->getTransactionType($contract->type),
                    'party_type' => $partyType,
                    'amount' => $amount,
                    'status' => 'pending',
                    'due_date' => now()->addDays(7), // 7 jours après signature
                ]);
            }
        }
    }

    /**
     * Calculer les commissions selon le type
     */
    private function calculateCommissions(Contract $contract): array
    {
        $data = $contract->template_data;
        
        return match($contract->type) {
            'location' => [
                'landlord' => ($data['terms']['rent_amount'] ?? 0) * 0.25, // 25% d'un mois
                'tenant' => ($data['terms']['rent_amount'] ?? 0) * 0.25,
            ],
            'sale_land' => [
                'seller' => ($data['terms']['sale_price'] ?? 0) * 0.005, // 0.5%
                'buyer' => ($data['terms']['sale_price'] ?? 0) * 0.005,
            ],
            'sale_property' => [
                'seller' => ($data['terms']['sale_price'] ?? 0) * 0.0075, // 0.75%
                'buyer' => ($data['terms']['sale_price'] ?? 0) * 0.0075,
            ],
            default => [],
        };
    }

    /**
     * Obtenir le type de transaction
     */
    private function getTransactionType(string $contractType): string
    {
        return match($contractType) {
            'location' => 'commission_location',
            'sale_land' => 'commission_sale_land',
            'sale_property' => 'commission_sale_property',
            default => 'commission_location',
        };
    }
}

